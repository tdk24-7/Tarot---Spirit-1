import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../shared/layouts/AdminLayout'
import Button from '../../shared/components/common/Button'
import Card from '../../shared/components/common/Card'
import Spinner from '../../shared/components/common/Spinner'
import Icon from '../../shared/components/common/Icon'
import SearchBar from '../../shared/components/common/SearchBar'

// Mock data for premium plans
const MOCK_PREMIUM_PLANS = [
  {
    id: 1,
    name: 'Basic',
    price: 9.99,
    billingCycle: 'monthly',
    annualPrice: 99.99,
    features: [
      'Unlimited readings',
      'Basic journal entries',
      'Email support',
      '5 saved readings'
    ],
    subscriberCount: 325,
    monthlyRevenue: 3246.75,
    color: 'blue'
  },
  {
    id: 2,
    name: 'Standard',
    price: 19.99,
    billingCycle: 'monthly',
    annualPrice: 199.99,
    features: [
      'Unlimited readings',
      'Advanced journal entries',
      'Priority email support',
      '20 saved readings',
      'Personal reading history'
    ],
    subscriberCount: 542,
    monthlyRevenue: 10834.58,
    color: 'purple'
  },
  {
    id: 3,
    name: 'Premium',
    price: 29.99,
    billingCycle: 'monthly',
    annualPrice: 299.99,
    features: [
      'Unlimited readings',
      'Advanced journal entries',
      'Priority email and chat support',
      'Unlimited saved readings',
      'Personal reading history',
      'AI-powered insights',
      'Monthly personalized report'
    ],
    subscriberCount: 217,
    monthlyRevenue: 6507.83,
    color: 'indigo'
  },
  {
    id: 4,
    name: 'VIP',
    price: 49.99,
    billingCycle: 'monthly',
    annualPrice: 499.99,
    features: [
      'Unlimited readings',
      'Advanced journal entries',
      'Priority email, chat, and phone support',
      'Unlimited saved readings',
      'Personal reading history',
      'AI-powered insights',
      'Weekly personalized report',
      'One-on-one consultation',
      'Early access to new features'
    ],
    subscriberCount: 78,
    monthlyRevenue: 3899.22,
    color: 'amber'
  }
]

// Mock data for premium subscribers
const MOCK_PREMIUM_SUBSCRIBERS = [
  {
    id: 1,
    userId: 101,
    userName: 'Nguyen Van A',
    userEmail: 'nguyena@example.com',
    planId: 2,
    planName: 'Standard',
    startDate: '2023-08-15',
    endDate: '2024-08-15',
    billingCycle: 'annual',
    amount: 199.99,
    status: 'active',
    paymentMethod: 'credit_card',
    autoRenew: true
  },
  {
    id: 2,
    userId: 102,
    userName: 'Tran Thi B',
    userEmail: 'tranb@example.com',
    planId: 3,
    planName: 'Premium',
    startDate: '2023-09-10',
    endDate: '2023-12-10',
    billingCycle: 'monthly',
    amount: 29.99,
    status: 'active',
    paymentMethod: 'paypal',
    autoRenew: true
  },
  {
    id: 3,
    userId: 103,
    userName: 'Le Van C',
    userEmail: 'lec@example.com',
    planId: 4,
    planName: 'VIP',
    startDate: '2023-07-05',
    endDate: '2024-07-05',
    billingCycle: 'annual',
    amount: 499.99,
    status: 'active',
    paymentMethod: 'credit_card',
    autoRenew: true
  },
  {
    id: 4,
    userId: 104,
    userName: 'Pham Van D',
    userEmail: 'phamd@example.com',
    planId: 1,
    planName: 'Basic',
    startDate: '2023-10-01',
    endDate: '2023-11-01',
    billingCycle: 'monthly',
    amount: 9.99,
    status: 'active',
    paymentMethod: 'credit_card',
    autoRenew: false
  },
  {
    id: 5,
    userId: 105,
    userName: 'Hoang Thi E',
    userEmail: 'hoange@example.com',
    planId: 2,
    planName: 'Standard',
    startDate: '2023-06-20',
    endDate: '2023-10-20',
    billingCycle: 'monthly',
    amount: 19.99,
    status: 'expired',
    paymentMethod: 'paypal',
    autoRenew: false
  },
  {
    id: 6,
    userId: 106,
    userName: 'Vo Tan F',
    userEmail: 'vof@example.com',
    planId: 3,
    planName: 'Premium',
    startDate: '2023-11-01',
    endDate: '2024-11-01',
    billingCycle: 'annual',
    amount: 299.99,
    status: 'active',
    paymentMethod: 'credit_card',
    autoRenew: true
  },
  {
    id: 7,
    userId: 107,
    userName: 'Do Thi G',
    userEmail: 'dog@example.com',
    planId: 1,
    planName: 'Basic',
    startDate: '2023-09-15',
    endDate: '2023-10-15',
    billingCycle: 'monthly',
    amount: 9.99,
    status: 'cancelled',
    paymentMethod: 'paypal',
    autoRenew: false
  }
]

