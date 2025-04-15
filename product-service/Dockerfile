# Dockerfile for NestJS Services

# Use Node.js 20 as the base image
FROM node:20 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the port that your application will run on
EXPOSE 3002

# Start the application
CMD ["npm", "run", "start:dev"]
