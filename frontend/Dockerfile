# Use an official Nginx image (lightweight)
FROM nginx:1.23-alpine

# Copy all your frontend files from the current folder
# into the Nginx web server's root directory
COPY . /usr/share/nginx/html

# Expose port 80, which is the default port for HTTP
EXPOSE 80