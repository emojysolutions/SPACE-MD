const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

class CommandLoader {
    constructor() {
        this.commands = new Map();
        this.categories = new Map();
    }

    loadCommands() {
        const commandsPath = path.join(__dirname);
        this.scanDirectory(commandsPath);
        logger.info(`Loaded ${this.commands.size} commands across ${this.categories.size} categories`);
        return this.commands;
    }

    scanDirectory(dir, category = null) {
        const items = fs.readdirSync(dir, { withFileTypes: true });

        for (const item of items) {
            const fullPath = path.join(dir, item.name);

            if (item.isDirectory() && item.name !== 'node_modules') {
                // Found a category folder
                const categoryName = item.name;
                if (!this.categories.has(categoryName)) {
                    this.categories.set(categoryName, []);
                }
                this.scanDirectory(fullPath, categoryName);
            } else if (item.isFile() && item.name.endsWith('.js') && item.name !== 'index.js') {
                // Found a command file
                try {
                    const command = require(fullPath);
                    
                    if (!command.name || !command.execute) {
                        logger.warn(`Invalid command file: ${fullPath}`);
                        continue;
                    }

                    // Set category if not defined in command
                    if (!command.category && category) {
                        command.category = category;
                    }

                    this.commands.set(command.name, command);

                    // Also register aliases
                    if (command.aliases && Array.isArray(command.aliases)) {
                        command.aliases.forEach(alias => {
                            this.commands.set(alias, command);
                        });
                    }

                    // Add to category list
                    if (command.category) {
                        if (!this.categories.has(command.category)) {
                            this.categories.set(command.category, []);
                        }
                        // Only add main command name, not aliases
                        if (!this.categories.get(command.category).includes(command.name)) {
                            this.categories.get(command.category).push(command.name);
                        }
                    }

                    logger.debug(`Loaded command: ${command.name} (${command.category || 'uncategorized'})`);
                } catch (error) {
                    logger.error(`Failed to load command from ${fullPath}`, error);
                }
            }
        }
    }

    getCommand(name) {
        return this.commands.get(name.toLowerCase());
    }

    getCommands() {
        return this.commands;
    }

    getCategories() {
        return this.categories;
    }

    getCommandsByCategory(category) {
        const categoryCommands = this.categories.get(category) || [];
        return categoryCommands.map(name => this.commands.get(name)).filter(cmd => cmd);
    }
}

module.exports = new CommandLoader();
