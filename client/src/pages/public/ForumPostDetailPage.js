import React, { memo, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ForumLayout from '../../features/forum/ForumLayout';
import { PostDetail } from '../../features/forum/ForumComponents';
import { Icon } from '../../shared/components/common';
import { path } from '../../shared/utils/routes';
import { useAuth } from '../../features/auth/hook/useAuth';
import forumService from '../../features/forum/services/forum.service';

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
    const fetchPost = async () => {
      try {
        setLoading(prev => ({ ...prev, pageLoading: true }));
        const response = await forumService.getPost(postId);
        if (response && response.status === 'success') {
          // Map API data to UI format
          const apiPost = response.data.post;
          const mappedPost = {
            id: apiPost.id,
            title: apiPost.title,
            author: {
              name: apiPost.author.username || 'Unknown',
              avatar: 'https://placehold.co/40x40/9370db/ffffff?text=' + (apiPost.author.username?.charAt(0) || 'U')
            },
            createdAt: apiPost.createdAt, // Assuming formatted string from backend or adjust date here
            category: apiPost.category,
            content: apiPost.content,
            excerpt: apiPost.content.substring(0, 100) + '...',
            likes: apiPost.likes,
            liked: false, // Need to check if current user liked it, backend should ideally return this
            comments: apiPost.comments.map(c => ({
              id: c.id,
              content: c.content,
              author: {
                name: c.author?.username || 'User',
                avatar: 'https://placehold.co/40x40/9370db/ffffff?text=' + (c.author?.username?.charAt(0) || 'U'),
                isOP: c.author?.id === apiPost.author.id
              },
              createdAt: c.createdAt,
              likes: c.likes || 0,
              liked: false,
              replies: c.replies ? c.replies.map(r => ({
                id: r.id,
                content: r.content,
                author: {
                  name: r.author?.username || 'User',
                  avatar: 'https://placehold.co/40x40/9370db/ffffff?text=' + (r.author?.username?.charAt(0) || 'U'),
                  isOP: r.author?.id === apiPost.author.id
                },
                createdAt: r.createdAt,
                likes: r.likes || 0,
                liked: false
              })) : []
            })),
            tags: apiPost.tags || [],
            isHot: apiPost.likes > 20,
            isFeatured: apiPost.isPinned
          };
          setPost(mappedPost);
        } else {
          // Handle explicit error status
          console.error("Failed to load post");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
      } finally {
        setLoading(prev => ({ ...prev, pageLoading: false }));
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const handleLike = async (id) => {
    if (!isAuthenticated) {
      navigate(path.AUTH.LOGIN, { state: { from: window.location.pathname, message: 'Vui lòng đăng nhập để thích bài viết' } });
      return;
    }

    setLoading(prev => ({ ...prev, likeLoading: true }));
    try {
      const response = await forumService.likePost(id);
      if (response && response.status === 'success') {
        setPost(prev => ({
          ...prev,
          liked: !prev.liked,
          likes: prev.liked ? prev.likes - 1 : prev.likes + 1
        }));
      }
    } catch (err) {
      console.error("Error liking post:", err);
    } finally {
      setLoading(prev => ({ ...prev, likeLoading: false }));
    }
  };

  const handleComment = async (data) => {
    if (!isAuthenticated) {
      navigate(path.AUTH.LOGIN, { state: { from: window.location.pathname, message: 'Vui lòng đăng nhập để bình luận' } });
      return;
    }

    setLoading(prev => ({ ...prev, commentLoading: true }));
    try {
      const response = await forumService.createComment(post.id, { content: data.content });
      if (response && response.status === 'success') {
        // Optimistically add comment or refetch. Optimistic update:
        // We'd ideally need the full user object and real ID from response.
        const newComment = {
          id: response.data?.comment?.id || Date.now(),
          content: data.content,
          author: {
            name: 'You', // Or get from auth context
            avatar: 'https://placehold.co/40x40/9370db/ffffff?text=Y',
            isOP: false // Check against post author ID
          },
          createdAt: 'Just now',
          likes: 0,
          liked: false,
          replies: []
        };
        setPost(prev => ({
          ...prev,
          comments: [newComment, ...prev.comments] // Add to top
        }));
      }
    } catch (err) {
      console.error("Error commenting:", err);
    } finally {
      setLoading(prev => ({ ...prev, commentLoading: false }));
    }
  };

  const handleReply = async (data, replyTo) => {
    if (!isAuthenticated) {
      navigate(path.AUTH.LOGIN, { state: { from: window.location.pathname, message: 'Vui lòng đăng nhập để trả lời bình luận' } });
      return;
    }

    setLoading(prev => ({ ...prev, commentLoading: true }));

    // Find absolute root parent
    let rootCommentId = replyTo.id;
    let isNested = false;

    // Check if replyTo is actually a nested reply inside a root comment
    const rootParent = post.comments.find(c =>
      c.replies && c.replies.some(r => r.id === replyTo.id)
    );

    if (rootParent) {
      rootCommentId = rootParent.id;
      isNested = true;
    }

    try {
      // If replying to a nested comment, effectively reply to the root, but maybe add tag in content if desired.
      // For now, simpler approach: just link to root.
      const response = await forumService.createComment(post.id, {
        content: data.content,
        parentCommentId: rootCommentId
      });

      if (response && response.status === 'success') {
        // Optimistic update
        const newReply = {
          id: response.data?.comment?.id || Date.now(),
          content: data.content,
          author: {
            name: currentUser.name || 'User', // Fallback
            avatar: currentUser.avatar || 'https://placehold.co/40x40/9370db/ffffff?text=U',
            isOP: false
          },
          createdAt: 'Just now',
          likes: 0,
          liked: false
        };

        setPost(prev => {
          return {
            ...prev,
            comments: prev.comments.map(comment => {
              if (comment.id === rootCommentId) {
                return {
                  ...comment,
                  replies: [...(comment.replies || []), newReply]
                };
              }
              return comment;
            })
          };
        });
      }
    } catch (err) {
      console.error("Error replying:", err);
    } finally {
      setLoading(prev => ({ ...prev, commentLoading: false }));
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!isAuthenticated) {
      navigate(path.AUTH.LOGIN, { state: { from: window.location.pathname, message: 'Vui lòng đăng nhập để thích bình luận' } });
      return;
    }

    // API call for like comment
    try {
      const response = await forumService.likeComment(commentId);
      if (response && response.status === 'success') {
        const { likesCount, liked } = response.data;

        setPost(prev => {
          // Helper function to update comment or reply
          const updateItem = (item) => {
            if (item.id === commentId) {
              return {
                ...item,
                liked: liked,
                likes: likesCount
              };
            }
            return item;
          };

          // Re-map comments to find and update the target
          const updatedComments = prev.comments.map(comment => {
            if (comment.id === commentId) {
              return updateItem(comment);
            }

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
      }
    } catch (err) {
      console.error("Error liking comment:", err);
    }
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
        <div className="mb-6">
          <button
            onClick={() => navigate(path.PUBLIC.FORUM)}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#9370db] transition-colors tracking-vn-tight"
          >
            <Icon name="ArrowLeft" size="sm" />
            Quay lại diễn đàn
          </button>
        </div>
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

      </ForumLayout>
    </>
  );
};

export default memo(ForumPostDetailPage); 