import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import AdminLayout from '../../shared/layouts/AdminLayout'
import Icon from '../../shared/components/common/Icon'
import Card from '../../shared/components/common/Card'
import Button from '../../shared/components/common/Button'

// Mock data for demonstration
const MOCK_DATA = {
  stats: {
    totalUsers: 1485,
    premiumUsers: 342,
    readings: 8976,
    forumPosts: 673
  },
  recentUsers: [
    { id: 1, name: 'Nguyen Van A', email: 'nguyena@example.com', joinedAt: '2023-11-10', avatar: '' },
    { id: 2, name: 'Tran Thi B', email: 'tranb@example.com', joinedAt: '2023-11-09', avatar: '' },
    { id: 3, name: 'Le Van C', email: 'lec@example.com', joinedAt: '2023-11-09', avatar: '' },
    { id: 4, name: 'Pham Van D', email: 'phamd@example.com', joinedAt: '2023-11-08', avatar: '' },
    { id: 5, name: 'Hoang Thi E', email: 'hoange@example.com', joinedAt: '2023-11-08', avatar: '' }
  ],
  recentActivities: [
    { id: 1, type: 'reading', user: 'Nguyen Van A', timestamp: '2023-11-10T15:30:00', details: 'Celtic Cross Reading' },
    { id: 2, type: 'forum_post', user: 'Tran Thi B', timestamp: '2023-11-10T14:45:00', details: 'Started new discussion: "Understanding the Fool"' },
    { id: 3, type: 'premium_signup', user: 'Le Van C', timestamp: '2023-11-10T13:20:00', details: 'Subscribed to Premium Standard plan' },
    { id: 4, type: 'reading', user: 'Pham Van D', timestamp: '2023-11-10T12:10:00', details: 'Three Card Spread' },
    { id: 5, type: 'forum_comment', user: 'Hoang Thi E', timestamp: '2023-11-10T11:45:00', details: 'Commented on "The Hidden Meaning of Pentacles"' }
  ],
  charts: {
    userGrowth: [...Array(7)].map((_, i) => ({ 
      date: new Date(Date.now() - (6 - i) * 86400000).toISOString().slice(0, 10),
      users: Math.floor(Math.random() * 30) + 10
    })),
    readingsByType: [
      { type: 'Celtic Cross', count: 345 },
      { type: 'Three Card', count: 523 },
      { type: 'One Card', count: 712 },
      { type: 'Career Path', count: 231 },
      { type: 'Love Reading', count: 389 }
    ]
  }
}

const StatCard = ({ title, value, icon, trend, color }) => {
  return (
    <Card className="flex items-center p-6 bg-gray-800 shadow-lg rounded-lg">
      <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center mr-4`}>
        <Icon name={icon} size={24} className="text-white" />
      </div>
      <div className="flex-1">
        <h3 className="text-gray-400 text-sm">{title}</h3>
        <div className="flex items-center mt-1">
          <span className="text-2xl font-bold text-gray-100">{value.toLocaleString()}</span>
          {trend && (
            <span className={`ml-2 text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
      </div>
    </Card>
  )
}

const ActivityItem = ({ activity }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'reading': return 'cards'
      case 'forum_post': return 'forum'
      case 'forum_comment': return 'comment'
      case 'premium_signup': return 'star'
      default: return 'activity'
    }
  }

  const getColor = (type) => {
    // Dark theme friendly colors
    switch (type) {
      case 'reading': return 'bg-indigo-700/30 text-indigo-300'
      case 'forum_post': return 'bg-green-700/30 text-green-300'
      case 'forum_comment': return 'bg-blue-700/30 text-blue-300'
      case 'premium_signup': return 'bg-yellow-700/30 text-yellow-300'
      default: return 'bg-gray-700/30 text-gray-300'
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex items-start py-3 border-b border-gray-700 last:border-b-0">
      <div className={`w-8 h-8 rounded-full ${getColor(activity.type).split(' ')[0]} flex items-center justify-center mr-3`}>
        <Icon name={getIcon(activity.type)} size={16} className={getColor(activity.type).split(' ')[1]} />
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <span className="font-medium text-gray-200">{activity.user}</span>
          <span className="text-xs text-gray-400">{formatTime(activity.timestamp)}</span>
        </div>
        <p className="text-sm text-gray-400 mt-1">{activity.details}</p>
      </div>
    </div>
  )
}

