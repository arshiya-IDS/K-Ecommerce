# Stage 1: Build the React application
FROM node:alpine AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire project
COPY . .

# Pass environment variable at build time
ARG VITE_BASE_URI
ENV VITE_BASE_URI=${VITE_BASE_URI}

# Ensure Vite reads the environment variable
RUN echo "VITE_BASE_URI=${VITE_BASE_URI}" > .env

# Build the application
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Copy built app from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
