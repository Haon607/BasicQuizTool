#!/bin/bash

# ==== CONFIG ====
remoteUser="rb"
remoteHost="192.168.0.6"
remoteDir="bqt"
remote="$remoteUser@$remoteHost"
tempDeploy="tempDeploy"
baseDir=$(pwd)

# ==== STEP 1: Build Spring Boot JAR (Gradle) ====
echo "Building Spring Boot app..."
cd "$baseDir/DatabaseServer"
./gradlew clean build -x test
cd "$baseDir"

# ==== STEP 2: Build Angular App ====
echo "Building Angular app..."
cd "$baseDir/Game"
npm install
npm run build --configuration=production
cd "$baseDir"

# ==== STEP 3: Prepare Deployment Folder ====
echo "Preparing deployment package..."
rm -rf "$tempDeploy"
mkdir -p "$tempDeploy/DatabaseServer"
mkdir -p "$tempDeploy/Game"
mkdir -p "$tempDeploy/node-server"

# Copy docker-compose
cp docker-compose.yml "$tempDeploy/docker-compose.yml"

# Copy built Spring Boot JAR
cp DatabaseServer/build/libs/*.jar "$tempDeploy/DatabaseServer/"

# Copy Angular build output, Dockerfile, and Nginx config
cp -R Game/dist "$tempDeploy/Game/"
cp Game/Dockerfile "$tempDeploy/Game/"
cp Game/nginx.conf "$tempDeploy/Game/"

# Copy Dockerfiles
cp DatabaseServer/Dockerfile "$tempDeploy/DatabaseServer/"
cp node-server/Dockerfile "$tempDeploy/node-server/"

# Copy Node server files (excluding node_modules)
rsync -av --exclude 'node_modules' node-server/ "$tempDeploy/node-server/"

# ==== STEP 4: Clean Remote ====
echo "Cleaning remote Raspberry Pi..."
ssh "$remote" << EOF
cd "$remoteDir" && \
docker compose down && \
rm -rf ./*
EOF

# ==== STEP 5: Upload Files ====
echo "Uploading files to Raspberry Pi..."
scp -r "$tempDeploy/"* "$remote:$remoteDir"

# ==== STEP 6: Launch Docker ====
echo "Starting containers on Raspberry Pi..."
ssh "$remote" << EOF
cd "$remoteDir" && \
docker compose up -d --build && \
docker exec bqt-angular-1 chmod -R 755 /usr/share/nginx/html && \
docker exec bqt-angular-1 chown -R nginx:nginx /usr/share/nginx/html
EOF

# ==== STEP 7: Clean Up ====
echo "Cleaning local temp files..."
rm -rf "$tempDeploy"

echo "Done! The app should be running on http://$remoteHost"
