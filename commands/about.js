/**
 * About Command
 * Provides information about the bot
 */

module.exports = {
  name: 'about',
  triggers: ['about', 'info', 'bot'],
  description: 'Learn about this bot',
  
  execute: (from, msgBody) => {
    const aboutText = `
*🚀 SPACE-MD WhatsApp Bot*

*Version:* 1.0.0
*Built with:* Node.js & Meta WhatsApp Cloud API

*Features:*
✅ Clean, readable codebase
✅ Modular command system
✅ Easy to extend and customize
✅ Production-ready with Docker support
✅ Secure with environment-based configuration

*Technology Stack:*
• Express.js - Web framework
• Axios - HTTP client
• WhatsApp Cloud API - Messaging platform

*Developer:* Tylor
*License:* MIT

Type *help* to see available commands!
    `.trim();
    
    return aboutText;
  }
};
