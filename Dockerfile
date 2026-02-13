FROM node:18-alpine

# Install ffmpeg for music features
RUN apk add --no-cache ffmpeg wget

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Copy all project files
COPY . .

# Create required directories
RUN mkdir -p temp logs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the bot
CMD ["node", "start.js"]