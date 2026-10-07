#!/bin/bash
# ==============================================================================
# CakeConnection — Daily Automated PostgreSQL Backup Script
# Keeps the last 14 daily backups automatically
# ==============================================================================

BACKUP_DIR="/var/backups/cakeconnection"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/cakeconnection_backup_$TIMESTAMP.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "Creating compressed backup: $BACKUP_FILE"
sudo -u postgres pg_dump cakeconnection | gzip > "$BACKUP_FILE"

# Keep only backups from the last 14 days
find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +14 -delete

echo "Backup completed successfully!"
