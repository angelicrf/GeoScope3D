#!/usr/bin/env sh

# Docker Compose launcher for GeoScape 3D
# Run this script from the project root.
# Usage:
#   ./run-app.sh compose-build   # Build Docker image
#   ./run-app.sh compose-up      # Start Docker Compose services
#   ./run-app.sh compose-down    # Stop Docker Compose services

set -e

command="$1"
if [ -z "$command" ]; then
  command="compose-up"
fi

case "$command" in
  compose-build)
    echo "Building the Docker image using docker compose..."
    docker compose build
    ;;
  compose-up)
    echo "Starting Docker Compose services in detached mode..."
    docker compose up -d
    ;;
  compose-down)
    echo "Stopping Docker Compose services..."
    docker compose down
    ;;
  *)
    echo "Usage: $0 [compose-build|compose-up|compose-down]"
    exit 1
    ;;
esac
