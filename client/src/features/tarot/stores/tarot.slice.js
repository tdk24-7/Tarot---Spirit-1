import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import TarotService from '../services/tarot.service'

// Async thunks
export const fetchAllCards = createAsyncThunk(
  'tarot/fetchAllCards',
  async (_, { rejectWithValue }) => {
    try {
      const response = await TarotService.getAllCards()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch cards' })
    }
  }
)

export const fetchSpreads = createAsyncThunk(
  'tarot/fetchSpreads',
  async (_, { rejectWithValue }) => {
    try {
      const response = await TarotService.getSpreads()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch spreads' })
    }
  }
)

export const fetchTopics = createAsyncThunk(
  'tarot/fetchTopics', 
  async (_, { rejectWithValue }) => {
    try {
      const response = await TarotService.getTopics()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch topics' })
    }
  }
)

export const createReading = createAsyncThunk(
  'tarot/createReading',
  async (readingData, { rejectWithValue }) => {
    try {
      const response = await TarotService.createReading(readingData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create reading' })
    }
  }
)

export const fetchUserReadings = createAsyncThunk(
  'tarot/fetchUserReadings',
  async (params, { rejectWithValue }) => {
    try {
      const response = await TarotService.getUserReadings(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch readings' })
    }
  }
)

export const fetchReadingById = createAsyncThunk(
  'tarot/fetchReadingById',
  async (readingId, { rejectWithValue }) => {
    try {
      const response = await TarotService.getReadingById(readingId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch reading' })
    }
  }
)

export const toggleFavorite = createAsyncThunk(
  'tarot/toggleFavorite',
  async ({ readingId, isFavorite }, { rejectWithValue }) => {
    try {
      const response = await TarotService.toggleFavorite(readingId, isFavorite)
      return { ...response.data, readingId }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update favorite status' })
    }
  }
)

export const saveInterpretation = createAsyncThunk(
  'tarot/saveInterpretation',
  async ({ readingId, interpretationData }, { rejectWithValue }) => {
    try {
      const response = await TarotService.saveInterpretation(readingId, interpretationData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to save interpretation' })
    }
  }
)

// Initial state
const initialState = {
  cards: {
    items: [],
    loading: false,
    error: null
  },
  spreads: {
    items: [],
    loading: false,
    error: null
  },
  topics: {
    items: [],
    loading: false,
    error: null
  },
  readings: {
    items: [],
    currentReading: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0
    },
    loading: false,
    error: null
  },
  ui: {
    activeStep: 0,
    selectedSpread: null,
    selectedTopic: null,
    question: '',
    isCreatingReading: false
  }
}

// Slice
const tarotSlice = createSlice({
  name: 'tarot',
  initialState,
  reducers: {
    setActiveStep: (state, action) => {
      state.ui.activeStep = action.payload
    },
    selectSpread: (state, action) => {
      state.ui.selectedSpread = action.payload
    },
    selectTopic: (state, action) => {
      state.ui.selectedTopic = action.payload
    },
    setQuestion: (state, action) => {
      state.ui.question = action.payload
    },
    resetReadingForm: (state) => {
      state.ui.activeStep = 0
      state.ui.selectedSpread = null
      state.ui.selectedTopic = null
      state.ui.question = ''
    },
    clearCurrentReading: (state) => {
      state.readings.currentReading = null
    }
  },
  extraReducers: (builder) => {
    // Handle fetchAllCards
    builder
      .addCase(fetchAllCards.pending, (state) => {
        state.cards.loading = true
        state.cards.error = null
      })
      .addCase(fetchAllCards.fulfilled, (state, action) => {
        state.cards.loading = false
        state.cards.items = action.payload
      })
      .addCase(fetchAllCards.rejected, (state, action) => {
        state.cards.loading = false
        state.cards.error = action.payload
      })

    // Handle fetchSpreads
    builder
      .addCase(fetchSpreads.pending, (state) => {
        state.spreads.loading = true
        state.spreads.error = null
      })
      .addCase(fetchSpreads.fulfilled, (state, action) => {
        state.spreads.loading = false
        state.spreads.items = action.payload
      })
      .addCase(fetchSpreads.rejected, (state, action) => {
        state.spreads.loading = false
        state.spreads.error = action.payload
      })

    // Handle fetchTopics
    builder
      .addCase(fetchTopics.pending, (state) => {
        state.topics.loading = true
        state.topics.error = null
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.topics.loading = false
        state.topics.items = action.payload
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.topics.loading = false
        state.topics.error = action.payload
      })

    // Handle createReading
    builder
      .addCase(createReading.pending, (state) => {
        state.ui.isCreatingReading = true
        state.readings.error = null
      })
      .addCase(createReading.fulfilled, (state, action) => {
        state.ui.isCreatingReading = false
        state.readings.currentReading = action.payload
        state.readings.items = [action.payload, ...state.readings.items]
      })
      .addCase(createReading.rejected, (state, action) => {
        state.ui.isCreatingReading = false
        state.readings.error = action.payload
      })

    // Handle fetchUserReadings
    builder
      .addCase(fetchUserReadings.pending, (state) => {
        state.readings.loading = true
        state.readings.error = null
      })
      .addCase(fetchUserReadings.fulfilled, (state, action) => {
        state.readings.loading = false
        state.readings.items = action.payload.readings
        state.readings.pagination = action.payload.pagination
      })
      .addCase(fetchUserReadings.rejected, (state, action) => {
        state.readings.loading = false
        state.readings.error = action.payload
      })

    // Handle fetchReadingById
    builder
      .addCase(fetchReadingById.pending, (state) => {
        state.readings.loading = true
        state.readings.error = null
      })
      .addCase(fetchReadingById.fulfilled, (state, action) => {
        state.readings.loading = false
        state.readings.currentReading = action.payload
      })
      .addCase(fetchReadingById.rejected, (state, action) => {
        state.readings.loading = false
        state.readings.error = action.payload
      })

    // Handle toggleFavorite
    builder
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { readingId, isFavorite } = action.payload
        // Update current reading if it matches
        if (state.readings.currentReading?.id === readingId) {
          state.readings.currentReading.isFavorite = isFavorite
        }
        // Update reading in items list
        const readingIndex = state.readings.items.findIndex(r => r.id === readingId)
        if (readingIndex !== -1) {
          state.readings.items[readingIndex].isFavorite = isFavorite
        }
      })

    // Handle saveInterpretation
    builder
      .addCase(saveInterpretation.fulfilled, (state, action) => {
        state.readings.currentReading = action.payload
        // Update reading in items list
        const readingIndex = state.readings.items.findIndex(r => r.id === action.payload.id)
        if (readingIndex !== -1) {
          state.readings.items[readingIndex] = action.payload
        }
      })
  }
})

// Actions
export const { 
  setActiveStep, 
  selectSpread, 
  selectTopic, 
  setQuestion, 
  resetReadingForm,
  clearCurrentReading
} = tarotSlice.actions

// Selectors
export const selectCards = (state) => state.tarot.cards.items
export const selectCardsLoading = (state) => state.tarot.cards.loading
export const selectSpreads = (state) => state.tarot.spreads.items
export const selectSpreadsLoading = (state) => state.tarot.spreads.loading
export const selectTopics = (state) => state.tarot.topics.items
export const selectTopicsLoading = (state) => state.tarot.topics.loading
export const selectReadings = (state) => state.tarot.readings.items
export const selectReadingsLoading = (state) => state.tarot.readings.loading
export const selectCurrentReading = (state) => state.tarot.readings.currentReading
export const selectPagination = (state) => state.tarot.readings.pagination
export const selectActiveStep = (state) => state.tarot.ui.activeStep
export const selectSelectedSpread = (state) => state.tarot.ui.selectedSpread
export const selectSelectedTopic = (state) => state.tarot.ui.selectedTopic
export const selectQuestion = (state) => state.tarot.ui.question
export const selectIsCreatingReading = (state) => state.tarot.ui.isCreatingReading

export default tarotSlice.reducer 