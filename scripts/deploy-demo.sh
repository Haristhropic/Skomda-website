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
active_address() {
  local cid
  cid=$(RELEASE_SLOT="$active" IMAGE_TAG="$(cat .deployed-image-tag)" docker compose -f compose.release.yaml --env-file deploy.env ps -q "$1")
  docker inspect --format '{{(index .NetworkSettings.Networks "skomda-runtime").IPAddress}}' "$cid"
}
release --profile operations config --quiet
switched=false
committed=false
reduced_active=false
secondary_attempted=false
pid_file=/sys/fs/cgroup/pids/pids.current
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
      candidate_pid_count="$(cat "$pid_file" 2>/dev/null || echo 500)"
      if [[ "$candidate_pid_count" =~ ^[0-9]+$ ]] && (( candidate_pid_count < 460 )); then
        RELEASE_SLOT="$active" IMAGE_TAG="$(cat .deployed-image-tag)" docker compose -f compose.release.yaml --env-file deploy.env up -d --no-build --wait --wait-timeout 120 backend-b || true
        candidate_pid_count="$(cat "$pid_file" 2>/dev/null || echo 500)"
        if [[ "$candidate_pid_count" =~ ^[0-9]+$ ]] && (( candidate_pid_count < 480 )); then
          RELEASE_SLOT="$active" IMAGE_TAG="$(cat .deployed-image-tag)" docker compose -f compose.release.yaml --env-file deploy.env up -d --no-build --wait --wait-timeout 120 frontend-b || true
          active_frontends=("$(active_address frontend-a)" "$(active_address frontend-b)")
          active_backends=("$(active_address backend-a)" "$(active_address backend-b)")
          python3 render-edge.py --frontend "${active_frontends[@]}" --backend "${active_backends[@]}" --output deploy/nginx/releases/candidate.conf || true
          if [[ -s deploy/nginx/releases/candidate.conf ]]; then
            mv deploy/nginx/releases/candidate.conf deploy/nginx/releases/active.conf
            docker compose --env-file deploy.env exec -T edge nginx -t && docker compose --env-file deploy.env exec -T edge nginx -s reload || true
          fi
        else
          RELEASE_SLOT="$active" IMAGE_TAG="$(cat .deployed-image-tag)" docker compose -f compose.release.yaml --env-file deploy.env stop --timeout 10 backend-b || true
          echo "Keeping the previous single serving pair; not enough PID headroom to restore its second replica ($candidate_pid_count/500)." >&2
        fi
      else
        echo "Keeping the previous single serving pair; not enough PID headroom to restore its second replica ($candidate_pid_count/500)." >&2
      fi
    fi
  elif [[ "$secondary_attempted" == true ]]; then
    release stop --timeout 35 frontend-b backend-b || true
  fi
  exit "$result"
}
trap recover_candidate ERR
# Retire only the inactive slot; the currently serving release remains untouched.
release down --timeout 35
if [[ -n "$active" && -r "$pid_file" && "$(cat "$pid_file")" -gt 370 ]]; then
  # On this provider a global 500-thread limit applies to the whole VPS.
  # Keep one verified serving pair while warming the new four containers.
  # Nginx retries a connection failure before forwarding a mutating request.
  for service in frontend-a backend-a; do
    [[ "$(docker inspect --format '{{.State.Health.Status}}' "skomda-$active-$service-1")" == healthy ]] || { echo 'Serving pair is not healthy; refusing capacity reduction' >&2; exit 1; }
  done
  reduced_active=true
  active_front_a="$(active_address frontend-a)"
  active_back_a="$(active_address backend-a)"
  docker compose --env-file deploy.env exec -T edge wget -q --spider "http://$active_front_a:3000/api/backend/health"
  python3 render-edge.py --frontend "$active_front_a" --backend "$active_back_a" --output deploy/nginx/releases/candidate.conf
  cp deploy/nginx/releases/active.conf deploy/nginx/releases/rollback.conf
  mv deploy/nginx/releases/candidate.conf deploy/nginx/releases/active.conf
  switched=true
  docker compose --env-file deploy.env exec -T edge nginx -t
  docker compose --env-file deploy.env exec -T edge nginx -s reload
  docker compose --env-file deploy.env exec -T edge wget -q --spider http://127.0.0.1:3000/api/backend/health
  switched=false
  RELEASE_SLOT="$active" IMAGE_TAG="$(cat .deployed-image-tag)" docker compose -f compose.release.yaml --env-file deploy.env stop --timeout 35 frontend-b backend-b
  echo 'Traffic is on one verified serving pair during candidate warm-up due to provider PID budget.'
