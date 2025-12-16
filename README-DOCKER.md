# QueueHive Docker Image

Complete queue management system with Spring Boot backend, React frontend, and PostgreSQL database - all in one container!

## Quick Start

```bash
# Pull and run from Docker Hub
docker pull manjoseph/queuehive:latest
docker run -d -p 8080:8080 --name queuehive manjoseph/queuehive:latest

# Access the application
open http://localhost:8080
```

## What's Included

- **PostgreSQL 14**: Database for storing users, companies, tokens
- **Spring Boot 3**: REST API backend with JWT authentication
- **React 18**: Modern frontend with Material Design 3
- **All-in-One**: Everything runs in a single container

## Building the Image

```bash
# Clone the repository
git clone https://github.com/ManJoseph/QueueHive.git
cd QueueHive

# Build the image
docker build -t queuehive:latest .

# Run locally
docker run -d -p 8080:8080 --name queuehive queuehive:latest
```

## Pushing to Docker Hub

```bash
# Tag the image
docker tag queuehive:latest manjoseph/queuehive:latest
docker tag queuehive:latest manjoseph/queuehive:v1.0.0

# Login to Docker Hub
docker login

# Push to Docker Hub
docker push manjoseph/queuehive:latest
docker push manjoseph/queuehive:v1.0.0
```

## Running the Container

### Basic Run

```bash
docker run -d \
  -p 8080:8080 \
  --name queuehive \
  manjoseph/queuehive:latest
```

### With Custom Environment Variables

```bash
docker run -d \
  -p 8080:8080 \
  --name queuehive \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -e JWT_SECRET=myjwtsecret \
  manjoseph/queuehive:latest
```

### With Data Persistence

```bash
docker run -d \
  -p 8080:8080 \
  --name queuehive \
  -v queuehive-data:/var/lib/postgresql/data \
  manjoseph/queuehive:latest
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_DB` | `queuehive` | Database name |
| `POSTGRES_USER` | `queuehive` | Database user |
| `POSTGRES_PASSWORD` | `queuehive123` | Database password |
| `SPRING_PROFILES_ACTIVE` | `docker` | Spring Boot profile |

## Accessing the Application

Once the container is running:

- **Frontend**: http://localhost:8080
- **API**: http://localhost:8080/api
- **Health Check**: http://localhost:8080/actuator/health

## Default Credentials

### Super Admin
- Email: `admin@queuehive.com`
- Password: `admin123`

## Container Management

### View Logs

```bash
docker logs -f queuehive
```

### Stop Container

```bash
docker stop queuehive
```

### Start Container

```bash
docker start queuehive
```

### Remove Container

```bash
docker stop queuehive
docker rm queuehive
```

### Remove Image

```bash
docker rmi manjoseph/queuehive:latest
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker logs queuehive

# Check if port is already in use
netstat -an | findstr :8080  # Windows
lsof -i :8080                # Mac/Linux
```

### Database connection issues

```bash
# Exec into container
docker exec -it queuehive bash

# Check PostgreSQL status
service postgresql status

# Check database
su - postgres -c "psql -l"
```

### Application not accessible

```bash
# Verify container is running
docker ps

# Check health
docker exec queuehive curl http://localhost:8080/actuator/health
```

## Production Deployment

For production, consider:

1. **Use environment variables** for sensitive data
2. **Mount volumes** for data persistence
3. **Use reverse proxy** (Nginx/Traefik) for HTTPS
4. **Set resource limits**:

```bash
docker run -d \
  -p 8080:8080 \
  --name queuehive \
  --memory="2g" \
  --cpus="2" \
  -v queuehive-data:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=${DB_PASSWORD} \
  manjoseph/queuehive:latest
```

## Features

- ✅ User registration and authentication
- ✅ Company registration and approval
- ✅ Service type management
- ✅ Token booking and queue management
- ✅ Real-time notifications
- ✅ Admin dashboard
- ✅ Company admin dashboard
- ✅ User dashboard

## Tech Stack

- **Backend**: Spring Boot 3, Spring Security, JWT, JPA/Hibernate
- **Frontend**: React 18, React Router, Material Design 3
- **Database**: PostgreSQL 14
- **Build**: Maven, npm

## Support

- **GitHub**: https://github.com/ManJoseph/QueueHive
- **Issues**: https://github.com/ManJoseph/QueueHive/issues

## License

MIT License - see LICENSE file for details
