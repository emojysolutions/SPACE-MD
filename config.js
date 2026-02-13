require('dotenv').config();

module.exports = {
    // WhatsApp API Configuration
    WHATSAPP_API_URL: process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v17.0',
    WHATSAPP_PHONE_ID: process.env.WHATSAPP_PHONE_ID || '',
    WHATSAPP_TOKEN: process.env.WHATSAPP_TOKEN || '',
    WEBHOOK_VERIFY_TOKEN: process.env.WEBHOOK_VERIFY_TOKEN || 'SPACE_MD_ULTRA_VERIFY',
    
    // Bot Configuration
    BOT_NAME: 'SPACE-MD Ultra',
    BOT_VERSION: '1.0.0',
    BOT_PREFIX: process.env.BOT_PREFIX || '!',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'spaceadmin123',
    
    // Server Configuration
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    // Rate Limiting
    RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX) || 10,
    RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW) || 30000, // 30 seconds
    
    // Command Cooldown
    DEFAULT_COOLDOWN: parseInt(process.env.DEFAULT_COOLDOWN) || 3000, // 3 seconds
    
    // Session Configuration
    SESSION_TIMEOUT: parseInt(process.env.SESSION_TIMEOUT) || 600000, // 10 minutes
    
    // External APIs (optional)
    OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY || '',
    
    // Bot Stats
    START_TIME: Date.now()
};
