import apiClient from '../../../shared/utils/api/apiClient';

const forumService = {
    /**
     * Fetch posts with filters
     * @param {Object} params - Query parameters (limit, offset, category, tag, search, sortBy, sortOrder)
     * @returns {Promise<Object>} List of posts and paginated info
     */
    getPosts: async (params = {}) => {
        try {
            const response = await apiClient.get('/forum/posts', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching forum posts:', error);
            throw error;
        }
    },

    /**
     * Get post details by ID
     * @param {number|string} id - Post ID
     * @returns {Promise<Object>} Post details
     */
    getPostById: async (id) => {
        try {
            const response = await apiClient.get(`/forum/posts/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching post ${id}:`, error);
            throw error;
        }
    },

    /**
     * Create a new post
     * @param {Object} data - Post data (title, content, category, tags)
     * @returns {Promise<Object>} Created post
     */
    createPost: async (data) => {
        try {
            const response = await apiClient.post('/forum/posts', data);
            return response.data;
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    },

    /**
     * Toggle like on a post
     * @param {number|string} id - Post ID
     * @returns {Promise<Object>} Like status
     */
    likePost: async (id) => {
        try {
            const response = await apiClient.post(`/forum/posts/${id}/like`);
            return response.data;
        } catch (error) {
            console.error(`Error liking post ${id}:`, error);
            throw error;
        }
    },

    /**
     * Add a comment to a post
     * @param {number|string} postId - Post ID
     * @param {Object} data - Comment data (content, parentCommentId)
     * @returns {Promise<Object>} Created comment
     */
    addComment: async (postId, data) => {
        try {
            const response = await apiClient.post(`/forum/posts/${postId}/comments`, data);
            return response.data;
        } catch (error) {
            console.error(`Error adding comment to post ${postId}:`, error);
            throw error;
        }
    }
};

export default forumService;
