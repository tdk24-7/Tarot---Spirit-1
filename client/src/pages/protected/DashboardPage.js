import React, { memo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '../../shared/ui/NavBar';
import Footer from '../../shared/ui/Footer';
import { useSelector } from 'react-redux';

// Components
const SectionTitle = memo(({ title, subtitle, centered = false, light = true }) => (
  <div className={`mb-6 ${centered ? 'text-center' : ''}`}>
    <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${light ? 'text-white' : 'text-[#9370db]'} tracking-vn-tight`}>
      {title}
      <span className="block h-1 w-16 bg-gradient-to-r from-[#9370db] to-[#8a2be2] mt-2 rounded-full"></span>
    </h2>
    {subtitle && <p className={`${light ? 'text-gray-300' : 'text-gray-600'} text-sm tracking-vn-tight leading-vn`}>{subtitle}</p>}
  </div>
));

const StatCard = memo(({ title, value, icon, trend = null, color = 'purple' }) => {
  const colors = {
    purple: 'from-[#9370db] to-[#8a2be2]',
    blue: 'from-[#4158D0] to-[#C850C0]',
    green: 'from-[#43e97b] to-[#38f9d7]',
    orange: 'from-[#fa709a] to-[#fee140]'
  };
  
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-purple-900/20 p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${colors[color]} flex items-center justify-center`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            <span className="mr-1">{trend > 0 ? '+' : ''}{trend}%</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 ${trend > 0 ? 'transform rotate-0' : 'transform rotate-180'}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </div>
        )}
      </div>
      <p className="text-white text-2xl md:text-3xl font-bold mb-1 tracking-vn-tight">{value}</p>
      <p className="text-gray-400 text-sm tracking-vn-tight">{title}</p>
    </div>
  );
});

const RecentActivityItem = memo(({ type, description, time, icon, iconColor }) => (
  <div className="flex items-start py-3 border-b border-purple-900/20 last:border-0">
    <div className={`w-8 h-8 rounded-full flex-shrink-0 bg-${iconColor}-500/20 flex items-center justify-center mr-3`}>
      {icon}
    </div>
    <div className="flex-grow">
      <div className="flex justify-between items-start mb-1">
        <p className="text-white text-sm font-medium tracking-vn-tight">{type}</p>
        <span className="text-gray-400 text-xs tracking-vn-tight">{time}</span>
      </div>
      <p className="text-gray-300 text-xs tracking-vn-tight">{description}</p>
    </div>
  </div>
));

const ChartCard = memo(({ title, children }) => (
  <div className="bg-white/5 backdrop-blur-sm border border-purple-900/20 p-6 rounded-xl">
    <h3 className="text-white text-lg font-bold mb-6 tracking-vn-tight">{title}</h3>
    {children}
  </div>
));

// Simple chart component - placeholder for real charts
const SimpleBarChart = memo(() => (
  <div className="space-y-2">
    {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, index) => {
      const height = [60, 30, 80, 45, 65, 85, 40][index];
      return (
        <div key={index} className="flex items-end">
          <div className="w-10 text-xs text-gray-400">{day}</div>
          <div 
            className="h-3 bg-gradient-to-r from-[#9370db] to-[#8a2be2] rounded-sm transition-all duration-300 hover:opacity-80"
            style={{ width: `${height}%` }}
          ></div>
          <div className="ml-2 text-xs text-gray-400">{height/10}</div>
        </div>
      );
    })}
  </div>
));

const SimplePieChart = memo(() => (
  <div className="relative w-full h-40 flex items-center justify-center">
    <svg viewBox="0 0 36 36" className="w-full h-full">
      <path
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        stroke="#8a2be2"
        strokeWidth="3"
        strokeDasharray="75, 100"
      />
      <path
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        stroke="#4158D0"
        strokeWidth="3"
        strokeDasharray="20, 100"
        strokeDashoffset="-75"
      />
      <path
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        stroke="#43e97b"
        strokeWidth="3"
        strokeDasharray="5, 100"
        strokeDashoffset="-95"
      />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <p className="text-xs text-gray-400">Tổng cộng</p>
        <p className="text-2xl font-bold text-white">25</p>
      </div>
    </div>
  </div>
));

// Decorative Elements
const MysticBackground = memo(() => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className="absolute top-20 right-[10%] w-64 h-64 bg-[#9370db]/10 rounded-full filter blur-[80px] animate-pulse-slow"></div>
    <div className="absolute bottom-40 left-[15%] w-72 h-72 bg-[#8a2be2]/10 rounded-full filter blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
    <div className="absolute top-[40%] left-[30%] w-2 h-2 bg-white rounded-full animate-twinkle"></div>
    <div className="absolute top-[20%] right-[25%] w-2 h-2 bg-white rounded-full animate-twinkle" style={{ animationDelay: '1s' }}></div>
    <div className="absolute bottom-[30%] right-[40%] w-2 h-2 bg-white rounded-full animate-twinkle" style={{ animationDelay: '2s' }}></div>
  </div>
));

