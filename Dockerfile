# Use the official Node.js image as the base image
FROM node:18-alpine

# root directory for the project
RUN mkdir /workspace

# Set the working directory
WORKDIR /workspace

# Copy the current directory contents into the container at /workspace
ADD . /workspace/

# Install dependencies
RUN npm install

# Expose the port the React development server runs on
EXPOSE 3000

# Start the React development server
CMD ["npm", "start"]
