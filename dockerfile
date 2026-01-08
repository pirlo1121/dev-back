FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# Install dependencies (including devDependencies for building)
RUN npm install

COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Expose port
EXPOSE 3000

# Start production server
CMD ["npm", "start"]
