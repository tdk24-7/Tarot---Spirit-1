import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../shared/layouts/AdminLayout'
import Button from '../../shared/components/common/Button'
import Card from '../../shared/components/common/Card'
import SearchBar from '../../shared/components/common/SearchBar'
import Icon from '../../shared/components/common/Icon'
import Spinner from '../../shared/components/common/Spinner'

// Mock data for demonstration
const MOCK_USERS = [
  { 
    id: 1, 
    name: 'Nguyen Van A', 
    email: 'nguyena@example.com', 
    joinedAt: '2023-10-15', 
    status: 'active',
    role: 'user',
    readings: 15,
    premium: false,
    lastLogin: '2023-11-09T15:45:22'
  },
  { 
    id: 2, 
    name: 'Tran Thi B', 
    email: 'tranb@example.com', 
    joinedAt: '2023-10-20', 
    status: 'active',
    role: 'premium',
    readings: 32,
    premium: true,
    lastLogin: '2023-11-10T08:12:45'
  },
  { 
    id: 3, 
    name: 'Le Van C', 
    email: 'lec@example.com', 
    joinedAt: '2023-09-05', 
    status: 'inactive',
    role: 'user',
    readings: 5,
    premium: false,
    lastLogin: '2023-10-25T11:30:10'
  },
  {
    id: 4, 
    name: 'Pham Van D', 
    email: 'phamd@example.com', 
    joinedAt: '2023-11-01', 
    status: 'banned',
    role: 'user',
    readings: 0,
    premium: false,
    lastLogin: '2023-11-02T09:45:37'
  },
  {
    id: 5, 
    name: 'Hoang Thi E', 
    email: 'hoange@example.com', 
    joinedAt: '2023-10-10', 
    status: 'active',
    role: 'premium',
    readings: 28,
    premium: true,
    lastLogin: '2023-11-10T14:22:18'
  },
  {
    id: 6, 
    name: 'Vu Van F', 
    email: 'vuf@example.com', 
    joinedAt: '2023-09-18', 
    status: 'active',
    role: 'admin',
    readings: 42,
    premium: true,
    lastLogin: '2023-11-10T16:05:33'
  },
  {
    id: 7, 
    name: 'Dang Thi G', 
    email: 'dangg@example.com', 
    joinedAt: '2023-08-30', 
    status: 'active',
    role: 'user',
    readings: 10,
    premium: false,
    lastLogin: '2023-11-08T12:15:56'
  },
  {
    id: 8, 
    name: 'Bui Van H', 
    email: 'buih@example.com', 
    joinedAt: '2023-07-22', 
    status: 'inactive',
    role: 'user',
    readings: 3,
    premium: false,
    lastLogin: '2023-10-15T10:40:22'
  },
  {
    id: 9, 
    name: 'Ngo Thi I', 
    email: 'ngoi@example.com', 
    joinedAt: '2023-11-02', 
    status: 'active',
    role: 'premium',
    readings: 8,
    premium: true,
    lastLogin: '2023-11-09T20:12:47'
  },
  {
    id: 10, 
    name: 'Duong Van K', 
    email: 'duongk@example.com', 
    joinedAt: '2023-10-05', 
    status: 'active',
    role: 'user',
    readings: 12,
    premium: false,
    lastLogin: '2023-11-07T18:30:15'
  }
]

// Filters component for user filtering
const UserFilters = ({ filters, setFilters, onApplyFilters }) => {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({
      status: 'all',
      premium: 'all',
      role: 'all'
    })
  }

  return (
    <div className="mb-6 flex flex-wrap gap-4 items-center p-4 bg-gray-800 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="py-2 px-3 border border-gray-600 bg-gray-700 text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="banned">Banned</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Premium</label>
        <select
          value={filters.premium}
          onChange={(e) => handleFilterChange('premium', e.target.value)}
          className="py-2 px-3 border border-gray-600 bg-gray-700 text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
        >
          <option value="all">All Users</option>
          <option value="true">Premium</option>
          <option value="false">Free</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
        <select
          value={filters.role}
          onChange={(e) => handleFilterChange('role', e.target.value)}
          className="py-2 px-3 border border-gray-600 bg-gray-700 text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
        >
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="premium">Premium</option>
        </select>
      </div>
      
      <div className="flex items-end space-x-2 pt-5">
        <Button 
          onClick={onApplyFilters}
          variant="solidDark" 
          size="md"
        >
          Apply Filters
        </Button>
        <Button 
          onClick={resetFilters}
          variant="outlineDark" 
          size="md"
        >
          Reset
        </Button>
      </div>
    </div>
  )
}

