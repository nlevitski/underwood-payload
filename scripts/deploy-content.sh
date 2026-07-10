#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

usage() {
  cat <<'EOF'
Usage:
  ./scripts/deploy-content.sh --media [--dry-run]
  ./scripts/deploy-content.sh --database [--dry-run] [--yes]
  ./scripts/deploy-content.sh --all [--dry-run] [--yes]

Options:
  --media       Synchronize the media directory without deleting remote files.
  --database    Upload a consistent SQLite snapshot and replace the remote DB.
  --all         Synchronize media, then replace the database.
  --dry-run     Show rsync changes without uploading or changing the VPS.
  --yes         Skip the database replacement confirmation.
  -h, --help    Show this help.

Environment:
  The script loads .env.deploy when it exists, otherwise .env.
  Override this with DEPLOY_ENV_FILE=/path/to/file.
EOF
}

MODE=""
DRY_RUN=false
ASSUME_YES=false

while (($# > 0)); do
  case "$1" in
    --media | --database | --all)
      if [[ -n "$MODE" ]]; then
        echo "Choose only one of --media, --database, or --all." >&2
        exit 2
      fi
      MODE="${1#--}"
      ;;
    --dry-run)
      DRY_RUN=true
      ;;
    --yes)
      ASSUME_YES=true
      ;;
    -h | --help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
  shift
done

if [[ -z "$MODE" ]]; then
  usage >&2
  exit 2
fi

if [[ -n "${DEPLOY_ENV_FILE:-}" ]]; then
  ENV_FILE="$DEPLOY_ENV_FILE"
elif [[ -f "$ROOT_DIR/.env.deploy" ]]; then
  ENV_FILE="$ROOT_DIR/.env.deploy"
else
  ENV_FILE="$ROOT_DIR/.env"
fi

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

REMOTE_COMPOSE_FILE="${REMOTE_COMPOSE_FILE:-docker-compose.prod.yml}"
REMOTE_SERVICE="${REMOTE_SERVICE:-app}"
REMOTE_DB_NAME="${REMOTE_DB_NAME:-underwood-payload.db}"
LOCAL_DB_PATH="${LOCAL_DB_PATH:-data/underwood-payload.db}"

if [[ ! "$VPS_HOST" =~ ^[A-Za-z0-9._-]+$ ]]; then
  echo "VPS_HOST contains unsupported characters." >&2
  exit 1
fi
if [[ ! "$VPS_USER" =~ ^[A-Za-z0-9._-]+$ ]]; then
  echo "VPS_USER contains unsupported characters." >&2
  exit 1
fi
if [[ ! "$VPS_PATH" =~ ^/[A-Za-z0-9._/-]+$ ]]; then
  echo "VPS_PATH must be an absolute path without spaces or shell characters." >&2
  exit 1
fi
if [[ ! "$REMOTE_COMPOSE_FILE" =~ ^[A-Za-z0-9._/-]+$ ]]; then
  echo "REMOTE_COMPOSE_FILE contains unsupported characters." >&2
  exit 1
fi
if [[ ! "$REMOTE_SERVICE" =~ ^[A-Za-z0-9._-]+$ ]]; then
  echo "REMOTE_SERVICE contains unsupported characters." >&2
  exit 1
fi
if [[ ! "$REMOTE_DB_NAME" =~ ^[A-Za-z0-9._-]+$ ]]; then
  echo "REMOTE_DB_NAME must be a filename without path separators." >&2
  exit 1
fi

for command_name in ssh rsync; do
  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "Required command not found: $command_name" >&2
    exit 1
  fi
done

REMOTE="${VPS_USER}@${VPS_HOST}"
RSYNC_OPTIONS=(-avP)
if [[ "$DRY_RUN" == true ]]; then
  RSYNC_OPTIONS+=(--dry-run)
fi

sync_media() {
  if [[ ! -d "$ROOT_DIR/media" ]]; then
    echo "Local media directory not found: $ROOT_DIR/media" >&2
    exit 1
  fi

  echo "Synchronizing media to $REMOTE:$VPS_PATH/media/"
  if [[ "$DRY_RUN" == false ]]; then
    ssh "$REMOTE" "mkdir -p '$VPS_PATH/media'"
  fi

  # FileZilla often does not preserve timestamps. Compare file contents so the
  # first rsync run does not upload every existing media derivative again.
  rsync "${RSYNC_OPTIONS[@]}" --checksum "$ROOT_DIR/media/" "$REMOTE:$VPS_PATH/media/"
}

