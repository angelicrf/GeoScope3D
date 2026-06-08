#!/usr/bin/env sh

# Launcher for GeoScape 3D development
# Run this script from the project root.

echo "Installing dependencies..."
npm install

echo "Starting GeoScape 3D on http://localhost:9002..."
npm run dev
