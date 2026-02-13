const axios = require('axios');
const config = require('../config');
const logger = require('./logger');

class WhatsAppAPI {
    constructor() {
        this.baseUrl = `${config.WHATSAPP_API_URL}/${config.WHATSAPP_PHONE_ID}`;
        this.token = config.WHATSAPP_TOKEN;
    }

    async sendText(to, text) {
        try {
            const response = await axios.post(
                `${this.baseUrl}/messages`,
                {
                    messaging_product: 'whatsapp',
                    to: to,
                    type: 'text',
                    text: { body: text }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            logger.debug(`Message sent to ${to}`);
            return response.data;
        } catch (error) {
            logger.error(`Failed to send text to ${to}`, error.response?.data || error.message);
            throw error;
        }
    }

    async sendImage(to, url, caption = '') {
        try {
            const response = await axios.post(
                `${this.baseUrl}/messages`,
                {
                    messaging_product: 'whatsapp',
                    to: to,
                    type: 'image',
                    image: {
                        link: url,
                        caption: caption
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            logger.debug(`Image sent to ${to}`);
            return response.data;
        } catch (error) {
            logger.error(`Failed to send image to ${to}`, error.response?.data || error.message);
            throw error;
        }
    }

    async sendButtons(to, bodyText, buttons) {
        try {
            const response = await axios.post(
                `${this.baseUrl}/messages`,
                {
                    messaging_product: 'whatsapp',
                    to: to,
                    type: 'interactive',
                    interactive: {
                        type: 'button',
                        body: { text: bodyText },
                        action: {
                            buttons: buttons.map((btn, idx) => ({
                                type: 'reply',
                                reply: {
                                    id: `btn_${idx}`,
                                    title: btn
                                }
                            }))
                        }
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            logger.debug(`Buttons sent to ${to}`);
            return response.data;
        } catch (error) {
            logger.error(`Failed to send buttons to ${to}`, error.response?.data || error.message);
            throw error;
        }
    }

    async sendList(to, bodyText, sections) {
        try {
            const response = await axios.post(
                `${this.baseUrl}/messages`,
                {
                    messaging_product: 'whatsapp',
                    to: to,
                    type: 'interactive',
                    interactive: {
                        type: 'list',
                        body: { text: bodyText },
                        action: {
                            button: 'View Options',
                            sections: sections
                        }
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            logger.debug(`List sent to ${to}`);
            return response.data;
        } catch (error) {
            logger.error(`Failed to send list to ${to}`, error.response?.data || error.message);
            throw error;
        }
    }
}

module.exports = new WhatsAppAPI();
