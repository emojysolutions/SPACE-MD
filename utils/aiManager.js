const axios = require('axios');

/**
 * Centralized AI Provider Manager
 * Handles multiple AI providers, conversation history, and routing
 */
class AIManager {
  constructor() {
    this.providers = new Map();
    this.conversationHistory = new Map(); // per-user conversation memory
    this.userPersonas = new Map(); // per-user persona settings
    this.maxHistoryLength = 20; // max messages per user
  }

  /**
   * Register available providers based on which API keys are set
   */
  initialize() {
    if (process.env.OPENAI_API_KEY) {
      this.providers.set('gpt', { 
        name: 'ChatGPT (GPT-4o)', 
        model: 'gpt-4o', 
        provider: 'openai',
        emoji: '🤖'
      });
      this.providers.set('gpt4', { 
        name: 'ChatGPT (GPT-4o)', 
        model: 'gpt-4o', 
        provider: 'openai',
        emoji: '🤖'
      });
      this.providers.set('imagine', {
        name: 'DALL-E 3',
        model: 'dall-e-3',
        provider: 'openai',
        emoji: '🎨'
      });
      this.providers.set('vision', {
        name: 'AI Vision',
        model: 'gpt-4o',
        provider: 'openai',
        emoji: '👁️'
      });
    }
    
    if (process.env.ANTHROPIC_API_KEY) {
      this.providers.set('claude', { 
        name: 'Claude Opus', 
        model: 'claude-opus-4-20250514', 
        provider: 'anthropic',
        emoji: '🟠'
      });
      this.providers.set('sonnet', { 
        name: 'Claude Sonnet', 
        model: 'claude-sonnet-4-20250514', 
        provider: 'anthropic',
        emoji: '🔶'
      });
    }
    
    if (process.env.GOOGLE_AI_KEY) {
      this.providers.set('gemini', { 
        name: 'Gemini Pro', 
        model: 'gemini-pro', 
        provider: 'google',
        emoji: '💎'
      });
    }
    
    if (process.env.DEEPSEEK_API_KEY) {
      this.providers.set('deepseek', { 
        name: 'DeepSeek', 
        model: 'deepseek-chat', 
        provider: 'deepseek',
        emoji: '🔮'
      });
    }
  }

  /**
   * Get list of available providers
   */
  getAvailableProviders() {
    const available = [];
    for (const [key, config] of this.providers.entries()) {
      if (!['imagine', 'vision'].includes(key)) { // Exclude non-chat providers
        available.push({
          key,
          ...config
        });
      }
    }
    return available;
  }

  /**
   * Check if a specific provider is available
   */
  isProviderAvailable(providerKey) {
    return this.providers.has(providerKey);
  }

  /**
   * Get provider configuration
   */
  getProvider(providerKey) {
    return this.providers.get(providerKey);
  }

  /**
   * Chat with a specific provider
   */
  async chat(providerKey, userId, message, systemPrompt = null) {
    const config = this.providers.get(providerKey);
    if (!config) {
      throw new Error(`Provider ${providerKey} not configured`);
    }

    // Get conversation history for this user and provider
    const historyKey = `${userId}_${providerKey}`;
    const history = this.getHistory(historyKey);

    // Add user message to history
    history.push({ role: 'user', content: message });

    let response;
    try {
      switch (config.provider) {
        case 'openai':
          response = await this.chatOpenAI(config.model, history, systemPrompt);
          break;
        case 'anthropic':
          response = await this.chatClaude(config.model, history, systemPrompt);
          break;
        case 'google':
          response = await this.chatGemini(history, systemPrompt);
          break;
        case 'deepseek':
          response = await this.chatDeepSeek(history, systemPrompt);
          break;
        default:
          throw new Error(`Unknown provider: ${config.provider}`);
      }

      // Add assistant response to history
      history.push({ role: 'assistant', content: response });

      // Update history (keeping max length)
      this.updateHistory(historyKey, history);

      return response;
    } catch (error) {
      // Remove the failed user message from history
      history.pop();
      throw error;
    }
  }

