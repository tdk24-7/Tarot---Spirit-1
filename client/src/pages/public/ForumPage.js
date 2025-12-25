import React, { useState, useEffect, memo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import ForumLayout from '../../features/forum/ForumLayout';
import { Icon } from '../../shared/components/common';
import { path } from '../../shared/utils/routes';
import { useAuth } from '../../features/auth/hook/useAuth';
import forumService from '../../features/forum/services/forum.service';

// Components
const SectionTitle = memo(({ title, subtitle, centered = false }) => (
  <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#9370db] tracking-vn-tight">
      {title}
      <span className="block h-1 w-20 bg-gradient-to-r from-[#9370db] to-[#8a2be2] mt-2 rounded-full"></span>
    </h2>
    {subtitle && <p className="text-gray-600 leading-vn tracking-vn-tight text-lg">{subtitle}</p>}
  </div>
));

const SearchBar = memo(({ value, onChange }) => (
  <div className="relative mb-6">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon
        name="Search"
        size="sm"
        className="text-gray-400"
      />
    </div>
    <input
      type="text"
      placeholder="Tìm kiếm bài viết..."
      value={value}
      onChange={onChange}
      className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-purple-900/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#9370db] transition-colors tracking-vn-tight"
    />
  </div>
));

const CategoryButton = memo(({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full mr-2 mb-2 text-sm font-medium transition-colors tracking-vn-tight
    ${active
        ? 'bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white shadow-md'
        : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20'}`}
  >
    {label}
  </button>
));

const ForumPostCard = memo(({ title, author, date, category, excerpt, likes, comments, tags, isHot = false, isFeatured = false }) => {
  const postLink = path.PUBLIC.FORUM_POST.replace(':postId', category === 'Câu hỏi' ? '1' : '2');

  return (
    <div className={`bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:bg-white/10 border ${isFeatured ? 'border-[#9370db]' : 'border-purple-900/20'}`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 text-xs rounded-full tracking-vn-tight ${getTagColor(category)}`}>
                {category}
              </span>
              {isHot && (
                <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs tracking-vn-tight">
                  Hot
                </span>
              )}
              {isFeatured && (
                <span className="bg-[#9370db]/20 text-[#9370db] px-2 py-1 rounded-full text-xs tracking-vn-tight">
                  Nổi bật
                </span>
              )}
            </div>
            <Link to={postLink} className="block">
              <h3 className="text-xl font-bold mb-2 text-white tracking-vn-tight hover:text-[#9370db] transition-colors line-clamp-2">{title}</h3>
            </Link>
          </div>
          <div className="flex items-center">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-[#9370db]"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/40x40?text=User";
              }}
            />
          </div>
        </div>

        <p className="text-gray-400 mb-4 tracking-vn-tight leading-vn line-clamp-2">{excerpt}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span key={index} className="bg-[#2a1045] text-gray-300 px-2 py-1 rounded-full text-xs tracking-vn-tight">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center text-sm text-gray-400">
          <div className="flex items-center">
            <span className="tracking-vn-tight">{author.name}</span>
            <span className="mx-2">•</span>
            <span className="tracking-vn-tight">{formatDate(date)}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Icon
                name="Heart"
                size="xs"
                className="text-gray-400"
              />
              <span>{likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon
                name="MessageCircle"
                size="xs"
                className="text-gray-400"
              />
              <span>{comments}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const TrendingTopicCard = memo(({ title, posts, isActive = false }) => (
  <div className={`p-4 rounded-xl transition-all ${isActive ? 'bg-[#9370db]/20 border border-[#9370db]/40' : 'bg-white/5 hover:bg-white/10 border border-purple-900/20'}`}>
    <h3 className={`text-lg font-bold mb-2 tracking-vn-tight ${isActive ? 'text-[#9370db]' : 'text-white'}`}>{title}</h3>
    <p className="text-gray-400 text-sm tracking-vn-tight">{posts} bài viết</p>
  </div>
));

const UserRankCard = memo(({ rank, user, posts, avatar }) => (
  <div className="flex items-center p-3 gap-3 rounded-xl transition-all hover:bg-white/5">
    <div className="font-bold text-lg text-gray-400 w-6">{rank}</div>
    <div className="relative">
      <img
        src={avatar}
        alt={user}
        className="w-10 h-10 rounded-full object-cover border-2 border-[#9370db]"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/40x40?text=User";
        }}
      />
      {rank <= 3 && (
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-[#9370db] to-[#8a2be2] flex items-center justify-center text-xs text-white font-bold">
          {rank}
        </div>
      )}
    </div>
    <div className="flex-1">
      <p className="font-medium text-white tracking-vn-tight">{user}</p>
      <p className="text-gray-400 text-xs tracking-vn-tight">{posts} bài viết</p>
    </div>
  </div>
));

const PaginationButton = memo(({ page, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors text-sm
    ${active
        ? 'bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white'
        : 'bg-white/10 text-white hover:bg-white/20'}`}
  >
    {page}
  </button>
));

// Helper Functions
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('vi-VN', options);
};

const getTagColor = (category) => {
  switch (category) {
    case 'Thảo luận':
      return 'bg-blue-500/20 text-blue-400';
    case 'Chia sẻ':
      return 'bg-green-500/20 text-green-400';
    case 'Câu hỏi':
      return 'bg-yellow-500/20 text-yellow-400';
    case 'Hướng dẫn':
      return 'bg-purple-500/20 text-purple-400';
    default:
      return 'bg-gray-500/20 text-gray-400';
  }
};

const ForumPage = () => {
  // Categories
  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'Thảo luận', label: 'Thảo luận' },
    { id: 'Chia sẻ', label: 'Chia sẻ' },
    { id: 'Câu hỏi', label: 'Câu hỏi' },
    { id: 'Hướng dẫn', label: 'Hướng dẫn' }
  ];

  // Hardcode Trending Topics & Contributors for now (avoid overengineering)
  const trendingTopics = [
    { id: 1, title: 'Bài Tarot cho người mới', posts: 27, isActive: true },
    { id: 2, title: 'Ý nghĩa các lá bài Major Arcana', posts: 19 }
  ];

  const topContributors = [
    { rank: 1, user: 'Admin', posts: 999, avatar: 'https://placehold.co/40x40/9370db/ffffff?text=A' }
  ];

  // Real API integration
  const [forumPosts, setForumPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, count: 0 });

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const params = {
          limit: 10,
          offset: (currentPage - 1) * 10,
          search: searchTerm || undefined,
          category: activeCategory !== 'all' ? activeCategory : undefined
        };
        const response = await forumService.getPosts(params);
        if (response && response.status === 'success') {
          // Map API data to UI format
          const mappedPosts = response.data.posts.map(post => ({
            id: post.id,
            title: post.title,
            author: {
              name: post.author.username || 'Unknown',
              avatar: 'https://placehold.co/40x40/9370db/ffffff?text=' + (post.author.username?.charAt(0) || 'U')
            },
            date: post.createdAt,
            category: post.category,
            excerpt: post.content, // Controller already truncates
            likes: post.likes,
            comments: post.commentsCount,
            tags: post.tags || [],
            isHot: post.likes > 20, // Simple logic
            isFeatured: post.isPinned
          }));
          setForumPosts(mappedPosts);
          setPagination({ total: response.total, count: response.count });
        }
      } catch (err) {
        console.error("Failed to fetch forum posts", err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
      fetchPosts();
    }, 500);
    return () => clearTimeout(timer);

  }, [activeCategory, searchTerm, currentPage]);

  // Use API posts, no need to filter locally again since API does it
  const filteredPosts = forumPosts;


  const handleCreatePost = () => {
    if (isAuthenticated) {
      navigate(path.PUBLIC.FORUM_CREATE_POST);
    } else {
      navigate(path.AUTH.LOGIN, { state: { from: path.PUBLIC.FORUM, message: 'Vui lòng đăng nhập để tạo bài viết mới' } });
    }
  };

  return (
    <>
      <Helmet>
        <title>Diễn Đàn Tarot | Thảo luận và chia sẻ kinh nghiệm</title>
        <meta name="description" content="Tham gia diễn đàn Tarot để thảo luận, đặt câu hỏi và chia sẻ kinh nghiệm về nghệ thuật Tarot với cộng đồng." />
      </Helmet>

      <ForumLayout
        title="Diễn Đàn Tarot"
        description="Kết nối với cộng đồng những người yêu thích Tarot. Chia sẻ kinh nghiệm, đặt câu hỏi và tham gia thảo luận về nghệ thuật Tarot."
        maxWidth="6xl"
      >
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-24">
              {/* Create Post Button */}
              <button
                onClick={handleCreatePost}
                className="block w-full bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white px-4 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow tracking-vn-tight"
              >
                <div className="flex items-center justify-center">
                  <Icon
                    name="Plus"
                    size="sm"
                    className="mr-2"
                  />
                  Tạo bài viết mới
                </div>
              </button>

              {/* Trending Topics */}
              <div className="bg-white/5 backdrop-blur-sm border border-purple-900/20 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold mb-4 tracking-vn-tight">Chủ đề nổi bật</h2>
                <div className="space-y-3">
                  {trendingTopics.map(topic => (
                    <TrendingTopicCard
                      key={topic.id}
                      title={topic.title}
                      posts={topic.posts}
                      isActive={topic.isActive}
                    />
                  ))}
                </div>
              </div>

              {/* Top Contributors */}
              <div className="bg-white/5 backdrop-blur-sm border border-purple-900/20 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 tracking-vn-tight">Thành viên tích cực</h2>
                <div className="space-y-1">
                  {topContributors.map(contributor => (
                    <UserRankCard
                      key={contributor.rank}
                      rank={contributor.rank}
                      user={contributor.user}
                      posts={contributor.posts}
                      avatar={contributor.avatar}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {/* Search and Filter */}
            <div className="mb-8">
              <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <div className="flex flex-wrap">
                {categories.map(category => (
                  <CategoryButton
                    key={category.id}
                    label={category.label}
                    active={activeCategory === category.id}
                    onClick={() => setActiveCategory(category.id)}
                  />
                ))}
              </div>
            </div>

            {/* Forum Posts */}
            <div className="space-y-6">
              {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                  <ForumPostCard
                    key={post.id}
                    title={post.title}
                    author={post.author}
                    date={post.date}
                    category={post.category}
                    excerpt={post.excerpt}
                    likes={post.likes}
                    comments={post.comments}
                    tags={post.tags}
                    isHot={post.isHot}
                    isFeatured={post.isFeatured}
                  />
                ))
              ) : (
                <div className="text-center py-12 bg-white/5 backdrop-blur-sm border border-purple-900/20 rounded-xl">
                  <Icon
                    name="Frown"
                    size="xl"
                    className="mx-auto text-gray-400 mb-4"
                  />
                  <p className="text-xl text-gray-400 tracking-vn-tight">Không tìm thấy bài viết phù hợp. Vui lòng thử lại với từ khóa khác.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredPosts.length > 0 && (
              <div className="flex justify-center items-center space-x-2 mt-10">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-md flex items-center justify-center bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 transition-colors"
                >
                  <Icon
                    name="ChevronLeft"
                    size="sm"
                    className="text-white"
                  />
                </button>

                {[1, 2, 3].map(page => (
                  <PaginationButton
                    key={page}
                    page={page}
                    active={currentPage === page}
                    onClick={() => setCurrentPage(page)}
                  />
                ))}

                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage === 3}
                  className="w-10 h-10 rounded-md flex items-center justify-center bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 transition-colors"
                >
                  <Icon
                    name="ChevronRight"
                    size="sm"
                    className="text-white"
                  />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Community Guidelines Section */}
        <section className="py-16 mt-16 px-4 md:px-8 relative bg-[#1a0933]/80 rounded-2xl">
          <SectionTitle
            title="Quy tắc cộng đồng"
            subtitle="Hãy cùng xây dựng một cộng đồng thân thiện và bổ ích"
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-purple-900/20 p-6 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-[#9370db]/20 flex items-center justify-center mb-4">
                <Icon
                  name="Zap"
                  size="md"
                  className="text-[#9370db]"
                />
              </div>
              <h3 className="text-xl font-bold mb-2 tracking-vn-tight">Tôn trọng</h3>
              <p className="text-gray-300 tracking-vn-tight leading-vn">Tôn trọng mọi thành viên trong cộng đồng. Không chấp nhận phân biệt đối xử, quấy rối hoặc ngôn ngữ xúc phạm.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-purple-900/20 p-6 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-[#9370db]/20 flex items-center justify-center mb-4">
                <Icon
                  name="AlertCircle"
                  size="md"
                  className="text-[#9370db]"
                />
              </div>
              <h3 className="text-xl font-bold mb-2 tracking-vn-tight">Có trách nhiệm</h3>
              <p className="text-gray-300 tracking-vn-tight leading-vn">Chia sẻ thông tin chính xác và có trách nhiệm. Tarot là công cụ tham khảo, không thay thế cho lời khuyên của chuyên gia.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-purple-900/20 p-6 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-[#9370db]/20 flex items-center justify-center mb-4">
                <Icon
                  name="Bell"
                  size="md"
                  className="text-[#9370db]"
                />
              </div>
              <h3 className="text-xl font-bold mb-2 tracking-vn-tight">Đóng góp tích cực</h3>
              <p className="text-gray-300 tracking-vn-tight leading-vn">Hãy đóng góp nội dung có giá trị, hữu ích cho cộng đồng. Tránh spam, quảng cáo hoặc nội dung không liên quan.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 mt-16">
          <div className="bg-gradient-to-r from-[#2a1045] to-[#3a1c5a] rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#9370db]/20 rounded-full filter blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#8a2be2]/20 rounded-full filter blur-[80px]"></div>

            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 tracking-vn-tight">Gia nhập cộng đồng ngay hôm nay</h2>
              <p className="text-lg text-gray-300 mb-8 tracking-vn-tight leading-vn">
                Đăng ký tài khoản để tham gia thảo luận, đặt câu hỏi và kết nối với những người yêu thích Tarot trên khắp Việt Nam.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to={path.AUTH.REGISTER}
                  className="bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow tracking-vn-tight"
                >
                  Đăng ký tài khoản
                </Link>
                <Link
                  to={path.AUTH.LOGIN}
                  className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-medium hover:bg-white/20 transition-colors tracking-vn-tight"
                >
                  Đăng nhập
                </Link>
              </div>
            </div>
          </div>
        </section>
      </ForumLayout>
    </>
  );
};

export default memo(ForumPage); 