/**
 * Chứa các biến màu sắc, spacing và các giá trị theme dùng chung
 */
export const theme = {
  colors: {
    primary: '#9370db',
    secondary: '#8a2be2',
    background: {
      dark: '#1a0933',
      darker: '#0f051d',
      card: '#2a1045'
    },
    text: {
      white: '#ffffff',
      gray: '#9ca3af',
      lightGray: '#d1d5db'
    }
  },
  gradients: {
    primary: 'from-[#9370db] to-[#8a2be2]',
    background: 'from-[#1a0933] to-[#0f051d]',
    card: 'from-[#2a1045] to-[#3a1c5a]'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem'
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px'
  },
  typography: {
    fontFamily: "'Be Vietnam Pro', sans-serif",
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem'
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  }
};

/**
 * Hàm truy cập các giá trị theme theo đường dẫn
 * @param {string} path - Đường dẫn tới giá trị theme (vd: 'colors.primary')
 * @returns {string} Giá trị theme
 */
export const getThemeValue = (path) => {
  const parts = path.split('.');
  let value = theme;
  
  for (const part of parts) {
    if (value && value[part] !== undefined) {
      value = value[part];
    } else {
      console.warn(`Theme value not found for path: ${path}`);
      return null;
    }
  }
  
  return value;
};

export default theme; 