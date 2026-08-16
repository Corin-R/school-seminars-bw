FROM node:24

ARG VERSION_FULL

ENV VITE_VERSION=${VERSION_FULL}

# Set working directory
WORKDIR /app

# Copy rest of the code
COPY . .

# Install dependencies
RUN npm install --verbose

# Expose the port your dev server uses
EXPOSE 8080

# Run the dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]