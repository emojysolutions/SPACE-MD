/**
 * Logger Utility
 * Simple logging utility with timestamps and log levels
 */

const LOG_LEVELS = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
};

/**
 * Format and output a log message
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {*} data - Additional data to log
 */
function log(level, message, data = null) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}`;
  
  switch (level) {
    case LOG_LEVELS.ERROR:
      console.error(logMessage);
      if (data) console.error(data);
      break;
    case LOG_LEVELS.WARN:
      console.warn(logMessage);
      if (data) console.warn(data);
      break;
    case LOG_LEVELS.DEBUG:
      if (process.env.NODE_ENV === 'development') {
        console.debug(logMessage);
        if (data) console.debug(data);
      }
      break;
    default:
      console.log(logMessage);
      if (data) console.log(data);
  }
}

module.exports = {
  info: (message, data) => log(LOG_LEVELS.INFO, message, data),
  warn: (message, data) => log(LOG_LEVELS.WARN, message, data),
  error: (message, data) => log(LOG_LEVELS.ERROR, message, data),
  debug: (message, data) => log(LOG_LEVELS.DEBUG, message, data)
};
