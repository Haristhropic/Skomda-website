#!/usr/bin/env bash
set -Eeuo pipefail
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
RELEASE_SLOT="$old_slot" IMAGE_TAG="$old_tag" docker compose -f compose.release.yaml --env-file deploy.env up -d --no-build --wait --wait-timeout 120
address() {
  local cid
  cid=$(RELEASE_SLOT="$1" IMAGE_TAG="$2" docker compose -f compose.release.yaml --env-file deploy.env ps -q "$3")
  docker inspect --format '{{(index .NetworkSettings.Networks "skomda-runtime").IPAddress}}' "$cid"
}
python3 render-edge.py \
  --frontend "$old_slot-frontend-a" "$old_slot-frontend-b" \
  --backend "$old_slot-backend-a" "$old_slot-backend-b" \
  --previous "$current_slot-frontend-a" "$current_slot-frontend-b" \
  --output deploy/nginx/releases/candidate.conf
cp deploy/nginx/releases/active.conf deploy/nginx/releases/rollback.conf
restore_pointer() {
  cp deploy/nginx/releases/rollback.conf deploy/nginx/releases/active.conf
  docker compose --env-file deploy.env exec -T edge nginx -t
  docker compose --env-file deploy.env exec -T edge nginx -s reload
}
trap restore_pointer ERR
mv deploy/nginx/releases/candidate.conf deploy/nginx/releases/active.conf
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
echo "Restored $old_slot / $old_tag (database unchanged)"
