# 🚀 SPACE-MD Ultra - Setup & Deployment Guide

This guide will help you set up and deploy SPACE-MD Ultra WhatsApp bot.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [WhatsApp Business API Setup](#whatsapp-business-api-setup)
3. [Local Setup](#local-setup)
4. [Configuration](#configuration)
5. [Running the Bot](#running-the-bot)
6. [Deployment Options](#deployment-options)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before starting, ensure you have:

- ✅ Node.js 18+ installed
- ✅ npm 10+ installed
- ✅ A Facebook Developer Account
- ✅ A WhatsApp Business Account
- ✅ A phone number for WhatsApp Business API

## WhatsApp Business API Setup

### Step 1: Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Select "Business" as the app type
4. Fill in app details and create

### Step 2: Add WhatsApp Product

1. In your app dashboard, click "Add Product"
2. Find "WhatsApp" and click "Set Up"
3. Follow the setup wizard

### Step 3: Get Your Credentials

You'll need three pieces of information:

1. **Phone Number ID**
   - Go to WhatsApp → Getting Started
   - Copy the "Phone Number ID"

2. **Access Token**
   - In the same page, find "Temporary access token"
   - For production, generate a permanent token in Settings → Business Settings

3. **Webhook Verify Token**
   - You'll create this yourself (any random string)
   - Example: `SPACE_MD_ULTRA_VERIFY_123`

### Step 4: Configure Webhook

1. Go to WhatsApp → Configuration
2. Click "Edit" next to Webhook
3. Enter your webhook URL: `https://your-domain.com/webhook`
4. Enter your Verify Token (the one you created)
5. Subscribe to "messages" field

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/emojysolutions/SPACE-MD.git
cd SPACE-MD
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- express
- axios
- chalk
- dotenv
- moment-timezone

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` file with your credentials:

```env
# WhatsApp Cloud API Configuration
WHATSAPP_API_URL=https://graph.facebook.com/v17.0
WHATSAPP_PHONE_ID=your_phone_number_id_here
WHATSAPP_TOKEN=your_whatsapp_access_token_here
WEBHOOK_VERIFY_TOKEN=SPACE_MD_ULTRA_VERIFY

# Bot Configuration
BOT_PREFIX=!
ADMIN_PASSWORD=change_this_password

# Server Configuration
PORT=3000
NODE_ENV=development
```

**⚠️ Important**: Change `ADMIN_PASSWORD` to a secure password!

## Configuration

### Command Prefix

By default, commands use `!` prefix (e.g., `!help`, `!joke`).

To change it, edit `BOT_PREFIX` in `.env`:

```env
BOT_PREFIX=$
```

Now commands would be `$help`, `$joke`, etc.

### Rate Limiting

Adjust rate limiting in `.env`:

```env
RATE_LIMIT_MAX=10          # Max messages per window
RATE_LIMIT_WINDOW=30000    # Window size in milliseconds (30 seconds)
```

### Command Cooldown

Set default cooldown between commands:

```env
DEFAULT_COOLDOWN=3000      # 3 seconds
```

## Running the Bot

### Development Mode

```bash
npm run dev
```

This uses nodemon for auto-restart on file changes.

### Production Mode

```bash
npm start
```

### Verify Installation

```bash
npm run verify
```

You should see:

```
╔══════════════════════════════════════════╗
║     🚀 SPACE-MD Ultra v1.0.0 🚀         ║
║     WhatsApp Bot Engine                  ║
╠══════════════════════════════════════════╣
║  Status:  🟢 Online                      ║
║  Port:    3000                           ║
╚══════════════════════════════════════════╝
```

## Deployment Options

### Option 1: Railway (Recommended)

Railway offers free hosting for hobby projects.

1. **Fork the repository** to your GitHub account

2. **Sign up at Railway**: https://railway.app/

3. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your forked repository

4. **Add Environment Variables**
   - Go to project settings → Variables
   - Add all variables from `.env`

5. **Deploy**
   - Railway will automatically deploy
   - Copy the provided URL
   - Use it as your webhook URL in Meta

### Option 2: Render

1. **Sign up at Render**: https://render.com/

2. **Create New Web Service**
   - Connect your GitHub repository
   - Choose the SPACE-MD repository

3. **Configure**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables

4. **Deploy**
   - Render will build and deploy
   - Copy the URL for webhook

### Option 3: Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-bot-name

# Set environment variables
heroku config:set WHATSAPP_TOKEN=your_token
heroku config:set WHATSAPP_PHONE_ID=your_phone_id
heroku config:set WEBHOOK_VERIFY_TOKEN=your_verify_token
heroku config:set ADMIN_PASSWORD=your_password

# Deploy
git push heroku main

# Check logs
heroku logs --tail
```

### Option 4: Docker

**Build the image:**

```bash
docker build -t space-md-ultra .
```

**Run the container:**

```bash
docker run -d \
  -p 3000:3000 \
  --env-file .env \
  --name space-md \
  space-md-ultra
```

**Check logs:**

```bash
docker logs -f space-md
```

### Option 5: VPS (Ubuntu)

1. **Install Node.js**

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Clone and setup**

```bash
git clone https://github.com/emojysolutions/SPACE-MD.git
cd SPACE-MD
npm install
cp .env.example .env
nano .env  # Edit configuration
```

3. **Use PM2 for process management**

```bash
sudo npm install -g pm2
pm2 start index.js --name space-md-ultra
pm2 save
pm2 startup
```

4. **Setup Nginx reverse proxy** (optional)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Troubleshooting

### Bot Not Responding

1. **Check if bot is running**
   ```bash
   curl http://localhost:3000/
   ```
   Should return bot status.

2. **Check logs for errors**
   - Look for error messages
   - Verify WhatsApp credentials

3. **Verify webhook**
   - Make sure webhook URL is accessible from internet
   - Check if webhook verification succeeded

### Commands Not Working

1. **Check command prefix**
   - Make sure you're using the correct prefix (`!` by default)
   - Example: `!help` not `help`

2. **Check cooldown**
   - Commands have cooldowns to prevent spam
   - Wait a few seconds between commands

3. **Rate limiting**
   - You may be sending too many messages
   - Wait 30 seconds and try again

### Module Not Found Errors

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use

```bash
# Change port in .env
PORT=3001
```

Or kill the process using the port:

```bash
# Find process
lsof -i :3000

# Kill it
kill -9 <PID>
```

### Webhook Verification Failed

1. **Check verify token**
   - Must match exactly in Meta and `.env`

2. **Check URL accessibility**
   - Webhook URL must be publicly accessible
   - Use https:// in production

3. **Check server is running**
   - Server must be running when Meta sends verification request

## Testing the Bot

### Send Test Message

Send a WhatsApp message to your bot number:

```
!help
```

You should receive the help menu.

### Try Different Commands

```
!ping        - Check bot response time
!about       - Bot information
!menu        - Full command list
!joke        - Random joke
!quote       - Inspirational quote
!trivia      - Play trivia game
```

### Admin Commands

```
!stats <admin_password>     - View bot statistics
```

Replace `<admin_password>` with your actual admin password.

## Adding Custom Commands

Create a new file in the appropriate category folder:

```javascript
// commands/fun/mycommand.js
const formatter = require('../../utils/formatter');

module.exports = {
    name: 'mycommand',
    aliases: ['mc'],
    category: 'fun',
    description: '✨ My awesome command',
    usage: '!mycommand',
    cooldown: 3000,
    adminOnly: false,

    async execute(from, args, api, sessionManager, stats) {
        return formatter.bold('Hello from my command!') + ' 🎉';
    }
};
```

Restart the bot and your command is ready!

## Security Best Practices

1. ✅ **Never commit `.env` file**
   - Already in `.gitignore`
   - Contains sensitive tokens

2. ✅ **Use strong admin password**
   - Change default password immediately
   - Use a password manager

3. ✅ **Keep dependencies updated**
   ```bash
   npm update
   npm audit fix
   ```

4. ✅ **Use HTTPS in production**
   - Required for WhatsApp webhook
   - Use Let's Encrypt for free SSL

5. ✅ **Monitor logs**
   - Check for suspicious activity
   - Set up log rotation

## Support

- 📖 Read the [README.md](README.md)
- 🐛 Report issues on GitHub
- 💡 Check existing issues for solutions
- 🤝 Contribute improvements

## Next Steps

1. ✅ Test all commands
2. ✅ Customize welcome messages
3. ✅ Add your own commands
4. ✅ Configure external APIs (weather, etc.)
5. ✅ Monitor bot usage
6. ✅ Share with users!

---

**🚀 Happy Botting with SPACE-MD Ultra!** ✨
