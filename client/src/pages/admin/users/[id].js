import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AdminLayout from '../../../shared/layouts/AdminLayout'
import Button from '../../../shared/components/common/Button'
import Card from '../../../shared/components/common/Card'
import Icon from '../../../shared/components/common/Icon'
import Spinner from '../../../shared/components/common/Spinner'

// Mock data for user details
const MOCK_USER_DETAIL = {
  id: 1,
  name: 'Nguyen Van A',
  email: 'nguyena@example.com',
  phone: '+84 123 456 789',
  joinedAt: '2023-11-10',
  lastLogin: '2023-11-15',
  status: 'active',
  role: 'user',
  premium: true,
  premiumPlan: 'Standard',
  premiumExpiry: '2024-05-10',
  readingsCount: 45,
  journalsCount: 23,
  avatar: '',
  bio: 'Passionate about astrology and tarot reading. I love exploring the mystical world and understanding the connections between different elements.',
  address: '123 Le Loi St, District 1, Ho Chi Minh City, Vietnam',
  birthday: '1992-05-15',
  favoriteCards: ['The Fool', 'The High Priestess', 'The Star'],
  readingHistory: [
    { id: 101, type: 'Celtic Cross', date: '2023-11-15', cards: ['The Fool', 'The Magician', 'The High Priestess'] },
    { id: 102, type: 'Three Card', date: '2023-11-12', cards: ['The Empress', 'The Emperor', 'The Hierophant'] },
    { id: 103, type: 'Career Path', date: '2023-11-08', cards: ['The Lovers', 'The Chariot', 'Strength'] },
    { id: 104, type: 'One Card', date: '2023-11-05', cards: ['The Hermit'] },
    { id: 105, type: 'Love Reading', date: '2023-11-02', cards: ['Wheel of Fortune', 'Justice', 'The Hanged Man'] }
  ],
  journals: [
    { id: 201, title: 'My Spiritual Journey', date: '2023-11-14', content: 'Today I reflected on my spiritual growth over the past year...' },
    { id: 202, title: 'Dreams and Visions', date: '2023-11-10', content: 'I had a vivid dream last night about...' },
    { id: 203, title: 'Tarot Insights', date: '2023-11-07', content: 'The reading today gave me profound insights into...' },
    { id: 204, title: 'Monthly Reflection', date: '2023-11-01', content: 'As I look back on October, I realize...' }
  ],
  premiumHistory: [
    { id: 301, plan: 'Basic', startDate: '2023-05-10', endDate: '2023-08-10', amount: 9.99, status: 'completed' },
    { id: 302, plan: 'Standard', startDate: '2023-08-10', endDate: '2023-11-10', amount: 19.99, status: 'completed' },
    { id: 303, plan: 'Standard', startDate: '2023-11-10', endDate: '2024-05-10', amount: 99.99, status: 'active' }
  ]
}