// Biểu đồ đường cho tăng trưởng người dùng
const UserGrowthChart = ({ data }) => {
  // Tính giá trị tối đa để tỷ lệ biểu đồ
  const maxValue = Math.max(...data.map(item => item.users)) * 1.2;
  
  return (
    <div className="h-64 relative">
      {/* Hiển thị trục Y */}
      <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between text-xs text-gray-400">
        <span>100</span>
        <span>75</span>
        <span>50</span>
        <span>25</span>
        <span>0</span>
      </div>
      
      {/* Hiển thị biểu đồ */}
      <div className="ml-10 h-full flex items-end">
        {data.map((point, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            {/* Thanh biểu đồ */}
            <div 
              className="w-8 bg-indigo-600 hover:bg-indigo-500 transition-all rounded-t"
              style={{ 
                height: `${(point.users / maxValue) * 100}%`,
              }}
              title={`${point.date}: ${point.users} users`}
            ></div>
            
            {/* Nhãn ngày */}
            <span className="text-xs text-gray-400 mt-1">
              {new Date(point.date).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Biểu đồ tròn cho các loại đọc bài
const ReadingTypesChart = ({ data }) => {
  const totalReadings = data.reduce((sum, item) => sum + item.count, 0);
  const colors = [
    'bg-indigo-600', 'bg-purple-600', 'bg-blue-600', 'bg-pink-600', 'bg-green-600'
  ];
  
  return (
    <div className="h-64 flex items-center justify-center">
      <div className="w-full max-w-xs">
        {data.map((item, index) => {
          const percentage = Math.round((item.count / totalReadings) * 100);
          
          return (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-300">{item.type}</span>
                <span className="text-sm text-gray-300">{item.count} ({percentage}%)</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className={`${colors[index % colors.length]} h-2.5 rounded-full`} 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [data, setData] = useState(MOCK_DATA)
  const { user } = useSelector((state) => state.auth)
  const [activeTimeframe, setActiveTimeframe] = useState('week')

  useEffect(() => {
    // In a real application, fetch data from the API here
    // For now, we're using mock data
  }, [])

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Dashboard</h1>
        <p className="text-gray-400">Welcome back, {user?.name || 'Admin'}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Users" 
          value={data.stats.totalUsers} 
          icon="people" 
          trend={5.2} 
          color="bg-blue-600" 
        />
        <StatCard 
          title="Premium Users" 
          value={data.stats.premiumUsers} 
          icon="star" 
          trend={8.1} 
          color="bg-purple-600" 
        />
        <StatCard 
          title="Tarot Readings" 
          value={data.stats.readings} 
          icon="cards" 
          trend={3.4} 
          color="bg-indigo-600" 
        />
        <StatCard 
          title="Forum Posts" 
          value={data.stats.forumPosts} 
          icon="forum" 
          trend={-2.5} 
          color="bg-pink-600" 
        />
      </div>

      {/* Charts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Charts */}
        <div className="lg:col-span-2">
          <Card className="p-6 h-full bg-gray-800 shadow-lg rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-100">User Growth</h2>
              <div className="flex space-x-2">
                {/* Nút chọn khung thời gian */}
                <Button 
                  size="small" 
                  variant={activeTimeframe === 'week' ? 'solidDark' : 'outlineDark'}
                  onClick={() => setActiveTimeframe('week')}
                >
                  Week
                </Button>
                <Button 
                  size="small" 
                  variant={activeTimeframe === 'month' ? 'solidDark' : 'outlineDark'}
                  onClick={() => setActiveTimeframe('month')}
                >
                  Month
                </Button>
                <Button 
                  size="small" 
                  variant={activeTimeframe === 'year' ? 'solidDark' : 'outlineDark'}
                  onClick={() => setActiveTimeframe('year')}
                >
                  Year
                </Button>
              </div>
            </div>
            
            {/* Hiển thị biểu đồ tăng trưởng người dùng */}
            <UserGrowthChart data={data.charts.userGrowth} />
          </Card>
        </div>
        
        {/* Recent Activity */}
        <div>
          <Card className="p-6 h-full bg-gray-800 shadow-lg rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-100">Recent Activity</h2>
              <Button size="small" variant="textDark">View All</Button>
            </div>
            
            <div className="overflow-y-auto max-h-64">
              {data.recentActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Users and Reading Types */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <div className="lg:col-span-2">
          <Card className="p-6 bg-gray-800 shadow-lg rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-100">Recent Users</h2>
              <Button size="small" variant="textDark">View All Users</Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700/50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-purple-700/30 rounded-full flex items-center justify-center mr-3">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                            ) : (
                              <span className="text-sm font-medium text-purple-300">{user.name.charAt(0)}</span>
                            )}
                          </div>
                          <span className="font-medium text-gray-200">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{user.email}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{user.joinedAt}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                        <Button size="small" variant="textDark">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        
        {/* Reading Types */}
        <div>
          <Card className="p-6 h-full bg-gray-800 shadow-lg rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-100">Popular Reading Types</h2>
              <Button size="small" variant="textDark">Details</Button>
            </div>
            
            {/* Hiển thị biểu đồ loại đọc bài */}
            <ReadingTypesChart data={data.charts.readingsByType} />
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Dashboard 