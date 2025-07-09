#!/bin/bash

echo "💾 Creating database backup..."

# Create backup directory
mkdir -p backups

# Get current date
DATE=$(date +%Y%m%d_%H%M%S)

# Backup database
pg_dump $DATABASE_URL > backups/salon_payroll_$DATE.sql

# Compress backup
gzip backups/salon_payroll_$DATE.sql

echo "✅ Backup created: backups/salon_payroll_$DATE.sql.gz"

# Clean old backups (keep last 30 days)
find backups/ -name "*.sql.gz" -mtime +30 -delete

echo "🧹 Old backups cleaned up"
