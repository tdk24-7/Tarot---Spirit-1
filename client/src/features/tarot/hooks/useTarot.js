import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchAllCards,
  fetchSpreads,
  fetchTopics,
  createReading,
  fetchUserReadings, 
  fetchReadingById,
  toggleFavorite,
  saveInterpretation,
  setActiveStep,
  selectSpread,
  selectTopic,
  setQuestion,
  resetReadingForm,
  clearCurrentReading,
  selectCards,
  selectCardsLoading,
  selectSpreads,
  selectSpreadsLoading,
  selectTopics,
  selectTopicsLoading,
  selectReadings,
  selectReadingsLoading,
  selectCurrentReading,
  selectPagination,
  selectActiveStep,
  selectSelectedSpread,
  selectSelectedTopic,
  selectQuestion,
  selectIsCreatingReading
} from '../stores/tarot.slice'

const useTarot = () => {
  const dispatch = useDispatch()

  // Selectors
  const cards = useSelector(selectCards)
  const cardsLoading = useSelector(selectCardsLoading)
  const spreads = useSelector(selectSpreads)
  const spreadsLoading = useSelector(selectSpreadsLoading)
  const topics = useSelector(selectTopics)
  const topicsLoading = useSelector(selectTopicsLoading)
  const readings = useSelector(selectReadings)
  const readingsLoading = useSelector(selectReadingsLoading)
  const currentReading = useSelector(selectCurrentReading)
  const pagination = useSelector(selectPagination)
  const activeStep = useSelector(selectActiveStep)
  const selectedSpread = useSelector(selectSelectedSpread)
  const selectedTopic = useSelector(selectSelectedTopic)
  const question = useSelector(selectQuestion)
  const isCreatingReading = useSelector(selectIsCreatingReading)

  // Load initial data
  useEffect(() => {
    if (cards.length === 0) {
      dispatch(fetchAllCards())
    }
    if (spreads.length === 0) {
      dispatch(fetchSpreads())
    }
    if (topics.length === 0) {
      dispatch(fetchTopics())
    }
  }, [dispatch, cards.length, spreads.length, topics.length])

  // Actions
  const loadUserReadings = (params = {}) => {
    const { page = 1, limit = 10, filter } = params
    dispatch(fetchUserReadings({ page, limit, filter }))
  }

  const loadReadingById = (readingId) => {
    dispatch(fetchReadingById(readingId))
  }

  const handleCreateReading = (readingData) => {
    return dispatch(createReading(readingData)).unwrap()
  }

  const handleSetActiveStep = (step) => {
    dispatch(setActiveStep(step))
  }

  const handleSelectSpread = (spread) => {
    dispatch(selectSpread(spread))
  }

  const handleSelectTopic = (topic) => {
    dispatch(selectTopic(topic))
  }

  const handleSetQuestion = (questionText) => {
    dispatch(setQuestion(questionText))
  }

  const handleResetForm = () => {
    dispatch(resetReadingForm())
  }

  const handleClearCurrentReading = () => {
    dispatch(clearCurrentReading())
  }

  const handleToggleFavorite = (readingId, isFavorite) => {
    dispatch(toggleFavorite({ readingId, isFavorite }))
  }

  const handleSaveInterpretation = (readingId, interpretationData) => {
    dispatch(saveInterpretation({ readingId, interpretationData }))
  }

  return {
    // State
    cards,
    cardsLoading,
    spreads,
    spreadsLoading,
    topics,
    topicsLoading,
    readings,
    readingsLoading,
    currentReading,
    pagination,
    activeStep,
    selectedSpread,
    selectedTopic,
    question,
    isCreatingReading,

    // Actions
    loadUserReadings,
    loadReadingById,
    handleCreateReading,
    handleSetActiveStep,
    handleSelectSpread,
    handleSelectTopic,
    handleSetQuestion,
    handleResetForm,
    handleClearCurrentReading,
    handleToggleFavorite,
    handleSaveInterpretation
  }
}

export default useTarot 