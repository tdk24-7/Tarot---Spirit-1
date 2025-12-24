import React, { useState, useEffect } from 'react'
import AdminLayout from '../../shared/layouts/AdminLayout'
import Card from '../../shared/components/common/Card'
import Button from '../../shared/components/common/Button'
import Spinner from '../../shared/components/common/Spinner'
import Icon from '../../shared/components/common/Icon'

// Mock analytics data
const MOCK_ANALYTICS = {
  overview: {
    totalUsers: 2485,
    activeUsers: 1875,
    premiumUsers: 642,
    totalReadings: 18756,
    dailyActiveUsers: 756,
    avgReadingsPerUser: 7.5,
    conversionRate: 25.8, // % of free users converting to premium
    retentionRate: 68.3, // % of users returning after first month
  },
  trends: {
    userGrowth: [
      { date: '2023-05-01', users: 1850 },
      { date: '2023-06-01', users: 1920 },
      { date: '2023-07-01', users: 2050 },
      { date: '2023-08-01', users: 2120 },
      { date: '2023-09-01', users: 2280 },
      { date: '2023-10-01', users: 2350 },
      { date: '2023-11-01', users: 2485 }
    ],
    readingsTrend: [
      { date: '2023-05-01', readings: 12500 },
      { date: '2023-06-01', readings: 13200 },
      { date: '2023-07-01', readings: 14100 },
      { date: '2023-08-01', readings: 15300 },
      { date: '2023-09-01', readings: 16400 },
      { date: '2023-10-01', readings: 17500 },
      { date: '2023-11-01', readings: 18756 }
    ],
    premiumTrend: [
      { date: '2023-05-01', premium: 350 },
      { date: '2023-06-01', premium: 385 },
      { date: '2023-07-01', premium: 420 },
      { date: '2023-08-01', premium: 480 },
      { date: '2023-09-01', premium: 530 },
      { date: '2023-10-01', premium: 590 },
      { date: '2023-11-01', premium: 642 }
    ],
    dailyActivity: [
      { hour: '00:00', users: 85 },
      { hour: '02:00', users: 42 },
      { hour: '04:00', users: 28 },
      { hour: '06:00', users: 65 },
      { hour: '08:00', users: 132 },
      { hour: '10:00', users: 205 },
      { hour: '12:00', users: 187 },
      { hour: '14:00', users: 164 },
      { hour: '16:00', users: 212 },
      { hour: '18:00', users: 251 },
      { hour: '20:00', users: 186 },
      { hour: '22:00', users: 124 }
    ]
  },
  readingTypes: {
    popularReadings: [
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
    ]
  },
  userBehavior: {
    deviceUsage: [
      { device: 'Mobile', percentage: 68 },
      { device: 'Desktop', percentage: 27 },
      { device: 'Tablet', percentage: 5 }
    ],
    sessionDuration: {
      average: '18m 42s',
      distribution: [
        { duration: '0-5 min', percentage: 15 },
        { duration: '5-15 min', percentage: 35 },
        { duration: '15-30 min', percentage: 32 },
        { duration: '30+ min', percentage: 18 }
      ]
    },
    weekdayDistribution: [
      { day: 'Monday', percentage: 12 },
      { day: 'Tuesday', percentage: 14 },
      { day: 'Wednesday', percentage: 13 },
      { day: 'Thursday', percentage: 15 },
      { day: 'Friday', percentage: 16 },
      { day: 'Saturday', percentage: 18 },
      { day: 'Sunday', percentage: 12 }
    ]
  },
  revenue: {
    monthly: [
      { month: 'May 2023', amount: 12450 },
      { month: 'Jun 2023', amount: 13650 },
      { month: 'Jul 2023', amount: 14820 },
      { month: 'Aug 2023', amount: 16950 },
      { month: 'Sep 2023', amount: 18720 },
      { month: 'Oct 2023', amount: 20830 },
      { month: 'Nov 2023', amount: 22680 }
    ],
    byPlan: [
      { plan: 'Basic', amount: 4350, percentage: 19.2 },
      { plan: 'Standard', amount: 9850, percentage: 43.4 },
      { plan: 'Premium', amount: 6480, percentage: 28.6 },
      { plan: 'VIP', amount: 2000, percentage: 8.8 }
    ]
  }
}

