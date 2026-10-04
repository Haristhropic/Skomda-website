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
switched=false
recover_rollback() {
  local result=$?
  if [[ "$switched" == true ]]; then
    cp deploy/nginx/releases/rollback.conf deploy/nginx/releases/active.conf
    docker compose --env-file deploy.env exec -T edge nginx -t && docker compose --env-file deploy.env exec -T edge nginx -s reload
  fi
  RELEASE_SLOT="$old_slot" IMAGE_TAG="$old_tag" docker compose -f compose.release.yaml --env-file deploy.env stop --timeout 35 || true
  RELEASE_SLOT="$current_slot" IMAGE_TAG="$current_tag" docker compose -f compose.release.yaml --env-file deploy.env up -d --no-build --wait --wait-timeout 120 || true
  exit "$result"
}
trap recover_rollback ERR
if [[ -r /sys/fs/cgroup/pids/pids.current && "$(cat /sys/fs/cgroup/pids/pids.current)" -gt 370 ]]; then
  for service in frontend-a backend-a; do
    [[ "$(docker inspect --format '{{.State.Health.Status}}' "skomda-$current_slot-$service-1")" == healthy ]]
  done
  RELEASE_SLOT="$current_slot" IMAGE_TAG="$current_tag" docker compose -f compose.release.yaml --env-file deploy.env stop --timeout 35 frontend-b backend-b
fi
RELEASE_SLOT="$old_slot" IMAGE_TAG="$old_tag" docker compose -f compose.release.yaml --env-file deploy.env up -d --no-build --wait --wait-timeout 120
address() {
  local cid
  cid=$(RELEASE_SLOT="$1" IMAGE_TAG="$2" docker compose -f compose.release.yaml --env-file deploy.env ps -q "$3")
  docker inspect --format '{{(index .NetworkSettings.Networks "skomda-runtime").IPAddress}}' "$cid"
}
frontends=("$(address "$old_slot" "$old_tag" frontend-a)" "$(address "$old_slot" "$old_tag" frontend-b)")
backends=("$(address "$old_slot" "$old_tag" backend-a)" "$(address "$old_slot" "$old_tag" backend-b)")
for frontend_ip in "${frontends[@]}"; do
  docker compose --env-file deploy.env exec -T edge wget -q --spider "http://$frontend_ip:3000/api/backend/health"
done
python3 render-edge.py --frontend "${frontends[@]}" --backend "${backends[@]}" --output deploy/nginx/releases/candidate.conf
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
trap - ERR
sleep 35
RELEASE_SLOT="$current_slot" IMAGE_TAG="$current_tag" docker compose -f compose.release.yaml --env-file deploy.env stop --timeout 35
echo "Restored $old_slot / $old_tag (database unchanged)"