  /**
   * OpenAI Chat Implementation (GPT-4o / GPT-5)
   */
  async chatOpenAI(model, messages, systemPrompt = null) {
    const messagesWithSystem = systemPrompt 
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : [{ role: 'system', content: 'You are a helpful assistant on WhatsApp. Keep responses concise and friendly.' }, ...messages];

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        { 
          model, 
          messages: messagesWithSystem, 
          max_tokens: 2048 
        },
        { 
          headers: { 
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      if (error.response) {
        throw new Error(`OpenAI API Error: ${error.response.data.error?.message || error.response.statusText}`);
      }
      throw error;
    }
  }

  /**
   * Anthropic Chat Implementation (Claude Opus / Sonnet)
   */
  async chatClaude(model, messages, systemPrompt = null) {
    const system = systemPrompt || 'You are a helpful assistant on WhatsApp. Keep responses concise and friendly.';
    
    try {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model,
          system,
          messages,
          max_tokens: 2048
        },
        {
          headers: {
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.content[0].text;
    } catch (error) {
      if (error.response) {
        throw new Error(`Anthropic API Error: ${error.response.data.error?.message || error.response.statusText}`);
      }
      throw error;
    }
  }

  /**
   * Google Gemini Implementation
   */
  async chatGemini(history, systemPrompt = null) {
    try {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      // Build conversation context from history
      let conversationContext = systemPrompt ? `${systemPrompt}\n\n` : '';
      
      // Add previous messages for context
      if (history.length > 1) {
        for (let i = 0; i < history.length - 1; i++) {
          const msg = history[i];
          conversationContext += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n\n`;
        }
      }
      
      // Add current message
      const currentMessage = history[history.length - 1].content;
      const fullMessage = conversationContext + `User: ${currentMessage}`;
      
      const result = await model.generateContent(fullMessage);
      return result.response.text();
    } catch (error) {
      if (error.message) {
        throw new Error(`Gemini API Error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * DeepSeek Implementation (OpenAI-compatible API)
   */
  async chatDeepSeek(messages, systemPrompt = null) {
    const messagesWithSystem = systemPrompt 
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : [{ role: 'system', content: 'You are a helpful assistant on WhatsApp. Keep responses concise and friendly.' }, ...messages];

    try {
      const response = await axios.post(
        'https://api.deepseek.com/v1/chat/completions',
        { 
          model: 'deepseek-chat', 
          messages: messagesWithSystem, 
          max_tokens: 2048 
        },
        { 
          headers: { 
            'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      if (error.response) {
        throw new Error(`DeepSeek API Error: ${error.response.data.error?.message || error.response.statusText}`);
      }
      throw error;
    }
  }

  /**
   * Get conversation history for a user
   */
  getHistory(historyKey) {
    if (!this.conversationHistory.has(historyKey)) {
      this.conversationHistory.set(historyKey, []);
    }
    return this.conversationHistory.get(historyKey);
  }

  /**
   * Update conversation history (keeping max length)
   */
  updateHistory(historyKey, messages) {
    // Keep only the last maxHistoryLength messages
    const trimmed = messages.slice(-this.maxHistoryLength);
    this.conversationHistory.set(historyKey, trimmed);
  }

  /**
   * Clear conversation history for a user and provider
   */
  clearHistory(userId, providerKey = null) {
    if (providerKey) {
      const historyKey = `${userId}_${providerKey}`;
      this.conversationHistory.delete(historyKey);
    } else {
      // Clear all histories for this user
      const keysToDelete = [];
      for (const key of this.conversationHistory.keys()) {
        if (key.startsWith(`${userId}_`)) {
          keysToDelete.push(key);
        }
      }
      keysToDelete.forEach(key => this.conversationHistory.delete(key));
    }
  }

  /**
   * Smart routing - pick the best available model
   * Priority: GPT-5 > Claude Opus > Gemini > DeepSeek
   */
  async smartChat(userId, message, systemPrompt = null) {
    const priority = ['gpt', 'claude', 'gemini', 'deepseek'];
    
    for (const providerKey of priority) {
      if (this.isProviderAvailable(providerKey)) {
        const response = await this.chat(providerKey, userId, message, systemPrompt);
        return {
          response,
          provider: this.getProvider(providerKey)
        };
      }
    }
    
    throw new Error('No AI providers configured. Please add at least one API key to your .env file.');
  }

  /**
   * Generate image using DALL-E 3
   */
  async generateImage(prompt) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('DALL-E 3 is not configured. Please add OPENAI_API_KEY to your .env file.');
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/images/generations',
        { 
          model: 'dall-e-3', 
          prompt, 
          n: 1, 
          size: '1024x1024' 
        },
        { 
          headers: { 
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      return response.data.data[0].url;
    } catch (error) {
      if (error.response) {
        throw new Error(`DALL-E API Error: ${error.response.data.error?.message || error.response.statusText}`);
      }
      throw error;
    }
  }

  /**
   * Analyze image using GPT-4o Vision
   */
  async analyzeImage(imageUrl, question = 'What is in this image?') {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('AI Vision is not configured. Please add OPENAI_API_KEY to your .env file.');
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: question },
                { type: 'image_url', image_url: { url: imageUrl } }
              ]
            }
          ],
          max_tokens: 2048
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      if (error.response) {
        throw new Error(`Vision API Error: ${error.response.data.error?.message || error.response.statusText}`);
      }
      throw error;
    }
  }

  /**
   * Set persona for a user
   */
  setPersona(userId, personaName) {
    this.userPersonas.set(userId, personaName);
  }

  /**
   * Get persona for a user
   */
  getPersona(userId) {
    return this.userPersonas.get(userId) || 'default';
  }

  /**
   * Clear persona for a user
   */
  clearPersona(userId) {
    this.userPersonas.delete(userId);
  }
}

// Export singleton instance
const aiManager = new AIManager();
aiManager.initialize();

module.exports = aiManager;
