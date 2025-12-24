import React, { useState, useEffect, memo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../../shared/ui/NavBar';
import Footer from '../../shared/ui/Footer';

// Components
const SectionTitle = memo(({ title, subtitle }) => (
  <div className="mb-8">
    <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">
      {title}
    </h2>
    {subtitle && (
      <p className="text-gray-400 text-sm md:text-base">
        {subtitle}
      </p>
    )}
  </div>
));

const SettingSection = memo(({ children, title, subtitle }) => (
  <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-purple-900/20 p-6 mb-8">
    <SectionTitle title={title} subtitle={subtitle} />
    {children}
  </div>
));

const Switch = memo(({ checked, onChange, label, description }) => (
  <div className="flex items-start mb-6">
    <div className="flex items-center h-5">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={onChange}
        />
        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9370db]"></div>
      </label>
    </div>
    <div className="ml-4">
      <label className="text-white text-sm font-medium">{label}</label>
      {description && <p className="text-gray-400 text-xs mt-1">{description}</p>}
    </div>
  </div>
));

const ThemeSelector = memo(({ currentTheme, onChange }) => {
  const themes = [
    { id: 'default', name: 'Mặc định (Tím)', color: '#9370db' },
    { id: 'dark', name: 'Tối (Đen)', color: '#111111' },
    { id: 'blue', name: 'Xanh Dương', color: '#3b82f6' },
    { id: 'green', name: 'Xanh Lục', color: '#10b981' },
    { id: 'red', name: 'Đỏ', color: '#ef4444' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-white text-lg font-medium mb-2">Chọn giao diện</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onChange(theme.id)}
            className={`flex flex-col items-center p-4 rounded-lg transition-all ${
              currentTheme === theme.id
                ? 'bg-white/20 ring-2 ring-[#9370db]'
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <div
              className="w-8 h-8 rounded-full mb-2"
              style={{ backgroundColor: theme.color }}
            ></div>
            <span className="text-white text-sm">{theme.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
});

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    name: 'Người dùng Tarot',
    email: 'user@example.com',
    phone: '+84 123 456 789',
    bio: 'Tôi là một người yêu thích Tarot và muốn khám phá nhiều hơn về bản thân thông qua các lá bài...',
  });
  const [isEditing, setIsEditing] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = (e) => {
    e.preventDefault();
    // Giả lập lưu
    setTimeout(() => {
      setIsEditing(false);
    }, 500);
  };

  return (
    <form onSubmit={handleSave}>
      <div className="space-y-6">
        {/* Avatar section */}
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 rounded-full bg-[#9370db]/30 flex items-center justify-center relative overflow-hidden">
            <span className="text-3xl text-white">
              {formData.name.charAt(0).toUpperCase()}
            </span>
            {isEditing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <button
                  type="button"
                  className="text-white text-xs bg-[#9370db]/70 px-2 py-1 rounded"
                >
                  Đổi
                </button>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-white font-medium">{formData.name}</h3>
            <p className="text-gray-400 text-sm">Thành viên từ 01/2023</p>
          </div>
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-gray-300 mb-2 text-sm">
              Họ và tên
            </label>
            {isEditing ? (
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full py-2 px-3 bg-white/10 backdrop-blur-sm border border-purple-900/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#9370db]"
              />
            ) : (
              <p className="text-white py-2">{formData.name}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-gray-300 mb-2 text-sm">
              Email
            </label>
            {isEditing ? (
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full py-2 px-3 bg-white/10 backdrop-blur-sm border border-purple-900/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#9370db]"
              />
            ) : (
              <p className="text-white py-2">{formData.email}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-gray-300 mb-2 text-sm">
              Số điện thoại
            </label>
            {isEditing ? (
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full py-2 px-3 bg-white/10 backdrop-blur-sm border border-purple-900/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#9370db]"
              />
            ) : (
              <p className="text-white py-2">{formData.phone}</p>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="bio" className="block text-gray-300 mb-2 text-sm">
            Tiểu sử
          </label>
          {isEditing ? (
            <textarea
              id="bio"
              name="bio"
              rows="4"
              value={formData.bio}
              onChange={handleChange}
              className="w-full py-2 px-3 bg-white/10 backdrop-blur-sm border border-purple-900/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#9370db] resize-none"
            ></textarea>
          ) : (
            <p className="text-white py-2">{formData.bio}</p>
          )}
        </div>
        
        <div className="flex justify-end space-x-3">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white rounded-lg transition-colors"
              >
                Lưu thay đổi
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white rounded-lg transition-colors"
            >
              Chỉnh sửa
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

const PasswordForm = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu mới không khớp');
      return;
    }
    
    if (formData.newPassword.length < 8) {
      setError('Mật khẩu mới phải có ít nhất 8 ký tự');
      return;
    }
    
    // Giả lập đổi mật khẩu
    setTimeout(() => {
      setSuccess('Mật khẩu đã được cập nhật thành công');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-white text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-3 bg-green-900/30 border border-green-700 rounded-lg text-white text-sm">
          {success}
        </div>
      )}
      
      <div>
        <label htmlFor="currentPassword" className="block text-gray-300 mb-2 text-sm">
          Mật khẩu hiện tại
        </label>
        <div className="relative">
          <input
            id="currentPassword"
            name="currentPassword"
            type={showPassword ? "text" : "password"}
            value={formData.currentPassword}
            onChange={handleChange}
            className="w-full py-2 px-3 bg-white/10 backdrop-blur-sm border border-purple-900/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#9370db]"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="newPassword" className="block text-gray-300 mb-2 text-sm">
            Mật khẩu mới
          </label>
          <div className="relative">
            <input
              id="newPassword"
              name="newPassword"
              type={showPassword ? "text" : "password"}
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full py-2 px-3 bg-white/10 backdrop-blur-sm border border-purple-900/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#9370db]"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-gray-300 mb-2 text-sm">
            Xác nhận mật khẩu mới
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full py-2 px-3 bg-white/10 backdrop-blur-sm border border-purple-900/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#9370db]"
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center mb-4">
        <input
          id="showPassword"
          type="checkbox"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
          className="w-4 h-4 text-[#9370db] bg-gray-700 border-gray-600 rounded focus:ring-[#9370db]"
        />
        <label htmlFor="showPassword" className="ml-2 text-sm text-gray-300">
          Hiển thị mật khẩu
        </label>
      </div>
      
      <div>
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white rounded-lg transition-colors"
        >
          Đổi mật khẩu
        </button>
      </div>
    </form>
  );
};

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    email_reading: true,
    email_newsletter: false,
    email_promotions: false,
    push_reading: true,
    push_chat: true,
    push_promotions: false,
  });
  
  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-white text-lg font-medium mb-4">Thông báo qua Email</h3>
        <div className="space-y-4">
          <Switch
            checked={settings.email_reading}
            onChange={() => handleToggle('email_reading')}
            label="Thông báo phiên đọc bài"
            description="Nhận email khi phiên đọc bài của bạn được cập nhật hoặc sắp diễn ra"
          />
          
          <Switch
            checked={settings.email_newsletter}
            onChange={() => handleToggle('email_newsletter')}
            label="Bản tin từ Tarot App"
            description="Nhận bản tin hàng tháng về Tarot, hiểu biết tâm linh, và các sự kiện sắp tới"
          />
          
          <Switch
            checked={settings.email_promotions}
            onChange={() => handleToggle('email_promotions')}
            label="Khuyến mãi và ưu đãi"
            description="Nhận thông tin về ưu đãi, giảm giá và khuyến mãi đặc biệt"
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-white text-lg font-medium mb-4">Thông báo đẩy</h3>
        <div className="space-y-4">
          <Switch
            checked={settings.push_reading}
            onChange={() => handleToggle('push_reading')}
            label="Phiên đọc bài"
            description="Nhận thông báo khi phiên đọc bài của bạn được cập nhật hoặc sắp diễn ra"
          />
          
          <Switch
            checked={settings.push_chat}
            onChange={() => handleToggle('push_chat')}
            label="Tin nhắn từ độc giả Tarot"
            description="Nhận thông báo khi có tin nhắn mới từ độc giả Tarot"
          />
          
          <Switch
            checked={settings.push_promotions}
            onChange={() => handleToggle('push_promotions')}
            label="Khuyến mãi và sự kiện"
            description="Nhận thông báo về ưu đãi, khuyến mãi và sự kiện mới"
          />
        </div>
      </div>
    </div>
  );
};

const PrivacySettings = () => {
  const [settings, setSettings] = useState({
    profile_visibility: 'public',
    reading_history_visibility: 'private',
    show_online_status: true,
    allow_data_collection: true,
  });
  
  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-white text-lg font-medium mb-4">Quyền riêng tư hồ sơ</h3>
        <div className="space-y-4 pl-4">
          <div className="flex items-center">
            <input
              id="profile_public"
              type="radio"
              name="profile_visibility"
              value="public"
              checked={settings.profile_visibility === 'public'}
              onChange={handleRadioChange}
              className="w-4 h-4 text-[#9370db] bg-gray-700 border-gray-600 focus:ring-[#9370db]"
            />
            <label htmlFor="profile_public" className="ml-2 text-white">
              Công khai
              <span className="block text-xs text-gray-400 mt-1">Bất kỳ ai cũng có thể xem hồ sơ của bạn</span>
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="profile_friends"
              type="radio"
              name="profile_visibility"
              value="friends"
              checked={settings.profile_visibility === 'friends'}
              onChange={handleRadioChange}
              className="w-4 h-4 text-[#9370db] bg-gray-700 border-gray-600 focus:ring-[#9370db]"
            />
            <label htmlFor="profile_friends" className="ml-2 text-white">
              Chỉ bạn bè
              <span className="block text-xs text-gray-400 mt-1">Chỉ bạn bè của bạn có thể xem hồ sơ của bạn</span>
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="profile_private"
              type="radio"
              name="profile_visibility"
              value="private"
              checked={settings.profile_visibility === 'private'}
              onChange={handleRadioChange}
              className="w-4 h-4 text-[#9370db] bg-gray-700 border-gray-600 focus:ring-[#9370db]"
            />
            <label htmlFor="profile_private" className="ml-2 text-white">
              Riêng tư
              <span className="block text-xs text-gray-400 mt-1">Không ai có thể xem hồ sơ của bạn</span>
            </label>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-white text-lg font-medium mb-4">Lịch sử đọc bài</h3>
        <div className="space-y-4 pl-4">
          <div className="flex items-center">
            <input
              id="history_public"
              type="radio"
              name="reading_history_visibility"
              value="public"
              checked={settings.reading_history_visibility === 'public'}
              onChange={handleRadioChange}
              className="w-4 h-4 text-[#9370db] bg-gray-700 border-gray-600 focus:ring-[#9370db]"
            />
            <label htmlFor="history_public" className="ml-2 text-white">
              Công khai
              <span className="block text-xs text-gray-400 mt-1">Bất kỳ ai cũng có thể xem lịch sử đọc bài của bạn</span>
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="history_friends"
              type="radio"
              name="reading_history_visibility"
              value="friends"
              checked={settings.reading_history_visibility === 'friends'}
              onChange={handleRadioChange}
              className="w-4 h-4 text-[#9370db] bg-gray-700 border-gray-600 focus:ring-[#9370db]"
            />
            <label htmlFor="history_friends" className="ml-2 text-white">
              Chỉ bạn bè
              <span className="block text-xs text-gray-400 mt-1">Chỉ bạn bè của bạn có thể xem lịch sử đọc bài của bạn</span>
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="history_private"
              type="radio"
              name="reading_history_visibility"
              value="private"
              checked={settings.reading_history_visibility === 'private'}
              onChange={handleRadioChange}
              className="w-4 h-4 text-[#9370db] bg-gray-700 border-gray-600 focus:ring-[#9370db]"
            />
            <label htmlFor="history_private" className="ml-2 text-white">
              Riêng tư
              <span className="block text-xs text-gray-400 mt-1">Không ai có thể xem lịch sử đọc bài của bạn</span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <Switch
          checked={settings.show_online_status}
          onChange={() => handleToggle('show_online_status')}
          label="Hiển thị trạng thái trực tuyến"
          description="Cho phép người dùng khác thấy khi bạn đang trực tuyến"
        />
        
        <Switch
          checked={settings.allow_data_collection}
          onChange={() => handleToggle('allow_data_collection')}
          label="Cho phép thu thập dữ liệu"
          description="Cho phép chúng tôi thu thập dữ liệu để cải thiện trải nghiệm người dùng và cá nhân hóa nội dung"
        />
      </div>
    </div>
  );
};

const SessionList = memo(() => {
  const sessions = [
    { device: 'Chrome trên Windows', location: 'Hồ Chí Minh, Việt Nam', time: 'Hiện tại', active: true },
    { device: 'Safari trên iPhone', location: 'Hồ Chí Minh, Việt Nam', time: '1 giờ trước' },
    { device: 'Firefox trên Windows', location: 'Hà Nội, Việt Nam', time: '2 ngày trước' },
    { device: 'Chrome trên Android', location: 'Đà Nẵng, Việt Nam', time: '5 ngày trước' },
  ];

  return (
    <div className="space-y-4">
      {sessions.map((session, index) => (
        <div
          key={index}
          className="flex justify-between items-center p-4 rounded-lg bg-white/5 backdrop-blur-sm"
        >
          <div>
            <p className="text-white font-medium">
              {session.device}
              {session.active && (
                <span className="ml-2 text-xs bg-green-500/20 text-green-400 py-1 px-2 rounded-full">
                  Hiện tại
                </span>
              )}
            </p>
            <p className="text-gray-400 text-sm">{session.location} • {session.time}</p>
          </div>
          {!session.active && (
            <button className="text-red-400 hover:text-red-300 text-sm">
              Đăng xuất
            </button>
          )}
        </div>
      ))}
      
      <button className="w-full mt-4 py-2 border border-[#9370db] text-[#9370db] rounded-lg hover:bg-[#9370db]/10 transition-colors">
        Đăng xuất khỏi tất cả các thiết bị khác
      </button>
    </div>
  );
});

const Sidebar = memo(({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'profile', label: 'Hồ sơ cá nhân' },
    { id: 'password', label: 'Mật khẩu & Bảo mật' },
    { id: 'appearance', label: 'Giao diện' },
    { id: 'notifications', label: 'Thông báo' },
    { id: 'privacy', label: 'Quyền riêng tư' },
    { id: 'sessions', label: 'Phiên đăng nhập' },
  ];

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-purple-900/20 p-4">
      <h3 className="text-lg font-medium text-white mb-4 px-2">Cài đặt</h3>
      <nav>
        <ul className="space-y-1">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                onClick={() => onTabChange(tab.id)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#9370db]/20 text-[#9370db]'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
});

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [theme, setTheme] = useState('default');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <SettingSection title="Hồ sơ cá nhân" subtitle="Quản lý thông tin cá nhân của bạn">
            <ProfileForm />
          </SettingSection>
        );
      case 'password':
        return (
          <SettingSection title="Mật khẩu & Bảo mật" subtitle="Cập nhật mật khẩu và bảo mật tài khoản">
            <PasswordForm />
          </SettingSection>
        );
      case 'appearance':
        return (
          <SettingSection title="Giao diện" subtitle="Tùy chỉnh giao diện ứng dụng">
            <ThemeSelector currentTheme={theme} onChange={setTheme} />
          </SettingSection>
        );
      case 'notifications':
        return (
          <SettingSection title="Thông báo" subtitle="Quản lý cài đặt thông báo">
            <NotificationSettings />
          </SettingSection>
        );
      case 'privacy':
        return (
          <SettingSection title="Quyền riêng tư" subtitle="Kiểm soát quyền riêng tư của bạn">
            <PrivacySettings />
          </SettingSection>
        );
      case 'sessions':
        return (
          <SettingSection title="Phiên đăng nhập" subtitle="Quản lý các phiên đăng nhập trên các thiết bị">
            <SessionList />
          </SettingSection>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0933] to-[#0f051d] text-white">
      <Helmet>
        <title>Cài đặt tài khoản | Tarot App</title>
        <meta name="description" content="Quản lý cài đặt tài khoản, thông báo, quyền riêng tư và bảo mật." />
      </Helmet>

      <Navbar />

      <main className="container mx-auto px-4 py-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
            <aside>
              <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
            </aside>
            
            <div>
              {renderTabContent()}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default memo(SettingsPage); 