// src/features/auth/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  login, 
  adminLogin,
  register, 
  logout, 
  getCurrentUser, 
  socialLogin, 
  forgotPassword, 
  resetPassword,
  createAdminAccount,
  changePassword as changePasswordAPI
} from '../services/authAPI';

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({email, password}, { rejectWithValue }) => {
    try {
      const response = await login(email, password);
      // Lưu token và user vào localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Async thunk for admin login
export const loginAdmin = createAsyncThunk(
  'auth/adminLogin',
  async ({email, password}, { rejectWithValue }) => {
    try {
      const response = await adminLogin(email, password);
      // Lưu token và user vào localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Admin login failed');
    }
  }
);

// Async thunk for social login
export const socialLoginUser = createAsyncThunk(
  'auth/socialLogin',
  async (data, { rejectWithValue }) => {
    try {
      const response = await socialLogin(data);
      
      // Xử lý nhiều cấu trúc response có thể có
      let userData = null;
      let token = null;
      
      if (response.data && response.data.token && response.data.user) {
        userData = response.data.user;
        token = response.data.token;
      } else if (response.data && response.data.data) {
        userData = response.data.data.user;
        token = response.data.data.token;
      }
      
      if (!userData || !token) {
        console.error('Invalid response structure:', response);
        return rejectWithValue('Định dạng dữ liệu đăng nhập không hợp lệ');
      }
      
      // Lưu token và user vào localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return { user: userData, token };
    } catch (error) {
      console.error('Social login error:', error);
      return rejectWithValue(
        error.message || 
        (typeof error === 'object' ? JSON.stringify(error) : 'Đăng nhập mạng xã hội thất bại')
      );
    }
  }
);

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      console.log('registerUser thunk: Calling register API with:', userData);
      const response = await register(userData);
      console.log('registerUser thunk: API response:', response);
      
      // Kiểm tra cấu trúc response đúng
      if (response && response.data) {
        // Cấu trúc phổ biến: response.data.user và response.data.token
        if (response.data.user && response.data.token) {
          console.log('registerUser thunk: Setting token and user data');
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          return response.data;
        }
        // Cấu trúc khác: token và user nằm trực tiếp trong response
        if (response.user && response.token) {
          console.log('registerUser thunk: Setting token and user from response root');
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          return response;
        }
        // Nếu response có status là success, nhưng token và user khác cấu trúc
        if (response.status === 'success' && response.data) {
          console.log('registerUser thunk: Success response with different structure');
          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
          }
          if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
          return response.data;
        }
        
        console.error('registerUser thunk: Response has data but in unknown format:', response);
        return rejectWithValue('Invalid response format from server');
      } else if (response && response.token) {
        // Một số format response khác có thể có
        console.log('registerUser thunk: Alternative response format, setting token and user');
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        return response;
      } else {
        console.error('registerUser thunk: Unexpected response format:', response);
        return rejectWithValue('Invalid response format from server');
      }
    } catch (error) {
      console.error('registerUser thunk: Error:', error);
      // Nếu error có message thì sử dụng
      if (error && error.message) {
        return rejectWithValue(error.message);
      }
      // Fallback
      return rejectWithValue('Registration failed');
    }
  }
);

// Async thunk for admin account creation
export const createAdmin = createAsyncThunk(
  'auth/createAdmin',
  async (userData, { rejectWithValue }) => {
    try {
      return await createAdminAccount(userData);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create admin account');
    }
  }
);

// Async thunk for fetching current user
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCurrentUser();
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user data');
    }
  }
);

// Async thunk for user logout
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      return await logout();
    } catch (error) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

// Async thunk for password reset request
export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (email, { rejectWithValue }) => {
    try {
      return await forgotPassword(email);
    } catch (error) {
      return rejectWithValue(error.message || 'Password reset request failed');
    }
  }
);

// Async thunk for password reset
export const resetUserPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data, { rejectWithValue }) => {
    try {
      return await resetPassword(data.token, data.password);
    } catch (error) {
      return rejectWithValue(error.message || 'Password reset failed');
    }
  }
);

// Async thunk for changing password
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (data, { rejectWithValue }) => {
    try {
      return await changePasswordAPI(data.currentPassword, data.newPassword);
    } catch (error) {
      return rejectWithValue(error.message || 'Đổi mật khẩu thất bại');
    }
  }
);

// Get user from localStorage
const user = localStorage.getItem('user') 
  ? JSON.parse(localStorage.getItem('user')) 
  : null;

const initialState = {
  user: user,
  isAuthenticated: !!user,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.error = null;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
    setAuthError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle admin login
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle social login
      .addCase(socialLoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(socialLoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(socialLoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle creating admin account
      .addCase(createAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdmin.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle fetch current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      })
      
      // Handle forgot password
      .addCase(requestPasswordReset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Handle reset password
      .addCase(resetUserPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetUserPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle change password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, loginSuccess, setAuthError } = authSlice.actions;
export default authSlice.reducer;