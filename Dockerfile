# QueueHive - All-in-One Docker Image
# Multi-stage build: Frontend → Backend → Runtime with PostgreSQL

# ============================================
# Stage 1: Build React Frontend
# ============================================
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend

# Copy package files
COPY QueueHive_FE/queuehive/package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY QueueHive_FE/queuehive/ ./

# Build React app
RUN npm run build

# ============================================
# Stage 2: Build Spring Boot Backend
# ============================================
FROM maven:3.9-eclipse-temurin-21 AS backend-build

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
# Stage 3: Runtime with Spring Boot Only
# ============================================
FROM ubuntu:22.04

# Prevent interactive prompts and set timezone
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Africa/Kigali

# Install Java and utilities (PostgreSQL runs in separate container)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        tzdata \
        openjdk-21-jre-headless \
        curl && \
    ln -fs /usr/share/zoneinfo/$TZ /etc/localtime && \
    dpkg-reconfigure --frontend noninteractive tzdata && \
    rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy Spring Boot JAR
COPY --from=backend-build /app/backend/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# Set environment variables
ENV SPRING_PROFILES_ACTIVE=docker

# Run Spring Boot application
CMD ["java", "-jar", "app.jar"]
