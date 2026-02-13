# 🚀 SPACE-MD Ultra 🚀

```
╔══════════════════════════════════════════╗
║     🚀 SPACE-MD Ultra v1.0.0 🚀         ║
║     WhatsApp Bot Engine                  ║
╠══════════════════════════════════════════╣
║  A Feature-Rich, Beautiful WhatsApp Bot  ║
║  Built for the Stars! ✨                 ║
╚══════════════════════════════════════════╝
```

A premium, feature-packed WhatsApp bot with personality, flair, and useful features people actually want. Built with the WhatsApp Cloud API.

## ✨ Features

- 🎨 **Space-themed personality** - Friendly, witty, emoji-rich responses
- 🎮 **30+ Commands** - Organized across 5 categories
- 🎯 **Interactive Games** - Trivia, Rock Paper Scissors, Number Guessing, and more
- 🛠️ **Useful Tools** - Calculator, World Clock, Translator, Weather (with API)
- 🎉 **Fun Commands** - Jokes, Quotes, Facts, Magic 8-Ball, Dice Rolling
- 📊 **Admin Dashboard** - Statistics, Broadcasting, Runtime Settings
- 🔒 **Security First** - Rate limiting, anti-spam, input sanitization
- 🚀 **Auto-loading System** - Drop commands in folders, they load automatically
- 💾 **Session Management** - Stateful game sessions with auto-expiry
- 🎨 **Beautiful Formatting** - Professional message styling with emojis

