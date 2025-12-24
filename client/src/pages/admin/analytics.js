import React, { useState, useEffect } from 'react';
import AdminLayout from '../../shared/layouts/AdminLayout';
import Card from '../../shared/components/common/Card';
import Icon from '../../shared/components/common/Icon';
import Button from '../../shared/components/common/Button';
import Spinner from '../../shared/components/common/Spinner';

// Dữ liệu mẫu
const MOCK_DATA = {
  overviewStats: {
    totalUsers: 2485,
    activeUsers: 1875,
    premiumUsers: 642,
    totalReadings: 18756,
    averageReadingsPerUser: 7.5,
    dailyActiveUsers: 756,
    conversionRate: 25.8,
    revenue: 22680
  },
  userStats: {
    userGrowth: [
      { month: 'T5/2023', users: 1850 },
      { month: 'T6/2023', users: 1920 },
      { month: 'T7/2023', users: 2050 },
      { month: 'T8/2023', users: 2120 },
      { month: 'T9/2023', users: 2280 },
      { month: 'T10/2023', users: 2350 },
      { month: 'T11/2023', users: 2485 }
    ],
    premiumGrowth: [
      { month: 'T5/2023', users: 350 },
      { month: 'T6/2023', users: 385 },
      { month: 'T7/2023', users: 420 },
      { month: 'T8/2023', users: 480 },
      { month: 'T9/2023', users: 530 },
      { month: 'T10/2023', users: 590 },
      { month: 'T11/2023', users: 642 }
    ],
    usersByDevice: [
      { device: 'Mobile', users: 1689, percentage: 68 },
      { device: 'Desktop', users: 671, percentage: 27 },
      { device: 'Tablet', users: 125, percentage: 5 }
    ],
    usersByAge: [
      { ageGroup: '18-24', users: 472, percentage: 19 },
      { ageGroup: '25-34', users: 770, percentage: 31 },
      { ageGroup: '35-44', users: 596, percentage: 24 },
      { ageGroup: '45-54', users: 347, percentage: 14 },
      { ageGroup: '55+', users: 300, percentage: 12 }
    ]
  },
  readingStats: {
    readingsTrend: [
      { month: 'T5/2023', count: 12500 },
      { month: 'T6/2023', count: 13200 },
      { month: 'T7/2023', count: 14100 },
      { month: 'T8/2023', count: 15300 },
      { month: 'T9/2023', count: 16400 },
      { month: 'T10/2023', count: 17500 },
      { month: 'T11/2023', count: 18756 }
    ],
    popularReadingTypes: [
      { type: 'Celtic Cross', count: 4521, percentage: 24.1 },
      { type: 'Three Card', count: 5832, percentage: 31.1 },
      { type: 'One Card', count: 6248, percentage: 33.3 },
      { type: 'Career Path', count: 1253, percentage: 6.7 },
      { type: 'Love Reading', count: 902, percentage: 4.8 }
    ],
    popularCards: [
      { name: 'The Fool', count: 2453 },
      { name: 'The Lovers', count: 2105 },
      { name: 'Ace of Cups', count: 1978 },
      { name: 'Ten of Pentacles', count: 1856 },
      { name: 'The Star', count: 1754 }
    ],
    hourlyDistribution: [
      { hour: '00:00', count: 325 },
      { hour: '03:00', count: 156 },
      { hour: '06:00', count: 256 },
      { hour: '09:00', count: 856 },
      { hour: '12:00', count: 1245 },
      { hour: '15:00', count: 1124 },
      { hour: '18:00', count: 1532 },
      { hour: '21:00', count: 965 }
    ]
  },
  revenueStats: {
    monthlyRevenue: [
      { month: 'T5/2023', amount: 12450 },
      { month: 'T6/2023', amount: 13650 },
      { month: 'T7/2023', amount: 14820 },
      { month: 'T8/2023', amount: 16950 },
      { month: 'T9/2023', amount: 18720 },
      { month: 'T10/2023', amount: 20830 },
      { month: 'T11/2023', amount: 22680 }
    ],
    revenueByPlan: [
      { plan: 'Basic', amount: 4350, percentage: 19.2 },
      { plan: 'Standard', amount: 9850, percentage: 43.4 },
      { plan: 'Premium', amount: 6480, percentage: 28.6 },
      { plan: 'VIP', amount: 2000, percentage: 8.8 }
    ],
    transactionCount: [
      { month: 'T5/2023', count: 325 },
      { month: 'T6/2023', count: 342 },
      { month: 'T7/2023', count: 378 },
      { month: 'T8/2023', count: 410 },
      { month: 'T9/2023', count: 452 },
      { month: 'T10/2023', count: 496 },
      { month: 'T11/2023', count: 532 }
    ]
  }
};

