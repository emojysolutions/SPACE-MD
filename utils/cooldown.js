const config = require('../config');

class CooldownManager {
    constructor() {
        this.cooldowns = new Map();
        this.defaultCooldown = config.DEFAULT_COOLDOWN;
    }

    isOnCooldown(userId, commandName) {
        const key = `${userId}:${commandName}`;
        const cooldownEnd = this.cooldowns.get(key);
        
        if (!cooldownEnd) return false;
        
        const now = Date.now();
        if (now > cooldownEnd) {
            this.cooldowns.delete(key);
            return false;
        }
        
        return true;
    }

    getRemainingCooldown(userId, commandName) {
        const key = `${userId}:${commandName}`;
        const cooldownEnd = this.cooldowns.get(key);
        
        if (!cooldownEnd) return 0;
        
        const remaining = Math.ceil((cooldownEnd - Date.now()) / 1000);
        return remaining > 0 ? remaining : 0;
    }

    setCooldown(userId, commandName, duration = null) {
        const key = `${userId}:${commandName}`;
        const cooldownDuration = duration || this.defaultCooldown;
        this.cooldowns.set(key, Date.now() + cooldownDuration);
        
        // Auto-cleanup after cooldown expires
        setTimeout(() => {
            this.cooldowns.delete(key);
        }, cooldownDuration + 1000);
    }

    clearCooldown(userId, commandName) {
        const key = `${userId}:${commandName}`;
        this.cooldowns.delete(key);
    }

    clearAllCooldowns(userId) {
        const prefix = `${userId}:`;
        for (const key of this.cooldowns.keys()) {
            if (key.startsWith(prefix)) {
                this.cooldowns.delete(key);
            }
        }
    }
}

module.exports = new CooldownManager();
