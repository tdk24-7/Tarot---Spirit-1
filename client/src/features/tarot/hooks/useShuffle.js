import { useState, useCallback, useEffect } from 'react'

/**
 * Custom hook to handle tarot card shuffling and dealing animations
 * 
 * @param {Object} options
 * @param {Array} options.cards - Array of tarot card objects
 * @param {number} options.cardCount - Number of cards to deal onto the table
 * @param {string} options.layout - Layout type ('1-card', '3-card', '7-card')
 * @param {string} options.readingType - Type of reading being performed
 * @returns {Object} Shuffle state and handlers
 */
const useShuffle = ({ cards = [], cardCount = 12, layout = '3-card', readingType = 'general' }) => {
  // Track shuffling state
  const [isShuffling, setIsShuffling] = useState(false)
  const [isDealingCards, setIsDealingCards] = useState(false)
  
  // Cards visible on the table
  const [tableCards, setTableCards] = useState([])
  const [dealedCount, setDealedCount] = useState(0)
  
  // Deck visual position for animation
  const [deckPosition, setDeckPosition] = useState({ x: 0, y: 0, rotation: 0 })
  
  /**
   * Reset shuffle state
   */
  const resetShuffle = useCallback(() => {
    setIsShuffling(false)
    setIsDealingCards(false)
    setTableCards([])
    setDealedCount(0)
    setDeckPosition({ x: 0, y: 0, rotation: 0 })
  }, [])
  
  /**
   * Handle card shuffling animation and dealing
   */
  const handleShuffleCards = useCallback(() => {
    if (!cards.length) return
    
    // Start shuffling animation
    setIsShuffling(true)
    
    // Randomly move deck during shuffling
    const shuffleInterval = setInterval(() => {
      setDeckPosition({
        x: Math.random() * 10 - 5,
        y: Math.random() * 10 - 5,
        rotation: Math.random() * 4 - 2
      })
    }, 150)
    
    // Stop shuffling after a delay
    setTimeout(() => {
      clearInterval(shuffleInterval)
      setIsShuffling(false)
      setDeckPosition({ x: 0, y: 0, rotation: 0 })
      
      // Start dealing cards
      setIsDealingCards(true)
      
      // Get random cards for the table
      const shuffledCards = [...cards]
        .sort(() => Math.random() - 0.5)
        .slice(0, cardCount)
        .map((card, index) => ({
          ...card,
          tablePosition: index + 1,
          isReversed: Math.random() > 0.7
        }))
      
      // Deal cards one by one with delay
      let count = 0
      const dealInterval = setInterval(() => {
        if (count < shuffledCards.length) {
          setTableCards(prev => [...prev, shuffledCards[count]])
          setDealedCount(count + 1)
          count++
        } else {
          clearInterval(dealInterval)
          setIsDealingCards(false)
        }
      }, 300)
    }, 2000)
  }, [cards, cardCount])
  
  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      resetShuffle()
    }
  }, [resetShuffle])
  
  return {
    isShuffling,
    isDealingCards,
    tableCards,
    dealedCount,
    deckPosition,
    handleShuffleCards,
    resetShuffle
  }
}

export default useShuffle 