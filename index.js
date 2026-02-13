/**
 * SPACE-MD WhatsApp Bot
 * A clean, modular WhatsApp bot built with Node.js and Meta WhatsApp Cloud API
 */

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { handleCommand } = require('./commands');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

/**
 * Send a text message via WhatsApp Cloud API
 * @param {string} to - Recipient phone number
 * @param {string} text - Message text to send
 */
async function sendMessage(to, text) {
  try {
    const url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;
    const data = {
      messaging_product: 'whatsapp',
      to: to,
      type: 'text',
      text: { body: text }
    };

    const response = await axios.post(url, data, {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    logger.info(`Message sent to ${to}: ${text.substring(0, 50)}...`);
    return response.data;
  } catch (error) {
    logger.error('Error sending message:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * GET /webhook - Webhook verification endpoint
 * Meta WhatsApp requires this for initial webhook setup
 */
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    logger.info('Webhook verified successfully');
    res.status(200).send(challenge);
  } else {
    logger.warn('Webhook verification failed');
    res.sendStatus(403);
  }
});

/**
 * POST /webhook - Incoming message handler
 * Processes incoming WhatsApp messages and routes to command handlers
 */
app.post('/webhook', async (req, res) => {
  try {
    const body = req.body;

    // Quickly respond to WhatsApp to prevent timeout
    res.sendStatus(200);

    // Check if this is a WhatsApp message event
    if (body.object !== 'whatsapp_business_account') {
      return;
    }

    // Extract message data
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (!messages || messages.length === 0) {
      return;
    }

    // Process each message
    for (const message of messages) {
      const from = message.from; // Sender's phone number
      const msgBody = message.text?.body; // Message text
      const messageId = message.id;

      // Log incoming message
      logger.info(`Received message from ${from}: ${msgBody}`);

      // Ignore non-text messages for now
      if (!msgBody) {
        logger.info('Non-text message received, skipping');
        continue;
      }

      // Handle the command
      const reply = await handleCommand(from, msgBody);

      // Send reply if command returned a response
      if (reply) {
        await sendMessage(from, reply);
      }
    }
  } catch (error) {
    logger.error('Error processing webhook:', error);
  }
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * Root endpoint
 */
app.get('/', (req, res) => {
  res.json({
    name: 'SPACE-MD WhatsApp Bot',
    version: '1.0.0',
    status: 'running'
  });
});

/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

/**
 * Start the server
 */
app.listen(PORT, () => {
  logger.info(`SPACE-MD Bot is running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Validate required environment variables
  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID || !VERIFY_TOKEN) {
    logger.warn('WARNING: Missing required environment variables!');
    logger.warn('Please check your .env file and ensure WHATSAPP_TOKEN, PHONE_NUMBER_ID, and VERIFY_TOKEN are set.');
  }
});

module.exports = { sendMessage };
