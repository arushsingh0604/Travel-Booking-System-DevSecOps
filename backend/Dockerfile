# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only necessary files for a quick test
COPY package*.json ./

# Install dependencies (use npm install instead of ci for flexibility)
RUN npm install

# Copy the main server file only
COPY server.js .

# Create a non-root user (still important for security)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose your backend port
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]