// Mock data
const MOCK_REPORTS = [
  {
    id: 1,
    type: 'forum_post',
    reason: 'offensive_content',
    description: 'Bài viết chứa nội dung không phù hợp và xúc phạm.',
    status: 'pending',
    reportedAt: '2023-11-08T09:25:43',
    reportedBy: {
      id: 3,
      name: 'Le Van C'
    },
    content: {
      id: 15,
      title: 'Bài viết về ý nghĩa của lá The Tower',
      type: 'forum_post',
      excerpt: 'Lá The Tower đại diện cho sự sụp đổ đột ngột...',
      author: {
        id: 7,
        name: 'Dang Thi G'
      },
      createdAt: '2023-11-07T14:30:22'
    }
  },
  {
    id: 2,
    type: 'comment',
    reason: 'spam',
    description: 'Người dùng đang spam liên kết đến trang bên ngoài.',
    status: 'pending',
    reportedAt: '2023-11-09T15:42:18',
    reportedBy: {
      id: 2,
      name: 'Tran Thi B'
    },
    content: {
      id: 32,
      type: 'comment',
      excerpt: 'Hãy truy cập website của tôi để xem thêm về tarot: www.example.com/tarot...',
      author: {
        id: 8,
        name: 'Bui Van H'
      },
      createdAt: '2023-11-09T13:15:44'
    }
  },
  {
    id: 3,
    type: 'user',
    reason: 'impersonation',
    description: 'Người dùng này đang mạo danh là chuyên gia Tarot nổi tiếng.',
    status: 'resolved',
    reportedAt: '2023-11-05T08:12:37',
    reportedBy: {
      id: 5,
      name: 'Hoang Thi E'
    },
    content: {
      id: 8,
      type: 'user',
      name: 'Bui Van H',
      createdAt: '2023-10-15T10:40:22'
    },
    resolvedAt: '2023-11-06T11:23:45',
    resolvedBy: {
      id: 6,
      name: 'Vu Van F'
    },
    resolution: 'Tài khoản đã bị cảnh cáo và yêu cầu sửa thông tin.'
  },
  {
    id: 4,
    type: 'forum_post',
    reason: 'misinformation',
    description: 'Bài viết chứa thông tin không chính xác về ý nghĩa của các lá bài Tarot.',
    status: 'rejected',
    reportedAt: '2023-11-02T16:35:19',
    reportedBy: {
      id: 1,
      name: 'Nguyen Van A'
    },
    content: {
      id: 10,
      title: 'Giải thích ý nghĩa các lá bài trong Tarot',
      type: 'forum_post',
      excerpt: 'Trong Tarot, mỗi lá bài đều có ý nghĩa riêng...',
      author: {
        id: 9,
        name: 'Ngo Thi I'
      },
      createdAt: '2023-11-01T09:45:12'
    },
    resolvedAt: '2023-11-03T10:18:27',
    resolvedBy: {
      id: 6,
      name: 'Vu Van F'
    },
    resolution: 'Báo cáo không hợp lệ, nội dung bài viết không vi phạm quy định.'
  },
  {
    id: 5,
    type: 'comment',
    reason: 'harassment',
    description: 'Bình luận này đang quấy rối người dùng khác.',
    status: 'resolved',
    reportedAt: '2023-11-07T13:42:56',
    reportedBy: {
      id: 10,
      name: 'Duong Van K'
    },
    content: {
      id: 45,
      type: 'comment',
      excerpt: 'Bạn thực sự không hiểu gì về Tarot, đừng có phát ngôn lung tung nữa...',
      author: {
        id: 4,
        name: 'Pham Van D'
      },
      createdAt: '2023-11-07T12:30:18'
    },
    resolvedAt: '2023-11-08T09:15:34',
    resolvedBy: {
      id: 6,
      name: 'Vu Van F'
    },
    resolution: 'Bình luận đã bị xóa và người dùng đã bị cảnh cáo.'
  }
];

