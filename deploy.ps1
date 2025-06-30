# ==== CONFIG ====
$remoteUser = "rb"
$remoteHost = "192.168.0.6"
$remoteDir = "bqt"
$remote = "$remoteUser@$remoteHost"
$tempDeploy = "tempDeploy"

# ==== STEP 1: Build Spring Boot JAR (Gradle) ====
Write-Host "Building Spring Boot app..."
Push-Location DatabaseServer
./gradlew clean build -x test
Pop-Location

# ==== STEP 2: Build Angular App ====
Write-Host "Building Angular app..."
Push-Location Game
npm install
npm run build --configuration=production
Pop-Location

# ==== STEP 3: Prepare Deployment Folder ====
Write-Host "Preparing deployment package..."
Remove-Item -Recurse -Force $tempDeploy -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path "$tempDeploy/DatabaseServer"
New-Item -ItemType Directory -Force -Path "$tempDeploy/Game"
New-Item -ItemType Directory -Force -Path "$tempDeploy/node-server"

# Copy docker-compose
Copy-Item -Path "docker-compose.yml" -Destination "$tempDeploy\docker-compose.yml"

# Copy built Spring Boot JAR
Copy-Item -Path "DatabaseServer\build\libs\*.jar" -Destination "$tempDeploy\DatabaseServer\"

# Copy Angular build output, Dockerfile, and Nginx config
Copy-Item -Recurse -Path "Game\dist" -Destination "$tempDeploy\Game\dist" # Copy the already-built files
Copy-Item -Path "Game\Dockerfile" -Destination "$tempDeploy\Game\"           # The new, simpler Dockerfile
Copy-Item -Path "Game\nginx.conf" -Destination "$tempDeploy\Game\"         # Nginx configuration

# Copy Dockerfiles
Copy-Item "DatabaseServer\Dockerfile" "$tempDeploy\DatabaseServer\"
Copy-Item "node-server\Dockerfile" "$tempDeploy\node-server\"

# Copy Node server files
Copy-Item -Recurse -Path "node-server\*" -Destination "$tempDeploy\node-server\" -Exclude "node_modules"

# ==== STEP 4: Clean Remote ====
Write-Host "Cleaning remote Raspberry Pi..."
ssh $remote @"
cd $remoteDir &&
docker compose down &&
rm -rf ./*
"@

# ==== STEP 5: Upload Files ====
Write-Host "Uploading files to Raspberry Pi..."
scp -r "$tempDeploy\*" "${remote}:$remoteDir"

# ==== STEP 6: Launch Docker ====
Write-Host "Starting containers on Raspberry Pi..."
ssh $remote @"
cd $remoteDir &&
docker compose up -d --build &&
docker exec bqt-angular-1 chmod -R 755 /usr/share/nginx/html &&
docker exec bqt-angular-1 chown -R nginx:nginx /usr/share/nginx/html
"@

# ==== STEP 7: Clean Up ====
Write-Host "Cleaning local temp files..."
Remove-Item -Recurse -Force $tempDeploy

Write-Host "Done! The app should be running on http://$remoteHost"
