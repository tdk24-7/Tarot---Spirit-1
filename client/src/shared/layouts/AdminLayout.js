import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { logoutUser } from '../../features/auth/slices/authSlice'
import Icon from '../components/common/Icon'

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation()
  
  const menuItems = [
    { title: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard' },
    { title: 'User Management', icon: 'people', path: '/admin/users' },
    { title: 'Tarot Cards', icon: 'cards', path: '/admin/tarot' },
    { title: 'Premium Services', icon: 'star', path: '/admin/premium' },
    { title: 'Forum Management', icon: 'forum', path: '/admin/forum' },
    { title: 'Reports', icon: 'alert-circle', path: '/admin/reports' },
    { title: 'Analytics', icon: 'bar-chart-2', path: '/admin/analytics' },
    { title: 'System Settings', icon: 'settings', path: '/admin/settings' },
  ]

  return (
    <div className={`fixed left-0 top-0 h-screen bg-gray-800 text-gray-200 transition-all duration-300 z-20 
                     ${isOpen ? 'w-64' : 'w-16'}`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
        {isOpen ? (
          <h1 className="text-xl font-bold text-white">Tarot Admin</h1>
        ) : (
          <span className="text-xl font-bold text-white">TA</span>
        )}
        <button 
          onClick={toggleSidebar}
          className="text-gray-300 hover:bg-gray-700 rounded-full p-1"
        >
          <Icon name={isOpen ? 'chevron-left' : 'chevron-right'} size={24} />
        </button>
      </div>
      
      <nav className="mt-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.title}>
              <Link
                to={item.path}
                className={`flex items-center py-3 px-4 text-gray-300 ${
                  location.pathname === item.path 
                    ? 'bg-purple-600 text-white' 
                    : 'hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon name={item.icon} size={20} />
                {isOpen && <span className="ml-4">{item.title}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

const Header = ({ isOpen }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/login')
  }

  return (
    <header className={`fixed top-0 right-0 h-16 bg-gray-800 border-b border-gray-700 z-10 transition-all
                        ${isOpen ? 'left-64' : 'left-16'}`}>
      <div className="h-full flex items-center justify-between px-6">
        <div className="text-xl font-semibold text-gray-100">Admin Panel</div>
        
        <div className="flex items-center">
          <div className="relative mr-4">
            <button className="p-2 text-gray-300 hover:bg-gray-700 rounded-full">
              <Icon name="notifications" size={20} />
            </button>
          </div>
          
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white mr-2">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="hidden md:block mr-4">
              <div className="text-sm font-medium text-gray-200">{user?.name || 'Admin'}</div>
              <div className="text-xs text-gray-400">{user?.email || 'admin@example.com'}</div>
            </div>
            <button 
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500"
            >
              <Icon name="logout" size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (!isAuthenticated || !(user?.isAdmin || user?.role === 'admin')) {
      navigate('/login')
    }
  }, [isAuthenticated, user, navigate])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Header isOpen={sidebarOpen} />
      
      <main className={`pt-16 transition-all ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}

export default AdminLayout 