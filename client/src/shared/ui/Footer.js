// src/containers/Public/Footer.js
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { path } from '../utils/routes';
import { Icon } from '../components/common';

// Icons Components
const EmailIcon = memo(() => (
  <Icon name="Mail" size="sm" className="text-[#9370db]" />
));

const PhoneIcon = memo(() => (
  <Icon name="Phone" size="sm" className="text-[#9370db]" />
));

const LocationIcon = memo(() => (
  <Icon name="MapPin" size="sm" className="text-[#9370db]" />
));

// Social Icons Component
const SocialIcon = memo(({ href, children, label }) => (
  <a 
    href={href} 
    target="_blank"
    rel="noopener noreferrer"
    className="text-[#9370db] hover:text-white transition-colors transform hover:scale-110 flex items-center justify-center w-9 h-9 rounded-full bg-[#2a1045] hover:bg-[#3a1c5a] transition-all" 
    aria-label={label}
  >
    {children}
  </a>
));

// Contact Item Component
const ContactItem = memo(({ icon, text, href, isLink = false }) => {
  const content = (
    <li className="flex items-start gap-3 text-gray-300 group hover:text-white transition-colors">
      <span className="flex-shrink-0 mt-1 group-hover:scale-110 transition-transform">{icon}</span>
      <span className="group-hover:translate-x-1 transition-transform tracking-vn-tight">{text}</span>
    </li>
  );

  return isLink ? (
    <a href={href} className="hover:text-[#9370db]" target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : content;
});

// Quick Link Item Component
const QuickLinkItem = memo(({ to, label }) => (
  <li>
    <Link 
      to={to} 
      className="text-gray-300 hover:text-[#9370db] transition-colors flex items-center group"
    >
      <Icon 
        name="ChevronRight" 
        size="xs" 
        className="mr-2 text-[#9370db] opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-0 group-hover:translate-x-1 transition-transform" 
      />
      <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform tracking-vn-tight">
        {label}
      </span>
    </Link>
  </li>
));

// Section Component
const Section = memo(({ title, children }) => (
  <div>
    <h3 className="text-[#9370db] font-bold text-lg mb-4 relative inline-block tracking-vn-tight">
      {title}
      <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-[#9370db] to-transparent"></span>
    </h3>
    {children}
  </div>
));

// Logo Component
const Logo = memo(() => (
  <div className="flex items-center gap-2 mb-4">
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#9370db] to-[#8a2be2]"></div>
      <span className="absolute inset-0.5 flex items-center justify-center bg-[#1a0933] text-[#9370db] text-xl rounded-full">
        T
      </span>
    </div>
    <span className="text-xl font-bold tracking-vn-tight">
      <span className="text-white">Bói</span>
      <span className="text-[#8a2be2]">Tarot</span>
    </span>
  </div>
));

// Newsletter Form Component
const NewsletterForm = memo(() => (
  <form className="flex flex-col space-y-2" onSubmit={(e) => e.preventDefault()}>
    <p className="text-sm text-gray-300 mb-2 tracking-vn-tight">Đăng ký nhận tin:</p>
    <div className="flex">
      <input 
        type="email" 
        placeholder="Email của bạn" 
        className="bg-[#2a1045] border border-[#3a1c5a] rounded-l-md px-3 py-2 text-sm flex-grow focus:outline-none focus:border-[#9370db] transition-colors" 
        aria-label="Địa chỉ email"
      />
      <button 
        type="submit" 
        className="bg-gradient-to-r from-[#8a2be2] to-[#9370db] text-white px-3 py-2 rounded-r-md hover:opacity-90 transition-opacity text-sm hover:shadow-lg hover:shadow-[#9370db]/20"
        aria-label="Gửi đăng ký"
      >
        Gửi
      </button>
    </div>
  </form>
));

// Decorative Element
const DecorativeElement = memo(() => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#9370db]/5 rounded-full filter blur-[80px] animate-pulse-slow"></div>
    <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-[#8a2be2]/5 rounded-full filter blur-[60px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
  </div>
));

// Main Footer Component
const Footer = () => {
  // Quick Links Data
  const quickLinks = [
    { to: "/", label: "Trang chủ" },
    { to: "/about", label: "Về chúng tôi" },
    { to: "/tarot-readings", label: "Bói Tarot" },
    { to: "/tarot-cards", label: "Thư Viện Bài" },
    { to: "/daily-tarot", label: "Tarot Hàng Ngày" },
    { to: "/forum", label: "Diễn Đàn" }
  ];

  // Services Data
  const services = [
    { to: "/love", label: "Tình Yêu", icon: "❤️" },
    { to: "/career", label: "Sự Nghiệp", icon: "💼" },
    { to: "/finance", label: "Tài Chính", icon: "✨" },
    { to: "/health", label: "Sức Khỏe", icon: "🔔" },
    { to: "/spiritual", label: "Tâm Linh", icon: "🔮" }
  ];

  return (
    <footer className="bg-gradient-to-b from-[#1a0933] to-[#150726] border-t border-[#3a1c5a] text-white py-12 relative">
      <DecorativeElement />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* About Section */}
          <Section title="Về Bói Tarot">
            <div className="space-y-4">
              <Logo />
              <p className="text-gray-300 text-sm leading-vn tracking-vn-tight">
                Bói Tarot là trang web chuyên về bói bài Tarot online kết hợp trí tuệ nhân tạo tiên tiến. Chúng tôi cung cấp các
                dịch vụ xem bói Tarot về tình yêu, sự nghiệp, và sức khỏe.
              </p>
              <div className="flex space-x-3 pt-2">
                <SocialIcon href="https://facebook.com" label="Facebook">
                  <Icon name="Facebook" size="md" />
                </SocialIcon>
                <SocialIcon href="https://twitter.com" label="Twitter">
                  <Icon name="Twitter" size="md" />
                </SocialIcon>
                <SocialIcon href="https://instagram.com" label="Instagram">
                  <Icon name="Instagram" size="md" />
                </SocialIcon>
              </div>
            </div>
          </Section>

          {/* Quick Links Section */}
          <Section title="Liên kết nhanh">
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link, index) => (
                <QuickLinkItem key={index} to={link.to} label={link.label} />
              ))}
            </ul>
          </Section>

          {/* Services Section */}
          <Section title="Dịch vụ">
            <ul className="space-y-2 text-sm">
              {services.map((service, index) => (
                <li key={index}>
                  <Link 
                    to={service.to} 
                    className="text-gray-300 hover:text-[#9370db] transition-colors flex items-center group"
                  >
                    <span className="mr-2 opacity-70 group-hover:opacity-100 transition-opacity">{service.icon}</span>
                    <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform tracking-vn-tight">
                      {service.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Section>

          {/* Contact Section */}
          <Section title="Liên hệ">
            <div className="space-y-4">
              <ul className="space-y-3 text-sm">
                <ContactItem 
                  icon={<EmailIcon />} 
                  text="contact@boitarot.vn"
                  href="mailto:contact@boitarot.vn"
                  isLink={true}
                />
                <ContactItem 
                  icon={<PhoneIcon />} 
                  text="0123 456 789"
                  href="tel:0123456789"
                  isLink={true}
                />
                <ContactItem 
                  icon={<LocationIcon />} 
                  text="Đà Nẵng, Việt Nam" 
                />
              </ul>
              
              <div className="pt-4">
                <NewsletterForm />
              </div>
            </div>
          </Section>
        </div>

        {/* Copyright Section */}
        <div className="mt-10 pt-6 border-t border-[#3a1c5a] text-center text-sm text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="tracking-vn-tight">© {new Date().getFullYear()} Bói Tarot. Tất cả các quyền được bảo lưu.</p>
            <div className="flex gap-4">
              <Link to={path.PUBLIC.TERMS} className="text-gray-400 hover:text-[#9370db] transition-colors tracking-vn-tight" data-discover="true">Điều khoản sử dụng</Link>
              <Link to={path.PUBLIC.PRIVACY_POLICY} className="text-gray-400 hover:text-[#9370db] transition-colors tracking-vn-tight" data-discover="true">Chính sách bảo mật</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;