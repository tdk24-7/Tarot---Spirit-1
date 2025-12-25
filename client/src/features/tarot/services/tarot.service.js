import apiClient from '../../../shared/utils/api/apiClient'

/**
 * Service for handling tarot card related API calls
 */
const tarotService = {
  /**
   * Fetch daily tarot card
   * @returns {Promise<Object>} Daily tarot card data
   */
  getDailyCard: async () => {
    try {
      const response = await apiClient.get('/tarot/daily');
      return response.data;
    } catch (error) {
      console.error('Error fetching daily tarot card:', error);
      throw error;
    }
  },
  /**
   * Fetch all tarot cards
   * @returns {Promise<Array>} Array of tarot cards
   */
  getCards: async () => {
    try {
      const response = await apiClient.get('/tarot/cards')
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
      const response = await apiClient.get(`/tarot/cards/${id}`)
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
      const response = await apiClient.get('/tarot/spreads')
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
      const response = await apiClient.get(`/tarot/spreads/${id}`)
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
      const response = await apiClient.post('/tarot/readings/standard', {
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
      // Token is handled automatically by apiClient interceptor
      const response = await apiClient.post('/tarot/readings/ai', {
        domain,
        selectedCards,
        question
      });

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
      const response = await apiClient.post('/tarot/readings/save', reading)
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
      const response = await apiClient.get('/tarot/readings', {
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
      const response = await apiClient.get(`/tarot/readings/${readingId}`)
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
      const response = await apiClient.delete(`/tarot/readings/${readingId}`)
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
      const response = await apiClient.post(`/tarot/readings/${readingId}/share`, { platform })
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
      const response = await apiClient.get(`/tarot/readings/${readingId}/share-link`)
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
      const response = await apiClient.get(`/tarot/shared/${shareToken}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching shared reading with token ${shareToken}:`, error)
      throw error
    }
  }
}

export default tarotService 