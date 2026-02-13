/**
 * Help Command
 * Displays a list of all available commands
 */

module.exports = {
  name: 'help',
  triggers: ['help', 'commands', 'menu'],
  description: 'Show available commands',
  
  execute: (from, msgBody) => {
    const helpText = `
*🤖 SPACE-MD Bot - Available Commands*

*Greetings:*
• hi, hello, hey - Get a friendly greeting

*Information:*
• help - Show this help message
• about - Learn about this bot
• time - Get current date and time

*How to use:*
Simply send any of the above commands as a message, and I'll respond!

Need more features? This bot is modular and easy to extend!
    `.trim();
    
    return helpText;
  }
};
