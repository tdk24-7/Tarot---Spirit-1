// Mock API for authentication
// This is a temporary solution to test frontend without a real backend

// Simulated delay (ms)
const MOCK_DELAY = 800;

// Mock local storage for user data
class MockDatabase {
  constructor() {
    this.users = JSON.parse(localStorage.getItem('mockUsers')) || [];
    this.init();
  }

  init() {
    // Add a default user if no users exist
    if (this.users.length === 0) {
      this.users.push({
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        createdAt: new Date().toISOString()
      });
      this.save();
    }
  }

  save() {
    localStorage.setItem('mockUsers', JSON.stringify(this.users));
  }

  findUserByEmail(email) {
    return this.users.find(user => user.email.toLowerCase() === email.toLowerCase());
  }

  createUser(userData) {
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    this.save();
    return newUser;
  }
}

const db = new MockDatabase();

// Simulate API delay
const delay = (ms = MOCK_DELAY) => new Promise(resolve => setTimeout(resolve, ms));

// Generate a mock JWT token
const generateToken = (user) => {
  return `mock-jwt-token-${user.id}-${Date.now()}`;
};

// Mock login API
export const mockLogin = async (email, password) => {
  await delay();
  
  const user = db.findUserByEmail(email);
  
  if (!user) {
    throw { message: 'Email không tồn tại trong hệ thống' };
  }
  
  if (user.password !== password) {
    throw { message: 'Mật khẩu không chính xác' };
  }
  
  // Create safe user object (without password)
  const safeUser = { ...user };
  delete safeUser.password;
  
  // Tự động đánh dấu người dùng là admin nếu email chứa từ admin
  if (email.toLowerCase().includes('admin')) {
    safeUser.isAdmin = true;
    safeUser.role = 'admin';
  }
  
  // Generate a token
  const token = generateToken(user);
  
  return {
    user: safeUser,
    token,
    message: 'Đăng nhập thành công'
  };
};

// Mock register API
export const mockRegister = async (userData) => {
  await delay();
  
  const existingUser = db.findUserByEmail(userData.email);
  
  if (existingUser) {
    throw { message: 'Email đã được sử dụng' };
  }
  
  // Create new user
  const newUser = db.createUser(userData);
  
  // Create safe user object (without password)
  const safeUser = { ...newUser };
  delete safeUser.password;
  
  return {
    user: safeUser,
    message: 'Đăng ký thành công'
  };
};

// Mock get current user API
export const mockGetCurrentUser = async () => {
  await delay();
  
  // Get user from localStorage (already saved during login)
  const userStr = localStorage.getItem('user');
  
  if (!userStr) {
    throw { message: 'Người dùng chưa đăng nhập' };
  }
  
  return JSON.parse(userStr);
};

// Mock social login API (Facebook, Google)
export const mockSocialLogin = async (provider, authResult) => {
  await delay();
  
  console.log(`Mock ${provider} login with:`, authResult);
  
  // Create a mock user based on the provider
  const mockUser = {
    id: `${provider}_${Date.now()}`,
    name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
    email: `${provider}_user@example.com`,
    avatar: provider === 'facebook' 
      ? 'https://via.placeholder.com/150?text=FB'
      : 'https://via.placeholder.com/150?text=Google',
    isAdmin: false
  };
  
  // Generate a token
  const token = generateToken(mockUser);
  
  return {
    user: mockUser,
    token: token,
    message: `Đăng nhập ${provider} thành công`
  };
};

// Toggle this to switch between real API and mock API
export const USE_MOCK_API = false; 