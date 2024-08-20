# Stage 1: Build the React app
FROM node:16 AS build

# Set working directory
WORKDIR /react-frontend

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the React app
FROM node:16-alpine

# Set working directory
WORKDIR /react-frontend

# Install serve globally
RUN npm install -g serve

# Copy built app from the previous stage
COPY --from=build /react-frontend/build /react-frontend/build

# Set the command to serve the React app
CMD ["serve", "-s", "build"]

# Expose the port
EXPOSE 3000