confirm_database_replacement() {
  if [[ "$DRY_RUN" == true || "$ASSUME_YES" == true ]]; then
    return
  fi

  if [[ ! -t 0 ]]; then
    echo "Database replacement requires an interactive confirmation or --yes." >&2
    exit 1
  fi

  echo "WARNING: this will replace the production SQLite database."
  read -r -p "Type REPLACE to continue: " answer
  if [[ "$answer" != "REPLACE" ]]; then
    echo "Database deployment cancelled."
    exit 1
  fi
}

sync_database() {
  if ! command -v sqlite3 >/dev/null 2>&1; then
    echo "Required command not found: sqlite3" >&2
    exit 1
  fi

  if [[ "$LOCAL_DB_PATH" != /* ]]; then
    LOCAL_DB_PATH="$ROOT_DIR/$LOCAL_DB_PATH"
  fi
  if [[ ! -f "$LOCAL_DB_PATH" ]]; then
    echo "Local SQLite database not found: $LOCAL_DB_PATH" >&2
    exit 1
  fi

  confirm_database_replacement

  local snapshot_dir="$ROOT_DIR/.deploy"
  local snapshot_path="$snapshot_dir/$REMOTE_DB_NAME"
  if [[ "$snapshot_path" == *"'"* ]]; then
    echo "Snapshot path cannot contain a single quote." >&2
    exit 1
  fi

  mkdir -p "$snapshot_dir"
  rm -f "$snapshot_path"
  trap "rm -f '$snapshot_path'" EXIT

  echo "Creating consistent SQLite snapshot..."
  sqlite3 "$LOCAL_DB_PATH" ".backup '$snapshot_path'"

  local integrity_result
  integrity_result="$(sqlite3 "$snapshot_path" 'PRAGMA integrity_check;')"
  if [[ "$integrity_result" != "ok" ]]; then
    echo "SQLite integrity check failed: $integrity_result" >&2
    exit 1
  fi

  echo "Uploading database snapshot..."
  if [[ "$DRY_RUN" == false ]]; then
    ssh "$REMOTE" "mkdir -p '$VPS_PATH/data'"
  fi
  rsync "${RSYNC_OPTIONS[@]}" \
    "$snapshot_path" \
    "$REMOTE:$VPS_PATH/data/$REMOTE_DB_NAME.incoming"

  if [[ "$DRY_RUN" == true ]]; then
    echo "Dry run complete; production database was not changed."
    return
  fi

  echo "Stopping the app briefly and replacing the database..."
  ssh "$REMOTE" \
    "bash -s -- '$VPS_PATH' '$REMOTE_COMPOSE_FILE' '$REMOTE_SERVICE' '$REMOTE_DB_NAME'" \
    <<'REMOTE_SCRIPT'
set -euo pipefail

project_path="$1"
compose_file="$2"
service="$3"
db_name="$4"
db_path="data/$db_name"
incoming_path="$db_path.incoming"
timestamp="$(date +%Y%m%d-%H%M%S)"

cd "$project_path"
if [[ ! -f "$incoming_path" ]]; then
  echo "Uploaded database snapshot not found: $incoming_path" >&2
  exit 1
fi

compose=(docker compose -f "$compose_file")
"${compose[@]}" stop "$service"
restart_app() {
  "${compose[@]}" up -d "$service"
}
trap restart_app EXIT

if [[ -f "$db_path" ]]; then
  cp -p "$db_path" "$db_path.backup-$timestamp"
fi

# Copy into the existing file so its ownership and permissions are preserved.
cp "$incoming_path" "$db_path"
rm -f "$incoming_path" "$db_path-wal" "$db_path-shm"

echo "Production database replaced; backup: $db_path.backup-$timestamp"
REMOTE_SCRIPT
}

case "$MODE" in
  media)
    sync_media
    ;;
  database)
    sync_database
    ;;
  all)
    sync_media
    sync_database
    ;;
esac

echo "Content deployment finished."
