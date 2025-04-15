# Step 1: Use Node.js image to build the Next.js app
FROM node:20 AS builder

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Step 2: Use a smaller image to run the app (for production)
FROM node:20-slim

WORKDIR /app

# Copy built files from the builder stage
COPY --from=builder /app /app

# Expose the port the app runs on
EXPOSE 3000

# Run the app in production mode
CMD ["npm", "start"]
