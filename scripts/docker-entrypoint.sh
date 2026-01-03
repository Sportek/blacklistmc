#!/bin/sh
set -e

echo "Waiting for database to be ready..."

# Wait for database
until nc -z db 5432; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "Database is up - running migrations"

# Run Prisma migrations
npx prisma db push --skip-generate

echo "Starting application..."

# Start the application
exec node server.js
