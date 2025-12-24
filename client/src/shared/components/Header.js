import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaChevronDown, FaMoon, FaSun } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/images/logo.png';
import { path } from '../utils/constant';

/**
 * Header component cho ứng dụng
 */
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const location = useLocation();
  
  // Đóng mobile menu khi chuyển trang
  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
  }, [location]);
  
  // Theo dõi scroll để thay đổi style header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tạo lời chào thân thiện theo thời gian
  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) return 'Chào buổi sáng';
      if (hour >= 12 && hour < 18) return 'Chào buổi chiều';
      return 'Chào buổi tối';
    };

    // Kiểm tra nếu đã đăng nhập
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setIsLoggedIn(true);
      setUsername(userData.username || 'bạn');
    }

    setGreeting(getGreeting());
  }, []);
  
  // Toggle mobile menu
  const toggleMenu = () => setIsOpen(!isOpen);
  
  // Toggle dropdown
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Thực hiện chuyển đổi theme ở đây
  };
  
  // Animations
  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.07,
        delayChildren: 0.1,
      },
    },
  };
  
  const menuItemVariants = {
    closed: { opacity: 0, y: -10 },
    open: { opacity: 1, y: 0 },
  };
  
  // Active link style
  const activeClassName = "text-purple-300 font-medium";
  const nonActiveClassName = "text-white hover:text-purple-300";
  
  // Navbar items
  const navItems = [
    { path: path.PUBLIC.HOMEPAGE, label: 'Trang chủ' },
    { path: path.PUBLIC.TAROTREADINGS, label: 'Xem bói Tarot' },
    { path: path.PUBLIC.TAROTCARDS, label: 'Thư viện Tarot' },
    { path: path.PUBLIC.ABOUTPAGE, label: 'Giới thiệu' },
    { path: path.PUBLIC.FORUM, label: 'Diễn đàn' },
  ];
  
  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900/95 shadow-lg backdrop-blur-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={logo} 
              alt="Tarot App" 
              className="h-10 w-auto mr-2" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/40x40/6B46C1/FFFFFF?text=T';
              }}
            />
            <span className="text-white font-bold text-xl">Tarot App</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive ? activeClassName : nonActiveClassName
                }
                end={item.path === '/'}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          
          {/* Auth buttons - desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Dark/Light mode toggle */}
            <button 
              onClick={toggleDarkMode}
              className="text-gray-300 hover:text-purple-300 transition-colors"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>

            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 text-white hover:text-purple-300 transition-colors"
                >
                  <span className="font-medium">{greeting}, {username}</span>
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                    <FaUser className="text-white text-sm" />
                  </div>
                  <FaChevronDown className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg overflow-hidden z-10"
                    >
                      <Link to="/profile" className="block px-4 py-2 text-white hover:bg-gray-700">
                        Trang cá nhân
                      </Link>
                      <Link to="/readings/history" className="block px-4 py-2 text-white hover:bg-gray-700">
                        Lịch sử bói
                      </Link>
                      <div className="border-t border-gray-700"></div>
                      <button className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 flex items-center">
                        <FaSignOutAlt className="mr-2" />
                        <span>Đăng xuất</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-white hover:text-purple-300 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white focus:outline-none" 
            onClick={toggleMenu}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="md:hidden bg-gray-900 shadow-lg"
          >
            <div className="container mx-auto px-4 py-2">
              {isLoggedIn && (
                <motion.div variants={menuItemVariants} className="py-3 px-2 border-b border-gray-800">
                  <p className="text-purple-300 font-medium">{greeting}, {username}</p>
                </motion.div>
              )}
              
              <nav className="flex flex-col space-y-4 py-4">
                {navItems.map((item) => (
                  <motion.div key={item.path} variants={menuItemVariants}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `block py-2 ${isActive ? activeClassName : nonActiveClassName}`
                      }
                      end={item.path === '/'}
                    >
                      {item.label}
                    </NavLink>
                  </motion.div>
                ))}
                
                {/* Dark/Light mode in mobile menu */}
                <motion.div variants={menuItemVariants}>
                  <button
                    onClick={toggleDarkMode}
                    className="flex items-center w-full py-2 text-white hover:text-purple-300"
                  >
                    {darkMode ? <FaSun className="mr-2" /> : <FaMoon className="mr-2" />}
                    <span>{darkMode ? "Chế độ sáng" : "Chế độ tối"}</span>
                  </button>
                </motion.div>
                
                {/* User dropdown in mobile menu */}
                {!isLoggedIn && (
                  <motion.div variants={menuItemVariants}>
                    <div className="relative">
                      <button
                        onClick={toggleDropdown}
                        className="flex items-center w-full py-2 text-white hover:text-purple-300"
                      >
                        <FaUser className="mr-2" />
                        <span>Tài khoản</span>
                        <FaChevronDown className={`ml-2 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      <AnimatePresence>
                        {dropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-2 py-2 w-full bg-gray-800 rounded-md shadow-lg"
                          >
                            <Link 
                              to="/login" 
                              className="block px-4 py-2 text-white hover:bg-gray-700"
                            >
                              Đăng nhập
                            </Link>
                            <Link 
                              to="/register" 
                              className="block px-4 py-2 text-white hover:bg-gray-700"
                            >
                              Đăng ký
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
                
                {/* Logout button for mobile when logged in */}
                {isLoggedIn && (
                  <>
                    <motion.div variants={menuItemVariants}>
                      <Link 
                        to="/profile" 
                        className="block py-2 text-white hover:text-purple-300"
                      >
                        Trang cá nhân
                      </Link>
                    </motion.div>
                    <motion.div variants={menuItemVariants}>
                      <Link 
                        to="/readings/history" 
                        className="block py-2 text-white hover:text-purple-300"
                      >
                        Lịch sử bói
                      </Link>
                    </motion.div>
                    <motion.div variants={menuItemVariants}>
                      <button
                        className="flex items-center w-full py-2 text-white hover:text-purple-300"
                      >
                        <FaSignOutAlt className="mr-2" />
                        <span>Đăng xuất</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header; 