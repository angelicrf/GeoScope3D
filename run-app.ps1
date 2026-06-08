# PowerShell launcher for GeoScape 3D
# Run this from the project root:
#   .\run-app.ps1

Write-Host "Installing dependencies..."
npm install

Write-Host "Starting GeoScape 3D on http://localhost:9002..."
npm run dev
