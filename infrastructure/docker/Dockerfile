# Use official Node.js 18 Alpine image as base
# Alpine Linux is chosen for its minimal size
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
# This layer will only rebuild when these files change
COPY package*.json ./

# Install only production dependencies to reduce image size
# --omit=dev flag excludes development dependencies
RUN npm install --omit=dev

# Copy application code to the working directory
# This happens after npm install to leverage Docker cache for dependencies
COPY . .

# Expose port 3000 for the application
# Note: This is for documentation - you still need to map the port when running the container
EXPOSE 3000

# Define the command to start the application
# Using array syntax for proper signal handling
CMD ["npm", "start"]