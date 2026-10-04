#!/usr/bin/env bash
set -Eeuo pipefail
cd "${1:-/opt/skomda-demo}"
exec 9>.deployment.lock
flock -w 60 9
test -r .previous-slot && test -r .previous-image-tag
old_slot=$(cat .previous-slot)
old_tag=$(cat .previous-image-tag)
[[ "$old_slot" == blue || "$old_slot" == green ]]
RELEASE_SLOT="$old_slot" IMAGE_TAG="$old_tag" docker compose -f compose.release.yaml --env-file deploy.env up -d --no-build --wait --wait-timeout 120
cp deploy/nginx/releases/rollback.conf deploy/nginx/releases/active.conf
docker compose --env-file deploy.env exec -T edge nginx -t
docker compose --env-file deploy.env exec -T edge nginx -s reload
printf '%s\n' "$old_slot" > .active-slot
printf '%s\n' "$old_tag" > .deployed-image-tag
echo "Restored $old_slot / $old_tag (database unchanged)"
