#!/usr/bin/env bash
# Blue/green on one VPS. Existing healthy release stays up until candidate readiness.
set -Eeuo pipefail
export COMPOSE_PARALLEL_LIMIT=1
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
switched=false
committed=false
reduced_active=false
recover_candidate() {
  local result=$?
  if [[ "$switched" == true ]]; then
    cp deploy/nginx/releases/rollback.conf deploy/nginx/releases/active.conf
    docker compose --env-file deploy.env exec -T edge nginx -t && docker compose --env-file deploy.env exec -T edge nginx -s reload
    echo 'Traffic pointer restored to the previous release' >&2
  fi
  if [[ "$committed" != true ]]; then
    release stop --timeout 35 || true
    if [[ "$reduced_active" == true ]]; then
      RELEASE_SLOT="$active" IMAGE_TAG="$(cat .deployed-image-tag)" docker compose -f compose.release.yaml --env-file deploy.env up -d --no-build --wait --wait-timeout 120 frontend-b backend-b || true
    fi
  fi
  exit "$result"
}
trap recover_candidate ERR
# Retire only the inactive slot; the currently serving release remains untouched.
release down --timeout 35
pid_file=/sys/fs/cgroup/pids/pids.current
if [[ -n "$active" && -r "$pid_file" && "$(cat "$pid_file")" -gt 370 ]]; then
  # On this provider a global 500-thread limit applies to the whole VPS.
  # Keep one verified serving pair while warming the new four containers.
  # Nginx retries a connection failure before forwarding a mutating request.
  for service in frontend-a backend-a; do
    [[ "$(docker inspect --format '{{.State.Health.Status}}' "skomda-$active-$service-1")" == healthy ]] || { echo 'Serving pair is not healthy; refusing capacity reduction' >&2; exit 1; }
  done
  reduced_active=true
  RELEASE_SLOT="$active" IMAGE_TAG="$(cat .deployed-image-tag)" docker compose -f compose.release.yaml --env-file deploy.env stop --timeout 35 frontend-b backend-b
  echo 'One healthy serving pair retained during candidate warm-up due to provider PID budget.'
fi
release --profile operations pull
release --profile operations run --rm --no-deps -T migrate < /dev/null
release up -d --no-build --wait --wait-timeout 180
address() { docker inspect --format '{{(index .NetworkSettings.Networks "skomda-runtime").IPAddress}}' "$(release ps -q "$1")"; }
mkdir -p deploy/nginx/releases/static
# Chunks use content hashes/build IDs. Retain old browser assets independently
# of app process lifetime; no credentials or server bundles are copied.
docker cp "$(release ps -q frontend-a):/app/.next/static/." deploy/nginx/releases/static/
if docker inspect skomda-demo-frontend-1 >/dev/null 2>&1; then
  docker cp skomda-demo-frontend-1:/app/.next/static/. deploy/nginx/releases/static/
fi
find deploy/nginx/releases/static -type d -exec chmod 755 {} +
find deploy/nginx/releases/static -type f -exec chmod 644 {} +
# Pin this release's live container addresses into Nginx. Docker DNS aliases can
# briefly return NXDOMAIN while blue/green services are being replaced; a stale
# DNS answer during cutover caused one observed 3-second frontend proxy 504.
frontends=("$(address frontend-a)" "$(address frontend-b)")
backends=("$(address backend-a)" "$(address backend-b)")
# Exercise each candidate's same-origin backend route before moving traffic.
for frontend_ip in "${frontends[@]}"; do
  docker compose --env-file deploy.env exec -T edge wget -q --spider "http://$frontend_ip:3000/api/backend/health"
done
mkdir -p deploy/nginx/releases
python3 render-edge.py --frontend "${frontends[@]}" --backend "${backends[@]}" --output deploy/nginx/releases/candidate.conf
cp deploy/nginx/releases/active.conf deploy/nginx/releases/rollback.conf
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
committed=true
trap - ERR
# Drain old workers before releasing scarce VPS PID/memory capacity. The old
# containers/images and archived chunks remain available for warm rollback.
if [[ -n "$active" ]]; then
  sleep 35
  RELEASE_SLOT="$active" IMAGE_TAG="$(cat .previous-image-tag)" docker compose -f compose.release.yaml --env-file deploy.env stop --timeout 35
fi
echo "Deployed $IMAGE_TAG to $candidate; previous slot stopped and retained for warm rollback."
release ps
