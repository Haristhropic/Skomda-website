#!/usr/bin/env bash
set -Eeuo pipefail
export COMPOSE_PARALLEL_LIMIT=1
cd "${1:-/opt/skomda-demo}"
exec 9>.deployment.lock
flock -w 60 9
test -r .previous-slot && test -r .previous-image-tag
old_slot=$(cat .previous-slot)
old_tag=$(cat .previous-image-tag)
current_slot=$(cat .active-slot)
current_tag=$(cat .deployed-image-tag)
[[ "$old_slot" == blue || "$old_slot" == green ]]
[[ "$current_slot" == blue || "$current_slot" == green ]]
[[ "$old_tag" =~ ^sha-[0-9a-f]{40}$ && "$current_tag" =~ ^sha-[0-9a-f]{40}$ ]]
address() {
  local cid
  cid=$(RELEASE_SLOT="$1" IMAGE_TAG="$2" docker compose -f compose.release.yaml --env-file deploy.env ps -q "$3")
  docker inspect --format '{{(index .NetworkSettings.Networks "skomda-runtime").IPAddress}}' "$cid"
}
switched=false
committed=false
reduced_current=false
secondary_attempted=false
recover_rollback() {
  local result=$?
  if [[ "$switched" == true ]]; then
    cp deploy/nginx/releases/rollback.conf deploy/nginx/releases/active.conf
    docker compose --env-file deploy.env exec -T edge nginx -t && docker compose --env-file deploy.env exec -T edge nginx -s reload
  fi
  if [[ "$committed" != true ]]; then
    RELEASE_SLOT="$old_slot" IMAGE_TAG="$old_tag" docker compose -f compose.release.yaml --env-file deploy.env stop --timeout 35 || true
    if [[ "$reduced_current" == true ]]; then
      RELEASE_SLOT="$current_slot" IMAGE_TAG="$current_tag" docker compose -f compose.release.yaml --env-file deploy.env up -d --no-build --wait --wait-timeout 120 frontend-b backend-b || true
      current_frontends=("$(address "$current_slot" "$current_tag" frontend-a)" "$(address "$current_slot" "$current_tag" frontend-b)")
      current_backends=("$(address "$current_slot" "$current_tag" backend-a)" "$(address "$current_slot" "$current_tag" backend-b)")
      python3 render-edge.py --frontend "${current_frontends[@]}" --backend "${current_backends[@]}" --output deploy/nginx/releases/candidate.conf || true
      if [[ -s deploy/nginx/releases/candidate.conf ]]; then
        mv deploy/nginx/releases/candidate.conf deploy/nginx/releases/active.conf
        docker compose --env-file deploy.env exec -T edge nginx -t && docker compose --env-file deploy.env exec -T edge nginx -s reload || true
      fi
    fi
  elif [[ "$secondary_attempted" == true ]]; then
    RELEASE_SLOT="$old_slot" IMAGE_TAG="$old_tag" docker compose -f compose.release.yaml --env-file deploy.env stop --timeout 35 frontend-b backend-b || true
  fi
  exit "$result"
}
trap recover_rollback ERR
if [[ -r /sys/fs/cgroup/pids/pids.current && "$(cat /sys/fs/cgroup/pids/pids.current)" -gt 370 ]]; then
  for service in frontend-a backend-a; do
    [[ "$(docker inspect --format '{{.State.Health.Status}}' "skomda-$current_slot-$service-1")" == healthy ]]
  done
  reduced_current=true
  current_front_a="$(address "$current_slot" "$current_tag" frontend-a)"
  current_back_a="$(address "$current_slot" "$current_tag" backend-a)"
  docker compose --env-file deploy.env exec -T edge wget -q --spider "http://$current_front_a:3000/api/backend/health"
  python3 render-edge.py --frontend "$current_front_a" --backend "$current_back_a" --output deploy/nginx/releases/candidate.conf
  cp deploy/nginx/releases/active.conf deploy/nginx/releases/rollback.conf
  mv deploy/nginx/releases/candidate.conf deploy/nginx/releases/active.conf
  switched=true
  docker compose --env-file deploy.env exec -T edge nginx -t
  docker compose --env-file deploy.env exec -T edge nginx -s reload
  switched=false
  RELEASE_SLOT="$current_slot" IMAGE_TAG="$current_tag" docker compose -f compose.release.yaml --env-file deploy.env stop --timeout 35 frontend-b backend-b
fi
RELEASE_SLOT="$old_slot" IMAGE_TAG="$old_tag" docker compose -f compose.release.yaml --env-file deploy.env up -d --no-build --wait --wait-timeout 120 backend-a frontend-a
frontend_a="$(address "$old_slot" "$old_tag" frontend-a)"
backend_a="$(address "$old_slot" "$old_tag" backend-a)"
docker compose --env-file deploy.env exec -T edge wget -q --spider "http://$frontend_a:3000/api/backend/health"
python3 render-edge.py --frontend "$frontend_a" --backend "$backend_a" --output deploy/nginx/releases/candidate.conf
cp deploy/nginx/releases/active.conf deploy/nginx/releases/rollback.conf
mv deploy/nginx/releases/candidate.conf deploy/nginx/releases/active.conf
switched=true
docker compose --env-file deploy.env exec -T edge nginx -t
docker compose --env-file deploy.env exec -T edge nginx -s reload
sleep 2
docker compose --env-file deploy.env exec -T edge wget -q --spider http://127.0.0.1:3000/
docker compose --env-file deploy.env exec -T edge wget -q --spider http://127.0.0.1:8080/api/health
printf '%s\n' "$old_slot" > .active-slot
printf '%s\n' "$old_tag" > .deployed-image-tag
printf '%s\n' "$current_slot" > .previous-slot
printf '%s\n' "$current_tag" > .previous-image-tag
committed=true
switched=false
sleep 35
RELEASE_SLOT="$current_slot" IMAGE_TAG="$current_tag" docker compose -f compose.release.yaml --env-file deploy.env stop --timeout 35
secondary_attempted=true
RELEASE_SLOT="$old_slot" IMAGE_TAG="$old_tag" docker compose -f compose.release.yaml --env-file deploy.env up -d --no-build --wait --wait-timeout 120 backend-b frontend-b
frontend_b="$(address "$old_slot" "$old_tag" frontend-b)"
backend_b="$(address "$old_slot" "$old_tag" backend-b)"
docker compose --env-file deploy.env exec -T edge wget -q --spider "http://$frontend_b:3000/api/backend/health"
cp deploy/nginx/releases/active.conf deploy/nginx/releases/rollback.conf
python3 render-edge.py --frontend "$frontend_a" "$frontend_b" --backend "$backend_a" "$backend_b" --output deploy/nginx/releases/candidate.conf
mv deploy/nginx/releases/candidate.conf deploy/nginx/releases/active.conf
switched=true
docker compose --env-file deploy.env exec -T edge nginx -t
docker compose --env-file deploy.env exec -T edge nginx -s reload
docker compose --env-file deploy.env exec -T edge wget -q --spider http://127.0.0.1:3000/api/backend/health
switched=false
secondary_attempted=false
trap - ERR
echo "Restored $old_slot / $old_tag with both app pairs healthy (database unchanged)."