const DashboardPage = () => {
  const { user } = useSelector(state => state.auth);
  const displayName = user?.profile?.full_name || user?.username || 'User';
  
  const recentActivities = [
    { 
      type: "Xem bói Tarot Tình Yêu", 
      description: "Bạn đã hoàn thành phiên xem bói Tình Yêu", 
      time: "10 phút trước", 
      icon: "❤️", 
      iconColor: "red" 
    },
    { 
      type: "Đạt được thành tựu", 
      description: "Bạn đã đạt được thành tựu 'Nhà Khám Phá' cấp độ 1", 
      time: "3 giờ trước", 
      icon: "🏆", 
      iconColor: "yellow" 
    },
    { 
      type: "Cập nhật hồ sơ", 
      description: "Bạn đã cập nhật thông tin hồ sơ cá nhân", 
      time: "Hôm qua", 
      icon: "👤", 
      iconColor: "blue" 
    },
    { 
      type: "Xem bói Tarot Hàng Ngày", 
      description: "Bạn đã xem lá bài Tarot Hàng Ngày", 
      time: "Hôm qua", 
      icon: "🔮", 
      iconColor: "purple" 
    },
    { 
      type: "Bình luận", 
      description: "Bạn đã bình luận trong diễn đàn 'Ý nghĩa lá The Fool'", 
      time: "1 tuần trước", 
      icon: "💬", 
      iconColor: "green" 
    }
  ];
  
  const upcomingEvents = [
    {
      title: "Horoscope Tháng 4",
      date: "01/04/2023",
      description: "Dự đoán tổng quan cho tháng 4/2023 theo các chòm sao"
    },
    {
      title: "Bài Tarot mới",
      date: "15/04/2023",
      description: "Bộ bài Tarot mới sẽ được thêm vào thư viện"
    },
    {
      title: "Webinar Tarot",
      date: "25/04/2023",
      description: "Hướng dẫn đọc và hiểu các lá bài Major Arcana"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0933] to-[#0f051d] text-white relative overflow-hidden">
      <Helmet>
        <title>Tổng Quan | Bói Tarot</title>
        <meta name="description" content="Tổng quan về tài khoản và hoạt động của bạn trên Bói Tarot" />
      </Helmet>
      
      <MysticBackground />
      <Navbar />
      
      {/* Dashboard Content */}
      <section className="relative pt-32 pb-16 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl relative z-10">
          {/* Header with greeting */}
          <div className="mb-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-vn-tight mb-1">
                  Xin chào, {displayName}
                </h1>
                <p className="text-gray-300 tracking-vn-tight leading-vn">
                  Chào mừng trở lại! Đây là tổng quan về tài khoản của bạn.
                </p>
              </div>
              <div className="flex gap-3">
                <Link 
                  to="/tarot-readings" 
                  className="bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-shadow tracking-vn-tight"
                >
                  Xem bói mới
                </Link>
                <Link 
                  to="/profile" 
                  className="bg-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors tracking-vn-tight"
                >
                  Hồ sơ
                </Link>
              </div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard 
              title="Lần xem bói" 
              value="25"
              icon="🔮"
              trend={8}
              color="purple"
            />
            
            <StatCard 
              title="Lá bài đã xem" 
              value="78"
              icon="🃏"
              trend={15}
              color="blue"
            />
            
            <StatCard 
              title="Thành tựu" 
              value="4"
              icon="🏆"
              trend={0}
              color="green"
            />
            
            <StatCard 
              title="Bài viết" 
              value="5"
              icon="📝"
              trend={-5}
              color="orange"
            />
          </div>
          
          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Charts */}
            <div className="lg:col-span-2 space-y-6">
              <ChartCard title="Hoạt động trong tuần">
                <div className="mt-4">
                  <SimpleBarChart />
                </div>
              </ChartCard>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChartCard title="Loại bói phổ biến">
                  <SimplePieChart />
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="flex items-center text-xs">
                      <span className="block w-3 h-3 rounded-full bg-[#8a2be2] mr-2"></span>
                      <span className="text-gray-300">Tình yêu</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <span className="block w-3 h-3 rounded-full bg-[#4158D0] mr-2"></span>
                      <span className="text-gray-300">Sự nghiệp</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <span className="block w-3 h-3 rounded-full bg-[#43e97b] mr-2"></span>
                      <span className="text-gray-300">Khác</span>
                    </div>
                  </div>
                </ChartCard>
                
                <ChartCard title="Thành tựu sắp đạt được">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-300">Chiêm tinh học cấp 2</span>
                        <span className="text-gray-300">70%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#9370db] to-[#8a2be2] rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-300">Hiền triết cấp 2</span>
                        <span className="text-gray-300">45%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#4158D0] to-[#C850C0] rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-300">Cộng đồng cấp 2</span>
                        <span className="text-gray-300">25%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#43e97b] to-[#38f9d7] rounded-full" style={{ width: '25%' }}></div>
                      </div>
                    </div>
                  </div>
                </ChartCard>
              </div>
            </div>
            
            {/* Right Column - Activity & Events */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <div className="bg-white/5 backdrop-blur-sm border border-purple-900/20 p-6 rounded-xl">
                <SectionTitle 
                  title="Hoạt động gần đây" 
                  subtitle="Các hoạt động mới nhất của bạn"
                />
                
                <div className="space-y-0">
                  {recentActivities.map((activity, index) => (
                    <RecentActivityItem 
                      key={index}
                      type={activity.type}
                      description={activity.description}
                      time={activity.time}
                      icon={activity.icon}
                      iconColor={activity.iconColor}
                    />
                  ))}
                </div>
              </div>
              
              {/* Upcoming Events */}
              <div className="bg-white/5 backdrop-blur-sm border border-purple-900/20 p-6 rounded-xl">
                <SectionTitle 
                  title="Sự kiện sắp tới" 
                  subtitle="Những cập nhật và sự kiện sắp diễn ra"
                />
                
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="bg-white/5 backdrop-blur-sm border border-purple-900/20 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-medium tracking-vn-tight">{event.title}</h4>
                        <span className="text-xs px-2 py-1 rounded-full bg-[#9370db]/20 text-[#9370db] tracking-vn-tight">{event.date}</span>
                      </div>
                      <p className="text-sm text-gray-300 tracking-vn-tight">{event.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default memo(DashboardPage); 