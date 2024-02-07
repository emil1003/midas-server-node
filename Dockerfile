# Run on alpine
FROM alpine

# Install node and npm
RUN apk add --update nodejs npm

# Use /app as workdir
WORKDIR /app

# Copy npm metadata files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy project source
COPY ./src ./src

# Build typescript
RUN npm run build

# Expose port (3000)
EXPOSE 3000

# TODO: Healthcheck

# Run npm start
CMD ["node", "-r", "dotenv/config", "build/"]
