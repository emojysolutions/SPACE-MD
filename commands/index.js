/**
 * Command Registry
 * Central command system that imports all commands and routes messages to handlers
 */

const greetCommand = require('./greet');
const helpCommand = require('./help');
const timeCommand = require('./time');
const aboutCommand = require('./about');
const logger = require('../utils/logger');

// Register all available commands
const commands = [
  greetCommand,
  helpCommand,
  timeCommand,
  aboutCommand
];

/**
 * Handle incoming messages and route to appropriate command
 * @param {string} from - Sender's phone number
 * @param {string} msgBody - Message text
 * @returns {string|null} Reply text or null if no command matched
 */
async function handleCommand(from, msgBody) {
  if (!msgBody) {
    return null;
  }

  // Normalize the message (lowercase and trim)
  const normalizedMsg = msgBody.toLowerCase().trim();

  // Find matching command
  for (const command of commands) {
    for (const trigger of command.triggers) {
      if (normalizedMsg === trigger || normalizedMsg.startsWith(trigger + ' ')) {
        try {
          logger.info(`Executing command: ${command.name} for user: ${from}`);
          const reply = await command.execute(from, msgBody);
          return reply;
        } catch (error) {
          logger.error(`Error executing command ${command.name}:`, error);
          return 'Sorry, I encountered an error processing your request. Please try again later.';
        }
      }
    }
  }

  // No command matched - return a helpful message
  logger.info(`No command matched for message: ${normalizedMsg}`);
  return `I didn't understand that command. Type *help* to see what I can do! 🤔`;
}

/**
 * Get all registered commands (useful for help command)
 * @returns {Array} List of all commands
 */
function getAllCommands() {
  return commands;
}

module.exports = {
  handleCommand,
  getAllCommands
};