// Stat Card component
const StatCard = ({ title, value, subtitle, icon, trend, color }) => {
  return (
    <Card className="p-6">
      <div className="flex items-start">
        {icon && (
          <div className={`w-12 h-12 rounded-full ${color || 'bg-indigo-100'} flex items-center justify-center mr-4`}>
            <Icon name={icon} size={24} className={color ? 'text-white' : 'text-indigo-600'} />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-gray-500 text-sm">{title}</h3>
          <div className="flex items-center mt-1">
            <span className="text-2xl font-bold">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            {trend && (
              <span className={`ml-2 text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
            )}
          </div>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </Card>
  )
}

// Chart placeholder component
// In a real application, this would be implemented with a chart library like Chart.js or Recharts
const ChartPlaceholder = ({ title, subtitle, height = 300 }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-none">
        <h3 className="text-lg font-semibold">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      <div 
        className="flex-1 bg-gray-50 rounded-lg mt-4 flex items-center justify-center"
        style={{ minHeight: height }}
      >
        <p className="text-gray-500">Chart Visualization Placeholder</p>
        {/* In a real application, chart component would be rendered here */}
      </div>
    </div>
  )
}

// Progress bar component
const ProgressBar = ({ label, value, max, color }) => {
  const percentage = Math.min(100, (value / max) * 100)
  
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-gray-600">{value.toLocaleString()}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${color || 'bg-indigo-500'}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}

// Reports Component
const Reports = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [timeframe, setTimeframe] = useState('monthly')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [resolution, setResolution] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5;

  useEffect(() => {
    // Simulate API call to get analytics data
    setTimeout(() => {
      setData(MOCK_ANALYTICS)
      setLoading(false)
    }, 500)
  }, [])

  // Tải dữ liệu báo cáo (giả lập)
  useEffect(() => {
    setTimeout(() => {
      setReports(MOCK_REPORTS);
      setFilteredReports(MOCK_REPORTS);
      setLoading(false);
    }, 800);
  }, []);

  // Lọc báo cáo khi bộ lọc thay đổi
  useEffect(() => {
    const results = reports.filter(report => {
      const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
      const matchesType = typeFilter === 'all' || report.type === typeFilter;
      
      return matchesStatus && matchesType;
    });
    
    setFilteredReports(results);
    setCurrentPage(1); // Reset về trang đầu tiên khi lọc
  }, [statusFilter, typeFilter, reports]);

  // Xử lý xem chi tiết báo cáo
  const handleViewDetail = (reportId) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      setSelectedReport(report);
      setIsDetailModalOpen(true);
    }
  };

  // Xử lý mở modal giải quyết báo cáo
  const handleOpenResolveModal = (reportId) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      setSelectedReport(report);
      setIsResolveModalOpen(true);
    }
  };

  // Xử lý giải quyết báo cáo
  const handleResolveReport = () => {
    if (!selectedReport || !resolution.trim()) return;
    
    setLoading(true);
    // Giả lập gọi API
    setTimeout(() => {
      const updatedReports = reports.map(report => {
        if (report.id === selectedReport.id) {
          return {
            ...report,
            status: 'resolved',
            resolvedAt: new Date().toISOString(),
            resolvedBy: {
              id: 6, // ID của admin hiện tại
              name: 'Vu Van F'
            },
            resolution: resolution
          };
        }
        return report;
      });
      
      setReports(updatedReports);
      setLoading(false);
      setIsResolveModalOpen(false);
      setResolution('');
    }, 500);
  };

  // Xử lý từ chối báo cáo
  const handleRejectReport = () => {
    if (!selectedReport || !resolution.trim()) return;
    
    setLoading(true);
    // Giả lập gọi API
    setTimeout(() => {
      const updatedReports = reports.map(report => {
        if (report.id === selectedReport.id) {
          return {
            ...report,
            status: 'rejected',
            resolvedAt: new Date().toISOString(),
            resolvedBy: {
              id: 6, // ID của admin hiện tại
              name: 'Vu Van F'
            },
            resolution: resolution
          };
        }
        return report;
      });
      
      setReports(updatedReports);
      setLoading(false);
      setIsResolveModalOpen(false);
      setResolution('');
    }, 500);
  };

  // Phân trang
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Format ngày giờ
  const formatDateTime = (dateTimeString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateTimeString).toLocaleDateString('vi-VN', options);
  };

  // Lấy màu badge dựa trên trạng thái
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Lấy màu badge dựa trên loại báo cáo
  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'forum_post':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'comment':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'user':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Lấy tên hiển thị cho loại báo cáo
  const getReportTypeDisplay = (type) => {
    switch (type) {
      case 'forum_post':
        return 'Bài viết';
      case 'comment':
        return 'Bình luận';
      case 'user':
        return 'Người dùng';
      default:
        return 'Không xác định';
    }
  };

  // Lấy tên hiển thị cho lý do báo cáo
  const getReportReasonDisplay = (reason) => {
    switch (reason) {
      case 'offensive_content':
        return 'Nội dung xúc phạm';
      case 'spam':
        return 'Spam';
      case 'misinformation':
        return 'Thông tin sai lệch';
      case 'harassment':
        return 'Quấy rối';
      case 'impersonation':
        return 'Mạo danh';
      default:
        return 'Khác';
    }
  };

  // Lấy tên hiển thị cho trạng thái báo cáo
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'pending':
        return 'Chưa xử lý';
      case 'resolved':
        return 'Đã giải quyết';
      case 'rejected':
        return 'Đã từ chối';
      default:
        return 'Không xác định';
    }
  };

  // Tab component
  const TabButton = ({ tab, label, icon }) => {
    return (
      <button
        onClick={() => setActiveTab(tab)}
        className={`px-4 py-2 font-medium text-sm border-b-2 flex items-center ${
          activeTab === tab 
            ? 'border-indigo-600 text-indigo-600' 
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`}
      >
        {icon && <Icon name={icon} size={16} className="mr-2" />}
        {label}
      </button>
    )
  }

  // Time frame selector component
  const TimeframeSelector = () => {
    return (
      <div className="flex space-x-2">
        <Button 
          size="small" 
          variant={timeframe === 'daily' ? 'solid' : 'outline'}
          onClick={() => setTimeframe('daily')}
        >
          Day
        </Button>
        <Button 
          size="small" 
          variant={timeframe === 'weekly' ? 'solid' : 'outline'}
          onClick={() => setTimeframe('weekly')}
        >
          Week
        </Button>
        <Button 
          size="small" 
          variant={timeframe === 'monthly' ? 'solid' : 'outline'}
          onClick={() => setTimeframe('monthly')}
        >
          Month
        </Button>
        <Button 
          size="small" 
          variant={timeframe === 'yearly' ? 'solid' : 'outline'}
          onClick={() => setTimeframe('yearly')}
        >
          Year
        </Button>
      </div>
    )
  }

  // Overview tab content
  const OverviewTab = () => {
    if (!data) return null
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Users" 
            value={data.overview.totalUsers} 
            subtitle={`${data.overview.activeUsers} active users`}
            icon="people" 
            trend={5.7} 
            color="bg-blue-500" 
          />
          <StatCard 
            title="Premium Users" 
            value={data.overview.premiumUsers} 
            subtitle={`${data.overview.conversionRate}% conversion rate`}
            icon="star" 
            trend={8.3} 
            color="bg-purple-500" 
          />
          <StatCard 
            title="Total Readings" 
            value={data.overview.totalReadings} 
            subtitle={`${data.overview.avgReadingsPerUser} per user`}
            icon="cards" 
            trend={7.2} 
            color="bg-indigo-500" 
          />
          <StatCard 
            title="Daily Active Users" 
            value={data.overview.dailyActiveUsers} 
            subtitle={`${data.overview.retentionRate}% retention rate`}
            icon="activity" 
            trend={3.5} 
            color="bg-emerald-500" 
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 h-full">
            <ChartPlaceholder 
              title="User Growth Trend" 
              subtitle="Last 6 months"
            />
          </Card>
          
          <Card className="p-6 h-full">
            <ChartPlaceholder 
              title="Premium Conversion Rate" 
              subtitle="Free to premium conversions"
            />
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 h-full">
            <h3 className="text-lg font-semibold mb-4">Popular Reading Types</h3>
            <div className="space-y-4">
              {data.readingTypes.popularReadings.map((reading) => (
                <ProgressBar 
                  key={reading.type} 
                  label={reading.type} 
                  value={reading.count} 
                  max={7000} 
                  color="bg-indigo-500"
                />
              ))}
            </div>
          </Card>
          
          <Card className="p-6 h-full">
            <h3 className="text-lg font-semibold mb-4">User Activity by Time of Day</h3>
            <ChartPlaceholder 
              height={240}
            />
          </Card>
        </div>
      </div>
    )
  }
  
  // Users tab content
  const UsersTab = () => {
    if (!data) return null
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            title="Total Users" 
            value={data.overview.totalUsers} 
            icon="people" 
            trend={5.7} 
          />
          <StatCard 
            title="Active Users" 
            value={data.overview.activeUsers} 
            icon="active" 
            trend={4.2} 
          />
          <StatCard 
            title="Premium Users" 
            value={data.overview.premiumUsers} 
            icon="star" 
            trend={8.3} 
          />
        </div>
        
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">User Growth Trend</h3>
            <TimeframeSelector />
          </div>
          <ChartPlaceholder height={350} />
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 h-full">
            <h3 className="text-lg font-semibold mb-4">User Engagement Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Retention Rate</span>
                <span className="font-medium">{data.overview.retentionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${data.overview.retentionRate}%` }}></div>
              </div>
              
              <div className="flex justify-between mt-4">
                <span>Premium Conversion Rate</span>
                <span className="font-medium">{data.overview.conversionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${data.overview.conversionRate}%` }}></div>
              </div>
              
              <div className="flex justify-between mt-4">
                <span>Average Readings Per User</span>
                <span className="font-medium">{data.overview.avgReadingsPerUser}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${(data.overview.avgReadingsPerUser / 15) * 100}%` }}></div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 h-full">
            <h3 className="text-lg font-semibold mb-4">Device Usage</h3>
            <ChartPlaceholder height={180} />
            <div className="grid grid-cols-3 gap-4 mt-4">
              {data.userBehavior.deviceUsage.map((device) => (
                <div key={device.device} className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-gray-500 text-sm">{device.device}</p>
                  <p className="text-lg font-bold mt-1">{device.percentage}%</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">User Activity by Time Period</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Day of Week Distribution</h4>
              <ChartPlaceholder height={200} />
            </div>
            <div>
              <h4 className="font-medium mb-2">Session Duration</h4>
              <ChartPlaceholder height={200} />
            </div>
          </div>
        </Card>
      </div>
    )
  }
  
  // Readings tab content
  const ReadingsTab = () => {
    if (!data) return null
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            title="Total Readings" 
            value={data.overview.totalReadings} 
            icon="cards" 
            trend={7.2} 
          />
          <StatCard 
            title="Average Readings/User" 
            value={data.overview.avgReadingsPerUser} 
            icon="chart" 
            trend={2.8} 
          />
          <StatCard 
            title="Daily Readings" 
            value="756" 
            icon="calendar" 
            trend={5.1} 
          />
        </div>
        
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Readings Growth Trend</h3>
            <TimeframeSelector />
          </div>
          <ChartPlaceholder height={350} />
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 h-full">
            <h3 className="text-lg font-semibold mb-4">Popular Reading Types</h3>
            <ChartPlaceholder height={200} />
            <div className="space-y-4 mt-4">
              {data.readingTypes.popularReadings.map((reading) => (
                <div key={reading.type} className="flex justify-between items-center">
                  <span>{reading.type}</span>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">{reading.count.toLocaleString()}</span>
                    <span className="text-gray-500 text-sm">({reading.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          <Card className="p-6 h-full">
            <h3 className="text-lg font-semibold mb-4">Most Popular Cards</h3>
            <ChartPlaceholder height={200} />
            <div className="space-y-4 mt-4">
              {data.readingTypes.popularCards.map((card, index) => (
                <ProgressBar 
                  key={card.name} 
                  label={card.name} 
                  value={card.count} 
                  max={3000} 
                  color={
                    index === 0 ? 'bg-indigo-500' :
                    index === 1 ? 'bg-purple-500' :
                    index === 2 ? 'bg-blue-500' :
                    index === 3 ? 'bg-green-500' :
                    'bg-amber-500'
                  }
                />
              ))}
            </div>
          </Card>
        </div>
      </div>
    )
  }
  
  // Revenue tab content
  const RevenueTab = () => {
    if (!data) return null
    
    const getTotalRevenue = () => {
      return data.revenue.byPlan.reduce((total, plan) => total + plan.amount, 0)
    }
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Revenue" 
            value={`$${getTotalRevenue().toLocaleString()}`} 
            icon="dollar" 
            trend={9.2} 
            color="bg-emerald-500" 
          />
          <StatCard 
            title="Premium Users" 
            value={data.overview.premiumUsers} 
            icon="star" 
            trend={8.3} 
            color="bg-purple-500" 
          />
          <StatCard 
            title="Average Revenue/User" 
            value={`$${(getTotalRevenue() / data.overview.premiumUsers).toFixed(2)}`} 
            icon="chart" 
            trend={3.1} 
            color="bg-blue-500" 
          />
          <StatCard 
            title="Conversion Rate" 
            value={`${data.overview.conversionRate}%`} 
            icon="conversion" 
            trend={2.4} 
            color="bg-amber-500" 
          />
        </div>
        
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Revenue Growth Trend</h3>
            <TimeframeSelector />
          </div>
          <ChartPlaceholder height={350} />
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 h-full">
            <h3 className="text-lg font-semibold mb-4">Revenue by Plan</h3>
            <ChartPlaceholder height={250} />
            <div className="space-y-4 mt-4">
              {data.revenue.byPlan.map((plan) => (
                <div key={plan.plan} className="flex justify-between items-center">
                  <span>{plan.plan}</span>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">${plan.amount.toLocaleString()}</span>
                    <span className="text-gray-500 text-sm">({plan.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          <Card className="p-6 h-full">
            <h3 className="text-lg font-semibold mb-4">Monthly Revenue</h3>
            <ChartPlaceholder height={250} />
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {data.revenue.monthly.map((month, index) => {
                    const prevMonth = index > 0 ? data.revenue.monthly[index - 1].amount : month.amount
                    const change = ((month.amount - prevMonth) / prevMonth) * 100
                    
                    return (
                      <tr key={month.month} className="border-b border-gray-100">
                        <td className="px-4 py-2 whitespace-nowrap">{month.month}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-right font-medium">${month.amount.toLocaleString()}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-right">
                          {index > 0 && (
                            <span className={change >= 0 ? 'text-green-500' : 'text-red-500'}>
                              {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Quản lý báo cáo</h1>
        <p className="text-gray-400">Xem và xử lý các báo cáo từ người dùng</p>
      </div>

      <Card className="p-6 bg-gray-800 shadow-lg rounded-lg mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          {/* Bộ lọc */}
          <div className="flex flex-wrap gap-2">
            {/* Lọc theo trạng thái */}
            <select 
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:border-indigo-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chưa xử lý</option>
              <option value="resolved">Đã giải quyết</option>
              <option value="rejected">Đã từ chối</option>
            </select>

            {/* Lọc theo loại báo cáo */}
            <select 
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:border-indigo-500"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">Tất cả loại báo cáo</option>
              <option value="forum_post">Bài viết</option>
              <option value="comment">Bình luận</option>
              <option value="user">Người dùng</option>
            </select>

            {/* Nút làm mới */}
            <Button 
              variant="outlineDark" 
              onClick={() => {
                setStatusFilter('all');
                setTypeFilter('all');
              }}
            >
              Làm mới
            </Button>
          </div>
        </div>

        {/* Bảng báo cáo */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <>
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3">ID</th>
                    <th scope="col" className="px-6 py-3">Loại</th>
                    <th scope="col" className="px-6 py-3">Lý do</th>
                    <th scope="col" className="px-6 py-3">Báo cáo bởi</th>
                    <th scope="col" className="px-6 py-3">Ngày báo cáo</th>
                    <th scope="col" className="px-6 py-3">Trạng thái</th>
                    <th scope="col" className="px-6 py-3 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {currentReports.length > 0 ? (
                    currentReports.map(report => (
                      <tr key={report.id} className="border-b border-gray-700 hover:bg-gray-700">
                        <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                          #{report.id}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeBadgeClass(report.type)}`}>
                            {getReportTypeDisplay(report.type)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {getReportReasonDisplay(report.reason)}
                        </td>
                        <td className="px-6 py-4">
                          {report.reportedBy.name}
                        </td>
                        <td className="px-6 py-4">
                          {formatDateTime(report.reportedAt)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(report.status)}`}>
                            {getStatusDisplay(report.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <div className="flex items-center justify-center space-x-2">
                            <Button 
                              variant="textDark" 
                              size="sm" 
                              onClick={() => handleViewDetail(report.id)} 
                              title="Xem chi tiết"
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <Icon name="view" />
                            </Button>
                            
                            {report.status === 'pending' && (
                              <Button 
                                variant="textDark" 
                                size="sm" 
                                onClick={() => handleOpenResolveModal(report.id)} 
                                title="Giải quyết báo cáo"
                                className="text-green-400 hover:text-green-300"
                              >
                                <Icon name="checkCircle" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-400">
                        Không tìm thấy báo cáo nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Phân trang */}
              {filteredReports.length > 0 && (
                <div className="flex justify-between items-center mt-6">
                  <div className="text-sm text-gray-400">
                    Hiển thị {indexOfFirstReport + 1}-{Math.min(indexOfLastReport, filteredReports.length)} trong số {filteredReports.length} báo cáo
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      variant="outlineDark"
                      size="small"
                      disabled={currentPage === 1}
                      onClick={() => paginate(currentPage - 1)}
                    >
                      <Icon name="chevronLeft" />
                    </Button>
                    
                    {[...Array(totalPages).keys()].map(number => (
                      <Button
                        key={number + 1}
                        variant={currentPage === number + 1 ? 'solidDark' : 'outlineDark'}
                        size="small"
                        onClick={() => paginate(number + 1)}
                      >
                        {number + 1}
                      </Button>
                    ))}
                    
                    <Button 
                      variant="outlineDark"
                      size="small"
                      disabled={currentPage === totalPages}
                      onClick={() => paginate(currentPage + 1)}
                    >
                      <Icon name="chevronRight" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Modal xem chi tiết báo cáo */}
      {isDetailModalOpen && selectedReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-75"></div>
            <div className="bg-gray-800 rounded-lg shadow-xl z-10 w-full max-w-3xl">
              <div className="flex justify-between items-center p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white">
                  Chi tiết báo cáo #{selectedReport.id}
                </h3>
                <button 
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <Icon name="close" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-lg font-medium text-white mb-4">Thông tin báo cáo</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400">Loại báo cáo</p>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeBadgeClass(selectedReport.type)}`}>
                          {getReportTypeDisplay(selectedReport.type)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Lý do</p>
                        <p className="text-white">{getReportReasonDisplay(selectedReport.reason)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Mô tả</p>
                        <p className="text-white">{selectedReport.description}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Người báo cáo</p>
                        <p className="text-white">{selectedReport.reportedBy.name} (ID: {selectedReport.reportedBy.id})</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Thời gian báo cáo</p>
                        <p className="text-white">{formatDateTime(selectedReport.reportedAt)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Trạng thái</p>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(selectedReport.status)}`}>
                          {getStatusDisplay(selectedReport.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-white mb-4">Nội dung bị báo cáo</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400">ID</p>
                        <p className="text-white">#{selectedReport.content.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Loại nội dung</p>
                        <p className="text-white">{getReportTypeDisplay(selectedReport.content.type)}</p>
                      </div>
                      {selectedReport.content.title && (
                        <div>
                          <p className="text-sm text-gray-400">Tiêu đề</p>
                          <p className="text-white">{selectedReport.content.title}</p>
                        </div>
                      )}
                      {selectedReport.content.excerpt && (
                        <div>
                          <p className="text-sm text-gray-400">Nội dung</p>
                          <p className="text-white">{selectedReport.content.excerpt}</p>
                        </div>
                      )}
                      {selectedReport.content.author && (
                        <div>
                          <p className="text-sm text-gray-400">Tác giả</p>
                          <p className="text-white">{selectedReport.content.author.name} (ID: {selectedReport.content.author.id})</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-400">Thời gian tạo</p>
                        <p className="text-white">{formatDateTime(selectedReport.content.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedReport.status !== 'pending' && (
                  <div className="border-t border-gray-700 pt-6">
                    <h4 className="text-lg font-medium text-white mb-4">Thông tin giải quyết</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400">Xử lý bởi</p>
                        <p className="text-white">{selectedReport.resolvedBy.name} (ID: {selectedReport.resolvedBy.id})</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Thời gian xử lý</p>
                        <p className="text-white">{formatDateTime(selectedReport.resolvedAt)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Kết quả xử lý</p>
                        <p className="text-white">{selectedReport.resolution}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 flex justify-end space-x-3">
                  {selectedReport.status === 'pending' && (
                    <Button 
                      variant="solid" 
                      onClick={() => {
                        setIsDetailModalOpen(false);
                        handleOpenResolveModal(selectedReport.id);
                      }}
                    >
                      Giải quyết báo cáo
                    </Button>
                  )}
                  <Button 
                    variant="outlineDark" 
                    onClick={() => setIsDetailModalOpen(false)}
                  >
                    Đóng
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal giải quyết báo cáo */}
      {isResolveModalOpen && selectedReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-75"></div>
            <div className="bg-gray-800 rounded-lg shadow-xl z-10 w-full max-w-lg">
              <div className="flex justify-between items-center p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white">
                  Giải quyết báo cáo #{selectedReport.id}
                </h3>
                <button 
                  onClick={() => setIsResolveModalOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <Icon name="close" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <p className="text-gray-300 mb-2">Báo cáo: <span className="text-white">{getReportReasonDisplay(selectedReport.reason)}</span></p>
                  <p className="text-gray-300 mb-4">Nội dung: <span className="text-white">{selectedReport.description}</span></p>
                  
                  <label className="block text-gray-300 mb-2">Kết quả xử lý:</label>
                  <textarea 
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:border-indigo-500 h-32"
                    placeholder="Nhập kết quả xử lý báo cáo..."
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={handleRejectReport}
                    disabled={!resolution.trim()}
                    className="border-red-500 text-red-500 hover:bg-red-500/20"
                  >
                    Từ chối báo cáo
                  </Button>
                  <Button 
                    variant="solid" 
                    onClick={handleResolveReport}
                    disabled={!resolution.trim()}
                  >
                    Xác nhận giải quyết
                  </Button>
                  <Button 
                    variant="outlineDark" 
                    onClick={() => setIsResolveModalOpen(false)}
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-6 border-b">
        <div className="flex overflow-x-auto">
          <TabButton tab="overview" label="Overview" icon="dashboard" />
          <TabButton tab="users" label="User Analytics" icon="people" />
          <TabButton tab="readings" label="Reading Analytics" icon="cards" />
          <TabButton tab="revenue" label="Revenue" icon="dollar" />
        </div>
      </div>
      
      <div className="py-4">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'readings' && <ReadingsTab />}
        {activeTab === 'revenue' && <RevenueTab />}
      </div>
    </AdminLayout>
  )
}

export default Reports 