# Use official Node.js image as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app/frontend

# Copy the dependencies file to the working directory
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the remaining source code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app
CMD ["npm", "run", "dev"]
