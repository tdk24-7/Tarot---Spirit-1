// src/containers/Public/Navbar.js
import React, { useState, useRef, useEffect, memo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import LoginForm from '../../features/auth/components/LoginForm';
import RegisterForm from '../../features/auth/components/RegisterForm';
import { path } from '../utils/routes';
import useAuth from '../../features/auth/hook/useAuth';
import { Icon } from '../components/common';

// Tách các menu items thành constant để dễ quản lý
const MAIN_MENU_ITEMS = [
  { to: path.PUBLIC.HOMEPAGE, label: "Trang chủ", protected: false },
  { to: path.PUBLIC.ABOUTPAGE, label: "Về chúng tôi", protected: false },
  { to: path.PUBLIC.TAROTREADINGS, label: "Bói Tarot", protected: true },
  { to: path.PUBLIC.TAROTCARDS, label: "Thư Viện Bài", protected: false },
  { to: path.PUBLIC.DAILYTAROT, label: "Tarot Hàng Ngày", protected: true },
  { to: path.PUBLIC.FORUM, label: "Diễn Đàn", protected: true }
];

const USER_MENU_ITEMS = [
  { to: path.PROTECTED.DASHBOARD, label: "Tổng quan", icon: "📊" },
  { to: path.PROTECTED.PROFILE, label: "Hồ sơ của tôi", icon: "👤" },
  { to: path.PROTECTED.READING_HISTORY, label: "Lịch sử bói bài", icon: "📜" },
  { to: path.PROTECTED.DAILY_JOURNAL, label: "Nhật ký hàng ngày", icon: "📔" },
  { to: path.PROTECTED.PREMIUM_SERVICES, label: "Dịch vụ cao cấp", icon: "✨" }
];

// Admin menu item
const ADMIN_MENU_ITEM = { to: path.ADMIN.DASHBOARD, label: "Quản trị hệ thống", icon: "⚙️" };

// Tách thành các component nhỏ để dễ quản lý
const NavLogo = memo(() => (
  <Link to="/" className="flex items-center gap-2 relative group">
    <div className="relative w-10 h-10 transform group-hover:rotate-12 transition-transform duration-300">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#9370db] to-[#8a2be2] shadow-lg"></div>
      <span className="absolute inset-0.5 flex items-center justify-center bg-[#1a0933] text-[#9370db] text-xl rounded-full">
        T
      </span>
    </div>
    <span className="text-2xl font-bold transition-transform duration-300 tracking-vn-tight">
      <span className="text-white group-hover:text-[#9370db] transition-colors">Tarot</span>
      <span className="text-[#8a2be2]">Spirit</span>
    </span>
  </Link>
));

const NavItem = memo(({ to, label, isProtected, isLoggedIn, onLoginClick }) => {
  if (isProtected && !isLoggedIn) {
    return (
      <button 
        onClick={onLoginClick}
        className="text-white hover:text-[#9370db] transition-colors relative px-2 py-1 group tracking-vn-tight flex items-center"
      >
        {label}
        <Icon name="Lock" size="xs" className="ml-1 text-[#9370db]" />
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#9370db] transition-all duration-300 group-hover:w-full"></span>
      </button>
    );
  }
  
  return (
    <Link 
      to={to} 
      className="text-white hover:text-[#9370db] transition-colors relative px-2 py-1 group tracking-vn-tight"
    >
      {label}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#9370db] transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
});

const UserAvatar = memo(({ userData, showUserMenu, setShowUserMenu }) => {
  // Lấy tên hiển thị từ user data
  const displayName = userData?.profile?.full_name || userData?.username || 'User';
  const initial = displayName.charAt(0).toUpperCase();
  
  return (
    <button 
      onClick={() => setShowUserMenu(!showUserMenu)}
      className="flex items-center gap-2 focus:outline-none group"
    >
      <div className="relative w-10 h-10 transform group-hover:scale-105 transition-transform">
        {userData?.profile?.avatar_url ? (
          <img 
            src={userData.profile.avatar_url} 
            alt={displayName}
            className="absolute inset-0 rounded-full w-full h-full object-cover" 
          />
        ) : (
          <>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#9370db] to-[#8a2be2] shadow-md"></div>
            <span className="absolute inset-0.5 flex items-center justify-center bg-[#1a0933] text-[#9370db] text-xl rounded-full">
              {initial}
            </span>
          </>
        )}
      </div>
      <span className="text-sm font-medium text-white group-hover:text-[#9370db] transition-colors hidden md:block">
        {displayName}
      </span>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white opacity-50 group-hover:text-[#9370db] group-hover:opacity-100 transition-all hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
});

const UserMenu = memo(({ isVisible, userMenuRef, items, onLogout, isAdmin }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div 
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="absolute top-full right-0 mt-2 w-56 rounded-lg shadow-xl bg-white/5 backdrop-blur-sm border border-white/10 z-[1000] overflow-hidden"
        ref={userMenuRef}
      >
        <div className="py-2">
          {items.map((item, index) => (
            <Link 
              key={index}
              to={item.to} 
              className="flex items-center gap-3 px-4 py-2 text-white hover:bg-white/10 transition-colors tracking-vn-tight"
            >
              <span className="text-[#9370db]">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
          {isAdmin && (
            <Link 
              to={ADMIN_MENU_ITEM.to} 
              className="flex items-center gap-3 px-4 py-2 text-white hover:bg-white/10 transition-colors tracking-vn-tight"
            >
              <span className="text-[#9370db]">{ADMIN_MENU_ITEM.icon}</span>
              <span>{ADMIN_MENU_ITEM.label}</span>
            </Link>
          )}
          <div className="border-t border-white/10 my-1"></div>
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors tracking-vn-tight"
          >
            <span className="text-[#9370db]">🚪</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
));

const AuthButtons = memo(({ setShowLogin, setShowRegister }) => (
  <>
    <button 
      onClick={() => setShowLogin(true)}
      className="text-white hover:text-[#9370db] transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5 relative group tracking-vn-tight"
      aria-label="Đăng nhập"
    >
      <span className="relative z-10">Đăng nhập</span>
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#9370db] transition-all duration-300 group-hover:w-full"></span>
    </button>
    <button
      onClick={() => setShowRegister(true)}
      className="bg-gradient-to-r from-[#8a2be2] to-[#9370db] text-white px-4 py-1.5 rounded-lg hover:shadow-lg hover:shadow-[#9370db]/20 transition-all transform hover:-translate-y-0.5 relative overflow-hidden group tracking-vn-tight"
      aria-label="Đăng ký"
    >
      <span className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
      <span className="relative z-10">Đăng ký</span>
    </button>
  </>
));

const MobileMenu = memo(({ isVisible, items, mobileMenuRef, setIsMobileMenuOpen, isLoggedIn, userData, setShowLogin, setShowRegister, userMenuItems, onLogout, isAdmin }) => {
  // Lấy tên hiển thị và email từ user data
  const displayName = userData?.profile?.full_name || userData?.username || 'User';
  const email = userData?.email || '';
  const initial = displayName.charAt(0).toUpperCase();
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          ref={mobileMenuRef}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white/5 border-t border-white/10 overflow-hidden"
        >
          <div className="container mx-auto px-4 py-4">
            {isLoggedIn && (
              <div className="bg-white/5 backdrop-blur p-4 rounded-lg border border-white/10 mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14">
                    {userData?.profile?.avatar_url ? (
                      <img 
                        src={userData.profile.avatar_url} 
                        alt={displayName}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    ) : (
                      <>
                        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#9370db] to-[#8a2be2] flex items-center justify-center">
                          <span className="text-white text-2xl font-medium">{initial}</span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-white">{displayName}</h3>
                    <p className="text-sm text-gray-400">{email}</p>
                  </div>
                </div>
              </div>
            )}
            
            <nav className="flex flex-col gap-3">
              {items.map((item, index) => {
                if (item.protected && !isLoggedIn) {
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setShowLogin(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 p-2 text-white hover:bg-white/10 rounded-lg transition-colors tracking-vn-tight"
                    >
                      <span className="w-6 text-center text-[#9370db]">{item.icon}</span>
                      <span>{item.label}</span>
                      <Icon name="Lock" size="xs" className="ml-1 text-[#9370db]" />
                    </button>
                  );
                }
                return (
                  <Link 
                    key={index} 
                    to={item.to} 
                    className="flex items-center gap-3 p-2 text-white hover:bg-white/10 rounded-lg transition-colors tracking-vn-tight"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="w-6 text-center text-[#9370db]">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            
            {isLoggedIn ? (
              <>
                <div className="border-t border-white/10 my-3"></div>
                <div className="text-sm text-gray-400 mb-2 px-2 tracking-vn-tight">Tùy chọn người dùng</div>
                <nav className="flex flex-col gap-2">
                  {userMenuItems.map((item, index) => (
                    <Link 
                      key={index} 
                      to={item.to} 
                      className="flex items-center gap-3 p-2 text-white hover:bg-white/10 rounded-lg transition-colors tracking-vn-tight"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="w-6 text-center text-[#9370db]">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  {isAdmin && (
                    <Link 
                      to={ADMIN_MENU_ITEM.to} 
                      className="flex items-center gap-3 p-2 text-white hover:bg-white/10 rounded-lg transition-colors tracking-vn-tight"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="w-6 text-center text-[#9370db]">{ADMIN_MENU_ITEM.icon}</span>
                      <span>{ADMIN_MENU_ITEM.label}</span>
                    </Link>
                  )}
                  <button 
                    onClick={() => {
                      onLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 p-2 text-white hover:bg-white/10 rounded-lg transition-colors tracking-vn-tight text-left"
                  >
                    <span className="w-6 text-center text-[#9370db]">🚪</span>
                    <span>Đăng xuất</span>
                  </button>
                </nav>
              </>
            ) : (
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/10">
                <button 
                  onClick={() => {
                    setShowLogin(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors tracking-vn-tight"
                >
                  <Icon 
                    name="User" 
                    size="sm" 
                    className="text-[#9370db]" 
                  />
                  <span>Đăng nhập</span>
                </button>
                <button 
                  onClick={() => {
                    setShowRegister(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 p-2 bg-gradient-to-r from-[#8a2be2] to-[#9370db] text-white rounded-lg tracking-vn-tight"
                >
                  <Icon 
                    name="UserPlus" 
                    size="sm" 
                  />
                  <span>Đăng ký</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// Main Navbar component
const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { user } = useSelector(state => state.auth);
  const { logout } = useAuth();
  
  const isLoggedIn = !!user;
  const userData = user;
  const isAdmin = userData?.role === 'admin';
  
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Ngăn cuộn trang khi mobile menu mở
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Xử lý đăng xuất
  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  // Modified mobile menu items with icon and protected status
  const mobileMenuItems = MAIN_MENU_ITEMS.map((item, index) => ({
    ...item,
    icon: ["🏠", "ℹ️", "🔮", "🤖", "🃏", "📆", "💬"][index]
  }));

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  return (
    <header className="w-full bg-gradient-to-b from-[#1a0933] to-[#150726] py-4 border-b border-[#3a1c5a] sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <NavLogo />

        <nav className="hidden md:flex gap-6">
          {MAIN_MENU_ITEMS.map((item, index) => (
            <NavItem 
              key={index} 
              to={item.to} 
              label={item.label} 
              isProtected={item.protected}
              isLoggedIn={isLoggedIn}
              onLoginClick={handleLoginClick}
            />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="relative z-[100]">
              <UserAvatar 
                userData={userData} 
                showUserMenu={showUserMenu} 
                setShowUserMenu={setShowUserMenu} 
              />
              <UserMenu 
                isVisible={showUserMenu} 
                userMenuRef={userMenuRef} 
                items={USER_MENU_ITEMS}
                onLogout={handleLogout}
                isAdmin={isAdmin}
              />
            </div>
          ) : (
            <AuthButtons 
              setShowLogin={setShowLogin}
              setShowRegister={setShowRegister}
            />
          )}
          
          {/* Mobile menu button */}
          <button
            className="md:hidden flex items-center p-2 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center relative">
              <span className={`block w-5 h-0.5 bg-white absolute transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'}`}></span>
              <span className={`block w-5 h-0.5 bg-white absolute transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`block w-5 h-0.5 bg-white absolute transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'}`}></span>
            </div>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <MobileMenu 
        isVisible={isMobileMenuOpen}
        items={mobileMenuItems}
        mobileMenuRef={mobileMenuRef}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isLoggedIn={isLoggedIn}
        userData={userData}
        setShowLogin={setShowLogin}
        setShowRegister={setShowRegister}
        userMenuItems={USER_MENU_ITEMS}
        onLogout={handleLogout}
        isAdmin={isAdmin}
      />

      <AnimatePresence>
        {showLogin && (
          <LoginForm 
            onClose={() => setShowLogin(false)} 
            onSwitchToRegister={() => {
              setShowLogin(false);
              setShowRegister(true);
            }}
          />
        )}
        {showRegister && (
          <RegisterForm 
            onClose={() => setShowRegister(false)} 
            onSwitchToLogin={() => {
              setShowRegister(false);
              setShowLogin(true);
            }}
          />
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;