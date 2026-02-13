/**
 * Media Handler Utility
 * Handles incoming media messages (images, audio, video, documents)
 */

const axios = require('axios');
const logger = require('./logger');

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

/**
 * Get media URL from media ID via WhatsApp Cloud API
 * @param {string} mediaId - The media ID from WhatsApp
 * @returns {Promise<string>} The media URL
 */
async function getMediaUrl(mediaId) {
  try {
    const url = `https://graph.facebook.com/v17.0/${mediaId}`;
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`
      }
    });

    logger.info(`Retrieved media URL for ID: ${mediaId}`);
    return response.data.url;
  } catch (error) {
    logger.error('Error getting media URL:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Download media from WhatsApp
 * @param {string} mediaUrl - The media URL
 * @returns {Promise<Buffer>} The media file as a buffer
 */
async function downloadMedia(mediaUrl) {
  try {
    const response = await axios.get(mediaUrl, {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`
      },
      responseType: 'arraybuffer'
    });

    logger.info(`Downloaded media from URL: ${mediaUrl}`);
    return Buffer.from(response.data);
  } catch (error) {
    logger.error('Error downloading media:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Process different media types
 * @param {string} mediaType - Type of media (image, audio, video, document)
 * @param {Buffer} mediaBuffer - The media file buffer
 * @returns {Promise<Object>} Processing result
 */
async function processMedia(mediaType, mediaBuffer) {
  // Placeholder for media processing logic
  // You can extend this to:
  // - Save media to file system or cloud storage
  // - Process images (resize, compress, analyze)
  // - Extract audio/video metadata
  // - Scan documents for text (OCR)
  
  logger.info(`Processing ${mediaType} media (${mediaBuffer.length} bytes)`);
  
  return {
    type: mediaType,
    size: mediaBuffer.length,
    processed: true,
    // Add your custom processing results here
  };
}

/**
 * Handle incoming media message
 * @param {Object} message - The WhatsApp message object
 * @returns {Promise<Object>} Result of media handling
 */
async function handleMediaMessage(message) {
  try {
    let mediaId, mediaType;

    // Determine media type and get media ID
    if (message.image) {
      mediaId = message.image.id;
      mediaType = 'image';
    } else if (message.audio) {
      mediaId = message.audio.id;
      mediaType = 'audio';
    } else if (message.video) {
      mediaId = message.video.id;
      mediaType = 'video';
    } else if (message.document) {
      mediaId = message.document.id;
      mediaType = 'document';
    } else {
      throw new Error('Unknown media type');
    }

    // Get media URL
    const mediaUrl = await getMediaUrl(mediaId);

    // Download media
    const mediaBuffer = await downloadMedia(mediaUrl);

    // Process media
    const result = await processMedia(mediaType, mediaBuffer);

    logger.info(`Media handled successfully: ${mediaType}`);
    return result;
  } catch (error) {
    logger.error('Error handling media message:', error);
    throw error;
  }
}

module.exports = {
  getMediaUrl,
  downloadMedia,
  processMedia,
  handleMediaMessage
};
