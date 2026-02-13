class Formatter {
    bold(text) {
        return `*${text}*`;
    }

    italic(text) {
        return `_${text}_`;
    }

    mono(text) {
        return `\`\`\`${text}\`\`\``;
    }

    strike(text) {
        return `~${text}~`;
    }

    divider() {
        return '━━━━━━━━━━━━━━━━━━━━━━━━';
    }

    header(text) {
        return `✨ ${this.bold(text)} ✨`;
    }

    list(items) {
        return items.map((item, idx) => `${idx + 1}. ${item}`).join('\n');
    }

    box(text) {
        const lines = text.split('\n');
        const maxLength = Math.max(...lines.map(l => l.length));
        const border = '─'.repeat(maxLength + 2);
        
        let result = `┌${border}┐\n`;
        lines.forEach(line => {
            result += `│ ${line.padEnd(maxLength)} │\n`;
        });
        result += `└${border}┘`;
        
        return result;
    }

    cleanNumber(num) {
        return num.toLocaleString();
    }

    timeAgo(timestamp) {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1
        };
        
        for (const [name, value] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / value);
            if (interval >= 1) {
                return `${interval} ${name}${interval > 1 ? 's' : ''} ago`;
            }
        }
        
        return 'just now';
    }

    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
        if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }
}

module.exports = new Formatter();
