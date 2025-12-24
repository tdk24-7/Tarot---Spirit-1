import React, { useState, useEffect } from 'react';
import AdminLayout from '../../shared/layouts/AdminLayout';
import Card from '../../shared/components/common/Card';
import Button from '../../shared/components/common/Button';
import Icon from '../../shared/components/common/Icon';
import Spinner from '../../shared/components/common/Spinner';

// Component để tạo tab
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

// Component chung cho form input
const FormInput = ({ label, id, type = 'text', value, onChange, placeholder, disabled = false, className = '' }) => (
  <div className={className}>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={(e) => onChange(id, e.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-800 disabled:text-gray-500"
    />
  </div>
);

// Component chung cho form select
const FormSelect = ({ label, id, options, value, onChange, disabled = false, className = '' }) => (
  <div className={className}>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
      {label}
    </label>
    <select
      id={id}
      name={id}
      value={value}
      onChange={(e) => onChange(id, e.target.value)}
      disabled={disabled}
      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-800 disabled:text-gray-500"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

// Component cho các cài đặt bật/tắt
const ToggleSetting = ({ label, description, id, checked, onChange, disabled = false }) => (
  <div className="flex items-start justify-between py-4 border-b border-gray-700 last:border-b-0">
    <div className="pr-4">
      <h4 className="text-sm font-medium text-gray-300">{label}</h4>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
    <div className="mt-1">
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={checked} 
          onChange={(e) => onChange(id, e.target.checked)}
          disabled={disabled}
        />
        <div className={`w-11 h-6 bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
      </label>
    </div>
  </div>
);

// Tab Cài đặt chung
const GeneralSettings = ({ settings, handleChange, handleToggle, saveSettings, loading }) => (
  <div className="space-y-6">
    <Card className="bg-gray-800">
      <div className="p-6">
        <h3 className="text-lg font-medium text-white mb-4">Cài đặt cơ bản</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Tên trang web"
            id="siteName"
            value={settings.siteName}
            onChange={handleChange}
            placeholder="Nhập tên trang web"
          />
          <FormInput
            label="URL trang web"
            id="siteUrl"
            value={settings.siteUrl}
            onChange={handleChange}
            placeholder="https://example.com"
          />
          <FormInput
            label="Email liên hệ"
            id="contactEmail"
            type="email"
            value={settings.contactEmail}
            onChange={handleChange}
            placeholder="contact@example.com"
          />
          <FormSelect
            label="Ngôn ngữ mặc định"
            id="defaultLanguage"
            value={settings.defaultLanguage}
            onChange={handleChange}
            options={[
              { value: 'vi', label: 'Tiếng Việt' },
              { value: 'en', label: 'Tiếng Anh' }
            ]}
          />
        </div>
      </div>
    </Card>

    <Card className="bg-gray-800">
      <div className="p-6">
        <h3 className="text-lg font-medium text-white mb-4">Tùy chọn hiển thị</h3>
        <div className="space-y-0">
          <ToggleSetting
            label="Chế độ bảo trì"
            description="Khi bật, trang web sẽ chỉ hiển thị thông báo bảo trì cho người dùng không phải admin."
            id="maintenanceMode"
            checked={settings.maintenanceMode}
            onChange={handleToggle}
          />
          <ToggleSetting
            label="Hiển thị số đọc bài"
            description="Hiển thị số lượng lần đọc bài Tarot trên trang người dùng."
            id="showReadingCount"
            checked={settings.showReadingCount}
            onChange={handleToggle}
          />
          <ToggleSetting
            label="Cho phép để lại bình luận"
            description="Cho phép người dùng để lại bình luận trên các bài đăng diễn đàn."
            id="allowComments"
            checked={settings.allowComments}
            onChange={handleToggle}
          />
          <ToggleSetting
            label="Hiển thị báo cáo xu hướng"
            description="Hiển thị báo cáo xu hướng hàng tuần cho người dùng premium."
            id="showTrendingReports"
            checked={settings.showTrendingReports}
            onChange={handleToggle}
          />
        </div>
      </div>
    </Card>

    <div className="flex justify-end">
      <Button 
        variant="solidDark" 
        onClick={saveSettings}
        disabled={loading}
      >
        {loading ? <><Spinner size="sm" className="mr-2" /> Đang lưu...</> : 'Lưu thay đổi'}
      </Button>
    </div>
  </div>
);

// Tab Cài đặt Email
const EmailSettings = ({ settings, handleChange, handleToggle, saveSettings, loading, testEmail }) => (
  <div className="space-y-6">
    <Card className="bg-gray-800">
      <div className="p-6">
        <h3 className="text-lg font-medium text-white mb-4">Cấu hình Email SMTP</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Server SMTP"
            id="smtpServer"
            value={settings.smtpServer}
            onChange={handleChange}
            placeholder="smtp.example.com"
          />
          <FormInput
            label="Cổng SMTP"
            id="smtpPort"
            value={settings.smtpPort}
            onChange={handleChange}
            placeholder="587"
          />
          <FormInput
            label="Tên người dùng SMTP"
            id="smtpUsername"
            value={settings.smtpUsername}
            onChange={handleChange}
            placeholder="username"
          />
          <FormInput
            label="Mật khẩu SMTP"
            id="smtpPassword"
            type="password"
            value={settings.smtpPassword}
            onChange={handleChange}
            placeholder="••••••••"
          />
          <FormInput
            label="Email từ"
            id="emailFrom"
            type="email"
            value={settings.emailFrom}
            onChange={handleChange}
            placeholder="no-reply@example.com"
          />
          <FormSelect
            label="Phương thức mã hóa"
            id="smtpEncryption"
            value={settings.smtpEncryption}
            onChange={handleChange}
            options={[
              { value: 'tls', label: 'TLS' },
              { value: 'ssl', label: 'SSL' },
              { value: 'none', label: 'Không mã hóa' }
            ]}
          />
        </div>
      </div>
    </Card>

    <Card className="bg-gray-800">
      <div className="p-6">
        <h3 className="text-lg font-medium text-white mb-4">Cài đặt thông báo</h3>
        <div className="space-y-0">
          <ToggleSetting
            label="Email chào mừng"
            description="Gửi email chào mừng cho người dùng mới đăng ký"
            id="sendWelcomeEmail"
            checked={settings.sendWelcomeEmail}
            onChange={handleToggle}
          />
          <ToggleSetting
            label="Thông báo đọc bài"
            description="Gửi email thông báo kết quả đọc bài Tarot cho người dùng"
            id="sendReadingNotification"
            checked={settings.sendReadingNotification}
            onChange={handleToggle}
          />
          <ToggleSetting
            label="Bản tin hàng tuần"
            description="Gửi email bản tin hàng tuần cho người dùng đã đăng ký"
            id="sendWeeklyNewsletter"
            checked={settings.sendWeeklyNewsletter}
            onChange={handleToggle}
          />
          <ToggleSetting
            label="Thông báo diễn đàn"
            description="Gửi email thông báo khi có bình luận mới trên bài đăng của người dùng"
            id="sendForumNotifications"
            checked={settings.sendForumNotifications}
            onChange={handleToggle}
          />
        </div>
      </div>
    </Card>

    <div className="flex justify-between">
      <Button 
        variant="outlineDark" 
        onClick={testEmail}
        disabled={loading}
      >
        <Icon name="mail" size="sm" className="mr-2" />
        Gửi email kiểm tra
      </Button>
      <Button 
        variant="solidDark" 
        onClick={saveSettings}
        disabled={loading}
      >
        {loading ? <><Spinner size="sm" className="mr-2" /> Đang lưu...</> : 'Lưu thay đổi'}
      </Button>
    </div>
  </div>
);

// Tab Cài đặt thanh toán
const PaymentSettings = ({ settings, handleChange, handleToggle, saveSettings, loading }) => (
  <div className="space-y-6">
    <Card className="bg-gray-800">
      <div className="p-6">
        <h3 className="text-lg font-medium text-white mb-4">Cài đặt thanh toán</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormSelect
            label="Đơn vị tiền tệ mặc định"
            id="defaultCurrency"
            value={settings.defaultCurrency}
            onChange={handleChange}
            options={[
              { value: 'VND', label: 'VND - Đồng Việt Nam' },
              { value: 'USD', label: 'USD - Đô la Mỹ' }
            ]}
          />
          <FormInput
            label="Phí giao dịch (%)"
            id="transactionFee"
            type="number"
            value={settings.transactionFee}
            onChange={handleChange}
            placeholder="2.5"
          />
        </div>
      </div>
    </Card>

    <Card className="bg-gray-800">
      <div className="p-6">
        <h3 className="text-lg font-medium text-white mb-4">Cấu hình Stripe</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Stripe Public Key"
            id="stripePublicKey"
            value={settings.stripePublicKey}
            onChange={handleChange}
            placeholder="pk_test_..."
          />
          <FormInput
            label="Stripe Secret Key"
            id="stripeSecretKey"
            type="password"
            value={settings.stripeSecretKey}
            onChange={handleChange}
            placeholder="sk_test_..."
          />
          <FormSelect
            label="Chế độ Stripe"
            id="stripeMode"
            value={settings.stripeMode}
            onChange={handleChange}
            options={[
              { value: 'test', label: 'Thử nghiệm' },
              { value: 'live', label: 'Trực tiếp' }
            ]}
          />
          <FormInput
            label="Webhook Secret"
            id="stripeWebhookSecret"
            type="password"
            value={settings.stripeWebhookSecret}
            onChange={handleChange}
            placeholder="whsec_..."
          />
        </div>
      </div>
    </Card>

    <Card className="bg-gray-800">
      <div className="p-6">
        <h3 className="text-lg font-medium text-white mb-4">Cấu hình PayPal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Client ID PayPal"
            id="paypalClientId"
            value={settings.paypalClientId}
            onChange={handleChange}
            placeholder="Ab1cD_eFgH..."
          />
          <FormInput
            label="Client Secret PayPal"
            id="paypalClientSecret"
            type="password"
            value={settings.paypalClientSecret}
            onChange={handleChange}
            placeholder="EabCD12_e..."
          />
          <FormSelect
            label="Chế độ PayPal"
            id="paypalMode"
            value={settings.paypalMode}
            onChange={handleChange}
            options={[
              { value: 'sandbox', label: 'Sandbox' },
              { value: 'live', label: 'Trực tiếp' }
            ]}
          />
        </div>
      </div>
    </Card>

    <Card className="bg-gray-800">
      <div className="p-6">
        <h3 className="text-lg font-medium text-white mb-4">Cài đặt thanh toán khác</h3>
        <div className="space-y-0">
          <ToggleSetting
            label="Cho phép thanh toán qua Stripe"
            description="Cho phép thanh toán qua cổng Stripe"
            id="enableStripe"
            checked={settings.enableStripe}
            onChange={handleToggle}
          />
          <ToggleSetting
            label="Cho phép thanh toán qua PayPal"
            description="Cho phép thanh toán qua cổng PayPal"
            id="enablePaypal"
            checked={settings.enablePaypal}
            onChange={handleToggle}
          />
          <ToggleSetting
            label="Lưu thẻ người dùng"
            description="Cho phép lưu thông tin thẻ người dùng để thanh toán định kỳ"
            id="enableCardSaving"
            checked={settings.enableCardSaving}
            onChange={handleToggle}
          />
          <ToggleSetting
            label="Biên lai tự động"
            description="Tự động gửi biên lai qua email sau khi thanh toán thành công"
            id="enableAutoReceipts"
            checked={settings.enableAutoReceipts}
            onChange={handleToggle}
          />
        </div>
      </div>
    </Card>

    <div className="flex justify-end">
      <Button 
        variant="solidDark" 
        onClick={saveSettings}
        disabled={loading}
      >
        {loading ? <><Spinner size="sm" className="mr-2" /> Đang lưu...</> : 'Lưu thay đổi'}
      </Button>
    </div>
  </div>
);

// Tab Cài đặt bảo mật
const SecuritySettings = ({ settings, handleChange, handleToggle, saveSettings, loading }) => (
  <div className="space-y-6">
    <Card className="bg-gray-800">
      <div className="p-6">
        <h3 className="text-lg font-medium text-white mb-4">Cài đặt đăng nhập</h3>
        <div className="space-y-0">
          <ToggleSetting
            label="Xác thực hai yếu tố"
            description="Yêu cầu xác thực hai yếu tố cho tất cả tài khoản admin"
            id="requireAdminTwoFactor"
            checked={settings.requireAdminTwoFactor}
            onChange={handleToggle}
          />
          <ToggleSetting
            label="Đăng nhập một lần"
            description="Cho phép đăng nhập một lần (Single Sign-On) qua Google, Facebook"
            id="enableSingleSignOn"
            checked={settings.enableSingleSignOn}
            onChange={handleToggle}
          />
          <ToggleSetting
            label="Khóa tài khoản"
            description="Khóa tài khoản sau nhiều lần đăng nhập thất bại"
            id="enableAccountLockout"
            checked={settings.enableAccountLockout}
            onChange={handleToggle}
          />
          <FormInput
            label="Số lần đăng nhập thất bại tối đa"
            id="maxFailedLoginAttempts"
            type="number"
            value={settings.maxFailedLoginAttempts}
            onChange={handleChange}
            placeholder="5"
            disabled={!settings.enableAccountLockout}
            className="mt-4"
          />
          <FormInput
            label="Thời gian khóa tài khoản (phút)"
            id="accountLockoutDuration"
            type="number"
            value={settings.accountLockoutDuration}
            onChange={handleChange}
            placeholder="30"
            disabled={!settings.enableAccountLockout}
            className="mt-4"
          />
        </div>
      </div>
    </Card>

    <Card className="bg-gray-800">
      <div className="p-6">
        <h3 className="text-lg font-medium text-white mb-4">Chính sách mật khẩu</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Độ dài mật khẩu tối thiểu"
            id="minPasswordLength"
            type="number"
            value={settings.minPasswordLength}
            onChange={handleChange}
            placeholder="8"
          />
          <FormInput
            label="Thời gian hiệu lực mật khẩu (ngày)"
            id="passwordExpiryDays"
            type="number"
            value={settings.passwordExpiryDays}
            onChange={handleChange}
            placeholder="90"
          />
        </div>
        <div className="mt-4 space-y-0">
          <ToggleSetting
            label="Yêu cầu chữ hoa"
            description="Mật khẩu phải chứa ít nhất một chữ cái viết hoa"
            id="requireUppercase"
            checked={settings.requireUppercase}
            onChange={handleToggle}
          />
          <ToggleSetting
            label="Yêu cầu số"
            description="Mật khẩu phải chứa ít nhất một chữ số"
            id="requireNumbers"
            checked={settings.requireNumbers}
            onChange={handleToggle}
          />
          <ToggleSetting
            label="Yêu cầu ký tự đặc biệt"
            description="Mật khẩu phải chứa ít nhất một ký tự đặc biệt (!@#$%^&*)"
            id="requireSpecialChars"
            checked={settings.requireSpecialChars}
            onChange={handleToggle}
          />
        </div>
      </div>
    </Card>

    <Card className="bg-gray-800">
      <div className="p-6">
        <h3 className="text-lg font-medium text-white mb-4">Cài đặt phiên đăng nhập</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Thời gian phiên đăng nhập (phút)"
            id="sessionTimeout"
            type="number"
            value={settings.sessionTimeout}
            onChange={handleChange}
            placeholder="60"
          />
          <FormInput
            label="Thời gian cookie nhớ đăng nhập (ngày)"
            id="rememberMeDuration"
            type="number"
            value={settings.rememberMeDuration}
            onChange={handleChange}
            placeholder="30"
          />
        </div>
      </div>
    </Card>

    <div className="flex justify-end">
      <Button 
        variant="solidDark" 
        onClick={saveSettings}
        disabled={loading}
      >
        {loading ? <><Spinner size="sm" className="mr-2" /> Đang lưu...</> : 'Lưu thay đổi'}
      </Button>
    </div>
  </div>
);

// Tab Quản lý tính năng
const FeaturesSettings = ({ settings, handleToggle, saveSettings, loading }) => (
  <div className="space-y-6">
    <Card className="bg-gray-800">
      <div className="p-6">
        <h3 className="text-lg font-medium text-white mb-4">Quản lý tính năng</h3>
        <div className="space-y-0">
          <ToggleSetting
            label="Tính năng đọc bài Tarot"
            description="Cho phép người dùng sử dụng tính năng đọc bài Tarot"
            id="enableTarotReadings"
            checked={settings.enableTarotReadings}
            onChange={handleToggle}
          />
          <ToggleSetting
            label="Diễn đàn thảo luận"
            description="Cho phép người dùng tham gia diễn đàn thảo luận"
            id="enableForum"
            checked={settings.enableForum}
            onChange={handleToggle}
          />
          <ToggleSetting
            label="Nhật ký cá nhân"
            description="Cho phép người dùng lưu trữ nhật ký cá nhân"
            id="enableJournal"
            checked={settings.enableJournal}
            onChange={handleToggle}
          />
          <ToggleSetting
            label="Tính năng Premium"
            description="Bật/tắt tất cả các tính năng dành cho người dùng Premium"
            id="enablePremiumFeatures"
            checked={settings.enablePremiumFeatures}
            onChange={handleToggle}
          />
          <ToggleSetting
            label="Diễn giải với AI"
            description="Cho phép sử dụng AI để diễn giải kết quả đọc bài Tarot"
            id="enableAIInterpretation"
            checked={settings.enableAIInterpretation}
            onChange={handleToggle}
          />
          <ToggleSetting
            label="Báo cáo thống kê"
            description="Cho phép người dùng xem báo cáo thống kê về các lần đọc bài"
            id="enableReadingStats"
            checked={settings.enableReadingStats}
            onChange={handleToggle}
          />
          <ToggleSetting
            label="Tính năng chia sẻ xã hội"
            description="Cho phép người dùng chia sẻ kết quả đọc bài lên mạng xã hội"
            id="enableSocialSharing"
            checked={settings.enableSocialSharing}
            onChange={handleToggle}
          />
          <ToggleSetting
            label="Thẻ bài hàng ngày"
            description="Bật tính năng thẻ bài Tarot hàng ngày"
            id="enableDailyCard"
            checked={settings.enableDailyCard}
            onChange={handleToggle}
          />
        </div>
      </div>
    </Card>

    <Card className="bg-gray-800">
      <div className="p-6">
        <h3 className="text-lg font-medium text-white mb-4">Tính năng đang thử nghiệm</h3>
        <div className="space-y-0">
          <ToggleSetting
            label="Phân tích cảm xúc"
            description="Phân tích cảm xúc dựa trên nhật ký người dùng (Beta)"
            id="enableEmotionAnalysis"
            checked={settings.enableEmotionAnalysis}
            onChange={handleToggle}
          />
          <ToggleSetting
            label="Đọc bài nâng cao"
            description="Cho phép sử dụng mô hình đọc bài nâng cao (Beta)"
            id="enableAdvancedReadings"
            checked={settings.enableAdvancedReadings}
            onChange={handleToggle}
          />
          <ToggleSetting
            label="Tùy chỉnh chủ đề"
            description="Cho phép người dùng tùy chỉnh giao diện (Beta)"
            id="enableCustomThemes"
            checked={settings.enableCustomThemes}
            onChange={handleToggle}
          />
        </div>
      </div>
    </Card>

    <div className="flex justify-end">
      <Button 
        variant="solidDark" 
        onClick={saveSettings}
        disabled={loading}
      >
        {loading ? <><Spinner size="sm" className="mr-2" /> Đang lưu...</> : 'Lưu thay đổi'}
      </Button>
    </div>
  </div>
);

// Component chính
const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Dữ liệu mẫu cho các cài đặt
  const [settings, setSettings] = useState({
    // Cài đặt chung
    siteName: 'Tarot Online',
    siteUrl: 'https://tarot-online.example.com',
    contactEmail: 'contact@tarot-online.example.com',
    defaultLanguage: 'vi',
    maintenanceMode: false,
    showReadingCount: true,
    allowComments: true,
    showTrendingReports: true,
    
    // Cài đặt email
    smtpServer: 'smtp.example.com',
    smtpPort: '587',
    smtpUsername: 'noreply@example.com',
    smtpPassword: '******',
    emailFrom: 'noreply@example.com',
    smtpEncryption: 'tls',
    sendWelcomeEmail: true,
    sendReadingNotification: true,
    sendWeeklyNewsletter: false,
    sendForumNotifications: true,
    
    // Cài đặt thanh toán
    defaultCurrency: 'VND',
    transactionFee: '2.5',
    stripePublicKey: 'pk_test_...',
    stripeSecretKey: '********',
    stripeMode: 'test',
    stripeWebhookSecret: '********',
    paypalClientId: 'Ab1cD_...',
    paypalClientSecret: '********',
    paypalMode: 'sandbox',
    enableStripe: true,
    enablePaypal: true,
    enableCardSaving: false,
    enableAutoReceipts: true,
    
    // Cài đặt bảo mật
    requireAdminTwoFactor: true,
    enableSingleSignOn: true,
    enableAccountLockout: true,
    maxFailedLoginAttempts: '5',
    accountLockoutDuration: '30',
    minPasswordLength: '8',
    passwordExpiryDays: '90',
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
    sessionTimeout: '120',
    rememberMeDuration: '30',
    
    // Quản lý tính năng
    enableTarotReadings: true,
    enableForum: true,
    enableJournal: true,
    enablePremiumFeatures: true,
    enableAIInterpretation: true,
    enableReadingStats: true,
    enableSocialSharing: true,
    enableDailyCard: true,
    enableEmotionAnalysis: false,
    enableAdvancedReadings: false,
    enableCustomThemes: false
  });

  useEffect(() => {
    // Mô phỏng việc tải cài đặt từ API
    setLoading(true);
    setTimeout(() => {
      // Đã tải xong
      setLoading(false);
    }, 1000);
  }, []);

  // Xử lý thay đổi giá trị input
  const handleChange = (id, value) => {
    setSettings(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Xử lý thay đổi toggle
  const handleToggle = (id, value) => {
    setSettings(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Xử lý lưu cài đặt
  const saveSettings = () => {
    setLoading(true);
    // Mô phỏng API call
    setTimeout(() => {
      setLoading(false);
      setSaveSuccess(true);
      
      // Ẩn thông báo thành công sau 3 giây
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1500);
  };

  // Xử lý gửi email kiểm tra
  const testEmail = () => {
    setLoading(true);
    // Mô phỏng API call
    setTimeout(() => {
      setLoading(false);
      alert('Email kiểm tra đã được gửi thành công!');
    }, 1500);
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Cài đặt hệ thống</h1>
        <p className="text-gray-400">Cấu hình và quản lý cài đặt hệ thống</p>
      </div>

      {/* Thông báo lưu thành công */}
      {saveSuccess && (
        <div className="bg-green-600 text-white p-4 rounded-lg mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Icon name="check-circle" className="mr-2" />
            <span>Cài đặt đã được lưu thành công!</span>
          </div>
          <button onClick={() => setSaveSuccess(false)}>
            <Icon name="x" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-700">
        <div className="flex flex-wrap -mb-px">
          <TabButton
            active={activeTab === 'general'}
            onClick={() => setActiveTab('general')}
          >
            <div className="flex items-center">
              <Icon name="settings" size="sm" className="mr-2" />
              Cài đặt chung
            </div>
          </TabButton>
          <TabButton
            active={activeTab === 'email'}
            onClick={() => setActiveTab('email')}
          >
            <div className="flex items-center">
              <Icon name="mail" size="sm" className="mr-2" />
              Email
            </div>
          </TabButton>
          <TabButton
            active={activeTab === 'payment'}
            onClick={() => setActiveTab('payment')}
          >
            <div className="flex items-center">
              <Icon name="credit-card" size="sm" className="mr-2" />
              Thanh toán
            </div>
          </TabButton>
          <TabButton
            active={activeTab === 'security'}
            onClick={() => setActiveTab('security')}
          >
            <div className="flex items-center">
              <Icon name="shield" size="sm" className="mr-2" />
              Bảo mật
            </div>
          </TabButton>
          <TabButton
            active={activeTab === 'features'}
            onClick={() => setActiveTab('features')}
          >
            <div className="flex items-center">
              <Icon name="toggle-left" size="sm" className="mr-2" />
              Tính năng
            </div>
          </TabButton>
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-4">
        {activeTab === 'general' && (
          <GeneralSettings 
            settings={settings} 
            handleChange={handleChange} 
            handleToggle={handleToggle} 
            saveSettings={saveSettings}
            loading={loading}
          />
        )}
        {activeTab === 'email' && (
          <EmailSettings 
            settings={settings} 
            handleChange={handleChange} 
            handleToggle={handleToggle} 
            saveSettings={saveSettings}
            loading={loading}
            testEmail={testEmail}
          />
        )}
        {activeTab === 'payment' && (
          <PaymentSettings 
            settings={settings} 
            handleChange={handleChange} 
            handleToggle={handleToggle} 
            saveSettings={saveSettings}
            loading={loading}
          />
        )}
        {activeTab === 'security' && (
          <SecuritySettings 
            settings={settings} 
            handleChange={handleChange} 
            handleToggle={handleToggle} 
            saveSettings={saveSettings}
            loading={loading}
          />
        )}
        {activeTab === 'features' && (
          <FeaturesSettings 
            settings={settings} 
            handleToggle={handleToggle} 
            saveSettings={saveSettings}
            loading={loading}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default SystemSettings; 