// Component card thống kê
const StatCard = ({ title, value, subtitle, icon, trend, color }) => {
  return (
    <Card className="bg-gray-800">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-400">{title}</h3>
            <div className="flex items-baseline mt-1">
              <h5 className="text-2xl font-semibold text-white">{value}</h5>
              {trend && (
                <span className={`ml-2 text-sm font-medium ${trend.type === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  <Icon name={trend.type === 'up' ? 'trending-up' : 'trending-down'} size="sm" className="inline mr-1" />
                  {trend.value}%
                </span>
              )}
            </div>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon name={icon} size="lg" className="text-white" />
          </div>
        </div>
        {subtitle && <p className="mt-3 text-sm text-gray-400">{subtitle}</p>}
      </div>
    </Card>
  );
};

// Component biểu đồ
const ChartPlaceholder = ({ title, subtitle, height = 300, children }) => {
  return (
    <Card className="bg-gray-800">
      <div className="p-5">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-white">{title}</h3>
          {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
        </div>
        {children ? (
          children
        ) : (
          <div 
            className="flex items-center justify-center bg-gray-700 rounded-lg" 
            style={{ height }}
          >
            <div className="text-center p-5">
              <Icon name="bar-chart-2" size="xl" className="text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">Biểu đồ dữ liệu sẽ hiển thị ở đây</p>
              <p className="text-xs text-gray-500 mt-2">Cần tích hợp thư viện biểu đồ</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

// Component thanh tiến trình
const ProgressBar = ({ label, value, max, color, percentage }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <span className="text-sm text-gray-400">{percentage ? `${percentage}%` : value}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${color}`} 
          style={{ width: `${percentage || (value / max) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

// Component tab
const TabButton = ({ active, onClick, children }) => (
  <button
    className={`px-4 py-2 font-medium rounded-t-lg ${
      active 
      ? 'bg-gray-800 text-white border-t border-l border-r border-gray-700' 
      : 'bg-gray-700 text-gray-400 hover:bg-gray-750 hover:text-gray-300'
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

// Trang Analytics
const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeframe, setTimeframe] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Giả lập API call
    setTimeout(() => {
      setData(MOCK_DATA);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Spinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Phân tích & Thống kê</h1>
        <p className="text-gray-400">Theo dõi hiệu suất và hoạt động của hệ thống</p>
      </div>

      {/* Bộ chọn tab */}
      <div className="mb-6 border-b border-gray-700">
        <div className="flex flex-wrap -mb-px">
          <TabButton 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')}
          >
            <div className="flex items-center">
              <Icon name="activity" size="sm" className="mr-2" />
              Tổng quan
            </div>
          </TabButton>
          <TabButton 
            active={activeTab === 'users'} 
            onClick={() => setActiveTab('users')}
          >
            <div className="flex items-center">
              <Icon name="users" size="sm" className="mr-2" />
              Người dùng
            </div>
          </TabButton>
          <TabButton 
            active={activeTab === 'readings'} 
            onClick={() => setActiveTab('readings')}
          >
            <div className="flex items-center">
              <Icon name="book-open" size="sm" className="mr-2" />
              Đọc bài
            </div>
          </TabButton>
          <TabButton 
            active={activeTab === 'revenue'} 
            onClick={() => setActiveTab('revenue')}
          >
            <div className="flex items-center">
              <Icon name="dollar-sign" size="sm" className="mr-2" />
              Doanh thu
            </div>
          </TabButton>
        </div>
      </div>

      {/* Bộ lọc thời gian */}
      <div className="mb-6 flex justify-end">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
              timeframe === 'weekly'
                ? 'bg-indigo-600 text-white border-indigo-700'
                : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
            }`}
            onClick={() => setTimeframe('weekly')}
          >
            Tuần
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium border-t border-b ${
              timeframe === 'monthly'
                ? 'bg-indigo-600 text-white border-indigo-700'
                : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
            }`}
            onClick={() => setTimeframe('monthly')}
          >
            Tháng
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
              timeframe === 'yearly'
                ? 'bg-indigo-600 text-white border-indigo-700'
                : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
            }`}
            onClick={() => setTimeframe('yearly')}
          >
            Năm
          </button>
        </div>
      </div>

      {/* Tab tổng quan */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Tổng người dùng"
              value={data.overviewStats.totalUsers.toLocaleString()}
              icon="users"
              color="bg-indigo-600"
              trend={{ type: 'up', value: 5.7 }}
            />
            <StatCard
              title="Người dùng premium"
              value={data.overviewStats.premiumUsers.toLocaleString()}
              icon="award"
              color="bg-purple-600"
              trend={{ type: 'up', value: 8.2 }}
            />
            <StatCard
              title="Tổng lượt đọc bài"
              value={data.overviewStats.totalReadings.toLocaleString()}
              icon="book-open"
              color="bg-blue-600"
              trend={{ type: 'up', value: 7.1 }}
            />
            <StatCard
              title="Doanh thu (VNĐ)"
              value={data.overviewStats.revenue.toLocaleString()}
              icon="dollar-sign"
              color="bg-green-600"
              trend={{ type: 'up', value: 9.3 }}
              subtitle="Đơn vị: nghìn đồng"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartPlaceholder 
              title="Tăng trưởng người dùng" 
              subtitle="Theo dõi sự tăng trưởng người dùng theo thời gian"
            />
            <ChartPlaceholder 
              title="Tổng lượt đọc bài" 
              subtitle="Phân tích xu hướng đọc bài theo thời gian"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-gray-800">
              <div className="p-5">
                <h3 className="text-lg font-medium text-white mb-4">Thống kê nhanh</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Tỷ lệ chuyển đổi</span>
                    <span className="text-green-500 font-medium">{data.overviewStats.conversionRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Người dùng hoạt động hàng ngày</span>
                    <span className="text-indigo-500 font-medium">{data.overviewStats.dailyActiveUsers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Trung bình đọc bài/người dùng</span>
                    <span className="text-blue-500 font-medium">{data.overviewStats.averageReadingsPerUser}</span>
                  </div>
                </div>
              </div>
            </Card>
            <ChartPlaceholder 
              title="Phân bố thiết bị" 
              subtitle="Thiết bị được người dùng sử dụng"
              height={200}
            />
            <ChartPlaceholder 
              title="Loại đọc bài phổ biến" 
              subtitle="Các kiểu đọc bài được sử dụng nhiều nhất"
              height={200}
            />
          </div>
        </div>
      )}

      {/* Tab người dùng */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Tổng người dùng"
              value={data.overviewStats.totalUsers.toLocaleString()}
              icon="users"
              color="bg-indigo-600"
            />
            <StatCard
              title="Người dùng hoạt động"
              value={data.overviewStats.activeUsers.toLocaleString()}
              icon="user-check"
              color="bg-green-600"
            />
            <StatCard
              title="Người dùng premium"
              value={data.overviewStats.premiumUsers.toLocaleString()}
              icon="award"
              color="bg-purple-600"
            />
            <StatCard
              title="Tỷ lệ chuyển đổi"
              value={`${data.overviewStats.conversionRate}%`}
              icon="percent"
              color="bg-orange-600"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartPlaceholder 
              title="Tăng trưởng người dùng" 
              subtitle="Theo dõi sự tăng trưởng người dùng theo thời gian"
            />
            <ChartPlaceholder 
              title="Tăng trưởng người dùng premium" 
              subtitle="Sự tăng trưởng người dùng premium theo thời gian"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-800">
              <div className="p-5">
                <h3 className="text-lg font-medium text-white mb-4">Phân bố theo thiết bị</h3>
                <div className="space-y-4">
                  {data.userStats.usersByDevice.map((item) => (
                    <ProgressBar
                      key={item.device}
                      label={item.device}
                      value={item.users}
                      percentage={item.percentage}
                      color="bg-indigo-600"
                    />
                  ))}
                </div>
              </div>
            </Card>
            <Card className="bg-gray-800">
              <div className="p-5">
                <h3 className="text-lg font-medium text-white mb-4">Phân bố theo độ tuổi</h3>
                <div className="space-y-4">
                  {data.userStats.usersByAge.map((item) => (
                    <ProgressBar
                      key={item.ageGroup}
                      label={item.ageGroup}
                      value={item.users}
                      percentage={item.percentage}
                      color="bg-purple-600"
                    />
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tab đọc bài */}
      {activeTab === 'readings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Tổng lượt đọc bài"
              value={data.overviewStats.totalReadings.toLocaleString()}
              icon="book-open"
              color="bg-blue-600"
            />
            <StatCard
              title="Trung bình/người dùng"
              value={data.overviewStats.averageReadingsPerUser}
              icon="bar-chart-2"
              color="bg-green-600"
            />
            <StatCard
              title="Đọc bài hôm nay"
              value="256"
              icon="calendar"
              color="bg-purple-600"
            />
            <StatCard
              title="Tỷ lệ hoàn thành"
              value="92.7%"
              icon="check-circle"
              color="bg-orange-600"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartPlaceholder 
              title="Xu hướng đọc bài" 
              subtitle="Lượng đọc bài theo thời gian"
            />
            <ChartPlaceholder 
              title="Phân bố theo giờ" 
              subtitle="Thời điểm phổ biến để đọc bài trong ngày"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-800">
              <div className="p-5">
                <h3 className="text-lg font-medium text-white mb-4">Loại đọc bài phổ biến</h3>
                <div className="space-y-4">
                  {data.readingStats.popularReadingTypes.map((item) => (
                    <ProgressBar
                      key={item.type}
                      label={item.type}
                      value={item.count.toLocaleString()}
                      percentage={item.percentage}
                      color="bg-indigo-600"
                    />
                  ))}
                </div>
              </div>
            </Card>
            <Card className="bg-gray-800">
              <div className="p-5">
                <h3 className="text-lg font-medium text-white mb-4">Lá bài phổ biến nhất</h3>
                <div className="space-y-4">
                  {data.readingStats.popularCards.map((item, index) => (
                    <div key={item.name} className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                        <span className="text-sm text-gray-400">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.count.toLocaleString()} lần xuất hiện</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tab doanh thu */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Doanh thu (VNĐ)"
              value={data.overviewStats.revenue.toLocaleString()}
              icon="dollar-sign"
              color="bg-green-600"
              trend={{ type: 'up', value: 9.3 }}
              subtitle="Đơn vị: nghìn đồng"
            />
            <StatCard
              title="Doanh thu trung bình/người dùng"
              value={(data.overviewStats.revenue / data.overviewStats.premiumUsers).toFixed(0)}
              icon="user-plus"
              color="bg-indigo-600"
              subtitle="Đơn vị: nghìn đồng"
            />
            <StatCard
              title="Số giao dịch"
              value="532"
              icon="credit-card"
              color="bg-purple-600"
            />
            <StatCard
              title="Tỷ lệ hủy đăng ký"
              value="3.2%"
              icon="user-minus"
              color="bg-red-600"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartPlaceholder 
              title="Doanh thu theo tháng" 
              subtitle="Doanh thu theo tháng (đơn vị: nghìn đồng)"
            />
            <ChartPlaceholder 
              title="Số lượng giao dịch" 
              subtitle="Số lượng giao dịch theo tháng"
            />
          </div>

          <Card className="bg-gray-800">
            <div className="p-5">
              <h3 className="text-lg font-medium text-white mb-4">Doanh thu theo gói dịch vụ</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {data.revenueStats.revenueByPlan.map((item) => (
                    <ProgressBar
                      key={item.plan}
                      label={item.plan}
                      value={`${item.amount.toLocaleString()} K`}
                      percentage={item.percentage}
                      color={
                        item.plan === 'Basic' ? 'bg-blue-600' :
                        item.plan === 'Standard' ? 'bg-indigo-600' :
                        item.plan === 'Premium' ? 'bg-purple-600' : 'bg-pink-600'
                      }
                    />
                  ))}
                </div>
                <ChartPlaceholder 
                  title="" 
                  height={200}
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <Button variant="outlineDark" className="mr-2">
          <Icon name="download" size="sm" className="mr-2" />
          Xuất báo cáo
        </Button>
        <Button variant="solidPrimary">
          <Icon name="refresh-cw" size="sm" className="mr-2" />
          Làm mới dữ liệu
        </Button>
      </div>
    </AdminLayout>
  );
};

export default Analytics; 