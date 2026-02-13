const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// WhatsApp Cloud API Configuration
// These should be set via environment variables
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
const TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || '';
const API_VERSION = 'v17.0';

/**
 * Validate WhatsApp API credentials are configured
 * @throws {Error} If credentials are not configured
 */
function validateCredentials() {
  if (!PHONE_NUMBER_ID || !TOKEN) {
    throw new Error('WhatsApp API credentials not configured. Set WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN environment variables.');
  }
}

/**
 * Upload a media file to WhatsApp's media endpoint
 * @param {string} filePath - Path to the file to upload
 * @param {string} mimeType - MIME type of the file (e.g., 'audio/mpeg', 'application/pdf')
 * @returns {Promise<string>} Media ID that can be used to send the media
 */
async function uploadMedia(filePath, mimeType) {
  validateCredentials();

  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));
  formData.append('messaging_product', 'whatsapp');
  formData.append('type', mimeType);

  try {
    const response = await axios.post(
      `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/media`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          ...formData.getHeaders()
        }
      }
    );
    return response.data.id;
  } catch (error) {
    throw new Error(`Failed to upload media: ${error.message}`);
  }
}

/**
 * Send an audio message using WhatsApp Cloud API
 * @param {string} to - Recipient phone number
 * @param {string} mediaId - Media ID from uploadMedia()
 * @returns {Promise<void>}
 */
async function sendAudio(to, mediaId) {
  validateCredentials();

  try {
    await axios.post(
      `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'audio',
        audio: { id: mediaId }
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    throw new Error(`Failed to send audio: ${error.message}`);
  }
}

/**
 * Send a document message with caption using WhatsApp Cloud API
 * @param {string} to - Recipient phone number
 * @param {string} mediaId - Media ID from uploadMedia()
 * @param {string} caption - Caption for the document (optional)
 * @param {string} filename - Display filename (optional)
 * @returns {Promise<void>}
 */
async function sendDocument(to, mediaId, caption, filename) {
  validateCredentials();

  const documentPayload = {
    messaging_product: 'whatsapp',
    to,
    type: 'document',
    document: { id: mediaId }
  };

  if (caption) {
    documentPayload.document.caption = caption;
  }

  if (filename) {
    documentPayload.document.filename = filename;
  }

  try {
    await axios.post(
      `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`,
      documentPayload,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    throw new Error(`Failed to send document: ${error.message}`);
  }
}

/**
 * Send a text message using WhatsApp Cloud API
 * @param {string} to - Recipient phone number
 * @param {string} text - Message text
 * @returns {Promise<void>}
 */
async function sendMessage(to, text) {
  validateCredentials();

  try {
    await axios.post(
      `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: text }
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    throw new Error(`Failed to send message: ${error.message}`);
  }
}

module.exports = {
  uploadMedia,
  sendAudio,
  sendDocument,
  sendMessage
};
