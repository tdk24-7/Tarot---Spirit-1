import React, { memo } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Icon as LucideIcon } from '../../../shared/components/common';

// Export the Icon component
export const Icon = LucideIcon;

// Modal Header Component
export const ModalHeader = memo(({ title, onClose }) => (
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-bold bg-gradient-to-r from-[#9370db] via-[#8a2be2] to-[#4e44ce] bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(147,112,219,0.3)] tracking-vn-tight">
      {title}
    </h2>
    <button 
      onClick={onClose} 
      className="text-gray-400 hover:text-[#9370db] transition-colors p-1 hover:bg-white/5 rounded-full"
      aria-label="Đóng"
    >
      <X size={18} />
    </button>
  </div>
));

// Divider Component
export const Divider = memo(({ text }) => (
  <div className="relative mt-4 mb-4">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-white/10"></div>
    </div>
    <div className="relative flex justify-center text-xs">
      <span className="px-2 bg-gradient-to-b from-[#170b36] to-[#0f0a23] text-gray-400 tracking-vn-tight">{text}</span>
    </div>
  </div>
));

// Input Field Component
export const InputField = memo(({ id, label, type, value, onChange, placeholder, rightLink, onRightLinkClick, delay }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === 'password';
  
  return (
    <div className={`transition-all duration-500 mb-4 ${delay ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: delay }}>
      <div className="flex items-center justify-between mb-1">
        <label htmlFor={id} className="block text-xs font-medium text-gray-300 ml-1 tracking-vn-tight">
          {label}
        </label>
        {rightLink && (
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onRightLinkClick) onRightLinkClick(e);
            }}
            className="text-xs text-[#9370db] hover:text-[#9370db]/80 transition-colors relative group tracking-vn-tight"
          >
            {rightLink}
            <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#9370db]/50 group-hover:w-full transition-all duration-300"></span>
          </button>
        )}
      </div>
      <div className="relative">
        <input
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 text-sm rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#9370db]/50 focus:border-[#9370db] transition-all placeholder:text-gray-500"
          placeholder={placeholder}
          required
        />
        {isPassword && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#9370db] transition-colors"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
          >
            {showPassword ? (
              <Icon name="Eye" size="sm" />
            ) : (
              <Icon name="EyeOff" size="sm" />
            )}
          </button>
        )}
      </div>
    </div>
  );
});

// Checkbox Field Component
export const CheckboxField = memo(({ id, label, isChecked, onChange, delay, children, required = false }) => (
  <div className={`flex items-center mb-4 transition-all duration-500 ${delay ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: delay }}>
    <input
      id={id}
      name={id}
      type="checkbox"
      checked={isChecked}
      onChange={onChange}
      className="h-4 w-4 rounded border-white/10 text-[#9370db] focus:ring-[#9370db] bg-white/5"
      required={required}
    />
    <label htmlFor={id} className="ml-2 block text-xs text-gray-300 tracking-vn-tight">
      {children || label}
    </label>
  </div>
));

// Auth Button Component
export const AuthButton = memo(({ children, loading, isLoaded, delay = '0ms', ...rest }) => {
  return (
    <button
      className={`w-full p-3 bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white rounded-md font-medium relative overflow-hidden transition-opacity duration-500 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${loading ? 'cursor-wait' : 'hover:shadow-lg hover:shadow-[#9370db]/30'}`}
      style={{ transitionDelay: delay }}
      disabled={loading}
      {...rest}
    >
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Đang xử lý...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
});

// Modal Wrapper
export const ModalWrapper = memo(({ onClose, children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
    className="fixed inset-0 flex items-center justify-center z-[9999] overflow-y-auto"
    onClick={onClose}
    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
  >
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm"></div>
    <div className="flex min-h-full items-center justify-center p-4 text-center relative z-[10000]">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ 
          duration: 0.35, 
          ease: [0.16, 1, 0.3, 1]
        }}
        className="bg-gradient-to-b from-[#170b36] to-[#0f0a23] rounded-lg border border-[#9370db]/30 shadow-2xl w-full max-w-md p-6 relative overflow-hidden m-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative elements */}
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-[#9370db]/10 rounded-full filter blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 w-32 h-32 bg-[#8a2be2]/10 rounded-full filter blur-3xl"></div>
        
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    </div>
  </motion.div>
));

// Error Alert Component
export const ErrorAlert = memo(({ error }) => (
  error ? (
    <div className="mb-4 p-2 rounded-lg bg-red-500/20 border border-red-500/30 text-white text-xs">
      {error}
    </div>
  ) : null
));

// Bottom Link Component
export const BottomLink = memo(({ isLoaded, delay, text, actionText, onClick }) => (
  <div className={`mt-4 text-center transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: delay }}>
    <p className="text-xs text-gray-400 tracking-vn-tight">
      {text}{' '}
      <button 
        onClick={onClick} 
        className="text-[#9370db] hover:text-[#9370db]/80 font-medium relative inline-block group"
      >
        {actionText}
        <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#9370db]/50 group-hover:w-full transition-all duration-300"></span>
      </button>
    </p>
  </div>
)); 