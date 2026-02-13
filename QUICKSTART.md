# 🚀 Quick Start Guide - SPACE-MD Ultra

Get up and running in 5 minutes!

## ⚡ Prerequisites

- Node.js 18+ and npm 10+
- WhatsApp Business API access (or get test credentials)
- A code editor

## 📦 Installation

```bash
# 1. Clone the repository
git clone https://github.com/emojysolutions/SPACE-MD.git
cd SPACE-MD

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env

# 4. Edit .env with your credentials
nano .env  # or use your preferred editor
```

## 🔧 Configuration

Edit `.env` file with your WhatsApp Business API credentials:

```env
WHATSAPP_PHONE_ID=your_phone_number_id
WHATSAPP_TOKEN=your_access_token
WEBHOOK_VERIFY_TOKEN=your_custom_verify_token
ADMIN_PASSWORD=your_secure_password
```

## 🏃 Run the Bot

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
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

## 🌐 Set Up Webhook

1. Make your local server accessible (use ngrok for testing):
   ```bash
   ngrok http 3000
   ```

2. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)

3. In Meta Developer Portal:
   - Go to WhatsApp → Configuration
   - Set webhook URL: `https://abc123.ngrok.io/webhook`
   - Set verify token: (same as in your `.env`)
   - Subscribe to "messages"

## ✅ Test It

Send a WhatsApp message to your bot number:

```
!help
```

You should receive the help menu! 🎉

## 🎮 Try These Commands

```
!ping        - Check bot status
!joke        - Get a random joke
!quote       - Inspirational quote
!trivia      - Play trivia quiz
!calc 2+2    - Calculate math
!8ball Will I succeed?  - Ask magic 8-ball
```

## 📚 Learn More

- **Full Documentation**: [README.md](README.md)
- **Setup Guide**: [SETUP.md](SETUP.md)
- **Command Reference**: [COMMANDS.md](COMMANDS.md)

## 🎯 Project Structure

```
SPACE-MD/
├── index.js           # Main server
├── bot.js             # Bot logic
├── config.js          # Configuration
├── commands/          # All commands (auto-loaded)
│   ├── general/       # help, ping, about, menu
│   ├── fun/           # joke, quote, 8ball, etc.
│   ├── tools/         # calc, time, translate, etc.
│   ├── games/         # trivia, hangman, etc.
│   └── admin/         # stats, broadcast, etc.
├── utils/             # Utilities
│   ├── logger.js      # Logging
│   ├── api.js         # WhatsApp API
│   ├── formatter.js   # Message formatting
│   └── ...
├── data/              # Data files
│   ├── jokes.json
│   ├── quotes.json
│   └── ...
└── middleware/        # Middleware
    ├── auth.js
    └── ...
```

## 🔨 Add Your Own Command

Create a new file in `commands/fun/mycommand.js`:

```javascript
const formatter = require('../../utils/formatter');

module.exports = {
    name: 'mycommand',
    category: 'fun',
    description: '✨ My awesome command',
    usage: '!mycommand',
    cooldown: 3000,
    adminOnly: false,

    async execute(from, args, api, sessionManager, stats) {
        return formatter.bold('Hello!') + ' 🎉';
    }
};
```

Restart the bot - your command is ready!

```
!mycommand
```

## 🐳 Deploy with Docker

```bash
# Build
docker build -t space-md-ultra .

# Run
docker run -d -p 3000:3000 --env-file .env space-md-ultra
```

## 🚀 Deploy to Cloud

### Railway (Easiest)

1. Fork the repo
2. Sign up at [Railway](https://railway.app)
3. Create new project from GitHub
4. Add environment variables
5. Deploy!

### Heroku

```bash
heroku create
heroku config:set WHATSAPP_TOKEN=your_token
git push heroku main
```

See [SETUP.md](SETUP.md) for more deployment options.

## 🆘 Troubleshooting

**Bot not responding?**
- Check if server is running
- Verify webhook is set correctly
- Check logs for errors

**Commands not working?**
- Use correct prefix (default: `!`)
- Wait for cooldown between commands

**Module errors?**
- Run `npm install` again
- Check Node.js version (18+)

## 💡 Tips

1. **Use environment variables** - Never commit secrets
2. **Check logs** - Logger shows helpful debug info
3. **Read the docs** - Comprehensive guides available
4. **Start small** - Test commands locally first
5. **Have fun!** - Experiment and customize

## 🎓 Next Steps

1. ✅ Customize bot personality
2. ✅ Add more commands
3. ✅ Integrate external APIs (weather, etc.)
4. ✅ Deploy to production
5. ✅ Share with users!

## 📞 Support

- 📖 Check [README.md](README.md) for full docs
- 🐛 Report issues on GitHub
- 💬 Check existing issues for solutions

---

**🎉 You're all set! Start building amazing WhatsApp experiences!** 🚀