fi
release --profile operations pull
release --profile operations run --rm --no-deps -T migrate < /dev/null
address() { docker inspect --format '{{(index .NetworkSettings.Networks "skomda-runtime").IPAddress}}' "$(release ps -q "$1")"; }
release up -d --no-build --wait --wait-timeout 180 backend-a
# Keep an explicit reserve for container exec, Nginx validation/reload and
# health-check processes. On a saturated provider host, abort and let the trap
# restore the still-running old pair before starting its frontend candidate.
candidate_pid_count="$(cat "$pid_file")"
if [[ ! "$candidate_pid_count" =~ ^[0-9]+$ ]] || (( candidate_pid_count >= 480 )); then
  echo "Insufficient VPS PID headroom to start candidate frontend safely ($candidate_pid_count/500); keeping the previous release." >&2
  exit 1
fi
release up -d --no-build --wait --wait-timeout 180 frontend-a
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
frontend_a="$(address frontend-a)"
backend_a="$(address backend-a)"
# Keep one active app pair on each side of cutover; expand to two replicas
# only after the old pair has drained and stopped under the provider's PID cap.
docker compose --env-file deploy.env exec -T edge wget -q --spider "http://$frontend_a:3000/api/backend/health"
mkdir -p deploy/nginx/releases
python3 render-edge.py --frontend "$frontend_a" --backend "$backend_a" --output deploy/nginx/releases/candidate.conf
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
  reduced_active=false
fi
candidate_pid_count="$(cat "$pid_file")"
if (( candidate_pid_count < 460 )); then
  # Add the second replica pair only while the provider-level PID reserve can
  # accommodate both containers and the readiness/edge checks. A single pair
  # remains healthy and is still routed through Nginx if capacity is tight.
  secondary_attempted=true
  if release up -d --no-build --wait --wait-timeout 180 backend-b; then
    candidate_pid_count="$(cat "$pid_file")"
  else
    candidate_pid_count=500
  fi
  if [[ "$candidate_pid_count" =~ ^[0-9]+$ ]] && (( candidate_pid_count < 480 )) && release up -d --no-build --wait --wait-timeout 180 frontend-b; then
    frontend_b="$(address frontend-b)"
    backend_b="$(address backend-b)"
    docker compose --env-file deploy.env exec -T edge wget -q --spider "http://$frontend_b:3000/api/backend/health"
    cp deploy/nginx/releases/active.conf deploy/nginx/releases/rollback.conf
    python3 render-edge.py --frontend "$frontend_a" "$frontend_b" --backend "$backend_a" "$backend_b" --output deploy/nginx/releases/candidate.conf
    mv deploy/nginx/releases/candidate.conf deploy/nginx/releases/active.conf
    switched=true
    docker compose --env-file deploy.env exec -T edge nginx -t
    docker compose --env-file deploy.env exec -T edge nginx -s reload
    docker compose --env-file deploy.env exec -T edge wget -q --spider http://127.0.0.1:3000/api/backend/health
    switched=false
    echo 'Second frontend/backend replica pair is healthy and added to Nginx.'
  else
    release stop --timeout 10 frontend-b backend-b || true
    secondary_attempted=false
    echo "Skipping second replica pair to preserve VPS PID headroom ($candidate_pid_count/500)."
  fi
else
  echo "Keeping the healthy single serving pair; insufficient VPS PID headroom for a second replica ($candidate_pid_count/500)."
fi
secondary_attempted=false
trap - ERR
echo "Deployed $IMAGE_TAG to $candidate. Previous slot is stopped and retained for warm rollback."
release ps
