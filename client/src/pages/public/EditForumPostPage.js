import React, { memo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ForumLayout from '../../features/forum/ForumLayout';
import { EditPostForm } from '../../features/forum/ForumComponents';
import { Icon } from '../../shared/components/common';

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

// Dummy data for testing - this would normally come from an API
const getDummyPost = () => ({
  id: 1,
  title: 'Làm thế nào để bắt đầu học Tarot từ con số 0?',
  content: `
    <p>Xin chào cộng đồng Tarot,</p>
    <p>Mình là người mới tìm hiểu về Tarot và thực sự không biết nên bắt đầu từ đâu. Mình đã tìm hiểu qua vài nguồn trên mạng nhưng có quá nhiều thông tin khiến mình bị choáng ngợp.</p>
    <p>Mình có một số câu hỏi mong mọi người giúp đỡ:</p>
    <ul>
      <li>Nên bắt đầu với bộ bài nào là phù hợp nhất cho người mới?</li>
      <li>Có nên học thuộc ý nghĩa 78 lá bài ngay từ đầu không, hay có cách tiếp cận nào khác?</li>
      <li>Làm thế nào để thực hành đọc bài hiệu quả khi chưa có nhiều kinh nghiệm?</li>
      <li>Có sách hoặc khóa học nào bằng tiếng Việt mà các bạn khuyên dùng không?</li>
    </ul>
    <p>Cảm ơn mọi người đã đọc và mình rất mong nhận được sự chia sẻ từ cộng đồng!</p>
  `,
  category: 'Câu hỏi',
  tags: ['người mới', 'học tarot', 'hướng dẫn']
});

const EditForumPostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState({
    pageLoading: true,
    submitLoading: false
  });

  useEffect(() => {
    // Simulate API call to fetch post details
    const fetchPost = async () => {
      setLoading(prev => ({ ...prev, pageLoading: true }));
      
      // In a real app, this would be an API call using the postId
      setTimeout(() => {
        setPost(getDummyPost());
        setLoading(prev => ({ ...prev, pageLoading: false }));
      }, 800);
    };
    
    fetchPost();
  }, [postId]);

  const handleSubmit = async (formData) => {
    setLoading(prev => ({ ...prev, submitLoading: true }));
    
    // Simulate API call
    setTimeout(() => {
      console.log('Updating post:', formData);
      setLoading(prev => ({ ...prev, submitLoading: false }));
      navigate(`/forum/post/${postId}`);
    }, 1500);
  };

  if (loading.pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a0933] to-[#0f051d] text-white relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <Icon
            name="Loader2"
            size="xl"
            className="animate-spin text-[#9370db] mx-auto mb-4"
          />
          <p className="text-lg text-gray-300 tracking-vn-tight">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <ForumLayout>
        <div className="text-center py-12">
          <Icon
            name="AlertTriangle"
            size="xl"
            className="text-amber-400 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold mb-4">Không tìm thấy bài viết</h1>
          <p className="text-gray-300 mb-8">Bài viết này không tồn tại, đã bị xóa, hoặc bạn không có quyền chỉnh sửa.</p>
          <button
            onClick={() => navigate('/forum')}
            className="bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow tracking-vn-tight"
          >
            Quay lại diễn đàn
          </button>
        </div>
      </ForumLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>Chỉnh sửa bài viết | Diễn Đàn Tarot</title>
        <meta name="description" content="Chỉnh sửa bài viết diễn đàn của bạn." />
      </Helmet>
      
      <ForumLayout
        title="Chỉnh sửa bài viết"
        description="Cập nhật nội dung bài viết của bạn trên diễn đàn Tarot."
      >
        <div className="bg-white/5 backdrop-blur-sm border border-purple-900/20 rounded-xl p-6 md:p-8">
          <EditPostForm 
            initialData={post}
            onSubmit={handleSubmit} 
            loading={loading.submitLoading} 
          />
        </div>
      </ForumLayout>
    </>
  );
};

export default memo(EditForumPostPage); 