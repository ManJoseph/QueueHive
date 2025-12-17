# QueueHive Docker Deployment

Complete queue management system with Spring Boot backend, React frontend, and PostgreSQL database using Docker Compose.

## Quick Start with Docker Compose

```bash
# Clone the repository
git clone https://github.com/ManJoseph/QueueHive.git
cd QueueHive

# Start all services
docker-compose up -d

# Access the application
open http://localhost:8080
```

## Architecture

The application uses a **multi-container architecture** with Docker Compose:

- **PostgreSQL Container**: Dedicated database server (postgres:15-alpine)
- **Backend Container**: Spring Boot application with embedded React frontend
- **pgAdmin Container**: Optional database management GUI

This architecture follows best practices by separating concerns and allowing independent scaling.

## What's Included

- **PostgreSQL 15**: Dedicated database container for storing users, companies, tokens
- **Spring Boot 3**: REST API backend with JWT authentication and WebSocket support
- **React 18**: Modern frontend with Material Design 3 (served by Spring Boot)
- **pgAdmin 4**: Web-based database administration tool

## Using Docker Compose (Recommended)

### Prerequisites
- Docker Desktop or Docker Engine with Docker Compose

### Running the Application

```bash
# Navigate to project root
cd QueueHive

# Start all services (builds backend image if needed)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v
```

### Accessing Services

Once running:

- **Frontend & API**: http://localhost:8080
- **API Endpoints**: http://localhost:8080/api
- **Health Check**: http://localhost:8080/actuator/health
- **pgAdmin**: http://localhost:5050
  - Email: `admin@queuehive.com`
  - Password: `admin`
- **PostgreSQL**: localhost:5432

### Default Credentials

**Super Admin**
- Email: `admin@queuehive.com`
- Password: `admin123`

## Using Pre-built Docker Image

You can also pull and run the backend image from Docker Hub:

```bash
# Pull the latest image
docker pull manjoseph/queuehive:latest

# Run with external PostgreSQL (recommended)
docker run -d \
  -p 8080:8080 \
  --name queuehive-backend \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://your-db-host:5432/queuehive_db \
  -e SPRING_DATASOURCE_USERNAME=postgres \
  -e SPRING_DATASOURCE_PASSWORD=yourpassword \
  manjoseph/queuehive:latest
```

> **Note**: The Docker image contains only the Spring Boot application with the React build. You need a separate PostgreSQL instance. Use Docker Compose for the complete setup.

## Building the Image Locally

```bash
# Build the backend image
docker build -t queuehive:latest .

# Tag for Docker Hub
docker tag queuehive:latest manjoseph/queuehive:latest
docker tag queuehive:latest manjoseph/queuehive:v1.0.0

# Login to Docker Hub
docker login

# Push to Docker Hub
docker push manjoseph/queuehive:latest
docker push manjoseph/queuehive:v1.0.0
```

## Configuration

### Environment Variables

The `docker-compose.yml` configures the following:

**PostgreSQL Container:**
| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_USER` | `postgres` | Database superuser |
| `POSTGRES_PASSWORD` | `Joseph123` | Database password |
| `POSTGRES_DB` | `queuehive_db` | Database name |

**Backend Container:**
| Variable | Default | Description |
|----------|---------|-------------|
| `SPRING_PROFILES_ACTIVE` | `docker` | Spring Boot profile (uses docker config) |

### Customizing Configuration

Edit `docker-compose.yml` to change environment variables:

```yaml
services:
  postgres:
    environment:
      POSTGRES_PASSWORD: your_secure_password
      
  queuehive-backend:
    environment:
      SPRING_PROFILES_ACTIVE: docker
      # Add more environment variables as needed
```

## Data Persistence

Database data is persisted in a Docker volume:

```bash
# View volumes
docker volume ls

# Inspect the postgres volume
docker volume inspect queuehive_postgres-data

# Backup database
docker exec queuehive-postgres pg_dump -U postgres queuehive_db > backup.sql

# Restore database
cat backup.sql | docker exec -i queuehive-postgres psql -U postgres -d queuehive_db
```

## Troubleshooting

### Services won't start

```bash
# Check logs for all services
docker-compose logs

# Check specific service
docker-compose logs queuehive-backend
docker-compose logs postgres

# Check if ports are in use
netstat -an | findstr :8080  # Windows
lsof -i :8080                # Mac/Linux
```

### Database connection issues

```bash
# Verify PostgreSQL is healthy
docker-compose ps

# Check database connectivity
docker exec queuehive-postgres pg_isready -U postgres

# Connect to database
docker exec -it queuehive-postgres psql -U postgres -d queuehive_db
```

### Backend not starting

```bash
# Check if database is ready
docker-compose logs postgres

# Restart backend after database is ready
docker-compose restart queuehive-backend

# View backend logs
docker-compose logs -f queuehive-backend
```

### Reset everything

```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Rebuild and start fresh
docker-compose up --build -d
```

## Production Deployment

For production environments:

1. **Use strong passwords**: Change default passwords in `docker-compose.yml`
2. **Enable HTTPS**: Use a reverse proxy (Nginx/Traefik) with SSL certificates
3. **Set resource limits**: Configure memory and CPU limits
4. **Use secrets**: Store sensitive data in Docker secrets or environment files
5. **Enable monitoring**: Add health checks and logging
6. **Backup regularly**: Implement automated database backups

### Production docker-compose Example

```yaml
services:
  postgres:
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}  # Use environment variable
    volumes:
      - postgres-data:/var/lib/postgresql/data
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '1'
          
  queuehive-backend:
    environment:
      SPRING_PROFILES_ACTIVE: prod
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '2'
```

## Multi-Stage Build Details

The Dockerfile uses a multi-stage build for optimization:

1. **Stage 1 - Frontend Build**: Builds React app using Node.js
2. **Stage 2 - Backend Build**: Builds Spring Boot JAR with Maven, includes React build
3. **Stage 3 - Runtime**: Minimal Ubuntu image with only Java runtime and the JAR

This results in a smaller final image (~400MB vs 1GB+).

## Features

- ✅ User registration and authentication (JWT)
- ✅ Company registration and approval workflow
- ✅ Service type management
- ✅ Token booking and queue management
- ✅ Real-time notifications (WebSocket)
- ✅ Admin dashboard (user & company management)
- ✅ Company admin dashboard
- ✅ User dashboard

## Support

- **Docker Hub**: https://hub.docker.com/r/manjoseph/queuehive
- **GitHub**: https://github.com/ManJoseph/QueueHive
- **Issues**: https://github.com/ManJoseph/QueueHive/issues
- **Documentation**: See `/docs` directory for API docs and UML diagrams

## License

MIT License - see LICENSE file for details
