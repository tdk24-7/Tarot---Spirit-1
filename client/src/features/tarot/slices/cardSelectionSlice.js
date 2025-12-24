import { createSlice } from '@reduxjs/toolkit'

const cardSelectionSlice = createSlice({
  name: 'cardSelection',
  initialState: {
    selectedCards: [],
    maxSelectionCount: 3,
    readingType: 'general',
    question: '',
    spreadType: '3-card'
  },
  reducers: {
    selectCard: (state, action) => {
      // Don't select more cards than the maximum allowed
      if (state.selectedCards.length >= state.maxSelectionCount) {
        return
      }
      
      // Add the card if it's not already selected
      const cardExists = state.selectedCards.find(card => card.id === action.payload.id)
      if (!cardExists) {
        state.selectedCards.push(action.payload)
      }
    },
    
    deselectCard: (state, action) => {
      state.selectedCards = state.selectedCards.filter(card => card.id !== action.payload.id)
    },
    
    clearSelectedCards: (state) => {
      state.selectedCards = []
    },
    
    setMaxSelectionCount: (state, action) => {
      state.maxSelectionCount = action.payload
    },
    
    setReadingType: (state, action) => {
      state.readingType = action.payload
    },
    
    setQuestion: (state, action) => {
      state.question = action.payload
    },
    
    setSpreadType: (state, action) => {
      state.spreadType = action.payload
      
      // Update max selection count based on spread type
      switch (action.payload) {
        case '1-card':
          state.maxSelectionCount = 1
          break
        case '3-card':
          state.maxSelectionCount = 3
          break
        case '7-card':
          state.maxSelectionCount = 7
          break
        default:
          state.maxSelectionCount = 3
      }
    }
  }
})

export const {
  selectCard,
  deselectCard,
  clearSelectedCards,
  setMaxSelectionCount,
  setReadingType,
  setQuestion,
  setSpreadType
} = cardSelectionSlice.actions

export const selectSelectedCards = state => state.cardSelection.selectedCards
export const selectMaxSelectionCount = state => state.cardSelection.maxSelectionCount
export const selectReadingType = state => state.cardSelection.readingType
export const selectQuestion = state => state.cardSelection.question
export const selectSpreadType = state => state.cardSelection.spreadType
export const selectIsSelectionComplete = state => 
  state.cardSelection.selectedCards.length === state.cardSelection.maxSelectionCount

export default cardSelectionSlice.reducer 