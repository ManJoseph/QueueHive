# QueueHive - All-in-One Docker Image
# Multi-stage build: Frontend → Backend → Runtime with PostgreSQL

# ============================================
# Stage 1: Build React Frontend
# ============================================
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend

# Copy package files
COPY QueueHive_FE/queuehive/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY QueueHive_FE/queuehive/ ./

# Build React app
RUN npm run build

# ============================================
# Stage 2: Build Spring Boot Backend
# ============================================
FROM maven:3.9-eclipse-temurin-17 AS backend-build

WORKDIR /app/backend

# Copy pom.xml first for dependency caching
COPY QueueHive_BE/pom.xml ./

# Download dependencies (cached layer)
RUN mvn dependency:go-offline -B

# Copy source code
COPY QueueHive_BE/src ./src

# Copy React build to static resources
COPY --from=frontend-build /app/frontend/build ./src/main/resources/static

# Build Spring Boot JAR
RUN mvn clean package -DskipTests -B

# ============================================
# Stage 3: Runtime with PostgreSQL + Spring Boot
# ============================================
FROM ubuntu:22.04

# Install PostgreSQL, Java, and utilities
RUN apt-get update && \
    apt-get install -y \
        postgresql-14 \
        postgresql-contrib-14 \
        openjdk-17-jre-headless \
        curl \
        && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy Spring Boot JAR
COPY --from=backend-build /app/backend/target/*.jar app.jar

# Copy startup script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Create postgres user and set permissions
RUN mkdir -p /var/lib/postgresql/data && \
    chown -R postgres:postgres /var/lib/postgresql && \
    chmod 700 /var/lib/postgresql/data

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# Set environment variables
ENV POSTGRES_DB=queuehive \
    POSTGRES_USER=queuehive \
    POSTGRES_PASSWORD=queuehive123 \
    SPRING_PROFILES_ACTIVE=docker

# Run startup script
CMD ["/app/start.sh"]