## 📋 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 10+
- WhatsApp Business Account with Cloud API access
- Facebook Developer Account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/emojysolutions/SPACE-MD.git
cd SPACE-MD
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. **Set up WhatsApp Cloud API**
- Go to [Facebook Developer Portal](https://developers.facebook.com/)
- Create a new app and enable WhatsApp Business Platform
- Get your Phone Number ID and Access Token
- Add them to your `.env` file

5. **Start the bot**
```bash
npm start
```

## 📂 Project Structure

```
SPACE-MD/
├── index.js                 # Main entry point with Express server
├── bot.js                   # Core bot logic & message router
├── config.js                # Centralized configuration
├── package.json
├── .env.example
├── .gitignore
├── Dockerfile
├── README.md
├── commands/
│   ├── index.js             # Auto-loader for commands
│   ├── general/             # General bot commands
│   │   ├── help.js
│   │   ├── ping.js
│   │   ├── about.js
│   │   └── menu.js
│   ├── fun/                 # Entertainment commands
│   │   ├── joke.js
│   │   ├── quote.js
│   │   ├── 8ball.js
│   │   ├── flip.js
│   │   ├── roll.js
│   │   ├── fact.js
│   │   └── horoscope.js
│   ├── tools/               # Utility commands
│   │   ├── calc.js
│   │   ├── weather.js
│   │   ├── translate.js
│   │   └── time.js
│   ├── games/               # Interactive games
│   │   ├── trivia.js
│   │   ├── rps.js
│   │   └── numguess.js
│   └── admin/               # Admin-only commands
│       └── stats.js
├── utils/
│   ├── logger.js            # Colored console logger
│   ├── api.js               # WhatsApp API wrapper
│   ├── formatter.js         # Message formatting helpers
│   ├── rateLimiter.js       # Spam prevention
│   ├── sessionManager.js    # Game state management
│   └── cooldown.js          # Command cooldowns
├── data/
│   ├── jokes.json           # 30+ jokes
│   ├── quotes.json          # 50+ inspirational quotes
│   ├── facts.json           # 40+ fun facts
│   ├── trivia.json          # 50+ trivia questions
│   └── 8ball.json           # Magic 8-ball responses
└── middleware/
    ├── auth.js              # Admin authentication
    ├── antiSpam.js          # Anti-spam protection
    └── errorHandler.js      # Error handling
```

## 🎮 Command Reference

### 📋 General Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `!menu` | Beautiful categorized menu | `!menu` |
| `!help` | Get help about commands | `!help [command]` |
| `!ping` | Check bot latency & uptime | `!ping` |
| `!about` | Bot information & stats | `!about` |

### 🎉 Fun Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `!joke` | Random joke from 30+ collection | `!joke` |
| `!quote` | Inspirational quote | `!quote` |
| `!8ball` | Magic 8-ball fortune | `!8ball <question>` |
| `!flip` | Flip a coin | `!flip` |
| `!roll` | Roll dice (D&D notation) | `!roll [3d6]` |
| `!fact` | Random fun fact | `!fact` |
| `!horoscope` | Daily horoscope by sign | `!horoscope aries` |

### 🛠️ Tool Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `!calc` | Safe math calculator | `!calc 2 + 2` |
| `!weather` | Weather info (needs API key) | `!weather London` |
| `!translate` | Basic phrase translation | `!translate spanish hello` |
| `!time` | World clock for cities | `!time Tokyo` |

### 🎮 Game Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `!trivia` | Trivia quiz with scoring | `!trivia` / `!trivia A` |
| `!rps` | Rock Paper Scissors | `!rps rock` |
| `!numguess` | Number guessing game | `!numguess` / `!numguess 50` |

### 👑 Admin Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `!stats` | Bot statistics | `!stats <password>` |

*Note: Admin commands require the admin password set in your `.env` file*

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `WHATSAPP_API_URL` | WhatsApp API base URL | `https://graph.facebook.com/v17.0` |
| `WHATSAPP_PHONE_ID` | Your WhatsApp Phone Number ID | - |
| `WHATSAPP_TOKEN` | WhatsApp Access Token | - |
| `WEBHOOK_VERIFY_TOKEN` | Webhook verification token | `SPACE_MD_ULTRA_VERIFY` |
| `BOT_PREFIX` | Command prefix | `!` |
| `ADMIN_PASSWORD` | Admin command password | `spaceadmin123` |
| `PORT` | Server port | `3000` |
| `RATE_LIMIT_MAX` | Max messages per window | `10` |
| `RATE_LIMIT_WINDOW` | Rate limit window (ms) | `30000` |
| `DEFAULT_COOLDOWN` | Command cooldown (ms) | `3000` |

## 🐳 Docker Deployment

```bash
# Build the image
docker build -t space-md-ultra .

# Run the container
docker run -d -p 3000:3000 --env-file .env --name space-md space-md-ultra
```

### Dockerfile

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
```

## 🚀 Deployment Guides

### Railway

1. Fork this repository
2. Connect your GitHub account to Railway
3. Create new project from your fork
4. Add environment variables in Railway dashboard
5. Deploy!

### Render

1. Create new Web Service
2. Connect repository
3. Set build command: `npm install`
4. Set start command: `node index.js`
5. Add environment variables
6. Deploy!

### Heroku

```bash
heroku create your-bot-name
heroku config:set WHATSAPP_TOKEN=your_token
heroku config:set WHATSAPP_PHONE_ID=your_phone_id
# Add other env vars
git push heroku main
```

## 🎨 Adding Custom Commands

Adding a new command is super easy! Just create a file in the appropriate category folder:

```javascript
// commands/fun/mycommand.js
const formatter = require('../../utils/formatter');

module.exports = {
    name: 'mycommand',
    aliases: ['mc', 'mycmd'],
    category: 'fun',
    description: '✨ My awesome command',
    usage: '!mycommand [args]',
    cooldown: 3000,
    adminOnly: false,

    async execute(from, args, api, sessionManager, stats) {
        return `${formatter.bold('Hello from my command!')} 🎉`;
    }
};
```

That's it! The command auto-loader will pick it up automatically on restart.

## 🔒 Security Features

- ✅ **No `eval()`** - Safe math parsing for calculator
- ✅ **Environment variables** - Secrets in `.env`, never committed
- ✅ **Webhook verification** - Validates WhatsApp webhook signatures
- ✅ **Rate limiting** - Per-user message limits (10 per 30s)
- ✅ **Anti-spam** - Progressive blocking for spammers
- ✅ **Input sanitization** - All user inputs validated
- ✅ **Admin authentication** - Password-protected admin commands
- ✅ **Command cooldowns** - Prevents command abuse

## 📝 API Documentation

### WhatsApp API Wrapper (`utils/api.js`)

```javascript
// Send text message
await api.sendText(phoneNumber, 'Hello World!');

// Send image with caption
await api.sendImage(phoneNumber, imageUrl, 'Check this out!');

// Send interactive buttons
await api.sendButtons(phoneNumber, 'Choose one:', ['Option 1', 'Option 2']);

// Send list menu
await api.sendList(phoneNumber, 'Select category:', sections);
```

### Session Manager (`utils/sessionManager.js`)

```javascript
// Get user session
const session = sessionManager.getSession(userId);

// Set session data
sessionManager.setSession(userId, { game: 'trivia', score: 0 });

// Clear session
sessionManager.clearSession(userId);

// Check for active game
if (sessionManager.hasActiveGame(userId)) {
    // Handle game state
}
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Add comments for complex logic
- Update README if adding new features
- Test your changes thoroughly
- Keep commits atomic and well-described

## 📜 License

This project is licensed under the MIT License - see below:

```
MIT License

Copyright (c) 2026 SPACE-MD Ultra

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👨‍💻 Credits

- **Creator**: Tylor
- **Bot Engine**: SPACE-MD Ultra
- **Built with**: Node.js, Express, WhatsApp Cloud API
- **Inspired by**: The vastness of space and human creativity ✨

## 🌟 Support

If you find this bot useful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs via Issues
- 💡 Suggesting new features
- 🤝 Contributing code

## 📞 Contact

For questions, suggestions, or support:
- Open an issue on GitHub
- Follow the project for updates

---

<div align="center">

**🚀 Built with ❤️ by the SPACE-MD team**

*Explore the cosmos of features!* ✨

</div>
