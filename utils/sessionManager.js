const config = require('../config');

class SessionManager {
    constructor() {
        this.sessions = new Map();
        this.timeout = config.SESSION_TIMEOUT;
    }

    getSession(userId) {
        const session = this.sessions.get(userId);
        if (session) {
            this.updateTimeout(userId);
            return session;
        }
        return null;
    }

    setSession(userId, data) {
        this.sessions.set(userId, {
            ...data,
            lastActivity: Date.now()
        });
        this.updateTimeout(userId);
    }

    clearSession(userId) {
        const session = this.sessions.get(userId);
        if (session && session.timeoutId) {
            clearTimeout(session.timeoutId);
        }
        this.sessions.delete(userId);
    }

    hasActiveGame(userId) {
        const session = this.getSession(userId);
        return session && (session.game !== undefined);
    }

    updateTimeout(userId) {
        const session = this.sessions.get(userId);
        if (session) {
            if (session.timeoutId) {
                clearTimeout(session.timeoutId);
            }
            session.timeoutId = setTimeout(() => {
                this.clearSession(userId);
            }, this.timeout);
            session.lastActivity = Date.now();
        }
    }

    getAllActiveSessions() {
        return Array.from(this.sessions.keys());
    }

    getSessionCount() {
        return this.sessions.size;
    }
}

module.exports = new SessionManager();
