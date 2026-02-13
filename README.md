# SPACE-MD WhatsApp Bot

A clean, modular, and production-ready WhatsApp bot built from scratch using Node.js and the official Meta WhatsApp Cloud API.

## 🌟 Features

- ✅ **Clean & Readable Code** - No obfuscation, every line is well-commented and easy to understand
- ✅ **Modular Command System** - Easy to add new commands and features
- ✅ **Production Ready** - Includes Dockerfile, error handling, and logging
- ✅ **Secure** - Environment-based configuration, webhook verification
- ✅ **Extensible** - Built-in utilities for media handling and database integration
- ✅ **WhatsApp Cloud API** - Uses official Meta WhatsApp Business API

## 📋 Prerequisites

Before you begin, ensure you have the following:

- **Node.js** (v18 or higher) and npm installed
- **Meta Developer Account** - [Sign up here](https://developers.facebook.com/)
- **WhatsApp Business Account** set up in Meta Business Suite
- **ngrok** or similar tunneling tool for local development (optional but recommended)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/emojysolutions/SPACE-MD.git
cd SPACE-MD
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and update it with your credentials:

```bash
cp .env.example .env
```

Edit `.env` and add your WhatsApp Cloud API credentials:

```env
WHATSAPP_TOKEN=your_access_token_here
PHONE_NUMBER_ID=your_phone_number_id_here
VERIFY_TOKEN=my_secret_verify_token
PORT=3000
```

**Where to get these values:**

- `WHATSAPP_TOKEN`: From Meta for Developers → Your App → WhatsApp → API Setup
- `PHONE_NUMBER_ID`: From Meta for Developers → Your App → WhatsApp → API Setup
- `VERIFY_TOKEN`: Choose any secure random string (you'll use this when setting up the webhook)

### 4. Set Up Meta Webhook

1. Start your bot locally:
   ```bash
   npm run dev
   ```

2. If running locally, expose your server using ngrok:
   ```bash
   ngrok http 3000
   ```

3. Go to Meta for Developers → Your App → WhatsApp → Configuration
4. Click "Edit" on Webhook
5. Enter your callback URL: `https://your-domain.com/webhook` (or ngrok URL)
6. Enter your `VERIFY_TOKEN` (same as in .env)
7. Subscribe to `messages` webhook field

### 5. Run the Bot

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The bot will start on port 3000 (or your configured PORT).

## 📁 Project Structure

```
SPACE-MD/
├── commands/              # Command modules
│   ├── index.js          # Command registry & router
│   ├── greet.js          # Greeting command
│   ├── help.js           # Help command
│   ├── time.js           # Time command
│   └── about.js          # About command
├── utils/                # Utility modules
│   ├── logger.js         # Logging utility
│   ├── mediaHandler.js   # Media handling utility
│   └── database.js       # Database placeholder
├── index.js              # Main application entry point
├── package.json          # Project dependencies
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore rules
├── Dockerfile           # Docker configuration
└── README.md            # This file
```

## 🎯 Available Commands

The bot comes with the following built-in commands:

| Command | Trigger Words | Description |
|---------|---------------|-------------|
| **Greet** | hi, hello, hey | Receive a friendly greeting |
| **Help** | help, commands, menu | Show all available commands |
| **Time** | time, date, datetime | Get current date and time |
| **About** | about, info, bot | Learn about the bot |

## 🔧 Adding Custom Commands

Adding a new command is simple! Follow these steps:

### 1. Create a new command file in `commands/` folder

```javascript
// commands/mycommand.js
module.exports = {
  name: 'mycommand',
  triggers: ['trigger1', 'trigger2'],
  description: 'What your command does',
  
  execute: async (from, msgBody) => {
    // Your command logic here
    return 'Your response message';
  }
};
```

### 2. Register the command in `commands/index.js`

```javascript
const myCommand = require('./mycommand');

const commands = [
  // ... existing commands
  myCommand
];
```

That's it! Your command is now active.

## 🐳 Docker Deployment

### Build the Docker image:

```bash
docker build -t space-md-bot .
```

### Run the container:

```bash
docker run -d \
  --name whatsapp-bot \
  -p 3000:3000 \
  --env-file .env \
  space-md-bot
```

## ☁️ Cloud Deployment

### Deploy to Heroku

1. Create a new Heroku app:
   ```bash
   heroku create your-app-name
   ```

2. Set environment variables:
   ```bash
   heroku config:set WHATSAPP_TOKEN=your_token
   heroku config:set PHONE_NUMBER_ID=your_phone_id
   heroku config:set VERIFY_TOKEN=your_verify_token
   ```

3. Deploy:
   ```bash
   git push heroku main
   ```

### Deploy to Railway, Render, or DigitalOcean

These platforms support automatic deployment from GitHub:

1. Connect your repository
2. Add environment variables in the platform dashboard
3. Deploy automatically on push

## 📱 Media Handling

The bot includes a media handler utility (`utils/mediaHandler.js`) that can:

- Download images, videos, audio, and documents from WhatsApp
- Process media files (placeholder for custom processing)
- Save media to storage

To use media handling, extend the webhook handler in `index.js` to detect and process media messages.

## 💾 Database Integration

The `utils/database.js` file provides a placeholder for database integration:

### MongoDB Example:

1. Install MongoDB driver:
   ```bash
   npm install mongodb
   ```

2. Uncomment MongoDB code in `utils/database.js`
3. Add `MONGODB_URI` to your `.env` file
4. Use the database functions in your commands

### SQLite Example:

1. Install SQLite:
   ```bash
   npm install sqlite3
   ```

2. Uncomment SQLite code in `utils/database.js`
3. Add `DB_PATH` to your `.env` file
4. Use the database functions in your commands

## 🔒 Security Best Practices

- ✅ Never commit your `.env` file to version control
- ✅ Keep your `WHATSAPP_TOKEN` secure and rotate it regularly
- ✅ Use a strong, random `VERIFY_TOKEN`
- ✅ Enable HTTPS in production (required by WhatsApp)
- ✅ Validate and sanitize all user inputs
- ✅ Implement rate limiting for production use

## 🐛 Troubleshooting

### Webhook verification fails
- Ensure your `VERIFY_TOKEN` in `.env` matches what you entered in Meta Developer Console
- Check that your server is publicly accessible (use ngrok for local testing)

### Messages not being received
- Verify webhook subscription is active in Meta Developer Console
- Check that `messages` webhook field is subscribed
- Review logs for errors: `npm run dev`

### Cannot send messages
- Verify `WHATSAPP_TOKEN` is correct and not expired
- Ensure `PHONE_NUMBER_ID` is correct
- Check that your WhatsApp Business Account is approved

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

**Tylor**

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you have questions or need help:

- Open an issue on GitHub
- Check the [Meta WhatsApp Cloud API Documentation](https://developers.facebook.com/docs/whatsapp/cloud-api)

---

**Made with ❤️ by the SPACE-MD team**
