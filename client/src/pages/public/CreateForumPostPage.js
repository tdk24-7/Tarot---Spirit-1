import React, { memo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ForumLayout from '../../features/forum/ForumLayout';
import { CreatePostForm } from '../../features/forum/ForumComponents';
import { Icon } from '../../shared/components/common';
import { useAuth } from '../../features/auth/hook/useAuth';
import { path } from '../../shared/utils/routes';

// Decorative Elements
const MysticBackground = memo(() => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className="absolute top-20 right-[10%] w-64 h-64 bg-[#9370db]/10 rounded-full filter blur-[80px] animate-pulse-slow"></div>
    <div className="absolute bottom-40 left-[15%] w-72 h-72 bg-[#8a2be2]/10 rounded-full filter blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
    <div className="absolute top-[40%] left-[30%] w-2 h-2 bg-white rounded-full animate-twinkle"></div>
    <div className="absolute top-[20%] right-[25%] w-2 h-2 bg-white rounded-full animate-twinkle" style={{ animationDelay: '1s' }}></div>
    <div className="absolute bottom-[30%] right-[40%] w-2 h-2 bg-white rounded-full animate-twinkle" style={{ animationDelay: '2s' }}></div>
  </div>
));

const CreateForumPostPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  
  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(path.AUTH.LOGIN, { 
        state: { 
          from: path.PUBLIC.FORUM_CREATE_POST, 
          message: 'Vui lòng đăng nhập để tạo bài viết mới' 
        } 
      });
    }
  }, [isAuthenticated, navigate]);
  
  const handleSubmit = async (formData) => {
    setLoading(true);
    
    // Fake API call for demo purposes
    // In a real app, this would be replaced with an actual API call
    setTimeout(() => {
      console.log('Submitting post:', formData);
      setLoading(false);
      navigate(path.PUBLIC.FORUM);
    }, 1500);
  };
  
  // If not authenticated, show nothing (will redirect via useEffect)
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <>
      <Helmet>
        <title>Tạo bài viết mới | Diễn Đàn Tarot</title>
        <meta name="description" content="Tạo bài viết mới để chia sẻ kiến thức và kinh nghiệm về Tarot với cộng đồng." />
      </Helmet>
      
      <ForumLayout
        title="Tạo bài viết mới"
        description="Chia sẻ kiến thức, đặt câu hỏi hoặc bắt đầu một cuộc thảo luận với cộng đồng Tarot."
      >
        <div className="bg-white/5 backdrop-blur-sm border border-purple-900/20 rounded-xl p-6 md:p-8">
          <CreatePostForm 
            onSubmit={handleSubmit} 
            loading={loading} 
          />
        </div>
        
        <div className="mt-8 flex justify-between items-center">
          <button 
            onClick={() => navigate(path.PUBLIC.FORUM)}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#9370db] transition-colors tracking-vn-tight"
          >
            <Icon name="ArrowLeft" size="sm" />
            Quay lại diễn đàn
          </button>
        </div>
      </ForumLayout>
    </>
  );
};

export default memo(CreateForumPostPage); 