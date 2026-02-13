<h1 align="center"> 𝐒𝐏𝐀𝐂𝐄 𝐌𝐃 </h1>

<p align="center">
  <a href="https://github.com/Dark-Xploit/SPACE-MD">
    <img alt="SPACE-MD docs" height="350" src="https://files.catbox.moe/ia1mgm.jpg">
  </a>
</p>
    
</a>
</p>
<p align="center">
<a href="https://github.com/Dark-Xploit"><img title="Author" src="https://img.shields.io/badge/SPACE-MD-darkgreen?style=for-the-badge&logo=whatsapp"></a>
<p/>

<p align="center">
    <strong>1. FORK REPOSITORY</strong>
  <br>
    <a href="https://github.com/Dark-Xploit/SPACE-MD/fork" target="_blank">
        <img alt="Fork Repo" src="https://img.shields.io/badge/Fork%20Repo-100000?style=for-the-badge&logo=scan&logoColor=white&labelColor=darkblue&color=darkblue"/>
    </a>
</p>

<p align="center">
    <strong>2. GET SESSION ID</strong>
    <br>
    <a href="https://www.cypherx.space/" target="_blank">
        <img alt="WEBSITE" src="https://img.shields.io/badge/Pair-100000?style=for-the-badge&logo=scan&logoColor=white&labelColor=darkred&color=darkred"/>
    </a>
</p>

<p align="center">
    <strong>3. DEPLOY TO HEROKU</strong>
    <br>
    <a href="https://dashboard.heroku.com/new?template=https://github.com/Dark-Xploit/SPACE-MD" target="_blank">
        <img alt="Deploy to heroku" src="https://img.shields.io/badge/Deploy-100000?style=for-the-badge&logo=scan&logoColor=white&labelColor=purple&color=purple"/>
    </a>
</p>

<p align="center">
    <strong>4. DOWNLOAD BOT ZIP</strong>
    <br>
    <a href="https://codeload.github.com/Dark-Xploit/SPACE-MD/zip/refs/heads/main" target="_blank">
        <img alt="Download zip" src="https://img.shields.io/badge/Download-100000?style=for-the-badge&logo=scan&logoColor=white&labelColor=darkorange&color=darkorange"/>
    </a>
</p>

---

## 🤖 Multi-AI Chat System

SPACE-MD now includes an advanced AI chat system with support for multiple AI providers!

### 🚀 Available AI Models

Chat with different AI models directly in WhatsApp:

| Command | AI Model | Provider |
|---------|----------|----------|
| `!gpt <message>` | ChatGPT GPT-4o | OpenAI |
| `!gpt4 <message>` | ChatGPT GPT-4o | OpenAI |
| `!claude <message>` | Claude Opus | Anthropic |
| `!sonnet <message>` | Claude Sonnet | Anthropic |
| `!gemini <message>` | Google Gemini Pro | Google |
| `!deepseek <message>` | DeepSeek | DeepSeek |
| `!ai <message>` | Smart Auto-Router | Auto-selects best available |

### 🎨 Special AI Features

- **`!imagine <prompt>`** - Generate images with DALL-E 3
- **`!vision <question>`** - Analyze images with AI Vision (send with image)
- **`!persona <name>`** - Set AI personality (pirate, shakespeare, yoda, scientist, comedian, poet, teacher, coder, chef)
- **`!ai models`** - Show all available AI models
- **`!ai clear`** - Clear conversation history

### 🔧 Setup AI Features

To enable AI features, add API keys to your `.env` file:

```env
# OpenAI (for GPT-4o, DALL-E 3, Vision)
OPENAI_API_KEY=sk-your-openai-key

# Anthropic (for Claude Opus, Claude Sonnet)
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key

# Google (for Gemini Pro)
GOOGLE_AI_KEY=your-google-ai-key

# DeepSeek
DEEPSEEK_API_KEY=your-deepseek-key
```

You can enable any combination of providers - the bot will automatically detect which ones are configured!

### 💬 Conversation Memory

- Each AI maintains conversation history per user
- Maximum 20 messages per conversation
- Use `!gpt clear` or `!ai clear` to reset

### 📚 Full Documentation

For detailed usage, examples, and best practices, see [commands/ai/README.md](commands/ai/README.md)
