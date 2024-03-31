# Use an official Node.js image as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app/backend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install nodemon globally
RUN npm install -g nodemon
RUN npm uninstall bcrypt
RUN npm install bcrypt

# Install dependencies
RUN npm install

# Copy the remaining source code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Command to run the app
CMD ["npm", "run", "dev"]
