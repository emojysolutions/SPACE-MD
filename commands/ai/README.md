# 🤖 SPACE-MD Multi-AI Chat System

This directory contains the AI chat system implementation for SPACE-MD WhatsApp bot, supporting multiple AI providers.

## 📋 Available Commands

### Chat Commands

| Command | Description | Provider |
|---------|-------------|----------|
| `!gpt <message>` | Chat with ChatGPT GPT-4o | OpenAI |
| `!gpt4 <message>` | Chat with ChatGPT GPT-4o | OpenAI |
| `!claude <message>` | Chat with Claude Opus | Anthropic |
| `!sonnet <message>` | Chat with Claude Sonnet | Anthropic |
| `!gemini <message>` | Chat with Google Gemini Pro | Google |
| `!deepseek <message>` | DeepSeek | DeepSeek |
| `!ai <message>` | Smart router (auto-picks best model) | Auto |

### Special Commands

| Command | Description |
|---------|-------------|
| `!imagine <prompt>` | Generate images with DALL-E 3 |
| `!vision <question>` | Analyze images (send with image) |
| `!persona <name>` | Set AI personality |
| `!ai models` | Show all available AI models |
| `!gpt clear` | Clear GPT conversation history |
| `!ai clear` | Clear all AI conversation histories |

## 🎭 Personas

Available personalities for AI responses:
- `pirate` 🏴‍☠️ - Talks like a pirate
- `shakespeare` 🎭 - Shakespearean English
- `yoda` 🟢 - Yoda-style speech
- `scientist` 🔬 - Scientific explanations
- `comedian` 😂 - Humorous responses
- `poet` ✍️ - Poetic verse
- `teacher` 👨‍🏫 - Patient educational style
- `coder` 💻 - Programming focused
- `chef` 👨‍🍳 - Food and cooking themed

Use `!persona <name>` to set, and `!persona reset` to return to default.

## 🔧 Configuration

AI API keys are configured in `.env` file:

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

## 📁 File Structure

```
commands/ai/
├── ai.js          # Smart auto-router
├── gpt.js         # ChatGPT GPT-4o
├── gpt4.js        # ChatGPT GPT-4o
├── claude.js      # Claude Opus
├── sonnet.js      # Claude Sonnet
├── gemini.js      # Google Gemini
├── deepseek.js    # DeepSeek
├── imagine.js     # DALL-E 3 image generation
├── vision.js      # Image analysis
└── persona.js     # Personality system

utils/
└── aiManager.js   # Centralized AI provider manager

data/
└── personas.json  # Personality definitions
```

## 💬 Conversation Memory

- Each AI provider maintains separate conversation history per user
- Maximum 20 messages stored per conversation
- Use `clear` commands to reset history

## 🛡️ Safety Features

- Maximum input length: 2000 characters
- Maximum output: 4000 characters (auto-split for longer responses)
- API key validation
- Error handling with helpful messages
- No API keys exposed in responses

## 🚀 Usage Examples

### Basic Chat
```
User: !gpt explain quantum computing in simple terms
Bot: [Detailed explanation from GPT-4o]
```

### With Persona
```
User: !persona pirate
Bot: [Persona set confirmation]
User: !gpt what is 2+2?
Bot: Arrr, ye landlubber! 2+2 be 4 doubloons!
```

### Image Generation
```
User: !imagine a cat astronaut floating in space
Bot: [Generates and sends image]
```

### Image Analysis
```
User: [Sends dog photo] !vision what breed is this?
Bot: [AI analyzes and describes the dog breed]
```

### Smart Router
```
User: !ai tell me a joke
Bot: [Uses best available AI model automatically]
```

## 📊 Model Priority (Smart Router)

When using `!ai`, models are selected in this order:
1. ChatGPT GPT-4o
2. Claude Opus
3. Google Gemini Pro
4. DeepSeek

## 🔍 Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| "not configured" | API key missing | Add API key to .env |
| "Message too long" | Input > 2000 chars | Shorten your message |
| "API Error" | Service issue | Try again or use different model |
| "Please include a message" | Empty command | Add your question/prompt |

## 🎯 Best Practices

1. **Keep prompts clear and specific** for better AI responses
2. **Use conversation history** for context-aware conversations
3. **Clear history** when switching topics
4. **Set personas** for themed conversations
5. **Use smart router** (!ai) when unsure which model to use

## 📝 Notes

- Commands are case-insensitive
- All AI responses support markdown formatting
- Long responses are automatically split into multiple messages
- Typing indicators show when AI is processing
