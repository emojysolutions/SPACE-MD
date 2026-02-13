#!/usr/bin/env node
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question, defaultVal) {
  return new Promise((resolve) => {
    const prompt = defaultVal ? `${question} (${defaultVal}): ` : `${question}: `;
    rl.question(prompt, (answer) => {
      resolve(answer.trim() || defaultVal || '');
    });
  });
}

async function main() {
  console.log(`
╔══════════════════════════════════════════════╗
║     👑 Queen Angela MD — Setup Wizard 👑      ║
╚══════════════════════════════════════════════╝
  `);

  const config = {};

  console.log('\n💜 Step 1: WhatsApp Configuration\n');
  config.WHATSAPP_TOKEN = await ask('Enter your WhatsApp API Token');
  config.PHONE_NUMBER_ID = await ask('Enter your Phone Number ID');
  config.VERIFY_TOKEN = await ask('Enter a Webhook Verify Token', 'queen_angela_' + Math.random().toString(36).slice(2, 8));
  config.PORT = await ask('Enter port number', '3000');
  config.BOT_NAME = await ask('Enter bot name', 'Queen Angela MD');

  console.log('\n💜 Step 2: AI Providers (press Enter to skip any)\n');
  config.OPENAI_API_KEY = await ask('OpenAI API Key (for GPT & DALL-E)');
  config.ANTHROPIC_API_KEY = await ask('Anthropic API Key (for Claude)');
  config.GOOGLE_AI_KEY = await ask('Google AI Key (for Gemini)');
  config.DEEPSEEK_API_KEY = await ask('DeepSeek API Key');

  console.log('\n💜 Step 3: Admin Settings\n');
  config.ADMIN_PASSWORD = await ask('Admin Password', '11223344');
  config.OWNER_NUMBER = await ask('Owner Phone Number (with country code)');

  // Write .env file
  const envContent = Object.entries(config)
    .filter(([_, v]) => v)
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  fs.writeFileSync('.env', envContent);

  console.log(`
╔══════════════════════════════════════════════╗
║     ✅ Setup Complete! 👑                     ║
╠══════════════════════════════════════════════╣
║  .env file has been created                  ║
║                                              ║
║  To start the bot:                           ║
║    npm start                                 ║
║                                              ║
║  To start in dev mode:                       ║
║    npm run dev                               ║
╚══════════════════════════════════════════════╝
  `);

  rl.close();
}

main();
