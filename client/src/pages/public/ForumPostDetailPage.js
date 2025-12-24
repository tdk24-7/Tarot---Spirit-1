import React, { memo, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ForumLayout from '../../features/forum/ForumLayout';
import { PostDetail } from '../../features/forum/ForumComponents';
import { Icon } from '../../shared/components/common';
import { path } from '../../shared/utils/routes';
import { useAuth } from '../../features/auth/hook/useAuth';

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

// Authentication prompt component for non-logged in users
const AuthPrompt = memo(() => (
  <div className="border border-white/10 rounded-lg bg-[#9370db]/10 p-6 my-6">
    <div className="flex items-center gap-3 mb-4">
      <Icon name="Lock" size="md" className="text-[#9370db]" />
      <h3 className="text-xl font-semibold text-white tracking-vn-tight">Đăng nhập để tham gia thảo luận</h3>
    </div>
    <p className="text-gray-300 mb-4 tracking-vn-tight leading-vn">
      Bạn cần đăng nhập hoặc đăng ký tài khoản để có thể bình luận và tham gia thảo luận với cộng đồng.
    </p>
    <div className="flex flex-wrap gap-3">
      <Link 
        to={path.AUTH.LOGIN}
        state={{ from: window.location.pathname }}
        className="bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all tracking-vn-tight"
      >
        Đăng nhập
      </Link>
      <Link
        to={path.AUTH.REGISTER}
        state={{ from: window.location.pathname }}
        className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors tracking-vn-tight"
      >
        Đăng ký
      </Link>
    </div>
  </div>
));

// Dummy data for testing
const getDummyPost = () => ({
  id: 1,
  title: 'Làm thế nào để bắt đầu học Tarot từ con số 0?',
  author: { name: 'Nguyễn Văn A', avatar: 'https://api-prod-minimal-v510.vercel.app/assets/images/avatar/avatar_6.jpg' },
  createdAt: '15/07/2023, 10:30',
  category: 'Câu hỏi',
  content: `
    Xin chào cộng đồng Tarot
    Mình là người mới tìm hiểu về Tarot và thực sự không biết nên bắt đầu từ đâu. Mình đã tìm hiểu qua vài nguồn trên mạng nhưng có quá nhiều thông tin khiến mình bị choáng ngợp.
    Mình có một số câu hỏi mong mọi người giúp đỡ:
    <ul>
      Nên bắt đầu với bộ bài nào là phù hợp nhất cho người mới?</li>
      Có nên học thuộc ý nghĩa 78 lá bài ngay từ đầu không, hay có cách tiếp cận nào khác?
      Làm thế nào để thực hành đọc bài hiệu quả khi chưa có nhiều kinh nghiệm?
      Có sách hoặc khóa học nào bằng tiếng Việt mà các bạn khuyên dùng không?
    
    Cảm ơn mọi người đã đọc và mình rất mong nhận được sự chia sẻ từ cộng đồng
  `,
  excerpt: 'Mình là người mới tìm hiểu về Tarot và không biết nên bắt đầu từ đâu. Mọi người có thể chia sẻ kinh nghiệm và các nguồn tài liệu tốt cho người mới không?',
  likes: 24,
  liked: false,
  comments: [
    {
      id: 1,
      content: 'Chào bạn! Mình nghĩ bắt đầu với bộ Rider Waite Smith là phù hợp nhất cho người mới vì hình ảnh trực quan và có nhiều tài liệu hỗ trợ. Không cần học thuộc ngay, bạn có thể bắt đầu với 22 lá Major Arcana trước.',
      author: { name: 'Trần Thị B', avatar: 'https://api-prod-minimal-v510.vercel.app/assets/images/avatar/avatar_7.jpg', isOP: false },
      createdAt: '15/07/2023, 11:45',
      likes: 5,
      liked: false,
      replies: [
        {
          id: 11,
          content: 'Mình cũng đồng ý với ý kiến này! Rider Waite Smith là lựa chọn tuyệt vời cho người mới.',
          author: { name: 'Lê Văn C', avatar: 'https://api-prod-minimal-v510.vercel.app/assets/images/avatar/avatar_8.jpg', isOP: false },
          createdAt: '15/07/2023, 12:30',
          likes: 2,
          liked: false
        }
      ]
    },
    {
      id: 2,
      content: 'Theo kinh nghiệm của mình, bạn nên thực hành đọc bài hàng ngày. Mỗi sáng rút 1 lá và suy ngẫm về ý nghĩa của nó, sau đó ghi lại cảm nhận. Cuối ngày nhìn lại xem lá bài đó đã thể hiện như thế nào trong ngày của bạn.',
      author: { name: 'Nguyễn Văn A', avatar: 'https://api-prod-minimal-v510.vercel.app/assets/images/avatar/avatar_6.jpg', isOP: true },
      createdAt: '15/07/2023, 13:20',
      likes: 7,
      liked: false,
      replies: []
    },
    {
      id: 3,
      content: 'Mình gợi ý cuốn "Tarot căn bản" của tác giả Bùi Anh Tấn và "78 Degrees of Wisdom" của Rachel Pollack (có bản dịch tiếng Việt). Hai cuốn này giải thích rất chi tiết và dễ hiểu cho người mới.',
      author: { name: 'Hoàng Thị D', avatar: 'https://api-prod-minimal-v510.vercel.app/assets/images/avatar/avatar_9.jpg', isOP: false },
      createdAt: '15/07/2023, 14:15',
      likes: 4,
      liked: false,
      replies: []
    }
  ],
  tags: ['người mới', 'học tarot', 'hướng dẫn'],
  isHot: true,
  isFeatured: true
});

const ForumPostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState({
    pageLoading: true,
    likeLoading: false,
    commentLoading: false
  });
  const [currentUser] = useState({
    id: 999,
    name: 'Người dùng hiện tại',
    avatar: 'https://api-prod-minimal-v510.vercel.app/assets/images/avatar/avatar_12.jpg'
  });
  const { isAuthenticated } = useAuth();

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

  const handleLike = async (id) => {
    // Require authentication to like posts
    if (!isAuthenticated) {
      navigate(path.AUTH.LOGIN, { state: { from: window.location.pathname, message: 'Vui lòng đăng nhập để thích bài viết' } });
      return;
    }
    
    setLoading(prev => ({ ...prev, likeLoading: true }));
    
    // Simulate API call
    setTimeout(() => {
      setPost(prev => ({
        ...prev,
        liked: !prev.liked,
        likes: prev.liked ? prev.likes - 1 : prev.likes + 1
      }));
      setLoading(prev => ({ ...prev, likeLoading: false }));
    }, 500);
  };

  const handleComment = async (data) => {
    // Require authentication to comment
    if (!isAuthenticated) {
      navigate(path.AUTH.LOGIN, { state: { from: window.location.pathname, message: 'Vui lòng đăng nhập để bình luận' } });
      return;
    }
    
    setLoading(prev => ({ ...prev, commentLoading: true }));
    
    // Simulate API call
    setTimeout(() => {
      const newComment = {
        id: Date.now(),
        content: data.content,
        author: currentUser,
        createdAt: new Date().toLocaleString('vi-VN'),
        likes: 0,
        liked: false,
        replies: []
      };
      
      setPost(prev => ({
        ...prev,
        comments: [...prev.comments, newComment]
      }));
      
      setLoading(prev => ({ ...prev, commentLoading: false }));
    }, 800);
  };

  const handleReply = async (data, replyTo) => {
    // Require authentication to reply
    if (!isAuthenticated) {
      navigate(path.AUTH.LOGIN, { state: { from: window.location.pathname, message: 'Vui lòng đăng nhập để trả lời bình luận' } });
      return;
    }
    
    setLoading(prev => ({ ...prev, commentLoading: true }));
    
    // Simulate API call
    setTimeout(() => {
      const newReply = {
        id: Date.now(),
        content: data.content,
        author: currentUser,
        createdAt: new Date().toLocaleString('vi-VN'),
        likes: 0,
        liked: false
      };
      
      setPost(prev => {
        return {
          ...prev,
          comments: prev.comments.map(comment => {
            if (comment.id === replyTo.id) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newReply]
              };
            }
            return comment;
          })
        };
      });
      
      setLoading(prev => ({ ...prev, commentLoading: false }));
    }, 800);
  };

  const handleLikeComment = async (commentId) => {
    // Require authentication to like comments
    if (!isAuthenticated) {
      navigate(path.AUTH.LOGIN, { state: { from: window.location.pathname, message: 'Vui lòng đăng nhập để thích bình luận' } });
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setPost(prev => {
        // Helper function to update comment or reply
        const updateItem = (item) => {
          if (item.id === commentId) {
            return {
              ...item,
              liked: !item.liked,
              likes: item.liked ? item.likes - 1 : item.likes + 1
            };
          }
          return item;
        };
        
        // Check if it's a top-level comment
        const updatedComments = prev.comments.map(comment => {
          // Check if this is the comment to update
          if (comment.id === commentId) {
            return updateItem(comment);
          }
          
          // Check if it's in the replies
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: comment.replies.map(reply => updateItem(reply))
            };
          }
          
          return comment;
        });
        
        return {
          ...prev,
          comments: updatedComments
        };
      });
    }, 300);
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
          <p className="text-gray-300 mb-8">Bài viết này không tồn tại hoặc đã bị xóa.</p>
          <button
            onClick={() => navigate(path.PUBLIC.FORUM)}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-6 py-3 rounded-lg text-white tracking-vn-tight"
          >
            <Icon name="ArrowLeft" size="sm" />
            Quay lại diễn đàn
          </button>
        </div>
      </ForumLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Diễn Đàn Tarot</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>
      
      <ForumLayout>
        <PostDetail
          post={post}
          onLike={handleLike}
          onComment={handleComment}
          onReply={handleReply}
          onLikeComment={handleLikeComment}
          currentUser={currentUser}
          loading={{
            likeLoading: loading.likeLoading,
            commentLoading: loading.commentLoading
          }}
        />
        
        {/* Authentication Prompt */}
        {!isAuthenticated && <AuthPrompt />}
        
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

export default memo(ForumPostDetailPage); 