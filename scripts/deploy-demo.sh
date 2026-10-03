#!/usr/bin/env bash
set -Eeuo pipefail

: "${DEPLOY_PATH_B64:?Deployment path must be passed by the CI job}"
: "${IMAGE_TAG:?Immutable image tag must be passed by the CI job}"

DEPLOY_PATH="$(printf '%s' "$DEPLOY_PATH_B64" | base64 -d)"
cd "$DEPLOY_PATH"

previous_tag=""
if [[ -f .deployed-image-tag ]]; then
  previous_tag="$(<.deployed-image-tag)"
fi

rollback() {
  if [[ -z "$previous_tag" ]]; then
    echo "No previous image tag recorded; automatic rollback is unavailable for the first deployment." >&2
    return 0
  fi

  echo "Rolling back to $previous_tag"
  IMAGE_TAG="$previous_tag" docker compose --env-file deploy.env pull
  IMAGE_TAG="$previous_tag" docker compose --env-file deploy.env up -d --no-build --wait --remove-orphans
}

docker compose --env-file deploy.env pull
if ! docker compose --env-file deploy.env up -d --no-build --wait --remove-orphans; then
  rollback
  exit 1
fi

printf '%s\n' "$IMAGE_TAG" > .deployed-image-tag
docker compose --env-file deploy.env ps
