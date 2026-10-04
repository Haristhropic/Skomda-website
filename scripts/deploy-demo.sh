#!/usr/bin/env bash
set -Eeuo pipefail

: "${DEPLOY_PATH_B64:?Deployment path must be passed by the CI job}"
: "${IMAGE_TAG:?Immutable image tag must be passed by the CI job}"

DEPLOY_PATH="$(printf '%s' "$DEPLOY_PATH_B64" | base64 -d)"
cd "$DEPLOY_PATH"

# Fail before pulling images or touching the database if VPS configuration is incomplete.
for env_file in deploy.env backend/.env backend/migrate.env; do
  if [[ ! -r "$env_file" ]]; then
    echo "Required deployment environment file is missing or unreadable: $env_file" >&2
    exit 1
  fi

  mode="$(stat -c '%a' "$env_file")"
  if [[ "$mode" != "600" ]]; then
    echo "Deployment environment file must have permission 600: $env_file (found $mode)" >&2
    exit 1
  fi
done

# Quiet mode validates interpolation and Compose syntax without printing resolved secrets.
docker compose --profile operations --env-file deploy.env config --quiet

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

docker compose --profile operations --env-file deploy.env pull
# Apply schema changes as a one-shot step before switching the running API image.
# Keep schema changes backward-compatible with the currently running backend.
docker compose --profile operations --env-file deploy.env run --rm --no-deps migrate
if ! docker compose --env-file deploy.env up -d --no-build --wait --remove-orphans; then
  rollback
  exit 1
fi

printf '%s\n' "$IMAGE_TAG" > .deployed-image-tag
docker compose --env-file deploy.env ps
