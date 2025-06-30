# Stage 1: Serve the application from a lightweight Nginx server
FROM nginx:1.27-alpine

# Remove the default Nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy the built Angular app from the 'dist' folder to the Nginx web root
# Note: Adjust 'game' if your project name in angular.json is different.
COPY dist/Game /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80