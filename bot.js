const logger = require('./utils/logger');
const config = require('./config');
const api = require('./utils/api');
const commandLoader = require('./commands/index');
const sessionManager = require('./utils/sessionManager');
const cooldownManager = require('./utils/cooldown');
const antiSpam = require('./middleware/antiSpam');
const errorHandler = require('./middleware/errorHandler');

class Bot {
    constructor() {
        this.commands = new Map();
        this.stats = {
            totalMessages: 0,
            uniqueUsers: new Set(),
            commandUsage: {},
            commandCount: 0,
            startTime: config.START_TIME
        };
    }

    async initialize() {
        logger.banner();
        
        // Load all commands
        this.commands = commandLoader.loadCommands();
        this.stats.commandCount = this.commands.size;
        
        logger.info(`Commands loaded: ${this.commands.size}`);
        logger.info('Bot initialized successfully');
        
        // Update banner with command count
        const categories = commandLoader.getCategories();
        logger.info(`Categories: ${Array.from(categories.keys()).join(', ')}`);
    }

    async handleMessage(message) {
        try {
            // Extract message data
            const from = message.from;
            const text = message.text?.body || '';
            
            if (!text) return;

            // Update stats
            this.stats.totalMessages++;
            this.stats.uniqueUsers.add(from);

            logger.debug(`Message from ${from}: ${text}`);

            // Check if message starts with prefix
            if (!text.startsWith(config.BOT_PREFIX)) return;

            // Parse command and arguments
            const args = text.slice(config.BOT_PREFIX.length).trim().split(/\s+/);
            const commandName = args.shift().toLowerCase();

            // Get command
            const command = commandLoader.getCommand(commandName);
            if (!command) {
                logger.debug(`Unknown command: ${commandName}`);
                return;
            }

            // Anti-spam check
            const spamCheck = antiSpam.check(from);
            if (spamCheck.blocked) {
                await api.sendText(from, spamCheck.message);
                return;
            }

            // Cooldown check
            if (cooldownManager.isOnCooldown(from, command.name)) {
                const remaining = cooldownManager.getRemainingCooldown(from, command.name);
                await api.sendText(from, `⏱️ Please wait ${remaining} seconds before using this command again!`);
                return;
            }

            // Execute command
            logger.info(`Executing command: ${command.name} for user: ${from}`);
            
            try {
                const response = await command.execute(from, args, api, sessionManager, this.stats);
                
                if (response) {
                    await api.sendText(from, response);
                }

                // Update command usage stats
                if (!this.stats.commandUsage[command.name]) {
                    this.stats.commandUsage[command.name] = 0;
                }
                this.stats.commandUsage[command.name]++;

                // Set cooldown
                const cooldown = command.cooldown || config.DEFAULT_COOLDOWN;
                cooldownManager.setCooldown(from, command.name, cooldown);

                logger.info(`Command ${command.name} executed successfully`);
            } catch (error) {
                const errorMessage = errorHandler.handleCommandError(error, command.name, from);
                await api.sendText(from, errorMessage);
            }

        } catch (error) {
            logger.error('Error handling message', error);
            errorHandler.handleGeneralError(error, 'handleMessage');
        }
    }

    getStats() {
        return {
            ...this.stats,
            uniqueUsers: this.stats.uniqueUsers.size
        };
    }
}

module.exports = new Bot();