// Tab component
const TabButton = ({ active, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors duration-150 ${
        active 
          ? 'border-purple-500 text-purple-400' 
          : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
      }`}
    >
      {children}
    </button>
  )
}

// Profile Tab Content
const ProfileTab = ({ user, onUpdateUser, onResetPassword, onToggleSuspend }) => {
  const [formData, setFormData] = useState(user);

  useEffect(() => {
    setFormData(user); // Update form when user prop changes
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUpdateUser(formData); // Pass updated formData
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
      <div className="md:col-span-1">
        <Card className="p-6 bg-gray-800 shadow-lg">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-purple-700/30 rounded-full flex items-center justify-center mb-4">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <span className="text-3xl font-medium text-purple-300">{user.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-100">{user.name}</h2>
            <p className="text-gray-400 mb-4">{user.email}</p>
            <div className="flex space-x-2 mb-4">
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                user.status === 'active' 
                  ? 'bg-green-600/30 text-green-300' 
                  : user.status === 'suspended' 
                    ? 'bg-red-600/30 text-red-300' 
                    : 'bg-gray-600/30 text-gray-300'
              }`}>
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                user.role === 'admin' 
                  ? 'bg-purple-600/30 text-purple-300' 
                  : 'bg-sky-600/30 text-sky-300'
              }`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
              {user.premium && (
                <span className="px-2 py-1 text-xs bg-yellow-600/30 text-yellow-300 rounded-full font-medium">
                  Premium
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400 mb-6">{user.bio}</p>
            <div className="w-full space-y-2">
              <Button variant="outlineDark" fullWidth onClick={onResetPassword}>
                Reset Password
              </Button>
              <Button variant={user.status === 'active' ? 'outlineDark' : 'solidDark'} fullWidth 
                      className={user.status === 'active' ? 'border-red-500 text-red-400 hover:bg-red-500/20' : ''}
                      onClick={onToggleSuspend}
              >
                {user.status === 'active' ? 'Suspend Account' : 'Activate Account'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="md:col-span-2">
        <Card className="p-6 bg-gray-800 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-100 mb-6">Personal Information</h3>
          <div className="space-y-4">
            {[ 
              { label: 'Full Name', name: 'name', type: 'text' },
              { label: 'Email', name: 'email', type: 'email' },
              { label: 'Phone', name: 'phone', type: 'tel' },
              { label: 'Birthday', name: 'birthday', type: 'date' },
              { label: 'Address', name: 'address', type: 'text' },
            ].map(field => (
              <div key={field.name}>
                <label htmlFor={field.name} className="block text-sm font-medium text-gray-300 mb-1">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  id={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-600 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            ))}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
              <textarea
                name="bio"
                id="bio"
                value={formData.bio || ''}
                onChange={handleChange}
                rows={4}
                className="w-full p-2.5 border border-gray-600 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                <select
                  name="role"
                  id="role"
                  value={formData.role || 'user'}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-600 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <select
                  name="status"
                  id="status"
                  value={formData.status || 'active'}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-600 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="solidDark" size="md" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </Card>
        
        <div className="mt-6">
          <Card className="p-6 bg-gray-800 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Account Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[ { label: 'Joined', value: user.joinedAt },
                 { label: 'Last Login', value: user.lastLogin },
                 { label: 'Total Readings', value: user.readingsCount }
              ].map(stat => (
                <div key={stat.label} className="bg-gray-750 p-4 rounded-md">
                  <div className="text-xs text-gray-400 uppercase">{stat.label}</div>
                  <div className="text-lg font-semibold text-gray-100">{stat.value}</div>
                </div>
              ))}
            </div>
            <h4 className="text-md font-medium text-gray-200 mt-6 mb-2">Favorite Cards</h4>
            <div className="flex flex-wrap gap-2">
              {user.favoriteCards.map((card, index) => (
                <span key={index} className="px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-sm font-medium">
                  {card}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Reading History Tab Content
const ReadingHistoryTab = ({ readings }) => {
  return (
    <Card className="mt-4 bg-gray-800 shadow-lg">
      <div className="overflow-x-auto p-1">
        <table className="w-full min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-750">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Reading ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cards Drawn</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {readings.map((reading) => (
              <tr key={reading.id} className="hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">#{reading.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{reading.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{reading.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {reading.cards.join(', ')}
                </td>
              </tr>
            ))}
            {readings.length === 0 && (
              <tr><td colSpan="4" className="text-center py-8 text-gray-400">No reading history available.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

// Journals Tab Content
const JournalsTab = ({ journals }) => {
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {journals.map(journal => (
        <Card key={journal.id} className="bg-gray-800 shadow-lg flex flex-col">
          <div className="p-6 flex-grow">
            <h4 className="text-md font-semibold text-purple-400 mb-1">{journal.title}</h4>
            <p className="text-xs text-gray-500 mb-3">{journal.date}</p>
            <p className="text-sm text-gray-300 leading-relaxed line-clamp-4">{journal.content}</p>
          </div>
          <div className="border-t border-gray-700 p-4 text-right">
            <Button variant="textDark" size="small">Read More</Button>
          </div>
        </Card>
      ))}
      {journals.length === 0 && (
        <p className="col-span-full text-center py-8 text-gray-400">No journal entries found.</p>
      )}
    </div>
  )
}

// Premium Tab Content
const PremiumTab = ({ user, subscriptions }) => {
  return (
    <Card className="mt-4 bg-gray-800 shadow-lg">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-2">Premium Status</h3>
        {user.premium ? (
          <div className="mb-6 p-4 bg-green-600/20 border border-green-500/50 rounded-md">
            <p className="text-green-300 font-medium">Active Premium User</p>
            <p className="text-sm text-green-400">Plan: {user.premiumPlan} (Expires: {user.premiumExpiry})</p>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-yellow-600/20 border border-yellow-500/50 rounded-md">
            <p className="text-yellow-300 font-medium">Not a Premium User</p>
            <Button variant="solidDark" size="sm" className="mt-2">Upgrade to Premium</Button>
          </div>
        )}

        <h3 className="text-lg font-semibold text-gray-100 mb-4">Subscription History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-750">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Subscription ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Plan</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Start Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">End Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {subscriptions.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">#{sub.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{sub.plan}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{sub.startDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{sub.endDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${sub.amount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${ 
                    sub.status === 'active' ? 'bg-green-600/50 text-green-200' : 'bg-gray-600/50 text-gray-200'
                  }`}>
                    {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
            {subscriptions.length === 0 && (
              <tr><td colSpan="6" className="text-center py-8 text-gray-400">No subscription history available.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

// Main User Detail Component
const UserDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    // Simulate API call to get user details
    setTimeout(() => {
      setUser(MOCK_USER_DETAIL)
      setLoading(false)
    }, 500)
  }, [id])

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </AdminLayout>
    )
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="text-center p-8">
          <h2 className="text-xl font-bold text-gray-700">User not found</h2>
          <p className="text-gray-500 mt-2">The user you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button 
            onClick={() => navigate('/admin/users')}
            variant="outline" 
            size="medium"
            className="mt-4"
          >
            Back to Users
          </Button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/admin/users')}
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <Icon name="arrow-left" size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => navigate(`/admin/users/${id}/edit`)}
            variant="outline" 
            size="medium"
          >
            <Icon name="edit" size={18} className="mr-1" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="medium"
            color="red"
          >
            <Icon name="delete" size={18} className="mr-1" />
            Delete
          </Button>
        </div>
      </div>
      
      <div className="mb-6 border-b">
        <div className="flex overflow-x-auto">
          <TabButton 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')}
          >
            <div className="flex items-center">
              <Icon name="user" size={16} className="mr-2" />
              Profile
            </div>
          </TabButton>
          <TabButton 
            active={activeTab === 'readings'} 
            onClick={() => setActiveTab('readings')}
          >
            <div className="flex items-center">
              <Icon name="cards" size={16} className="mr-2" />
              Reading History
            </div>
          </TabButton>
          <TabButton 
            active={activeTab === 'journals'} 
            onClick={() => setActiveTab('journals')}
          >
            <div className="flex items-center">
              <Icon name="journal" size={16} className="mr-2" />
              Journals
            </div>
          </TabButton>
          <TabButton 
            active={activeTab === 'premium'} 
            onClick={() => setActiveTab('premium')}
          >
            <div className="flex items-center">
              <Icon name="star" size={16} className="mr-2" />
              Premium Info
            </div>
          </TabButton>
        </div>
      </div>
      
      <div className="py-4">
        {activeTab === 'profile' && <ProfileTab user={user} />}
        {activeTab === 'readings' && <ReadingHistoryTab readings={user.readingHistory} />}
        {activeTab === 'journals' && <JournalsTab journals={user.journals} />}
        {activeTab === 'premium' && <PremiumTab user={user} subscriptions={user.premiumHistory} />}
      </div>
    </AdminLayout>
  )
}

export default UserDetail 