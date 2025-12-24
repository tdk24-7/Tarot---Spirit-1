// src/features/user/slices/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLoginRequest: (state) => {
      state.loading = true;
    },
    userLoginSuccess: (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
    },
    userLoginFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    userLogout: (state) => {
      state.userInfo = null;
    }
  },
});

export const { userLoginRequest, userLoginSuccess, userLoginFail, userLogout } = userSlice.actions;
export default userSlice.reducer;