// PlanCard component to display premium plan
const PlanCard = ({ plan, onEdit, onViewSubscribers }) => {
  // Ensure color provides good contrast for text-white
  const bgColor = plan.color ? `bg-${plan.color}-600` : 'bg-purple-600';
  const featureIconColor = plan.color ? `text-${plan.color}-400` : 'text-purple-400';

  return (
    <Card className="overflow-hidden bg-gray-800 shadow-lg rounded-lg flex flex-col">
      <div className={`p-6 text-white ${bgColor}`}>
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">{plan.name}</h3>
          <div className="flex space-x-1.5">
            <button 
              onClick={() => onEdit(plan)}
              className="p-1.5 bg-white/10 rounded hover:bg-white/20 transition-colors"
              title="Edit Plan"
            >
              <Icon name="edit" size={16} className="text-white" />
            </button>
            <button 
              onClick={() => onViewSubscribers(plan.id)}
              className="p-1.5 bg-white/10 rounded hover:bg-white/20 transition-colors"
              title="View Subscribers"
            >
              <Icon name="people" size={16} className="text-white" />
            </button>
          </div>
        </div>
        <div className="mt-3 flex items-baseline">
          <span className="text-3xl font-extrabold tracking-tight">${plan.price}</span>
          <span className="ml-1 text-sm text-white/80">/month</span>
        </div>
        <div className="text-xs mt-1 text-white/80">
          or ${plan.annualPrice}/year (Save {Math.round((1 - (plan.annualPrice / (plan.price * 12)))*100)}%)
        </div>
      </div>
      
      <div className="p-6 flex-grow">
        <ul className="space-y-2.5 mb-6">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Icon name="check-circle" size={18} className={`mr-2.5 mt-0.5 ${featureIconColor}`} />
              <span className="text-sm text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-6 border-t border-gray-700 mt-auto">
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-gray-400">Subscribers:</span>
          <span className="font-medium text-gray-200">{plan.subscriberCount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Monthly Revenue:</span>
          <span className="font-medium text-gray-200">${plan.monthlyRevenue.toLocaleString()}</span>
        </div>
      </div>
    </Card>
  )
}

// Plan modal for adding/editing plans
const PlanModal = ({ isOpen, onClose, plan, onSave }) => {
  const [formData, setFormData] = useState({})
  
  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name || '',
        price: plan.price || '',
        billingCycle: plan.billingCycle || 'monthly',
        annualPrice: plan.annualPrice || '',
        features: plan.features || [],
        color: plan.color || 'purple'
      })
    } else {
      setFormData({
        name: '',
        price: '',
        billingCycle: 'monthly',
        annualPrice: '',
        features: ['New Feature 1', 'New Feature 2'],
        color: 'purple'
      })
    }
  }, [plan])
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }))
  }
  
  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }))
  }
  
  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    const finalData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      annualPrice: parseFloat(formData.annualPrice) || 0,
      features: formData.features.filter(f => f.trim() !== '')
    }
    onSave(finalData)
  }
  
  if (!isOpen) return null
  
  const inputClass = "w-full p-2.5 border border-gray-600 bg-gray-700 text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
  const labelClass = "block text-sm font-medium text-gray-300 mb-1"
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 shadow-xl rounded-lg w-full max-w-2xl max-h-[90vh]">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-gray-100">
              {plan ? `Edit Plan: ${plan.name}` : 'Add New Premium Plan'}
            </h2>
          </div>
          
          <div className="p-6 space-y-4 overflow-y-auto" style={{maxHeight: 'calc(90vh - 140px)'}}>
            <div>
              <label htmlFor="name" className={labelClass}>Plan Name</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className={inputClass} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className={labelClass}>Monthly Price ($)</label>
                <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required step="0.01" className={inputClass} />
              </div>
              <div>
                <label htmlFor="annualPrice" className={labelClass}>Annual Price ($)</label>
                <input type="number" name="annualPrice" id="annualPrice" value={formData.annualPrice} onChange={handleChange} step="0.01" className={inputClass} />
              </div>
            </div>
            <div>
              <label htmlFor="billingCycle" className={labelClass}>Billing Cycle</label>
              <select name="billingCycle" id="billingCycle" value={formData.billingCycle} onChange={handleChange} className={inputClass}>
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
              </select>
            </div>
            <div>
              <label htmlFor="color" className={labelClass}>Theme Color (Tailwind e.g., purple, blue, green)</label>
              <input type="text" name="color" id="color" value={formData.color} onChange={handleChange} className={inputClass} placeholder="e.g., purple" />
            </div>
            <div>
              <label className={labelClass}>Features</label>
              {formData.features && formData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input type="text" value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)} className={`${inputClass} flex-grow`} />
                  <Button type="button" onClick={() => removeFeature(index)} variant="outlineDark" size="small" className="text-red-400 border-red-400 hover:bg-red-400/20">
                    <Icon name="delete" size={16} />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addFeature} variant="textDark" size="sm" className="mt-1">
                <Icon name="add" size={16} className="mr-1" /> Add Feature
              </Button>
            </div>
          </div>
          
          <div className="bg-gray-750 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
            <Button type="button" onClick={onClose} variant="outlineDark">Cancel</Button>
            <Button type="submit" variant="solidDark">{plan ? 'Save Changes' : 'Add Plan'}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Filter component for subscribers table
