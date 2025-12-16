# QueueHive Docker Build and Push Script

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "QueueHive Docker Build Script" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$IMAGE_NAME = "queuehive"
$DOCKER_HUB_USER = "manjoseph"  # Change this to your Docker Hub username
$VERSION = "1.0.0"

# Build the image
Write-Host "Building Docker image..." -ForegroundColor Yellow
docker build -t ${IMAGE_NAME}:latest -t ${IMAGE_NAME}:${VERSION} .

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Build successful!" -ForegroundColor Green
Write-Host ""

# Tag for Docker Hub
Write-Host "Tagging image for Docker Hub..." -ForegroundColor Yellow
docker tag ${IMAGE_NAME}:latest ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest
docker tag ${IMAGE_NAME}:${VERSION} ${DOCKER_HUB_USER}/${IMAGE_NAME}:${VERSION}

Write-Host "Tagged successfully!" -ForegroundColor Green
Write-Host ""

# Ask if user wants to push
$push = Read-Host "Do you want to push to Docker Hub? (y/n)"

if ($push -eq "y" -or $push -eq "Y") {
    Write-Host "Logging in to Docker Hub..." -ForegroundColor Yellow
    docker login
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Pushing to Docker Hub..." -ForegroundColor Yellow
        docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest
        docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:${VERSION}
        
        Write-Host "Push successful!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Image available at:" -ForegroundColor Cyan
        Write-Host "  docker pull ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest" -ForegroundColor White
        Write-Host "  docker pull ${DOCKER_HUB_USER}/${IMAGE_NAME}:${VERSION}" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "To run the container:" -ForegroundColor Cyan
Write-Host "  docker run -d -p 8080:8080 --name queuehive ${IMAGE_NAME}:latest" -ForegroundColor White
Write-Host ""
Write-Host "To view logs:" -ForegroundColor Cyan
Write-Host "  docker logs -f queuehive" -ForegroundColor White
Write-Host ""
Write-Host "Access application at:" -ForegroundColor Cyan
Write-Host "  http://localhost:8080" -ForegroundColor White
Write-Host "=========================================" -ForegroundColor Cyan
