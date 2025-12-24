import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getAIInterpretation, 
  getGuestAIInterpretation,
  createReading,
  createGuestReading,
  getReadingById,
  getGuestReadingById,
  getUserReadings
} from '../services/tarotAPI';

/**
 * @typedef {Object} ReadingCard
 * @property {string} id - Card identifier
 * @property {string} name - Card name
 * @property {string} position - Card position in the reading
 * @property {boolean} reversed - Whether the card is reversed
 */

/**
 * @typedef {Object} Reading
 * @property {string} id - Reading identifier
 * @property {string} question - User's question for the reading
 * @property {string} readingType - Type of reading performed
 * @property {ReadingCard[]} cards - Cards in the reading
 * @property {string} interpretation - AI-generated interpretation
 * @property {string} createdAt - ISO date string when reading was created
 */

/**
 * @typedef {Object} UserReadingsResponse
 * @property {Reading[]} readings - List of readings
 * @property {number} totalCount - Total number of readings
 * @property {number} page - Current page
 * @property {number} limit - Items per page
 */

/**
 * Async thunk to get an AI interpretation for selected cards
 * @param {Object} params - Parameters for interpretation
 * @param {ReadingCard[]} params.cards - Selected cards
 * @param {string} params.question - User's question
 * @param {string} params.readingType - Type of reading
 */
export const getInterpretation = createAsyncThunk(
  'readings/getInterpretation',
  async ({ cards, question, readingType }, { getState, rejectWithValue }) => {
    try {
      const { isAuthenticated } = getState().auth || { isAuthenticated: false };
      
      return isAuthenticated
        ? await getAIInterpretation(cards, question, readingType)
        : await getGuestAIInterpretation(cards, question, readingType);
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Failed to get AI interpretation',
        code: error.code || 'UNKNOWN_ERROR',
        status: error.status || 500
      });
    }
  }
);

/**
 * Async thunk to save a reading
 * @param {Object} readingData - Data for the reading to save
 */
export const performReading = createAsyncThunk(
  'readings/performReading',
  async (readingData, { getState, rejectWithValue }) => {
    try {
      const { isAuthenticated } = getState().auth || { isAuthenticated: false };
      
      return isAuthenticated
        ? await createReading(readingData)
        : await createGuestReading(readingData);
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Failed to create reading',
        code: error.code || 'UNKNOWN_ERROR',
        status: error.status || 500
      });
    }
  }
);

/**
 * Async thunk to fetch a reading by ID
 * @param {string} readingId - ID of the reading to fetch
 */
export const fetchReadingById = createAsyncThunk(
  'readings/fetchReadingById',
  async (readingId, { getState, rejectWithValue }) => {
    try {
      const { isAuthenticated } = getState().auth || { isAuthenticated: false };
      
      return isAuthenticated
        ? await getReadingById(readingId)
        : await getGuestReadingById(readingId);
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Failed to fetch reading',
        code: error.code || 'UNKNOWN_ERROR',
        status: error.status || 500
      });
    }
  }
);

/**
 * Async thunk to fetch user's reading history
 * @param {Object} params - Parameters for fetching readings
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=10] - Items per page
 * @param {string} [params.sortBy='createdAt'] - Sort field
 * @param {string} [params.sortDirection='desc'] - Sort direction
 */
export const fetchUserReadings = createAsyncThunk(
  'readings/fetchUserReadings',
  async (params, { rejectWithValue }) => {
    try {
      return await getUserReadings(params);
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Failed to fetch user readings',
        code: error.code || 'UNKNOWN_ERROR',
        status: error.status || 500
      });
    }
  }
);

/**
 * Initial state for readings slice
 * @type {Object}
 */
const initialState = {
  currentReading: null,
  interpretation: '',
  userReadings: {
    readings: [],
    totalCount: 0,
    page: 1,
    limit: 10,
  },
  loading: false,
  interpretationLoading: false,
  readingLoading: false,
  userReadingsLoading: false,
  error: null,
  interpretationError: null,
  readingError: null,
  userReadingsError: null,
};

/**
 * Redux slice for managing tarot readings
 */
const readingsSlice = createSlice({
  name: 'readings',
  initialState,
  reducers: {
    /**
     * Clear the current reading and interpretation
     */
    clearCurrentReading: (state) => {
      state.currentReading = null;
      state.interpretation = '';
    },
    
    /**
     * Reset the readings state to initial values
     */
    resetReadingsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Get interpretation
      .addCase(getInterpretation.pending, (state) => {
        state.interpretationLoading = true;
        state.interpretationError = null;
      })
      .addCase(getInterpretation.fulfilled, (state, action) => {
        state.interpretationLoading = false;
        state.interpretation = action.payload;
      })
      .addCase(getInterpretation.rejected, (state, action) => {
        state.interpretationLoading = false;
        state.interpretationError = action.payload;
      })
      
      // Perform reading
      .addCase(performReading.pending, (state) => {
        state.readingLoading = true;
        state.readingError = null;
      })
      .addCase(performReading.fulfilled, (state, action) => {
        state.readingLoading = false;
        state.currentReading = action.payload;
      })
      .addCase(performReading.rejected, (state, action) => {
        state.readingLoading = false;
        state.readingError = action.payload;
      })
      
      // Fetch reading by ID
      .addCase(fetchReadingById.pending, (state) => {
        state.readingLoading = true;
        state.readingError = null;
      })
      .addCase(fetchReadingById.fulfilled, (state, action) => {
        state.readingLoading = false;
        state.currentReading = action.payload;
      })
      .addCase(fetchReadingById.rejected, (state, action) => {
        state.readingLoading = false;
        state.readingError = action.payload;
      })
      
      // Fetch user readings
      .addCase(fetchUserReadings.pending, (state) => {
        state.userReadingsLoading = true;
        state.userReadingsError = null;
      })
      .addCase(fetchUserReadings.fulfilled, (state, action) => {
        state.userReadingsLoading = false;
        state.userReadings = {
          readings: action.payload.readings,
          totalCount: action.payload.totalCount,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(fetchUserReadings.rejected, (state, action) => {
        state.userReadingsLoading = false;
        state.userReadingsError = action.payload;
      });
  },
});

// Export actions
export const {
  clearCurrentReading,
  resetReadingsState,
} = readingsSlice.actions;

// Memoized selectors
export const selectCurrentReading = (state) => state.readings.currentReading;
export const selectInterpretation = (state) => state.readings.interpretation;
export const selectUserReadings = (state) => state.readings.userReadings;
export const selectInterpretationLoading = (state) => state.readings.interpretationLoading;
export const selectReadingLoading = (state) => state.readings.readingLoading;
export const selectUserReadingsLoading = (state) => state.readings.userReadingsLoading;
export const selectInterpretationError = (state) => state.readings.interpretationError;
export const selectReadingError = (state) => state.readings.readingError;
export const selectUserReadingsError = (state) => state.readings.userReadingsError;

export default readingsSlice.reducer; 