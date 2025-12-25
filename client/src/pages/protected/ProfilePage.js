import React, { useState, memo, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from '../../shared/ui/NavBar';
import Footer from '../../shared/ui/Footer';
import { fetchCurrentUser } from '../../features/auth/slices/authSlice';
import axios from 'axios';
import { API_URL, CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../../config/constants';
import { toast } from 'react-toastify';
import { AnimatePresence } from 'framer-motion';
import PasswordChangeForm from '../../features/auth/components/PasswordChangeForm';
import tarotService from '../../features/tarot/services/tarot.service';

// Tạo axiosInstance với cấu hình đúng
const axiosInstance = axios.create({
  baseURL: API_URL
});

// Set token khi component mount
const setAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  }
  return {};
};

// Components
const SectionTitle = memo(({ title, subtitle, centered = false, light = true }) => (
  <div className={`mb-10 ${centered ? 'text-center' : ''}`}>
    <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${light ? 'text-white' : 'text-[#9370db]'} tracking-vn-tight`}>
      {title}
      <span className="block h-1 w-20 bg-gradient-to-r from-[#9370db] to-[#8a2be2] mt-2 rounded-full"></span>
    </h2>
    {subtitle && <p className={`${light ? 'text-gray-300' : 'text-gray-600'} text-lg tracking-vn-tight leading-vn`}>{subtitle}</p>}
  </div>
));

const ProfileInfoItem = memo(({ label, value, icon, isEditing, onChange, name, type = "text" }) => (
  <div className="mb-6">
    <label className="block text-[#9370db] mb-2 text-sm font-medium tracking-vn-tight flex items-center">
      <span className="mr-2 text-[#9370db]">{icon}</span>
      {label}
    </label>
    {isEditing ? (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm border border-purple-900/30 rounded-lg text-white focus:outline-none focus:border-[#9370db] transition-colors tracking-vn-tight"
      />
    ) : (
      <div className="px-4 py-3 bg-white/5 backdrop-blur-sm border border-purple-900/20 rounded-lg text-white tracking-vn-tight">
        {value || 'Chưa cập nhật'}
      </div>
    )}
  </div>
));

const TarotSessionItem = memo(({ id, date, reading, image, result }) => (
  <div className="flex items-center bg-white/5 backdrop-blur-sm border border-purple-900/20 p-4 rounded-xl mb-4 hover:bg-white/10 transition-colors">
    <div className="w-16 h-16 min-w-16 rounded-lg overflow-hidden mr-4">
      <img src={image} alt={reading} className="w-full h-full object-cover" />
    </div>
    <div className="flex-1">
      <h4 className="text-white font-medium tracking-vn-tight mb-1">{reading}</h4>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400 tracking-vn-tight">{new Date(date).toLocaleDateString('vi-VN')}</p>
        <span className="text-xs px-2 py-1 rounded-full bg-[#9370db]/20 text-[#9370db] tracking-vn-tight">{result}</span>
      </div>
    </div>
    <Link to={`/reading-history/${id}`} className="ml-4 p-2 text-[#9370db] hover:text-white transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  </div>
));

const BadgeItem = memo(({ title, description, icon, level, progress }) => (
  <div className="bg-white/5 backdrop-blur-sm border border-purple-900/20 p-4 rounded-xl text-center">
    <div className="w-16 h-16 rounded-full bg-[#2a1045] flex items-center justify-center mx-auto mb-3">
      <span className="text-2xl">{icon}</span>
    </div>
    <h4 className="text-white font-medium tracking-vn-tight mb-1">{title}</h4>
    <p className="text-sm text-gray-400 tracking-vn-tight mb-3">{description}</p>
    <div className="relative h-2 bg-white/10 rounded-full overflow-hidden mb-1">
      <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#9370db] to-[#8a2be2]" style={{ width: `${progress}%` }}></div>
    </div>
    <p className="text-xs text-gray-400 tracking-vn-tight">Cấp độ {level}</p>
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

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    phone: "",
    birthdate: "",
    address: "",
    bio: "",
    avatar: ""
  });
  const [profileError, setProfileError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Sử dụng useRef thay vì useState để không gây re-render
  const hasInitialized = useRef(false);

  // Fetch user data when component mounts - chỉ thực hiện 1 lần
  useEffect(() => {
    // Chỉ fetch dữ liệu khi component đầu tiên được mount và chưa từng fetch
    if (!hasInitialized.current && user === null) {
      const fetchData = async () => {
        try {
          await dispatch(fetchCurrentUser()).unwrap();
          setProfileError(null);
        } catch (err) {
          console.error("Error fetching user profile:", err);
          setProfileError("Không thể tải thông tin người dùng. Vui lòng thử lại sau.");
        }
      };

      fetchData();
      hasInitialized.current = true;
    }
  }, [dispatch, user]);

  // Update local state when user data changes
  useEffect(() => {
    if (user) {
      console.log("User data received:", user);
      const profile = user.profile || {};
      setUserProfile({
        name: profile.full_name || profile.fullName || user.username || "",
        email: user.email || "",
        phone: profile.phone_number || profile.phoneNumber || "",
        birthdate: profile.birth_date || profile.birthDate || "",
        address: profile.city && profile.country ?
          `${profile.city}, ${profile.country}` :
          (profile.country || profile.address || ""),
        bio: profile.bio || "",
        avatar: profile.avatar_url || profile.avatarUrl || ""
      });
    }
  }, [user]);

  // State for stats and readings
  const [stats, setStats] = useState({
    totalReadings: 0
  });
  const [recentReadings, setRecentReadings] = useState([]);

  // Fetch usage stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await tarotService.getUserReadings(1, 3);
        if (response && response.status === 'success') {
          setStats({
            totalReadings: response.total
          });
          setRecentReadings(response.data.readings);
        }
      } catch (err) {
        console.error("Failed to fetch profile stats", err);
      }
    };
    fetchStats();
  }, []);

  const formatReadingResult = (reading) => {
    // Determine a simple "result" label based on domain or arbitrary logic for UI
    if (reading.domain === 'love') return 'Tình cảm';
    if (reading.domain === 'career') return 'Công việc';
    if (reading.domain === 'money') return 'Tài chính';
    return 'Tổng quan';
  };


  // Danh sách huy hiệu - trong thực tế sẽ lấy từ API
  const badges = [
    {
      title: "Nhà Khám Phá",
      description: "Đã hoàn thành 5 lần xem bói",
      icon: "🔮",
      level: 1,
      progress: 60
    },
    {
      title: "Tâm Linh Học",
      description: "Đã xem 10 loại trải bài khác nhau",
      icon: "🧠",
      level: 2,
      progress: 45
    },
    {
      title: "Hiền Triết",
      description: "Đã đọc 20 bài viết trên diễn đàn",
      icon: "📚",
      level: 1,
      progress: 30
    },
    {
      title: "Cộng Đồng",
      description: "Đã tham gia thảo luận trên diễn đàn",
      icon: "👥",
      level: 1,
      progress: 15
    }
  ];

  const handleProfileChange = (field, value) => {
    setUserProfile({
      ...userProfile,
      [field]: value
    });
  };

  const handleRetry = () => {
    setProfileError(null);
    dispatch(fetchCurrentUser());
  };

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setProfileError(null);

      // Log file info
      console.log('File selected:', file.name, file.type, file.size);

      // Tạo URL ảnh giả để test trước
      // Thêm ảnh tạm thời từ file đã chọn
      const tempImageUrl = URL.createObjectURL(file);

      // Cập nhật state với URL tạm thời
      setUserProfile({
        ...userProfile,
        avatar: tempImageUrl
      });

      setProfileError("Đã tải lên ảnh tạm thời. Chức năng upload sẽ được hoàn thiện trong phiên bản tiếp theo.");
      setIsUploading(false);

      // Thông báo cho người dùng
      console.log('Using temporary local file URL instead of uploading to Cloudinary');

      /* Chức năng upload sẽ được cập nhật sau khi cấu hình Cloudinary được hoàn tất
      // Tạo form data để upload lên Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');
      
      // URL upload API với cloud name
      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
      
      // Upload file lên Cloudinary
      const uploadResponse = await axios.post(uploadUrl, formData);

      // Lấy URL ảnh đã upload
      const imageUrl = uploadResponse.data.secure_url;
      
      // Cập nhật state
      setUserProfile({
        ...userProfile,
        avatar: imageUrl
      });
      */
    } catch (error) {
      console.error("Error handling file:", error);
      setProfileError("Không thể xử lý file ảnh. Vui lòng thử lại hoặc chọn file khác.");
      setIsUploading(false);
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";

    // Chuyển đổi định dạng ngày tháng thành YYYY-MM-DD cho input type="date"
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (e) {
      return dateString;
    }
  };

  const handleSaveProfile = async () => {
    try {
      console.log("Saving profile:", userProfile);

      // Chuyển đổi dữ liệu để phù hợp với API
      const profileData = {
        fullName: userProfile.name,
        bio: userProfile.bio,
        phoneNumber: userProfile.phone,
        birthDate: userProfile.birthdate,
        avatarUrl: userProfile.avatar,
        // Phân tách địa chỉ thành city và country nếu có dấu phẩy
        ...(userProfile.address && userProfile.address.includes(',')
          ? {
            city: userProfile.address.split(',')[0].trim(),
            country: userProfile.address.split(',')[1].trim()
          }
          : { country: userProfile.address })
      };

      console.log("Sending profile data to API:", profileData);
      console.log("Headers:", setAuthHeader());

      // Gọi API cập nhật profile với axiosInstance
      const headers = setAuthHeader();
      const response = await axiosInstance.put('/users/profile', profileData, { headers });

      console.log("Profile update response:", response);

      // Cập nhật lại dữ liệu người dùng
      dispatch(fetchCurrentUser());

      // Tắt chế độ chỉnh sửa
      setIsEditing(false);
      setProfileError(null);
    } catch (error) {
      console.error("Error updating profile:", error);

      // Hiển thị thông báo lỗi chi tiết từ server nếu có
      if (error.response) {
        // Server trả về lỗi với status code
        console.error("Server responded with error:", error.response);
        const errorMessage = error.response.data?.message || "Cập nhật thông tin không thành công. Vui lòng thử lại.";
        setProfileError(errorMessage);
      } else if (error.request) {
        // Không nhận được phản hồi từ server
        console.error("No response received:", error.request);
        setProfileError("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.");
      } else {
        // Lỗi trong quá trình thiết lập request
        setProfileError("Cập nhật thông tin không thành công: " + error.message);
      }
    }
  };

  const handlePasswordSuccess = () => {
    setShowPasswordForm(false);
    toast.success('Đổi mật khẩu thành công!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  // JSX phần hiển thị nút thử lại
  const retryButton = (
    <div className="bg-red-500/20 border border-red-500/30 p-4 rounded-lg text-white text-center">
      <p>{profileError}</p>
      <button
        onClick={handleRetry}
        className="mt-4 bg-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors tracking-vn-tight"
      >
        Thử lại
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0933] to-[#0f051d] text-white relative overflow-hidden">
      <Helmet>
        <title>Hồ Sơ Người Dùng | Bói Tarot</title>
        <meta name="description" content="Quản lý hồ sơ cá nhân và xem lại lịch sử các lần xem bói Tarot của bạn." />
      </Helmet>

      <MysticBackground />
      <Navbar />

      {/* Password Change Form */}
      <AnimatePresence>
        {showPasswordForm && (
          <PasswordChangeForm
            onClose={() => setShowPasswordForm(false)}
            onSuccess={handlePasswordSuccess}
          />
        )}
      </AnimatePresence>

      {/* Profile Section */}
      <section className="relative pt-32 pb-16 px-4 md:px-8">
        <div className="container mx-auto max-w-5xl relative z-10">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9370db]"></div>
            </div>
          ) : profileError ? (
            retryButton
          ) : (
            <div className="flex flex-col md:flex-row gap-10">
              {/* Left Column - Profile Info */}
              <div className="w-full md:w-2/3 space-y-8">
                <div className="flex items-center justify-between mb-6">
                  <SectionTitle
                    title="Hồ Sơ Cá Nhân"
                    subtitle="Thông tin và cài đặt tài khoản của bạn"
                  />

                  {isEditing ? (
                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveProfile}
                        className="bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-shadow tracking-vn-tight"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors tracking-vn-tight"
                      >
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors tracking-vn-tight"
                    >
                      Chỉnh sửa
                    </button>
                  )}
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-purple-900/20 p-6 rounded-xl">
                  {profileError && (
                    <div className="mb-6 bg-red-500/20 border border-red-500/30 p-4 rounded-lg text-white text-center">
                      <p>{profileError}</p>
                      <button
                        onClick={() => setProfileError(null)}
                        className="mt-2 bg-white/10 text-white px-3 py-1 text-sm rounded-lg font-medium hover:bg-white/20 transition-colors tracking-vn-tight"
                      >
                        Đóng
                      </button>
                    </div>
                  )}

                  <div className="flex items-center mb-6">
                    <div className="relative mr-6">
                      {/* File input hidden */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />

                      {/* Avatar display */}
                      <div
                        onClick={handleAvatarClick}
                        className={`w-24 h-24 rounded-full ${isEditing ? 'cursor-pointer' : ''} overflow-hidden relative ${isEditing ? 'hover:opacity-80 transition-opacity' : ''
                          }`}
                      >
                        {userProfile.avatar ? (
                          <img
                            src={userProfile.avatar}
                            alt={userProfile.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-[#9370db] to-[#8a2be2] flex items-center justify-center">
                            <span className="text-white text-3xl font-medium">{userProfile.name.charAt(0).toUpperCase()}</span>
                          </div>
                        )}

                        {/* Upload progress */}
                        {isUploading && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="w-16 h-16 relative">
                              <svg className="w-full h-full" viewBox="0 0 100 100">
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="45"
                                  fill="none"
                                  stroke="#9370db"
                                  strokeWidth="8"
                                  strokeDasharray="283"
                                  strokeDashoffset={283 - (283 * uploadProgress) / 100}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <span className="absolute inset-0 flex items-center justify-center text-white text-xs">
                                {uploadProgress}%
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Camera button for avatar upload in edit mode */}
                      {isEditing && (
                        <button
                          onClick={handleAvatarClick}
                          className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#9370db] flex items-center justify-center hover:bg-[#8a2be2] transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white tracking-vn-tight">{userProfile.name}</h3>
                      <p className="text-gray-400 tracking-vn-tight">Thành viên từ {new Date().toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileInfoItem
                      label="Họ và tên"
                      value={userProfile.name}
                      icon="👤"
                      isEditing={isEditing}
                      onChange={handleProfileChange}
                      name="name"
                    />
                    <ProfileInfoItem
                      label="Email"
                      value={userProfile.email}
                      icon="📧"
                      isEditing={isEditing}
                      onChange={handleProfileChange}
                      name="email"
                    />
                    <ProfileInfoItem
                      label="Số điện thoại"
                      value={userProfile.phone}
                      icon="📱"
                      isEditing={isEditing}
                      onChange={handleProfileChange}
                      name="phone"
                    />
                    <ProfileInfoItem
                      label="Ngày sinh"
                      icon="🎂"
                      isEditing={isEditing}
                      onChange={handleProfileChange}
                      name="birthdate"
                      type="date"
                      // Nếu đang chỉnh sửa, hiển thị ngày theo định dạng YYYY-MM-DD cho input type="date"
                      value={isEditing ? formatDateForInput(userProfile.birthdate) : (userProfile.birthdate ? new Date(userProfile.birthdate).toLocaleDateString('vi-VN') : '')}
                    />
                    <ProfileInfoItem
                      label="Địa chỉ"
                      value={userProfile.address}
                      icon="🏠"
                      isEditing={isEditing}
                      onChange={handleProfileChange}
                      name="address"
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block text-[#9370db] mb-2 text-sm font-medium tracking-vn-tight flex items-center">
                      <span className="mr-2 text-[#9370db]">📝</span>
                      Giới thiệu về bản thân
                    </label>
                    {isEditing ? (
                      <textarea
                        value={userProfile.bio}
                        onChange={(e) => handleProfileChange("bio", e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm border border-purple-900/30 rounded-lg text-white focus:outline-none focus:border-[#9370db] transition-colors tracking-vn-tight"
                      ></textarea>
                    ) : (
                      <div className="px-4 py-3 bg-white/5 backdrop-blur-sm border border-purple-900/20 rounded-lg text-white tracking-vn-tight min-h-20">
                        {userProfile.bio || 'Chưa cập nhật'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Security Section */}
                <div className="bg-white/5 backdrop-blur-sm border border-purple-900/20 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-white tracking-vn-tight mb-4">Bảo mật tài khoản</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-purple-900/20">
                      <div>
                        <p className="text-white tracking-vn-tight">Đổi mật khẩu</p>
                        <p className="text-sm text-gray-400 tracking-vn-tight">Cập nhật mật khẩu để bảo vệ tài khoản</p>
                      </div>
                      <button
                        onClick={() => setShowPasswordForm(true)}
                        className="bg-white/10 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-white/20 transition-colors tracking-vn-tight text-sm"
                      >
                        Đổi mật khẩu
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recent Readings Section */}
                <div className="bg-white/5 backdrop-blur-sm border border-purple-900/20 p-6 rounded-xl">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white tracking-vn-tight">Lịch sử xem gần đây</h3>
                    <Link to="/reading-history" className="text-[#9370db] hover:text-white transition-colors text-sm tracking-vn-tight">
                      Xem tất cả
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {recentReadings.length > 0 ? recentReadings.map(reading => (
                      <TarotSessionItem
                        key={reading.id}
                        id={reading.id}
                        date={reading.created_at}
                        reading={`Bói bài ${reading.domain === 'love' ? 'Tình Yêu' : reading.domain === 'career' ? 'Sự Nghiệp' : 'Tổng Quan'}`}
                        image="https://placehold.co/100x100/9370db/white?text=Tarot"
                        result={formatReadingResult(reading)}
                      />
                    )) : (
                      <p className="text-gray-400 text-center py-4">Chưa có lịch sử xem bói.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Stats & Achievements */}
              <div className="w-full md:w-1/3 space-y-8">
                {/* Stats */}
                <div className="bg-white/5 backdrop-blur-sm border border-purple-900/20 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-white tracking-vn-tight mb-4">Thống kê</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-purple-900/20">
                      <p className="text-gray-300 tracking-vn-tight">Số lần xem bói</p>
                      <p className="text-white font-medium tracking-vn-tight">{stats.totalReadings}</p>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-purple-900/20">
                      <p className="text-gray-300 tracking-vn-tight">Loại bói phổ biến</p>
                      <p className="text-white font-medium tracking-vn-tight">Tổng hợp</p>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-purple-900/20">
                      <p className="text-gray-300 tracking-vn-tight">Bài viết trên diễn đàn</p>
                      <p className="text-white font-medium tracking-vn-tight">0</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-300 tracking-vn-tight">Thành viên từ</p>
                      <p className="text-white font-medium tracking-vn-tight">{user?.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Membership */}
                <div className="bg-gradient-to-r from-[#2a1045] to-[#3a1c5a] p-6 rounded-xl relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-[#9370db]/20 rounded-full filter blur-[30px]"></div>
                  <div className="absolute left-0 bottom-0 w-24 h-24 bg-[#8a2be2]/20 rounded-full filter blur-[20px]"></div>

                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-white tracking-vn-tight">Hạng thành viên</h3>
                      <div className="px-2 py-1 rounded-full bg-[#9370db]/20">
                        <span className="text-xs text-[#9370db] tracking-vn-tight font-medium">Premium</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-gray-300 text-sm tracking-vn-tight">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#9370db]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Không giới hạn bói bài bằng AI</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-300 text-sm tracking-vn-tight">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#9370db]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Bói 1 lá thông điệp hàng ngày</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-300 text-sm tracking-vn-tight">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#9370db]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Tạo và lưu nhật ký hàng ngày</span>
                      </div>
                    </div>

                    <button className="mt-6 w-full bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-shadow tracking-vn-tight text-center">
                      Nâng cấp lên Premium
                    </button>
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h3 className="text-xl font-bold text-white tracking-vn-tight mb-4">Thành tựu</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {badges.map((badge, index) => (
                      <BadgeItem
                        key={index}
                        title={badge.title}
                        description={badge.description}
                        icon={badge.icon}
                        level={badge.level}
                        progress={badge.progress}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default memo(ProfilePage); 