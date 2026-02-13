const chalk = require('chalk');

class Logger {
    constructor() {
        this.levels = {
            info: { color: chalk.green, emoji: '✅', label: 'INFO' },
            warn: { color: chalk.yellow, emoji: '⚠️', label: 'WARN' },
            error: { color: chalk.red, emoji: '❌', label: 'ERROR' },
            debug: { color: chalk.blue, emoji: '🔍', label: 'DEBUG' }
        };
    }

    getTimestamp() {
        const now = new Date();
        return now.toISOString().replace('T', ' ').split('.')[0];
    }

    log(level, message, data = null) {
        const config = this.levels[level] || this.levels.info;
        const timestamp = chalk.gray(`[${this.getTimestamp()}]`);
        const emoji = config.emoji;
        const label = config.color(`[${config.label}]`);
        
        let output = `${timestamp} ${emoji} ${label} ${message}`;
        
        if (data) {
            console.log(output);
            console.log(config.color(JSON.stringify(data, null, 2)));
        } else {
            console.log(output);
        }
    }

    info(message, data) {
        this.log('info', message, data);
    }

    warn(message, data) {
        this.log('warn', message, data);
    }

    error(message, data) {
        this.log('error', message, data);
    }

    debug(message, data) {
        if (process.env.NODE_ENV === 'development') {
            this.log('debug', message, data);
        }
    }

    banner() {
        const banner = `
╔══════════════════════════════════════════╗
║     🚀 SPACE-MD Ultra v1.0.0 🚀         ║
║     WhatsApp Bot Engine                  ║
╠══════════════════════════════════════════╣
║  Status:  🟢 Online                      ║
║  Port:    3000                           ║
╚══════════════════════════════════════════╝
        `;
        console.log(chalk.cyan(banner));
    }
}

module.exports = new Logger();
