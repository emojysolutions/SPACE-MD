const rateLimiter = require('../utils/rateLimiter');

class AntiSpam {
    constructor() {
        this.spamWarnings = new Map();
        this.blockedUsers = new Set();
    }

    check(userId) {
        if (this.blockedUsers.has(userId)) {
            return {
                blocked: true,
                message: '🚫 You have been temporarily blocked for spamming.\n\nPlease try again later.'
            };
        }

        const result = rateLimiter.checkLimit(userId);
        
        if (!result.allowed) {
            const warnings = this.spamWarnings.get(userId) || 0;
            this.spamWarnings.set(userId, warnings + 1);
            
            if (warnings >= 3) {
                this.blockedUsers.add(userId);
                setTimeout(() => {
                    this.blockedUsers.delete(userId);
                    this.spamWarnings.delete(userId);
                }, 5 * 60 * 1000); // Unblock after 5 minutes
                
                return {
                    blocked: true,
                    message: '🚫 You have been blocked for excessive spamming!\n\nYou can try again in 5 minutes.'
                };
            }
            
            return {
                blocked: true,
                message: result.message
            };
        }

        return { blocked: false };
    }

    unblock(userId) {
        this.blockedUsers.delete(userId);
        this.spamWarnings.delete(userId);
    }
}

module.exports = new AntiSpam();