const SubscriberFilters = ({ filters, setFilters, onApplyFilters, plans }) => {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({ planId: 'all', status: 'all', billingCycle: 'all' })
  }

  const inputClass = "py-2 px-3 border border-gray-600 bg-gray-700 text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
  const labelClass = "block text-sm font-medium text-gray-300 mb-1"

  return (
    <div className="mb-6 flex flex-wrap gap-4 items-center p-4 bg-gray-800 rounded-lg">
      <div>
        <label htmlFor="planFilter" className={labelClass}>Plan</label>
        <select id="planFilter" value={filters.planId} onChange={(e) => handleFilterChange('planId', e.target.value)} className={inputClass}>
          <option value="all">All Plans</option>
          {plans.map(plan => <option key={plan.id} value={plan.id}>{plan.name}</option>)}
        </select>
      </div>
      
      <div>
        <label htmlFor="statusFilter" className={labelClass}>Status</label>
        <select id="statusFilter" value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)} className={inputClass}>
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="cycleFilter" className={labelClass}>Billing Cycle</label>
        <select id="cycleFilter" value={filters.billingCycle} onChange={(e) => handleFilterChange('billingCycle', e.target.value)} className={inputClass}>
          <option value="all">All Cycles</option>
          <option value="monthly">Monthly</option>
          <option value="annual">Annual</option>
        </select>
      </div>
      
      <div className="flex items-end space-x-2 pt-5">
        <Button onClick={onApplyFilters} variant="solidDark" size="md">Apply Filters</Button>
        <Button onClick={resetFilters} variant="outlineDark" size="md">Reset</Button>
      </div>
    </div>
  )
}

