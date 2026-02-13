FROM node:lts

# Queen Angela MD - Your Royal WhatsApp Assistant
# A royal, feature-rich WhatsApp bot

# Install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg imagemagick webp && apt-get clean

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install && npm cache clean --force

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV production

# Run command
CMD ["npm", "run", "start"]