// User modal for adding/editing users
const UserModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    status: 'active',
    premium: false,
    premiumPlan: '',
    premiumExpiry: ''
  })
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'user',
        status: user.status || 'active',
        premium: user.premium || false,
        premiumPlan: user.premiumPlan || '',
        premiumExpiry: user.premiumExpiry || ''
      })
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'user',
        status: 'active',
        premium: false,
        premiumPlan: '',
        premiumExpiry: ''
      })
    }
  }, [user])
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ ...user, ...formData })
    onClose()
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <Card className="bg-gray-800 w-full max-w-lg shadow-xl rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-100 mb-6">{user ? 'Edit User' : 'Add New User'}</h2>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-300">Role</label>
                <select
                  name="role"
                  id="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-300">Status</label>
                <select
                  name="status"
                  id="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="banned">Banned</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="premium"
                  id="premium"
                  checked={formData.premium}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600 border-gray-500 rounded focus:ring-purple-500"
                />
                <label htmlFor="premium" className="ml-2 block text-sm text-gray-300">Premium User</label>
              </div>
              {formData.premium && (
                <>
                  <div>
                    <label htmlFor="premiumPlan" className="block text-sm font-medium text-gray-300">Premium Plan</label>
                    <input
                      type="text"
                      name="premiumPlan"
                      id="premiumPlan"
                      value={formData.premiumPlan}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="premiumExpiry" className="block text-sm font-medium text-gray-300">Premium Expiry</label>
                    <input
                      type="date"
                      name="premiumExpiry"
                      id="premiumExpiry"
                      value={formData.premiumExpiry}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="bg-gray-750 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
            <Button type="button" onClick={onClose} variant="outlineDark">
              Cancel
            </Button>
            <Button type="submit" variant="solidDark">
              {user ? 'Save Changes' : 'Add User'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

// Main Users Component
const Users = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    status: 'all',
    premium: 'all',
    role: 'all'
  })
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 8
  
  useEffect(() => {
    // Simulate API call to get users
    setTimeout(() => {
      setUsers(MOCK_USERS)
      setFilteredUsers(MOCK_USERS)
      setLoading(false)
    }, 500)
  }, [])
  
  // Filter users based on search query and filters
  const applyFilters = () => {
    let filtered = [...users]
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        user => 
          user.name.toLowerCase().includes(query) || 
          user.email.toLowerCase().includes(query)
      )
    }
    
    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(user => user.status === filters.status)
    }
    
    // Apply premium filter
    if (filters.premium !== 'all') {
      const isPremium = filters.premium === 'true'
      filtered = filtered.filter(user => user.premium === isPremium)
    }
    
    // Apply role filter
    if (filters.role !== 'all') {
      filtered = filtered.filter(user => user.role === filters.role)
    }
    
    setFilteredUsers(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }
  
  useEffect(() => {
    if (!loading) {
      applyFilters()
    }
  }, [searchQuery, loading])
  
  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  
  // Handle adding/editing users
  const openAddUserModal = () => {
    setSelectedUser(null)
    setIsModalOpen(true)
  }
  
  const openEditUserModal = (user) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }
  
  const handleUserSave = (userData) => {
    if (selectedUser) {
      // Update existing user
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id ? userData : user
      )
      setUsers(updatedUsers)
      setFilteredUsers(updatedUsers)
    } else {
      // Add new user
      const newUser = {
        id: users.length + 1,
        ...userData,
        joinedAt: new Date().toISOString().slice(0, 10),
        lastLogin: '-',
        readingsCount: 0
      }
      setUsers([...users, newUser])
      setFilteredUsers([...filteredUsers, newUser])
    }
    setIsModalOpen(false)
  }
  
  // View user details
  const handleViewUser = (userId) => {
    navigate(`/admin/users/${userId}`)
  }
  
  const handleResetPassword = (userId) => {
    // In a real app, this would call an API to reset the password
    alert(`Password reset link sent to user ${userId}`)
  }
  
  // Render pagination controls
  const renderPagination = () => {
    return (
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
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
  
  // Status badge component
  const StatusBadge = ({ status }) => {
    let bgColor = 'bg-gray-100 text-gray-600'
    
    if (status === 'active') {
      bgColor = 'bg-green-100 text-green-800'
    } else if (status === 'inactive') {
      bgColor = 'bg-gray-100 text-gray-800'
    } else if (status === 'banned') {
      bgColor = 'bg-red-100 text-red-800'
    }
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${bgColor}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }
  
  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">User Management</h1>
          <p className="text-gray-600">View, add, edit, and manage users</p>
        </div>
        <Button 
          onClick={openAddUserModal}
          variant="solidDark" 
          size="medium"
        >
          <Icon name="add" size={18} className="mr-1" />
          Add User
        </Button>
      </div>
      
      <Card className="mb-6">
        <div className="p-4">
          <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by name or email"
              className="md:w-1/3"
            />
          </div>
          
          <UserFilters 
            filters={filters} 
            setFilters={setFilters} 
            onApplyFilters={applyFilters}
          />
        </div>
      </Card>
      
      <Card>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Spinner size="lg" color="text-purple-400" />
            </div>
          ) : (
            <>
              <table className="min-w-full table-auto">
                <thead className="bg-gray-750">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Premium
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Readings
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {currentUsers.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center text-gray-400">
                        No users found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    currentUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                              {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                              ) : (
                                <span className="text-sm font-medium text-purple-800">{user.name.charAt(0)}</span>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-100">{user.name}</div>
                              <div className="text-sm text-gray-400">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={user.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {user.role === 'admin' ? (
                            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                              Admin
                            </span>
                          ) : user.role === 'premium' ? (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              Premium
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              User
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {user.premium ? (
                            <div>
                              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full mr-1">
                                {user.premiumPlan}
                              </span>
                              <div className="text-xs text-gray-500 mt-1">Until {user.premiumExpiry}</div>
                            </div>
                          ) : (
                            <span className="text-gray-500">Free</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {user.readings}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {user.joinedAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {user.lastLogin}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleViewUser(user.id)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="View User"
                            >
                              <Icon name="view" size={18} />
                            </button>
                            <button
                              onClick={() => openEditUserModal(user)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit User"
                            >
                              <Icon name="edit" size={18} />
                            </button>
                            <button
                              onClick={() => handleResetPassword(user.id)}
                              className="text-orange-600 hover:text-orange-900"
                              title="Reset Password"
                            >
                              <Icon name="key" size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              
              {renderPagination()}
            </>
          )}
        </div>
      </Card>
      
      <UserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        user={selectedUser}
        onSave={handleUserSave}
      />
    </AdminLayout>
  )
}

export default Users 