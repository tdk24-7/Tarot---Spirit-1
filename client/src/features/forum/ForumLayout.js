import React, { memo } from 'react';
import Navbar from '../../shared/ui/NavBar';
import Footer from '../../shared/ui/Footer';

// Decorative Elements
export const MysticBackground = memo(() => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className="absolute top-20 right-[10%] w-64 h-64 bg-[#9370db]/10 rounded-full filter blur-[80px] animate-pulse-slow"></div>
    <div className="absolute bottom-40 left-[15%] w-72 h-72 bg-[#8a2be2]/10 rounded-full filter blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
    <div className="absolute top-[40%] left-[30%] w-2 h-2 bg-white rounded-full animate-twinkle"></div>
    <div className="absolute top-[20%] right-[25%] w-2 h-2 bg-white rounded-full animate-twinkle" style={{ animationDelay: '1s' }}></div>
    <div className="absolute bottom-[30%] right-[40%] w-2 h-2 bg-white rounded-full animate-twinkle" style={{ animationDelay: '2s' }}></div>
  </div>
));

const ForumLayout = ({ children, title, description, maxWidth = '4xl', padding = "pt-32 pb-16 px-4 md:px-8" }) => {
  // Dynamically determine the max-width class
  const getMaxWidthClass = () => {
    switch(maxWidth) {
      case 'sm': return 'max-w-sm';
      case 'md': return 'max-w-md';
      case 'lg': return 'max-w-lg';
      case 'xl': return 'max-w-xl';
      case '2xl': return 'max-w-2xl';
      case '3xl': return 'max-w-3xl';
      case '4xl': return 'max-w-4xl';
      case '5xl': return 'max-w-5xl';
      case '6xl': return 'max-w-6xl';
      case '7xl': return 'max-w-7xl';
      default: return 'max-w-4xl';
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0933] to-[#0f051d] text-white relative overflow-hidden">
      <MysticBackground />
      <Navbar />
      
      {/* Main Content */}
      <section className={`relative ${padding}`}>
        <div className={`container mx-auto ${getMaxWidthClass()} relative z-10`}>
          {title && (
            <div className="mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white tracking-vn-tight">
                {title}
              </h1>
              {description && (
                <p className="text-lg text-gray-300 tracking-vn-tight leading-vn">
                  {description}
                </p>
              )}
            </div>
          )}
          
          {children}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default memo(ForumLayout); 