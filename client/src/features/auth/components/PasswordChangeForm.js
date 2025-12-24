import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { changePassword } from '../slices/authSlice';

const PasswordChangeForm = ({ onClose, onSuccess }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useDispatch();
  
  const validateForm = () => {
    if (!currentPassword) {
      setError('Vui lòng nhập mật khẩu hiện tại');
      return false;
    }
    
    if (!newPassword) {
      setError('Vui lòng nhập mật khẩu mới');
      return false;
    }
    
    if (newPassword.length < 8) {
      setError('Mật khẩu mới phải có ít nhất 8 ký tự');
      return false;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await dispatch(changePassword({
        currentPassword,
        newPassword
      })).unwrap();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.message || 'Không thể đổi mật khẩu. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-b from-[#1a0933] to-[#0f051d] p-6 rounded-xl w-full max-w-md border border-purple-900/20"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white tracking-vn-tight">Đổi mật khẩu</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/20 text-red-200 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2 tracking-vn-tight" htmlFor="current-password">
                Mật khẩu hiện tại
              </label>
              <input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-purple-900/20 text-white focus:outline-none focus:ring-2 focus:ring-[#9370db] transition-all"
                placeholder="Nhập mật khẩu hiện tại"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm mb-2 tracking-vn-tight" htmlFor="new-password">
                Mật khẩu mới
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-purple-900/20 text-white focus:outline-none focus:ring-2 focus:ring-[#9370db] transition-all"
                placeholder="Nhập mật khẩu mới"
              />
              <p className="text-xs text-gray-400 mt-1">Mật khẩu phải có ít nhất 8 ký tự</p>
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm mb-2 tracking-vn-tight" htmlFor="confirm-password">
                Xác nhận mật khẩu mới
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-purple-900/20 text-white focus:outline-none focus:ring-2 focus:ring-[#9370db] transition-all"
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors tracking-vn-tight"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white hover:shadow-lg transition-shadow tracking-vn-tight flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý
                  </>
                ) : 'Đổi mật khẩu'}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PasswordChangeForm; 