#!/bin/bash
set -e

echo "========================================="
echo "Starting QueueHive Application"
echo "========================================="

# Start PostgreSQL
echo "Starting PostgreSQL..."
service postgresql start

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -U postgres > /dev/null 2>&1; do
    sleep 1
done

# Create database and user if they don't exist
echo "Setting up database..."
su - postgres -c "psql -c \"CREATE DATABASE ${POSTGRES_DB};\"" 2>/dev/null || true
su - postgres -c "psql -c \"CREATE USER ${POSTGRES_USER} WITH PASSWORD '${POSTGRES_PASSWORD}';\"" 2>/dev/null || true
su - postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE ${POSTGRES_DB} TO ${POSTGRES_USER};\"" 2>/dev/null || true

echo "Database setup complete!"

# Start Spring Boot application
echo "Starting Spring Boot application..."
echo "========================================="
java -jar /app/app.jar

# Keep container running
tail -f /dev/null
