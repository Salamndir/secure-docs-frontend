# =========================================================
# Enterprise Production Runtime Stage (CI-Driven Build)
# Use a lightweight Nginx image to serve static files
# =========================================================
FROM nginx:alpine

# ------------------------------------------------------------------
# 1. Artifact Injection
# ------------------------------------------------------------------
# Copy the pre-built Angular artifacts directly from the GitHub Actions workspace.
# CRITICAL: The path must match the "outputPath" defined in your angular.json.
# For Angular 19+, it typically includes the '/browser' subfolder.
COPY dist/notes-app-frontend/browser /usr/share/nginx/html

# ------------------------------------------------------------------
# 2. Server Configuration
# ------------------------------------------------------------------
# Copy custom Nginx configuration for Single Page Application (SPA) routing.
# This overrides the default Nginx config to handle Angular routes correctly.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ------------------------------------------------------------------
# 3. Execution
# ------------------------------------------------------------------
# Expose port 80 (Internal container port)
EXPOSE 80

# Start Nginx in the foreground (daemon off is required for Docker containers)
CMD ["nginx", "-g", "daemon off;"]