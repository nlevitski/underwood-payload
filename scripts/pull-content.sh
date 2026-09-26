#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MODE="${1:---all}"

case "$MODE" in
  --database | --media | --all) ;;
  *)
    echo 'Usage: bash scripts/pull-content.sh [--database|--media|--all]' >&2
    exit 2
    ;;
esac

ENV_FILE="${DEPLOY_ENV_FILE:-$ROOT_DIR/.env.deploy}"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "Deployment environment file not found: $ENV_FILE" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

: "${VPS_HOST:?Set VPS_HOST in $ENV_FILE}"
: "${VPS_USER:?Set VPS_USER in $ENV_FILE}"
: "${VPS_PATH:?Set VPS_PATH in $ENV_FILE}"

REMOTE_DB_NAME="${REMOTE_DB_NAME:-underwood-payload.db}"
LOCAL_DB_PATH="${LOCAL_DB_PATH:-$ROOT_DIR/data/underwood-payload.db}"
if [[ "$LOCAL_DB_PATH" != /* ]]; then
  LOCAL_DB_PATH="$ROOT_DIR/$LOCAL_DB_PATH"
fi

if [[ ! "$VPS_HOST" =~ ^[A-Za-z0-9._-]+$ || ! "$VPS_USER" =~ ^[A-Za-z0-9._-]+$ ||
      ! "$VPS_PATH" =~ ^/[A-Za-z0-9._/-]+$ || ! "$REMOTE_DB_NAME" =~ ^[A-Za-z0-9._-]+$ ]]; then
  echo 'Invalid VPS connection or database path in deployment environment.' >&2
  exit 1
fi

for command_name in ssh rsync sqlite3; do
  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "Required command not found: $command_name" >&2
    exit 1
  fi
done

ssh_args=(-o BatchMode=yes -o ConnectTimeout=8)
rsync_ssh='ssh -o BatchMode=yes -o ConnectTimeout=8'
if [[ -n "${VPS_IDENTITY:-}" ]]; then
  if [[ ! "$VPS_IDENTITY" =~ ^[A-Za-z0-9._/-]+$ ]]; then
    echo 'VPS_IDENTITY contains unsupported characters.' >&2
    exit 1
  fi
  ssh_args+=(-i "$VPS_IDENTITY" -o IdentitiesOnly=yes)
  rsync_ssh+=" -i $VPS_IDENTITY -o IdentitiesOnly=yes"
fi

remote="$VPS_USER@$VPS_HOST"
backup_dir="$ROOT_DIR/.deploy/pull-$(date +%Y%m%d-%H%M%S)-$$"
mkdir -p "$backup_dir"

pull_media() {
  mkdir -p "$ROOT_DIR/media"
  echo 'Pulling media from production...'
  rsync -a --checksum --backup --backup-dir="$backup_dir/media-before-pull" \
    --stats -e "$rsync_ssh" \
    "$remote:$VPS_PATH/media/" "$ROOT_DIR/media/"
}

check_local_database_available() {
  if command -v lsof >/dev/null 2>&1 && [[ -f "$LOCAL_DB_PATH" ]] &&
      lsof "$LOCAL_DB_PATH" >/dev/null 2>&1; then
    echo "Local database is open; stop the local app before replacing it: $LOCAL_DB_PATH" >&2
    exit 1
  fi
}

pull_database() {
  mkdir -p "$(dirname "$LOCAL_DB_PATH")"
  if [[ -e "$LOCAL_DB_PATH-wal" || -e "$LOCAL_DB_PATH-shm" ]]; then
    echo "Local SQLite WAL/SHM files exist; check the local app before replacing $LOCAL_DB_PATH" >&2
    exit 1
  fi

  if [[ -f "$LOCAL_DB_PATH" ]]; then
    local local_backup="$backup_dir/local-before-pull.db"
    if [[ "$local_backup" == *"'"* ]]; then
      echo 'Backup path cannot contain a single quote.' >&2
      exit 1
    fi
    sqlite3 "$LOCAL_DB_PATH" ".backup '$local_backup'"
    echo "Local database backed up to $local_backup"
  fi

  local snapshot="$backup_dir/production-snapshot.db"
  echo 'Downloading a consistent SQLite snapshot from production...'
  ssh "${ssh_args[@]}" "$remote" python3 - "$VPS_PATH/data/$REMOTE_DB_NAME" \
    > "$snapshot" <<'PY'
import os
import shutil
import sqlite3
import sys
import tempfile

source = sqlite3.connect(f'file:{sys.argv[1]}?mode=ro', uri=True, timeout=30)
fd, snapshot = tempfile.mkstemp(prefix='underwood-pull-', suffix='.db')
os.close(fd)
try:
    destination = sqlite3.connect(snapshot)
    try:
        source.backup(destination)
    finally:
        destination.close()
        source.close()
    with open(snapshot, 'rb') as data:
        shutil.copyfileobj(data, sys.stdout.buffer)
finally:
    os.unlink(snapshot)
PY

  local integrity
  integrity="$(sqlite3 "$snapshot" 'PRAGMA integrity_check;')"
  if [[ "$integrity" != ok ]]; then
    echo "Downloaded SQLite snapshot failed integrity check: $integrity" >&2
    exit 1
  fi

  cp "$snapshot" "$LOCAL_DB_PATH"
  echo "Local database updated from production: $LOCAL_DB_PATH"
}

if [[ "$MODE" != --media ]]; then
  check_local_database_available
fi

case "$MODE" in
  --media) pull_media ;;
  --database) pull_database ;;
  --all)
    pull_media
    pull_database
    ;;
esac

echo "Backups and downloaded snapshot: $backup_dir"
