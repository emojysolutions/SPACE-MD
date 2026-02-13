const express = require('express');
const config = require('./config');
const logger = require('./utils/logger');
const bot = require('./bot');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/', (req, res) => {
    const stats = bot.getStats();
    res.json({
        status: 'online',
        bot: config.BOT_NAME,
        version: config.BOT_VERSION,
        uptime: Date.now() - config.START_TIME,
        stats: stats
    });
});

// Webhook verification endpoint (for WhatsApp Cloud API)
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === config.WEBHOOK_VERIFY_TOKEN) {
        logger.info('Webhook verified successfully');
        res.status(200).send(challenge);
    } else {
        logger.warn('Webhook verification failed');
        res.sendStatus(403);
    }
});

// Webhook endpoint for receiving messages
app.post('/webhook', async (req, res) => {
    try {
        const body = req.body;

        // Check if this is a WhatsApp message
        if (body.object === 'whatsapp_business_account') {
            const entry = body.entry?.[0];
            const changes = entry?.changes?.[0];
            const value = changes?.value;
            const messages = value?.messages;

            if (messages && messages.length > 0) {
                for (const message of messages) {
                    // Process message
                    await bot.handleMessage(message);
                }
            }
        }

        // Always respond with 200 OK
        res.sendStatus(200);
    } catch (error) {
        logger.error('Error processing webhook', error);
        res.sendStatus(500);
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Express error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Initialize bot and start server
async function start() {
    try {
        await bot.initialize();
        
        const PORT = config.PORT;
        app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
            logger.info(`Webhook URL: http://localhost:${PORT}/webhook`);
            logger.info('SPACE-MD Ultra is ready! 🚀');
        });
    } catch (error) {
        logger.error('Failed to start bot', error);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully...');
    process.exit(0);
});

// Start the bot
start();
