/**
 * Greet Command
 * Responds to greetings with a friendly welcome message
 */

module.exports = {
  name: 'greet',
  triggers: ['hi', 'hello', 'hey', 'hola', 'greetings'],
  description: 'Greet the bot',
  
  execute: (from, msgBody) => {
    const hour = new Date().getHours();
    let greeting;
    
    if (hour < 12) {
      greeting = 'Good morning';
    } else if (hour < 18) {
      greeting = 'Good afternoon';
    } else {
      greeting = 'Good evening';
    }
    
    return `${greeting}! 👋\n\nWelcome to SPACE-MD Bot! I'm here to help you.\n\nType *help* to see what I can do.`;
  }
};
