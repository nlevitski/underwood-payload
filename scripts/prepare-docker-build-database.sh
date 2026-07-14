#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ENV_FILE:-$ROOT_DIR/.env}"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

SOURCE_DATABASE="${BUILD_DATABASE_PATH:-}"
if [[ -z "$SOURCE_DATABASE" && "${DATABASE_URL:-}" == file:* ]]; then
  SOURCE_DATABASE="${DATABASE_URL#file:}"
fi
SOURCE_DATABASE="${SOURCE_DATABASE:-data/underwood-payload.db}"

if [[ "$SOURCE_DATABASE" != /* ]]; then
  SOURCE_DATABASE="$ROOT_DIR/$SOURCE_DATABASE"
fi

if [[ ! -f "$SOURCE_DATABASE" ]]; then
  echo "Build database not found: $SOURCE_DATABASE" >&2
  exit 1
fi

if ! command -v gzip >/dev/null 2>&1; then
  echo "Required command not found: gzip" >&2
  exit 1
fi

TARGET_DATABASE="${BUILD_DATABASE_SECRET_PATH:-$ROOT_DIR/.deploy/build-database.db.gz}"
if [[ "$TARGET_DATABASE" != /* ]]; then
  TARGET_DATABASE="$ROOT_DIR/$TARGET_DATABASE"
fi

mkdir -p "$(dirname "$TARGET_DATABASE")"
temporary_file="$TARGET_DATABASE.tmp"
trap 'rm -f "$temporary_file"' EXIT

gzip -c "$SOURCE_DATABASE" > "$temporary_file"

maximum_secret_size=$((500 * 1024))
actual_size="$(wc -c < "$temporary_file" | tr -d ' ')"
if ((actual_size > maximum_secret_size)); then
  echo "Compressed build database is larger than BuildKit's 500 KiB secret limit." >&2
  echo "Create a smaller build snapshot or set BUILD_DATABASE_PATH to one." >&2
  exit 1
fi

chmod 600 "$temporary_file"
mv "$temporary_file" "$TARGET_DATABASE"
trap - EXIT

echo "Prepared compressed Docker build database: $TARGET_DATABASE"
