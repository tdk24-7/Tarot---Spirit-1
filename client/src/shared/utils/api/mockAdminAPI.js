// Mock API for admin functionality
// This provides mock endpoints for admin operations

import { mockLogin } from './mockAuthAPI';

// Simulated delay (ms)
const MOCK_DELAY = 800;

// Simulate API delay
const delay = (ms = MOCK_DELAY) => new Promise(resolve => setTimeout(resolve, ms));

// Admin accounts
const adminAccounts = [
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin1@tarot.vn',
    password: 'Admin@123',
    role: 'admin',
    isAdmin: true,
    is_premium: true,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: 'admin2',
    name: 'Super Admin',
    email: 'superadmin@tarot.vn',
    password: 'Super@123',
    role: 'admin',
    isAdmin: true,
    is_premium: true,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  }
];

// Initialize admin accounts in localStorage if they don't exist
const initializeAdminAccounts = () => {
  const existingUsers = JSON.parse(localStorage.getItem('mockUsers')) || [];
  let updated = false;

  adminAccounts.forEach(admin => {
    if (!existingUsers.some(user => user.email === admin.email)) {
      existingUsers.push(admin);
      updated = true;
    }
  });

  if (updated) {
    localStorage.setItem('mockUsers', JSON.stringify(existingUsers));
    console.log('Admin accounts initialized in localStorage');
  }
};

// Mock login with admin credentials
export const mockAdminLogin = async (email, password) => {
  // Ensure admin accounts are initialized
  initializeAdminAccounts();
  
  await delay();
  
  // Tìm tài khoản admin từ email
  const adminUser = adminAccounts.find(admin => admin.email.toLowerCase() === email.toLowerCase());
  
  if (!adminUser) {
    throw { message: 'Email không tồn tại trong hệ thống' };
  }
  
  if (adminUser.password !== password) {
    throw { message: 'Mật khẩu không chính xác' };
  }
  
  // Create safe user object (without password)
  const safeUser = { ...adminUser };
  delete safeUser.password;
  
  // Đảm bảo thuộc tính isAdmin được đặt thành true
  safeUser.isAdmin = true;
  
  // Generate a token
  const token = `mock-jwt-token-${adminUser.id}-${Date.now()}`;
  
  return {
    user: safeUser,
    token,
    message: 'Đăng nhập admin thành công'
  };
};

// Mock create admin account
export const mockCreateAdminAccount = async (userData) => {
  await delay();
  
  const existingUsers = JSON.parse(localStorage.getItem('mockUsers')) || [];
  
  // Check if email already exists
  if (existingUsers.some(user => user.email === userData.email)) {
    throw { message: 'Email đã được sử dụng' };
  }
  
  // Create new admin user
  const newAdmin = {
    id: `admin_${Date.now()}`,
    ...userData,
    role: 'admin',
    is_premium: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // Add to users list
  existingUsers.push(newAdmin);
  localStorage.setItem('mockUsers', JSON.stringify(existingUsers));
  
  // Return safe user object (without password)
  const safeUser = { ...newAdmin };
  delete safeUser.password;
  
  return {
    user: safeUser,
    message: 'Tài khoản admin đã được tạo thành công'
  };
};

// Mock get all users (admin function)
export const mockGetAllUsers = async () => {
  await delay();
  
  const allUsers = JSON.parse(localStorage.getItem('mockUsers')) || [];
  
  // Remove sensitive information
  const safeUsers = allUsers.map(user => {
    const { password, ...safeUser } = user;
    return safeUser;
  });
  
  return safeUsers;
};

// Mock update user role
export const mockUpdateUserRole = async (userId, newRole) => {
  await delay();
  
  const allUsers = JSON.parse(localStorage.getItem('mockUsers')) || [];
  const userIndex = allUsers.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    throw { message: 'Người dùng không tồn tại' };
  }
  
  // Update user role
  allUsers[userIndex].role = newRole;
  allUsers[userIndex].updated_at = new Date().toISOString();
  
  // Save back to localStorage
  localStorage.setItem('mockUsers', JSON.stringify(allUsers));
  
  // Return updated user (without password)
  const { password, ...safeUser } = allUsers[userIndex];
  
  return {
    user: safeUser,
    message: 'Cập nhật quyền người dùng thành công'
  };
};

// Mock delete user (admin function)
export const mockDeleteUser = async (userId) => {
  await delay();
  
  const allUsers = JSON.parse(localStorage.getItem('mockUsers')) || [];
  const userIndex = allUsers.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    throw { message: 'Người dùng không tồn tại' };
  }
  
  // Remove user
  allUsers.splice(userIndex, 1);
  
  // Save back to localStorage
  localStorage.setItem('mockUsers', JSON.stringify(allUsers));
  
  return {
    message: 'Xóa người dùng thành công'
  };
};

// Run initialization immediately
initializeAdminAccounts();

// Export flag to use with other APIs
export const USE_MOCK_ADMIN_API = false; 