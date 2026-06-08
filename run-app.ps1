# Docker Compose launcher for GeoScape 3D
# Run this from the project root:
#   .\run-app.ps1 compose-build   # Build Docker image
#   .\run-app.ps1 compose-up      # Start Docker Compose services
#   .\run-app.ps1 compose-down    # Stop Docker Compose services

param(
  [string]$Command = 'compose-up'
)

switch ($Command.ToLower()) {
  'compose-build' {
    Write-Host "Building the Docker image using docker compose..."
    docker compose build
  }
  'compose-up' {
    Write-Host "Starting Docker Compose services in detached mode..."
    docker compose up -d
  }
  'compose-down' {
    Write-Host "Stopping Docker Compose services..."
    docker compose down
  }
  default {
    Write-Host "Usage: .\run-app.ps1 [compose-build|compose-up|compose-down]"
    exit 1
  }
}
