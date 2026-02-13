const config = require('../config');

class RateLimiter {
    constructor() {
        this.users = new Map();
        this.maxMessages = config.RATE_LIMIT_MAX;
        this.windowMs = config.RATE_LIMIT_WINDOW;
    }

    checkLimit(userId) {
        const now = Date.now();
        const userRecord = this.users.get(userId);

        if (!userRecord) {
            this.users.set(userId, {
                count: 1,
                resetTime: now + this.windowMs
            });
            return { allowed: true, remaining: this.maxMessages - 1 };
        }

        if (now > userRecord.resetTime) {
            this.users.set(userId, {
                count: 1,
                resetTime: now + this.windowMs
            });
            return { allowed: true, remaining: this.maxMessages - 1 };
        }

        if (userRecord.count >= this.maxMessages) {
            const waitTime = Math.ceil((userRecord.resetTime - now) / 1000);
            return {
                allowed: false,
                remaining: 0,
                waitTime: waitTime,
                message: `🐌 Whoa there, space cadet! You're sending messages too fast!\n\nPlease wait ${waitTime} seconds before sending another command.`
            };
        }

        userRecord.count++;
        this.users.set(userId, userRecord);
        return { allowed: true, remaining: this.maxMessages - userRecord.count };
    }

    reset(userId) {
        this.users.delete(userId);
    }

    cleanup() {
        const now = Date.now();
        for (const [userId, record] of this.users.entries()) {
            if (now > record.resetTime) {
                this.users.delete(userId);
            }
        }
    }
}

// Cleanup old records every 5 minutes
const rateLimiter = new RateLimiter();
setInterval(() => rateLimiter.cleanup(), 5 * 60 * 1000);

module.exports = rateLimiter;
