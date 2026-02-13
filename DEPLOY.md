# 👑 Queen Angela MD — Deployment Guide

## 🟢 Deploy on BotHosting.net (Recommended)

### Step 1: Create Account
1. Go to [BotHosting.net](https://bothosting.net)
2. Sign up and create a new server
3. Select **Node.js** as environment

### Step 2: Upload Code
**Option A: Connect GitHub repo**
1. In the BotHosting panel, select "GitHub Integration"
2. Connect to repository: `emojysolutions/SPACE-MD`
3. Select the branch you want to deploy (usually `main`)

**Option B: Download ZIP and upload**
1. Download the repository as ZIP from GitHub
2. Upload the ZIP file through BotHosting's file manager
3. Extract the ZIP in your server directory

### Step 3: Install Dependencies
1. Open the Console/Terminal tab in BotHosting panel
2. Run the following command:
```bash
npm install
```

### Step 4: Configure Environment Variables
Go to **Settings → Environment Variables** and add the following:

| Variable | Required | Description |
|----------|----------|-------------|
| `BOT_NAME` | No | Bot display name (default: Queen Angela MD) |
| `WHATSAPP_TOKEN` | ✅ Yes | Your WhatsApp Cloud API token |
| `PHONE_NUMBER_ID` | ✅ Yes | Your WhatsApp phone number ID |
| `VERIFY_TOKEN` | ✅ Yes | Webhook verification token |
| `PORT` | No | Server port (default: 3000) |
| `OPENAI_API_KEY` | No | For GPT & DALL-E features |
| `ANTHROPIC_API_KEY` | No | For Claude features |
| `GOOGLE_AI_KEY` | No | For Gemini features |
| `DEEPSEEK_API_KEY` | No | For DeepSeek features |
| `ADMIN_PASSWORD` | No | Admin password (default: 11223344) |
| `OWNER_NUMBER` | No | Bot owner's phone number |
| `SESSION_ID` | No | WhatsApp session ID |
| `BOT_ADMIN` | No | Admin phone number |
| `GITHUB_USERNAME` | No | Your GitHub username |

### Step 5: Set Startup Command
In the BotHosting panel, set the startup command to:
```bash
node start.js
```

### Step 6: Start the Bot
1. Click the **Start** or **Deploy** button
2. Monitor the logs to ensure the bot starts successfully
3. Look for messages indicating the bot is connected

### Step 7: Configure Webhook (For WhatsApp Cloud API)
If you're using WhatsApp Cloud API:

1. Copy your BotHosting server URL (e.g., `https://your-server.bothosting.net`)
2. Go to [Meta Developer Dashboard](https://developers.facebook.com)
3. Navigate to **WhatsApp → Configuration**
4. Set Webhook URL to: `https://your-server-url/webhook`
5. Set Verify Token to the same value you set in environment variables
6. Subscribe to `messages` events
7. Click **Verify and Save**

### Step 8: Test Your Bot
Send a message to your WhatsApp number. The bot should reply!

### Troubleshooting on BotHosting
- **Bot won't start?** Check the Logs tab for error messages
- **Missing dependencies?** Run `npm install` again in the console
- **Environment variables not working?** Double-check they're saved in Settings
- **Port conflicts?** Make sure PORT is set to 3000 or remove it to use default
- **Bot crashes frequently?** Enable auto-restart in the panel settings
- **Node.js version issues?** BotHosting should use Node.js 18+ (check `.node-version` file)

### Enable Auto-Restart
1. Go to **Settings → General**
2. Enable **Auto Restart on Crash**
3. Set restart delay to 5 seconds
4. Save changes

---

## 🚂 Deploy on Railway

### Step 1: Create Railway Account
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub (recommended)

### Step 2: Create New Project
1. Click **New Project**
2. Select **Deploy from GitHub repo**
3. Choose `emojysolutions/SPACE-MD`

### Step 3: Configure Environment Variables
Railway will automatically detect `railway.json` config. Add these environment variables:

```
SESSION_ID=your_session_id
BOT_ADMIN=254712345678
GITHUB_USERNAME=your_github_username
ADMIN_PASSWORD=11223344
PORT=3000
```

### Step 4: Deploy
1. Railway will automatically build and deploy
2. Monitor the deployment logs
3. Once deployed, copy the public URL

### Step 5: Configure Webhook (if using WhatsApp Cloud API)
Set your webhook URL to: `https://your-railway-url.up.railway.app/webhook`

---

## 🎨 Deploy on Render

### Step 1: Create Render Account
1. Go to [Render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Create New Web Service
1. Click **New +** → **Web Service**
2. Connect your GitHub repository: `emojysolutions/SPACE-MD`
3. Render will auto-detect `render.yaml`

### Step 3: Configure Service
- **Name**: queen-angela-md
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `node index.js`

### Step 4: Add Environment Variables
Go to **Environment** tab and add:

```
SESSION_ID=your_session_id
BOT_ADMIN=254712345678
GITHUB_USERNAME=your_github_username
ADMIN_PASSWORD=11223344
NODE_ENV=production
PORT=3000
```

### Step 5: Deploy
1. Click **Create Web Service**
2. Wait for deployment to complete
3. Copy the service URL (e.g., `https://queen-angela-md.onrender.com`)

### Step 6: Configure Webhook
Set webhook to: `https://your-render-url.onrender.com/webhook`

**Note**: Render free tier spins down after inactivity. Use a free uptime monitor like [UptimeRobot](https://uptimerobot.com) to ping your `/health` endpoint every 5 minutes.

---

## 🟣 Deploy on Heroku

### Step 1: Create Heroku Account
1. Go to [Heroku.com](https://heroku.com)
2. Sign up for a free account

### Step 2: Deploy Using Button
Click the deploy button in the README:

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://dashboard.heroku.com/new?template=https://github.com/emojysolutions/SPACE-MD)

### Step 3: Configure App
1. Choose an app name
2. Fill in the environment variables (same as above)
3. Click **Deploy App**

### Step 4: Alternative - Deploy with Heroku CLI
```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login to Heroku
heroku login

# Clone the repository
git clone https://github.com/emojysolutions/SPACE-MD.git
cd SPACE-MD

# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set SESSION_ID=your_session_id
heroku config:set BOT_ADMIN=254712345678
heroku config:set GITHUB_USERNAME=your_github_username

# Deploy
git push heroku main

# Check logs
heroku logs --tail
```

### Step 5: Configure Webhook
Set webhook to: `https://your-app-name.herokuapp.com/webhook`

---

## 🖥️ Deploy on VPS (Ubuntu/Debian)

### Prerequisites
- Ubuntu 20.04+ or Debian 11+
- Root or sudo access
- Domain name (optional but recommended)

### Step 1: Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### Step 2: Install Node.js 18+
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### Step 3: Install PM2
```bash
sudo npm install -g pm2
```

### Step 4: Install Dependencies
```bash
sudo apt install -y ffmpeg imagemagick webp git
```

### Step 5: Clone Repository
```bash
cd /opt
sudo git clone https://github.com/emojysolutions/SPACE-MD.git
cd SPACE-MD
```

### Step 6: Install Node Dependencies
```bash
npm install --production
```

### Step 7: Configure Environment
Create `.env` file or use the setup wizard:
```bash
npm run setup
```

Or manually create `.env`:
```bash
nano .env
```

Add your environment variables:
```
SESSION_ID=your_session_id
BOT_ADMIN=254712345678
GITHUB_USERNAME=your_github_username
ADMIN_PASSWORD=11223344
PORT=3000
```

### Step 8: Start with PM2
```bash
pm2 start pm2.config.js
pm2 save
pm2 startup
```

### Step 9: Configure Nginx (Optional)
If you want to use a domain name:

```bash
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/queen-angela
```

Add this configuration:
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

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/queen-angela /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 10: Enable SSL with Certbot (Optional)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Step 11: Configure Webhook
Set webhook to: `https://your-domain.com/webhook` or `http://your-vps-ip:3000/webhook`

### Managing PM2
```bash
# View logs
pm2 logs queen-angela-md

# Restart bot
pm2 restart queen-angela-md

# Stop bot
pm2 stop queen-angela-md

# Monitor
pm2 monit
```

---

## 🐳 Deploy with Docker

### Step 1: Install Docker
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

### Step 2: Clone Repository
```bash
git clone https://github.com/emojysolutions/SPACE-MD.git
cd SPACE-MD
```

### Step 3: Create .env File
```bash
cp .env.example .env
nano .env
```

Add your environment variables.

### Step 4: Build and Run with Docker Compose
```bash
docker-compose up -d
```

### Step 5: View Logs
```bash
docker-compose logs -f queen-angela-md
```

### Step 6: Alternative - Run with Docker
```bash
# Build image
docker build -t queen-angela-md .

# Run container
docker run -d \
  --name queen-angela-md \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env \
  -v $(pwd)/temp:/app/temp \
  -v $(pwd)/data:/app/data \
  queen-angela-md
```

### Managing Docker Container
```bash
# View logs
docker logs -f queen-angela-md

# Restart container
docker restart queen-angela-md

# Stop container
docker stop queen-angela-md

# Remove container
docker rm queen-angela-md
```

---

## 🔧 Environment Variables Reference

### Required Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `SESSION_ID` | WhatsApp session ID | `XPLOADER-BOT:~xxxxx` |
| `BOT_ADMIN` | Admin phone number | `254712345678` |
| `GITHUB_USERNAME` | Your GitHub username | `yourusername` |

### Optional Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `BOT_NAME` | Bot display name | `Queen Angela MD` |
| `BOT_PASSWORD` | Bot password | `12345678` |
| `ADMIN_PASSWORD` | Admin password | `11223344` |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token | - |
| `ANTI_DELETE` | Enable anti-delete | `false` |
| `PREMIUM_KEY` | Premium membership key | - |
| `MAX_SESSIONS` | Max sessions (premium) | `3` |
| `EXPIRY` | Premium expiry date | - |

### AI Provider Variables (Optional)
| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key for GPT & DALL-E |
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude |
| `GOOGLE_AI_KEY` | Google AI key for Gemini |
| `DEEPSEEK_API_KEY` | DeepSeek API key |

---

## 🆘 Common Issues

### Bot Won't Start
1. Check Node.js version: `node --version` (should be 18+)
2. Install dependencies: `npm install`
3. Check environment variables
4. View logs for error messages

### Webhook Verification Failed
1. Ensure `VERIFY_TOKEN` matches in both .env and Meta Dashboard
2. Check that webhook URL is accessible (test `/health` endpoint)
3. Ensure URL uses HTTPS (required by Meta)

### Bot Not Responding
1. Check if bot is running
2. Verify WhatsApp API credentials
3. Check webhook subscription is active
4. View logs for errors

### Memory Issues
1. Increase server memory if possible
2. Disable `ANTI_DELETE` if enabled
3. Use PM2 with `max_memory_restart: '512M'`

### SSL/HTTPS Issues
1. Use Certbot for free SSL on VPS
2. Railway/Render/Heroku provide HTTPS automatically
3. Ensure webhook uses HTTPS URL

---

## 📊 Monitoring

### Health Check Endpoint
All deployments include a health check endpoint:
```
GET /health
```

Response:
```json
{
  "status": "online",
  "bot": "Queen Angela MD",
  "version": "1.0.0",
  "uptime": 3600,
  "timestamp": "2024-01-01T12:00:00.000Z",
  "memory": {
    "rss": 50000000,
    "heapTotal": 30000000,
    "heapUsed": 20000000
  }
}
```

### Uptime Monitoring
Use free services to monitor your bot:
- [UptimeRobot](https://uptimerobot.com)
- [StatusCake](https://www.statuscake.com)
- [Pingdom](https://www.pingdom.com)

Configure them to ping `https://your-bot-url/health` every 5 minutes.

---

## 🎉 Success!

Your Queen Angela MD bot should now be deployed and running! 

For support:
- GitHub Issues: https://github.com/emojysolutions/SPACE-MD/issues
- Documentation: Check README.md

---

## 📝 Quick Start Summary

### BotHosting.net (Fastest)
```
1. Sign up → Create Node.js server
2. Upload code or connect GitHub
3. npm install
4. Set environment variables
5. Start with: node index.js
6. Configure webhook
```

### VPS (Most Control)
```bash
npm install -g pm2
git clone https://github.com/emojysolutions/SPACE-MD.git
cd SPACE-MD
npm install
npm run setup
pm2 start pm2.config.js
pm2 save && pm2 startup
```

### Docker (Easiest Local)
```bash
git clone https://github.com/emojysolutions/SPACE-MD.git
cd SPACE-MD
nano .env  # Add your config
docker-compose up -d
```

---

**Enjoy your Queen Angela MD bot! 👑**
