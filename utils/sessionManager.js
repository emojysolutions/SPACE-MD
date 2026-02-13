/**
 * Session Manager for SPACE-MD Bot
 * Manages temporary session data like search results with auto-expiration
 */

// Constants
const DEFAULT_TTL_MS = 60000; // 60 seconds

class SessionManager {
  constructor() {
    this.sessions = new Map();
    this.defaultTTL = DEFAULT_TTL_MS;
  }

  /**
   * Store data in a session with auto-expiration
   * @param {string} userId - User identifier
   * @param {string} key - Session key
   * @param {any} data - Data to store
   * @param {number} ttl - Time to live in milliseconds (default: 60000)
   */
  set(userId, key, data, ttl = this.defaultTTL) {
    const sessionKey = `${userId}:${key}`;
    
    // Clear existing timeout if any
    if (this.sessions.has(sessionKey)) {
      clearTimeout(this.sessions.get(sessionKey).timeout);
    }

    // Set timeout for auto-expiration
    const timeout = setTimeout(() => {
      this.sessions.delete(sessionKey);
    }, ttl);

    this.sessions.set(sessionKey, {
      data,
      timeout,
      timestamp: Date.now()
    });
  }

  /**
   * Retrieve data from a session
   * @param {string} userId - User identifier
   * @param {string} key - Session key
   * @returns {any} Stored data or null if not found
   */
  get(userId, key) {
    const sessionKey = `${userId}:${key}`;
    const session = this.sessions.get(sessionKey);
    return session ? session.data : null;
  }

  /**
   * Check if a session exists
   * @param {string} userId - User identifier
   * @param {string} key - Session key
   * @returns {boolean}
   */
  has(userId, key) {
    const sessionKey = `${userId}:${key}`;
    return this.sessions.has(sessionKey);
  }

  /**
   * Delete a session
   * @param {string} userId - User identifier
   * @param {string} key - Session key
   */
  delete(userId, key) {
    const sessionKey = `${userId}:${key}`;
    const session = this.sessions.get(sessionKey);
    
    if (session) {
      clearTimeout(session.timeout);
      this.sessions.delete(sessionKey);
    }
  }

  /**
   * Clear all sessions for a user
   * @param {string} userId - User identifier
   */
  clearUser(userId) {
    const keysToDelete = [];
    
    for (const [key, session] of this.sessions.entries()) {
      if (key.startsWith(`${userId}:`)) {
        clearTimeout(session.timeout);
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.sessions.delete(key));
  }

  /**
   * Clear all sessions
   */
  clearAll() {
    for (const [, session] of this.sessions.entries()) {
      clearTimeout(session.timeout);
    }
    this.sessions.clear();
  }
}

// Export a singleton instance
module.exports = new SessionManager();