// Main Premium Component
const Premium = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('plans')
  const [plans, setPlans] = useState([])
  const [subscribers, setSubscribers] = useState([])
  const [filteredSubscribers, setFilteredSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Modal state
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  
  // Search and filter
  const [searchQuery, setSearchQuery] = useState('')
  const [subscriberFilters, setSubscriberFilters] = useState({ planId: 'all', status: 'all', billingCycle: 'all' })
  
  // Pagination for subscribers
  const [currentPage, setCurrentPage] = useState(1)
  const subscribersPerPage = 10
  
  useEffect(() => {
    // Simulate API call to get data
    setTimeout(() => {
      setPlans(MOCK_PREMIUM_PLANS)
      setSubscribers(MOCK_PREMIUM_SUBSCRIBERS)
      setFilteredSubscribers(MOCK_PREMIUM_SUBSCRIBERS)
      setLoading(false)
    }, 500)
  }, [])
  
  // Filter subscribers based on search query and filters
  const applySubscriberFilters = () => {
    let filtered = [...subscribers]
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        sub => 
          sub.userName.toLowerCase().includes(query) || 
          sub.userEmail.toLowerCase().includes(query)
      )
    }
    
    // Apply plan filter
    if (subscriberFilters.planId !== 'all') {
      filtered = filtered.filter(sub => sub.planId === parseInt(subscriberFilters.planId))
    }
    
    // Apply status filter
    if (subscriberFilters.status !== 'all') {
      filtered = filtered.filter(sub => sub.status === subscriberFilters.status)
    }
    
    // Apply billing cycle filter
    if (subscriberFilters.billingCycle !== 'all') {
      filtered = filtered.filter(sub => sub.billingCycle === subscriberFilters.billingCycle)
    }
    
    setFilteredSubscribers(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }
  
  useEffect(() => {
    if (!loading) {
      applySubscriberFilters()
    }
  }, [searchQuery, loading])
  
  // Get current subscribers for pagination
  const indexOfLastSubscriber = currentPage * subscribersPerPage
  const indexOfFirstSubscriber = indexOfLastSubscriber - subscribersPerPage
  const currentSubscribers = filteredSubscribers.slice(indexOfFirstSubscriber, indexOfLastSubscriber)
  const totalPages = Math.ceil(filteredSubscribers.length / subscribersPerPage)
  
  // Handle adding/editing plans
  const openAddPlanModal = () => {
    setSelectedPlan(null)
    setIsPlanModalOpen(true)
  }
  
  const openEditPlanModal = (plan) => {
    setSelectedPlan(plan)
    setIsPlanModalOpen(true)
  }
  
  const handlePlanSave = (planData) => {
    setLoading(prev => ({ ...prev, plans: true }))
    setTimeout(() => {
      if (selectedPlan) {
        // Update existing plan
        const updatedPlans = plans.map(plan => 
          plan.id === selectedPlan.id ? { ...selectedPlan, ...planData } : plan
        )
        setPlans(updatedPlans)
      } else {
        // Add new plan
        const newPlan = {
          id: plans.length + 1,
          ...planData,
          subscriberCount: 0,
          monthlyRevenue: 0
        }
        setPlans([...plans, newPlan])
      }
      setIsPlanModalOpen(false)
      setSelectedPlan(null)
      setLoading(prev => ({ ...prev, plans: false }))
    }, 300)
  }
  
  // View plan subscribers
  const handleViewPlanSubscribers = (planId) => {
    setActiveTab('subscribers')
    setSubscriberFilters(prev => ({
      ...prev,
      planId: planId.toString()
    }))
    applySubscriberFilters()
  }
  
  // View user details
  const handleViewUser = (userId) => {
    navigate(`/admin/users/${userId}`)
  }
  
  // Status badge component
  const StatusBadge = ({ status }) => {
    let colorClasses = 'bg-gray-600/50 text-gray-200'
    
    if (status === 'active') colorClasses = 'bg-green-600/50 text-green-200'
    if (status === 'expired') colorClasses = 'bg-yellow-600/50 text-yellow-200'
    if (status === 'cancelled') colorClasses = 'bg-red-600/50 text-red-200'
    
    return (
      <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }
  
  // Render pagination controls
  const renderPagination = () => {
    return (
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          Showing {indexOfFirstSubscriber + 1} to {Math.min(indexOfLastSubscriber, filteredSubscribers.length)} of {filteredSubscribers.length} subscribers
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
          <h1 className="text-2xl font-bold text-gray-100">Premium Service Management</h1>
          <p className="text-gray-400">Manage premium plans and track subscribers.</p>
        </div>
        {activeTab === 'plans' && (
          <Button 
            onClick={openAddPlanModal}
            variant="solidDark" 
            size="md"
          >
            <Icon name="add" size={18} className="mr-2" />
            Add New Plan
          </Button>
        )}
      </div>
      
      <div className="mb-6 border-b">
        <div className="flex">
          <button 
            onClick={() => setActiveTab('plans')}
            className={`px-4 py-2 font-medium text-sm border-b-2 ${
              activeTab === 'plans' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Premium Plans
          </button>
          <button 
            onClick={() => setActiveTab('subscribers')}
            className={`px-4 py-2 font-medium text-sm border-b-2 ${
              activeTab === 'subscribers' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Subscribers
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <Spinner size="lg" color="text-purple-400" />
        </div>
      ) : (
        <>
          {activeTab === 'plans' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map(plan => (
                <PlanCard 
                  key={plan.id} 
                  plan={plan} 
                  onEdit={openEditPlanModal}
                  onViewSubscribers={handleViewPlanSubscribers}
                />
              ))}
            </div>
          ) : (
            <>
              <Card className="mb-6">
                <div className="p-4">
                  <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
                    <SearchBar
                      value={searchQuery}
                      onChange={setSearchQuery}
                      placeholder="Search subscribers by name or email"
                      className="md:w-1/3"
                    />
                  </div>
                  
                  <SubscriberFilters 
                    filters={subscriberFilters} 
                    setFilters={setSubscriberFilters} 
                    onApplyFilters={applySubscriberFilters}
                    plans={plans}
                  />
                </div>
              </Card>
              
              <Card>
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Plan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Start Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          End Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Billing
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentSubscribers.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                            No subscribers found matching your criteria.
                          </td>
                        </tr>
                      ) : (
                        currentSubscribers.map((subscriber) => (
                          <tr key={subscriber.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-sm font-medium text-purple-800">
                                    {subscriber.userName.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{subscriber.userName}</div>
                                  <div className="text-sm text-gray-500">{subscriber.userEmail}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs bg-${
                                subscriber.planName === 'Basic' ? 'blue' :
                                subscriber.planName === 'Standard' ? 'purple' :
                                subscriber.planName === 'Premium' ? 'indigo' :
                                'amber'
                              }-100 text-${
                                subscriber.planName === 'Basic' ? 'blue' :
                                subscriber.planName === 'Standard' ? 'purple' :
                                subscriber.planName === 'Premium' ? 'indigo' :
                                'amber'
                              }-800 rounded-full`}>
                                {subscriber.planName}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <StatusBadge status={subscriber.status} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {subscriber.startDate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {subscriber.endDate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className="capitalize">{subscriber.billingCycle}</span>
                              {subscriber.autoRenew && (
                                <span className="ml-2 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded">
                                  Auto Renew
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${subscriber.amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => handleViewUser(subscriber.userId)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                  title="View User"
                                >
                                  <Icon name="view" size={18} />
                                </button>
                                {subscriber.status === 'active' && (
                                  <button
                                    className="text-blue-600 hover:text-blue-900"
                                    title="Manage Subscription"
                                  >
                                    <Icon name="settings" size={18} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  
                  {renderPagination()}
                </div>
              </Card>
            </>
          )}
        </>
      )}
      
      <PlanModal 
        isOpen={isPlanModalOpen} 
        onClose={() => setIsPlanModalOpen(false)} 
        plan={selectedPlan}
        onSave={handlePlanSave}
      />
    </AdminLayout>
  )
}

export default Premium 