import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import Navbar from '../../shared/ui/NavBar';
import Footer from '../../shared/ui/Footer';
import { MysticBackground } from '../components/common';

/**
 * Layout chung cho toàn bộ trang
 * @param {Object} props - Props của component
 * @param {React.ReactNode} props.children - Nội dung của trang
 * @param {string} props.title - Tiêu đề trang
 * @param {string} props.description - Mô tả trang cho SEO
 * @param {Object} props.meta - Các thẻ meta bổ sung
 * @param {string} props.className - Classes bổ sung cho container
 */
const PageLayout = memo(({ 
  children, 
  title = 'Bói Tarot Online',
  description = 'Khám phá tương lai với Bói Tarot Online - từ tình yêu, sự nghiệp đến sức khỏe và phát triển bản thân.',
  meta = {},
  className = ''
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0933] to-[#0f051d] text-white relative overflow-hidden">
      <Helmet>
        <title>{title} | Bói Tarot</title>
        <meta name="description" content={description} />
        {Object.entries(meta).map(([name, content]) => (
          <meta key={name} name={name} content={content} />
        ))}
      </Helmet>
      
      <MysticBackground />
      <Navbar />
      
      <main className={`relative pt-32 pb-20 px-4 md:px-8 ${className}`}>
        <div className="container mx-auto max-w-6xl relative z-10">
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
});

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  meta: PropTypes.object,
  className: PropTypes.string
};

export default PageLayout; 