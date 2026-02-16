# =========================================================
# Stage 1: Build the Angular application
# Use Node.js image to compile TypeScript to JavaScript
# =========================================================
FROM node:20-alpine as build

# Set the working directory inside the build container
WORKDIR /app

# Copy dependency definitions first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the source code
COPY . .

# Build the app for production (optimizes code)
RUN npm run build --prod

# =========================================================
# Stage 2: Serve with Nginx (Internal Web Server)
# Use a lightweight Nginx image to serve static files
# =========================================================
FROM nginx:alpine

# 1. Copy the built artifacts from 'Stage 1' to Nginx's HTML folder
# CRITICAL: Ensure 'notes-app-frontend' matches the "outputPath" in angular.json
COPY --from=build /app/dist/notes-app-frontend/browser /usr/share/nginx/html

# 2. Copy our custom Nginx configuration (for SPA routing & compression)
# This overrides the default Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (Internal container port)
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]