import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../shared/layouts/AdminLayout'
import Button from '../../shared/components/common/Button'
import Card from '../../shared/components/common/Card'
import SearchBar from '../../shared/components/common/SearchBar'
import Icon from '../../shared/components/common/Icon'
import Spinner from '../../shared/components/common/Spinner'

// Mock data for tarot cards
const MOCK_TAROT_CARDS = [
  {
    id: 1,
    name: 'The Fool',
    arcana: 'major',
    number: 0,
    suit: null,
    element: 'air',
    imageUrl: '/assets/images/cards/major/the-fool.jpg',
    keywords: ['beginnings', 'innocence', 'spontaneity', 'free spirit'],
    upright: 'New beginnings, innocence, adventure, idealism',
    reversed: 'Recklessness, carelessness, distraction, negligence',
    usageCount: 1245
  },
  {
    id: 2,
    name: 'The Magician',
    arcana: 'major',
    number: 1,
    suit: null,
    element: 'air',
    imageUrl: '/assets/images/cards/major/the-magician.jpg',
    keywords: ['manifestation', 'resourcefulness', 'power', 'action'],
    upright: 'Manifestation, resourcefulness, power, inspired action',
    reversed: 'Manipulation, poor planning, untapped talents',
    usageCount: 1087
  },
  {
    id: 3,
    name: 'The High Priestess',
    arcana: 'major',
    number: 2,
    suit: null,
    element: 'water',
    imageUrl: '/assets/images/cards/major/the-high-priestess.jpg',
    keywords: ['intuition', 'sacred knowledge', 'subconscious mind', 'mystery'],
    upright: 'Intuition, sacred knowledge, divine feminine, the subconscious mind',
    reversed: 'Secrets, disconnected from intuition, withdrawal and silence',
    usageCount: 956
  },
  {
    id: 4,
    name: 'The Empress',
    arcana: 'major',
    number: 3,
    suit: null,
    element: 'earth',
    imageUrl: '/assets/images/cards/major/the-empress.jpg',
    keywords: ['femininity', 'beauty', 'nature', 'nurturing', 'abundance'],
    upright: 'Femininity, beauty, nature, nurturing, abundance',
    reversed: 'Creative block, dependence on others, emptiness',
    usageCount: 875
  },
  {
    id: 5,
    name: 'The Emperor',
    arcana: 'major',
    number: 4,
    suit: null,
    element: 'fire',
    imageUrl: '/assets/images/cards/major/the-emperor.jpg',
    keywords: ['authority', 'establishment', 'structure', 'control'],
    upright: 'Authority, establishment, structure, a father figure',
    reversed: 'Domination, excessive control, rigidity, inflexibility',
    usageCount: 792
  },
  {
    id: 6,
    name: 'Ace of Cups',
    arcana: 'minor',
    number: 1,
    suit: 'cups',
    element: 'water',
    imageUrl: '/assets/images/cards/minor/cups/ace-of-cups.jpg',
    keywords: ['new love', 'compassion', 'creativity', 'emotional growth'],
    upright: 'New feelings, intuition, intimacy, love, emotional growth',
    reversed: 'Emotional loss, blocked creativity, emptiness',
    usageCount: 1102
  },
  {
    id: 7,
    name: 'Two of Cups',
    arcana: 'minor',
    number: 2,
    suit: 'cups',
    element: 'water',
    imageUrl: '/assets/images/cards/minor/cups/two-of-cups.jpg',
    keywords: ['unity', 'partnership', 'connection', 'mutual attraction'],
    upright: 'Unity, partnership, connection, attraction',
    reversed: 'Imbalance, broken communication, tension',
    usageCount: 987
  },
  {
    id: 8,
    name: 'Ace of Wands',
    arcana: 'minor',
    number: 1,
    suit: 'wands',
    element: 'fire',
    imageUrl: '/assets/images/cards/minor/wands/ace-of-wands.jpg',
    keywords: ['inspiration', 'new opportunities', 'growth', 'potential'],
    upright: 'Creation, willpower, inspiration, desire',
    reversed: 'Lack of direction, delays, obstacles',
    usageCount: 854
  },
  {
    id: 9,
    name: 'Queen of Swords',
    arcana: 'minor',
    number: 13,
    suit: 'swords',
    element: 'air',
    imageUrl: '/assets/images/cards/minor/swords/queen-of-swords.jpg',
    keywords: ['observation', 'clear-mindedness', 'complexity', 'perceptiveness'],
    upright: 'Independent, clear boundaries, direct communication',
    reversed: 'Overly emotional, easily influenced, cold-hearted',
    usageCount: 732
  },
  {
    id: 10,
    name: 'Ten of Pentacles',
    arcana: 'minor',
    number: 10,
    suit: 'pentacles',
    element: 'earth',
    imageUrl: '/assets/images/cards/minor/pentacles/ten-of-pentacles.jpg',
    keywords: ['wealth', 'family', 'establishment', 'inheritance'],
    upright: 'Wealth, family, establishment, inheritance, long-term success',
    reversed: 'Family disputes, bankruptcy, loss of stability',
    usageCount: 678
  }
]

