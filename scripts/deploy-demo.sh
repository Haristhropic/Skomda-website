#!/usr/bin/env bash
# Blue/green on one VPS. Existing healthy release stays up until candidate readiness.
set -Eeuo pipefail
: "${DEPLOY_PATH_B64:?Missing deployment path}"
: "${IMAGE_TAG:?Missing immutable tag}"
[[ "$IMAGE_TAG" =~ ^sha-[0-9a-f]{40}$ ]] || { echo 'An immutable SHA tag is required' >&2; exit 1; }
DEPLOY_PATH="$(printf '%s' "$DEPLOY_PATH_B64" | base64 -d)"
cd "$DEPLOY_PATH"
exec 9>.deployment.lock
flock -w 600 9 || { echo 'Another deployment is active' >&2; exit 1; }
for env_file in deploy.env backend/.env backend/migrate.env; do
  [[ -r "$env_file" && "$(stat -c '%a' "$env_file")" == 600 ]] || { echo "Missing/unprotected configuration: $env_file" >&2; exit 1; }
done
docker compose --env-file deploy.env config --quiet
docker network inspect skomda-runtime >/dev/null
find deploy -type d -exec chmod 755 {} +
find deploy -type f -exec chmod 644 {} +
docker compose --env-file deploy.env up -d --wait --wait-timeout 120
active="$(cat .active-slot 2>/dev/null || true)"
case "$active" in blue) candidate=green;; green|'') candidate=blue;; *) echo 'Invalid release state' >&2; exit 1;; esac
export RELEASE_SLOT="$candidate"
release() { docker compose -f compose.release.yaml --env-file deploy.env "$@"; }
release --profile operations config --quiet
# Retire only the inactive slot; the currently serving release remains untouched.
release down --timeout 35
release --profile operations pull
release --profile operations run --rm --no-deps migrate
release up -d --no-build --wait --wait-timeout 180
address() { docker inspect --format '{{(index .NetworkSettings.Networks "skomda-runtime").IPAddress}}' "$(release ps -q "$1")"; }
frontends=("$(address frontend-a)" "$(address frontend-b)")
backends=("$(address backend-a)" "$(address backend-b)")
previous=()
if [[ -n "$active" ]]; then
  previous=(--previous)
  for service in frontend-a frontend-b; do
    cid="$(RELEASE_SLOT="$active" docker compose -f compose.release.yaml --env-file deploy.env ps -q "$service")"
    previous+=("$(docker inspect --format '{{(index .NetworkSettings.Networks "skomda-runtime").IPAddress}}' "$cid")")
  done
elif docker inspect skomda-demo-frontend-1 >/dev/null 2>&1; then
  previous=(--previous "$(docker inspect --format '{{(index .NetworkSettings.Networks "skomda-runtime").IPAddress}}' skomda-demo-frontend-1)")
fi
mkdir -p deploy/nginx/releases
python3 render-edge.py --frontend "${frontends[@]}" --backend "${backends[@]}" "${previous[@]}" --output deploy/nginx/releases/candidate.conf
cp deploy/nginx/releases/active.conf deploy/nginx/releases/rollback.conf
switched=false
restore_pointer() {
  cp deploy/nginx/releases/rollback.conf deploy/nginx/releases/active.conf
  docker compose --env-file deploy.env exec -T edge nginx -t
  docker compose --env-file deploy.env exec -T edge nginx -s reload
  echo 'Traffic pointer restored to the previous healthy release' >&2
}
trap 'if [[ "$switched" == true ]]; then restore_pointer; fi' ERR
mv deploy/nginx/releases/candidate.conf deploy/nginx/releases/active.conf
switched=true
docker compose --env-file deploy.env exec -T edge nginx -t
docker compose --env-file deploy.env exec -T edge nginx -s reload
sleep 2
docker compose --env-file deploy.env exec -T edge wget -q --spider http://127.0.0.1:3000/
docker compose --env-file deploy.env exec -T edge wget -q --spider http://127.0.0.1:8080/api/health
printf '%s\n' "$candidate" > .active-slot
if [[ -n "$active" ]]; then
  printf '%s\n' "$active" > .previous-slot
  cp .deployed-image-tag .previous-image-tag
fi
printf '%s\n' "$IMAGE_TAG" > .deployed-image-tag
switched=false
trap - ERR
# Keep the previous slot for instant rollback and old browser static chunks.
echo "Deployed $IMAGE_TAG to $candidate; previous slot retained for rollback."
release ps
