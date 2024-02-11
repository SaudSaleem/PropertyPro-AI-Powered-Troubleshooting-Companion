# Use the official Node.js image as base
FROM node:latest as build-stage

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to container
COPY package*.json ./

# Install dependencies
RUN npm cache clean --force
RUN npm install

# Install pm2 globally
RUN npm install pm2 -g

# Copy the rest of the application code to the container
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application with pm2
CMD ["bash", "-c", "npx sequelize-cli db:migrate && pm2-runtime npm -- start"]
