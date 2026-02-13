const logger = require('../utils/logger');

class ErrorHandler {
    handleCommandError(error, commandName, userId) {
        logger.error(`Error in command ${commandName} for user ${userId}`, error);
        
        // User-friendly error messages
        const errorMessages = {
            'ETIMEDOUT': '⏱️ Request timed out. Please try again.',
            'ENOTFOUND': '🌐 Network error. Please check your connection.',
            'ECONNREFUSED': '🔌 Connection refused. Service may be down.',
        };

        const userMessage = errorMessages[error.code] || 
            '❌ Oops! Something went wrong in space!\n\nPlease try again later or contact an admin if the problem persists.';
        
        return userMessage;
    }

    handleWebhookError(error, req) {
        logger.error('Webhook error', {
            error: error.message,
            path: req.path,
            method: req.method
        });
    }

    handleGeneralError(error, context = '') {
        logger.error(`General error${context ? ` in ${context}` : ''}`, error);
    }
}

module.exports = new ErrorHandler();
