FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy other backend files
COPY . .

# Expose port
EXPOSE 8000

# Command to run the backend server
CMD ["node", "index.js"]
