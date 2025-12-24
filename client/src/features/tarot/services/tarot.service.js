import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL || '/api'

/**
 * Service for handling tarot card related API calls
 */
const tarotService = {
  /**
   * Fetch all tarot cards
   * @returns {Promise<Array>} Array of tarot cards
   */
  getCards: async () => {
    try {
      const response = await axios.get(`${API_URL}/tarot/cards`)
      return response.data
    } catch (error) {
      console.error('Error fetching tarot cards:', error)
      throw error
    }
  },

  /**
   * Fetch a single tarot card by ID
   * @param {string} id - Card ID
   * @returns {Promise<Object>} Tarot card data
   */
  getCardById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/tarot/cards/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching tarot card with ID ${id}:`, error)
      throw error
    }
  },

  /**
   * Fetch all available tarot spreads
   * @returns {Promise<Array>} Array of spread configurations
   */
  getSpreads: async () => {
    try {
      const response = await axios.get(`${API_URL}/tarot/spreads`)
      return response.data
    } catch (error) {
      console.error('Error fetching tarot spreads:', error)
      throw error
    }
  },

  /**
   * Fetch a single tarot spread by ID
   * @param {string} id - Spread ID
   * @returns {Promise<Object>} Spread configuration
   */
  getSpreadById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/tarot/spreads/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching tarot spread with ID ${id}:`, error)
      throw error
    }
  },

  /**
   * Generate a standard tarot reading with predefined templates
   * @param {string} domain - Domain/topic for the reading (love, career, finance, health, spiritual)
   * @param {Array} selectedCards - The 3 cards chosen by the user
   * @param {string} question - User's question
   * @returns {Promise<Object>} Tarot reading result with interpretation
   */
  generateStandardReading: async (domain, selectedCards, question = '') => {
    try {
      const response = await axios.post(`${API_URL}/tarot/readings/standard`, {
        domain,
        selectedCards,
        question
      })
      return response.data
    } catch (error) {
      console.error('Error generating standard tarot reading:', error)
      throw error
    }
  },

  /**
   * Generate an AI-powered tarot reading
   * @param {string} domain - Domain/topic for the reading (love, career, finance, health, spiritual)
   * @param {Array} selectedCards - The 3 cards chosen by the user
   * @param {string} question - User's question
   * @returns {Promise<Object>} AI-powered tarot reading result
   */
  generateAIReading: async (domain, selectedCards, question = '') => {
    try {
      // Lấy token xác thực từ localStorage
      const token = localStorage.getItem('token');
      
      // Chuẩn bị headers với token xác thực
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios.post(`${API_URL}/tarot/readings/ai`, {
        domain,
        selectedCards,
        question
      }, { headers });
      
      return response.data
    } catch (error) {
      console.error('Error generating AI tarot reading:', error)
      throw error
    }
  },

  /**
   * Save a tarot reading to user history
   * @param {Object} reading - Reading data to save
   * @returns {Promise<Object>} Saved reading data with ID
   */
  saveReading: async (reading) => {
    try {
      const response = await axios.post(`${API_URL}/tarot/readings/save`, reading)
      return response.data
    } catch (error) {
      console.error('Error saving tarot reading:', error)
      throw error
    }
  },

  /**
   * Fetch user's saved readings
   * @param {number} page - Page number for pagination
   * @param {number} limit - Number of readings per page
   * @returns {Promise<Object>} Object containing user's reading history and pagination info
   */
  getUserReadings: async (page = 1, limit = 10) => {
    try {
      const response = await axios.get(`${API_URL}/tarot/readings`, {
        params: { page, limit }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching reading history:', error)
      throw error
    }
  },

  /**
   * Fetch details of a specific reading by ID
   * @param {string} readingId - ID of the reading to fetch
   * @returns {Promise<Object>} Reading details with cards and interpretations
   */
  getReadingById: async (readingId) => {
    try {
      const response = await axios.get(`${API_URL}/tarot/readings/${readingId}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching reading with ID ${readingId}:`, error)
      throw error
    }
  },

  /**
   * Delete a saved reading from user history
   * @param {string} readingId - ID of the reading to delete
   * @returns {Promise<Object>} Response indicating success
   */
  deleteReading: async (readingId) => {
    try {
      const response = await axios.delete(`${API_URL}/tarot/readings/${readingId}`)
      return response.data
    } catch (error) {
      console.error(`Error deleting reading with ID ${readingId}:`, error)
      throw error
    }
  },

  /**
   * Share a reading on social media
   * @param {string} readingId - ID of the reading to share
   * @param {string} platform - Social media platform (facebook, twitter, etc.)
   * @returns {Promise<Object>} Response with sharing info including URL
   */
  shareReading: async (readingId, platform) => {
    try {
      const response = await axios.post(`${API_URL}/tarot/readings/${readingId}/share`, { platform })
      return response.data
    } catch (error) {
      console.error(`Error sharing reading with ID ${readingId}:`, error)
      throw error
    }
  },

  /**
   * Generate a public share link for a reading
   * @param {string} readingId - ID of the reading to share
   * @returns {Promise<Object>} Response with public URL
   */
  getShareLink: async (readingId) => {
    try {
      const response = await axios.get(`${API_URL}/tarot/readings/${readingId}/share-link`)
      return response.data
    } catch (error) {
      console.error(`Error generating share link for reading with ID ${readingId}:`, error)
      throw error
    }
  },

  /**
   * Fetch a reading by its public share token
   * @param {string} shareToken - Public share token
   * @returns {Promise<Object>} Publicly shared reading data
   */
  getSharedReading: async (shareToken) => {
    try {
      const response = await axios.get(`${API_URL}/tarot/shared/${shareToken}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching shared reading with token ${shareToken}:`, error)
      throw error
    }
  }
}

export default tarotService 