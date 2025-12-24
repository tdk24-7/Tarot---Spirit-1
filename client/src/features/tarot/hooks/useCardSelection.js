import { useState, useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { selectCard, deselectCard, clearSelectedCards } from '../slices/cardSelectionSlice'

/**
 * Custom hook to handle tarot card selection process
 * 
 * @param {Object} options
 * @param {string} options.readingType - Type of reading being performed
 * @param {number} options.maxSelectCount - Maximum number of cards that can be selected
 * @param {string} options.defaultQuestion - Default question for the reading
 * @returns {Object} Selection state and handlers
 */
const useCardSelection = ({ 
  readingType = 'general', 
  maxSelectCount = 3,
  defaultQuestion = '' 
}) => {
  const dispatch = useDispatch()
  
  // Steps: 1 = selection, 2 = confirmation, 3 = result
  const [readingStep, setReadingStep] = useState(1)
  
  // Reading data
  const [readingData, setReadingData] = useState({
    readingType,
    question: defaultQuestion,
    cards: [],
    date: new Date(),
    spread: maxSelectCount === 1 
      ? 'Single Card'
      : maxSelectCount === 3 
        ? 'Past-Present-Future' 
        : 'Celtic Cross'
  })
  
  // Error state
  const [selectionError, setSelectionError] = useState(null)
  
  // Update reading type when it changes
  useEffect(() => {
    setReadingData(prev => ({
      ...prev,
      readingType
    }))
  }, [readingType])
  
  // Update question when it changes
  const setQuestion = useCallback((question) => {
    setReadingData(prev => ({
      ...prev,
      question
    }))
  }, [])
  
  // Initialize with default question
  useEffect(() => {
    setQuestion(defaultQuestion)
  }, [defaultQuestion, setQuestion])
  
  /**
   * Handle card selection
   */
  const handleCardSelect = useCallback((card, index) => {
    if (readingStep !== 1) return
    
    dispatch(selectCard({
      ...card,
      position: index + 1,
      isReversed: card.isReversed || false
    }))
  }, [dispatch, readingStep])
  
  /**
   * Handle card deselection
   */
  const handleCardDeselect = useCallback((card) => {
    if (readingStep !== 1) return
    
    dispatch(deselectCard(card))
  }, [dispatch, readingStep])
  
  /**
   * Reset selection
   */
  const resetSelection = useCallback(() => {
    dispatch(clearSelectedCards())
    setReadingStep(1)
    setSelectionError(null)
  }, [dispatch])
  
  /**
   * Prepare and show reading result
   */
  const handleShowResult = useCallback((selectedCards) => {
    if (!selectedCards || selectedCards.length === 0) {
      setSelectionError('Vui lòng chọn ít nhất một lá bài')
      return
    }
    
    if (selectedCards.length < maxSelectCount) {
      setSelectionError(`Vui lòng chọn đủ ${maxSelectCount} lá bài`)
      return
    }
    
    // Update reading data with selected cards
    setReadingData(prev => ({
      ...prev,
      cards: selectedCards,
      date: new Date()
    }))
    
    // Move to result step
    setReadingStep(3)
    setSelectionError(null)
  }, [maxSelectCount])
  
  return {
    readingData,
    readingStep,
    setReadingStep,
    selectionError,
    setQuestion,
    handleCardSelect,
    handleCardDeselect,
    handleShowResult,
    resetSelection
  }
}

export default useCardSelection 