// Card detail modal
const CardDetailModal = ({ isOpen, onClose, card, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    arcana: 'major',
    number: '',
    suit: '',
    element: '',
    keywords: '',
    upright: '',
    reversed: '',
    imageUrl: ''
  })
  
  useEffect(() => {
    if (card) {
      setFormData({
        name: card.name || '',
        arcana: card.arcana || 'major',
        number: card.number === undefined ? '' : card.number,
        suit: card.suit || '',
        element: card.element || '',
        keywords: card.keywords ? card.keywords.join(', ') : '',
        upright: card.upright || '',
        reversed: card.reversed || '',
        imageUrl: card.imageUrl || ''
      })
    } else {
      setFormData({
        name: '',
        arcana: 'major',
        number: '',
        suit: '',
        element: '',
        keywords: '',
        upright: '',
        reversed: '',
        imageUrl: ''
      })
    }
  }, [card])
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    const finalData = {
      ...formData,
      keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k),
      number: formData.number !== '' ? parseInt(formData.number, 10) : null,
      suit: formData.arcana === 'major' ? null : formData.suit,
    }
    onSave(finalData)
  }
  
  if (!isOpen) return null
  
  const inputClass = "w-full p-2.5 border border-gray-600 bg-gray-700 text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
  const labelClass = "block text-sm font-medium text-gray-300 mb-1"
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 shadow-xl rounded-lg w-full max-w-3xl max-h-[90vh]">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-gray-100">
              {card ? `Edit Card: ${card.name}` : 'Add New Tarot Card'}
            </h2>
          </div>
          
          <div className="p-6 space-y-4 overflow-y-auto" style={{maxHeight: 'calc(90vh - 140px)'}}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className={labelClass}>Card Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label htmlFor="imageUrl" className={labelClass}>Image URL</label>
                <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} className={inputClass} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="arcana" className={labelClass}>Arcana</label>
                <select name="arcana" id="arcana" value={formData.arcana} onChange={handleChange} className={inputClass}>
                  <option value="major">Major Arcana</option>
                  <option value="minor">Minor Arcana</option>
                </select>
              </div>
              <div>
                <label htmlFor="number" className={labelClass}>Number</label>
                <input type="number" name="number" id="number" value={formData.number} onChange={handleChange} className={inputClass} min="0" max="21" />
              </div>
              {formData.arcana === 'minor' && (
                <div>
                  <label htmlFor="suit" className={labelClass}>Suit</label>
                  <select name="suit" id="suit" value={formData.suit} onChange={handleChange} className={inputClass}>
                    <option value="">Select Suit</option>
                    <option value="wands">Wands</option>
                    <option value="cups">Cups</option>
                    <option value="swords">Swords</option>
                    <option value="pentacles">Pentacles</option>
                  </select>
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="element" className={labelClass}>Element</label>
              <input type="text" name="element" id="element" value={formData.element} onChange={handleChange} className={inputClass} />
            </div>
            
            <div>
              <label htmlFor="keywords" className={labelClass}>Keywords (comma-separated)</label>
              <input type="text" name="keywords" id="keywords" value={formData.keywords} onChange={handleChange} className={inputClass} />
            </div>
            
            <div>
              <label htmlFor="upright" className={labelClass}>Upright Meaning</label>
              <textarea name="upright" id="upright" value={formData.upright} onChange={handleChange} rows={3} className={inputClass}></textarea>
            </div>
            
            <div>
              <label htmlFor="reversed" className={labelClass}>Reversed Meaning</label>
              <textarea name="reversed" id="reversed" value={formData.reversed} onChange={handleChange} rows={3} className={inputClass}></textarea>
            </div>
          </div>
          
          <div className="bg-gray-750 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
            <Button type="button" onClick={onClose} variant="outlineDark">
              Cancel
            </Button>
            <Button type="submit" variant="solidDark">
              {card ? 'Save Changes' : 'Add Card'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Filters component
const CardFilters = ({ filters, setFilters, onApplyFilters }) => {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({ arcana: 'all', suit: 'all', element: 'all' })
  }
  
  const inputClass = "py-2 px-3 border border-gray-600 bg-gray-700 text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
  const labelClass = "block text-sm font-medium text-gray-300 mb-1"

  return (
    <div className="mb-6 flex flex-wrap gap-4 items-center p-4 bg-gray-800 rounded-lg">
      <div>
        <label htmlFor="arcanaFilter" className={labelClass}>Arcana</label>
        <select id="arcanaFilter" value={filters.arcana} onChange={(e) => handleFilterChange('arcana', e.target.value)} className={inputClass}>
          <option value="all">All Arcana</option>
          <option value="major">Major</option>
          <option value="minor">Minor</option>
        </select>
      </div>
      <div>
        <label htmlFor="suitFilter" className={labelClass}>Suit</label>
        <select id="suitFilter" value={filters.suit} onChange={(e) => handleFilterChange('suit', e.target.value)} className={inputClass} disabled={filters.arcana === 'major'}>
          <option value="all">All Suits</option>
          <option value="wands">Wands</option>
          <option value="cups">Cups</option>
          <option value="swords">Swords</option>
          <option value="pentacles">Pentacles</option>
        </select>
      </div>
      <div>
        <label htmlFor="elementFilter" className={labelClass}>Element</label>
        <select id="elementFilter" value={filters.element} onChange={(e) => handleFilterChange('element', e.target.value)} className={inputClass}>
          <option value="all">All Elements</option>
          <option value="fire">Fire</option>
          <option value="water">Water</option>
          <option value="air">Air</option>
          <option value="earth">Earth</option>
        </select>
      </div>
      <div className="flex items-end space-x-2 pt-5">
        <Button onClick={onApplyFilters} variant="solidDark" size="md">Apply Filters</Button>
        <Button onClick={resetFilters} variant="outlineDark" size="md">Reset</Button>
      </div>
    </div>
  )
}

// Main Tarot Component
const Tarot = () => {
  const navigate = useNavigate()
  const [cards, setCards] = useState([])
  const [filteredCards, setFilteredCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    arcana: 'all',
    suit: 'all',
    element: 'all'
  })
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const cardsPerPage = 8
  
  useEffect(() => {
    // Simulate API call to get cards
    setTimeout(() => {
      setCards(MOCK_TAROT_CARDS)
      setFilteredCards(MOCK_TAROT_CARDS)
      setLoading(false)
    }, 500)
  }, [])
  
  // Filter cards based on search query and filters
  const applyFilters = () => {
    let filtered = [...cards]
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        card => 
          card.name.toLowerCase().includes(query) || 
          card.keywords.some(keyword => keyword.toLowerCase().includes(query))
      )
    }
    
    // Apply arcana filter
    if (filters.arcana !== 'all') {
      filtered = filtered.filter(card => card.arcana === filters.arcana)
    }
    
    // Apply suit filter
    if (filters.suit !== 'all') {
      if (filters.suit === 'none') {
        filtered = filtered.filter(card => !card.suit)
      } else {
        filtered = filtered.filter(card => card.suit === filters.suit)
      }
    }
    
    // Apply element filter
    if (filters.element !== 'all') {
      filtered = filtered.filter(card => card.element === filters.element)
    }
    
    setFilteredCards(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }
  
  useEffect(() => {
    if (!loading) {
      applyFilters()
    }
  }, [searchQuery, loading])
  
  // Get current cards for pagination
  const indexOfLastCard = currentPage * cardsPerPage
  const indexOfFirstCard = indexOfLastCard - cardsPerPage
  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard)
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage)
  
  // Handle adding/editing cards
  const openAddCardModal = () => {
    setSelectedCard(null)
    setIsModalOpen(true)
  }
  
  const openEditCardModal = (card) => {
    setSelectedCard(card)
    setIsModalOpen(true)
  }
  
  const handleCardSave = (cardData) => {
    if (selectedCard) {
      // Update existing card
      const updatedCards = cards.map(card => 
        card.id === selectedCard.id ? { ...card, ...cardData } : card
      )
      setCards(updatedCards)
      setFilteredCards(updatedCards)
    } else {
      // Add new card
      const newCard = {
        id: cards.length + 1,
        ...cardData,
        usageCount: 0
      }
      setCards([...cards, newCard])
      setFilteredCards([...filteredCards, newCard])
    }
    setIsModalOpen(false)
  }
  
  // View card details
  const handleViewCard = (cardId) => {
    const card = cards.find(card => card.id === cardId);
    if (card) {
      setSelectedCard(card);
      setIsModalOpen(true);
    }
  }
  
  // Render pagination controls
  const renderPagination = () => {
    return (
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          Showing {indexOfFirstCard + 1} to {Math.min(indexOfLastCard, filteredCards.length)} of {filteredCards.length} cards
        </div>
        <div className="flex space-x-1">
          <button 
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Icon name="chevron-left" size={16} />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button 
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Icon name="chevron-right" size={16} />
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tarot Card Management</h1>
          <p className="text-gray-600">View, add, edit, and manage tarot cards</p>
        </div>
        <Button 
          onClick={openAddCardModal}
          variant="solid" 
          size="medium"
        >
          <Icon name="add" size={18} className="mr-1" />
          Add Card
        </Button>
      </div>
      
      <Card className="mb-6">
        <div className="p-4">
          <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search cards by name or keywords"
              className="md:w-1/3"
            />
          </div>
          
          <CardFilters 
            filters={filters} 
            setFilters={setFilters} 
            onApplyFilters={applyFilters}
          />
        </div>
      </Card>
      
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {currentCards.length === 0 ? (
            <Card>
              <div className="p-8 text-center">
                <p className="text-gray-500">No cards found matching your criteria.</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentCards.map((card) => (
                <Card key={card.id} className="overflow-hidden flex flex-col">
                  <div className="relative bg-gray-200 h-48 flex items-center justify-center">
                    {card.imageUrl ? (
                      <img 
                        src={card.imageUrl} 
                        alt={card.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400">No image</div>
                    )}
                    
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <button 
                        onClick={() => openEditCardModal(card)}
                        className="p-1 bg-white rounded-full shadow hover:bg-gray-100 text-gray-700"
                        title="Edit Card"
                      >
                        <Icon name="edit" size={16} />
                      </button>
                      <button 
                        onClick={() => handleViewCard(card.id)}
                        className="p-1 bg-white rounded-full shadow hover:bg-gray-100 text-gray-700"
                        title="View Details"
                      >
                        <Icon name="view" size={16} />
                      </button>
                    </div>
                    
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        card.arcana === 'major' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {card.arcana === 'major' ? 'Major' : 'Minor'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold">{card.name}</h3>
                      {card.element && (
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          card.element === 'fire' ? 'bg-red-100 text-red-800' :
                          card.element === 'water' ? 'bg-blue-100 text-blue-800' :
                          card.element === 'air' ? 'bg-gray-100 text-gray-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {card.element.charAt(0).toUpperCase() + card.element.slice(1)}
                        </span>
                      )}
                    </div>
                    
                    {card.suit && (
                      <p className="text-sm text-gray-500 mt-1">
                        {card.suit.charAt(0).toUpperCase() + card.suit.slice(1)} • #{card.number}
                      </p>
                    )}
                    
                    {!card.suit && (
                      <p className="text-sm text-gray-500 mt-1">
                        #{card.number}
                      </p>
                    )}
                    
                    <div className="mt-2 flex flex-wrap gap-1">
                      {card.keywords.slice(0, 3).map((keyword, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-indigo-50 text-indigo-700 rounded">
                          {keyword}
                        </span>
                      ))}
                      {card.keywords.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-50 text-gray-500 rounded">
                          +{card.keywords.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-xs text-gray-500">Upright</p>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {card.upright}
                      </p>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-xs text-gray-500">Reversed</p>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {card.reversed}
                      </p>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t text-sm text-gray-500">
                      Used in {card.usageCount} readings
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          {renderPagination()}
        </>
      )}
      
      <CardDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        card={selectedCard}
        onSave={handleCardSave}
      />
    </AdminLayout>
  )
}

export default Tarot 