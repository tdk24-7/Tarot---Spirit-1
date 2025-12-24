// src/store/reducers/rootReducer.js
import { combineReducers } from 'redux';
import authSlice from '../../../features/auth/slices/authSlice';
import userSlice from '../../../features/user/slices/userSlice';
import tarotSlice from '../../../features/tarot/slices/tarotSlice'

const rootReducer = combineReducers({
  auth: authSlice,
  user: userSlice,
  tarot: tarotSlice
});

export default rootReducer;