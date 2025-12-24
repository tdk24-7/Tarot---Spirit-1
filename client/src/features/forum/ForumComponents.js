import React, { memo, useState, useEffect } from 'react';
import { Icon } from '../../shared/components/common';
import { motion } from 'framer-motion';

// Text Editor Toolbar Button
export const ToolbarButton = memo(({ icon, label, active, onClick }) => (
  <button
    type="button"
    className={`p-2 rounded-md hover:bg-white/10 ${active ? 'bg-white/10 text-[#9370db]' : 'text-gray-400'}`}
    onClick={onClick}
    title={label}
  >
    <Icon name={icon} size="sm" />
  </button>
));

// Rich Text Editor
export const RichTextEditor = memo(({ value, onChange, placeholder = 'Nhập nội dung bài viết...' }) => {
  const [editorState, setEditorState] = useState(value || '');
  const [activeControls, setActiveControls] = useState({
    bold: false,
    italic: false,
    underline: false,
    list: false,
  });

  useEffect(() => {
    if (onChange) {
      onChange(editorState);
    }
  }, [editorState, onChange]);

  const handleToolbarAction = (action) => {
    // Placeholder for rich text editor functionality
    // In a real implementation, this would modify the text with formatting
    setActiveControls(prev => ({
      ...prev,
      [action]: !prev[action]
    }));
  };

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden bg-white/5">
      <div className="flex items-center border-b border-white/10 p-2 bg-white/5">
        <ToolbarButton 
          icon="Bold" 
          label="Đậm" 
          active={activeControls.bold}
          onClick={() => handleToolbarAction('bold')} 
        />
        <ToolbarButton 
          icon="Italic" 
          label="Nghiêng" 
          active={activeControls.italic}
          onClick={() => handleToolbarAction('italic')} 
        />
        <ToolbarButton 
          icon="Underline" 
          label="Gạch chân" 
          active={activeControls.underline}
          onClick={() => handleToolbarAction('underline')} 
        />
        <div className="h-5 w-px bg-white/10 mx-2"></div>
        <ToolbarButton 
          icon="List" 
          label="Danh sách" 
          active={activeControls.list}
          onClick={() => handleToolbarAction('list')} 
        />
        <ToolbarButton 
          icon="Image" 
          label="Hình ảnh" 
          active={activeControls.image}
          onClick={() => handleToolbarAction('image')} 
        />
        <ToolbarButton 
          icon="Link" 
          label="Liên kết" 
          active={activeControls.link}
          onClick={() => handleToolbarAction('link')} 
        />
      </div>
      <textarea
        value={editorState}
        onChange={(e) => setEditorState(e.target.value)}
        placeholder={placeholder}
        className="w-full p-4 min-h-[200px] bg-transparent text-white focus:outline-none resize-y tracking-vn-tight leading-vn"
      />
    </div>
  );
});

// Tag Input Component
export const TagInput = memo(({ tags, setTags, maxTags = 5 }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim()) && tags.length < maxTags) {
      setTags([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="border border-white/10 rounded-lg bg-white/5 p-2 focus-within:border-[#9370db] transition-colors">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <div 
            key={index} 
            className="flex items-center gap-1 bg-[#2a1045] px-2 py-1 rounded-full text-xs tracking-vn-tight"
          >
            <span>#{tag}</span>
            <button 
              type="button" 
              onClick={() => removeTag(tag)}
              className="text-gray-400 hover:text-white"
            >
              <Icon name="X" size="xs" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <span className="text-gray-400 mr-1">#</span>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleAddTag}
          placeholder={tags.length < maxTags ? "Thêm thẻ và nhấn Enter" : "Đã đạt số lượng thẻ tối đa"}
          disabled={tags.length >= maxTags}
          className="flex-1 bg-transparent border-none focus:outline-none text-white text-sm tracking-vn-tight"
        />
      </div>
      {tags.length >= maxTags && (
        <p className="text-xs text-amber-400 mt-1">Bạn đã đạt số lượng thẻ tối đa ({maxTags})</p>
      )}
    </div>
  );
});

// Category Select Component
export const CategorySelect = memo(({ categories, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        className="w-full flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg hover:border-[#9370db]/50 transition-colors text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {selected ? (
            <>
              <span className={`w-3 h-3 rounded-full ${getCategoryColor(selected).bg}`}></span>
              <span className="tracking-vn-tight">{selected}</span>
            </>
          ) : (
            <span className="text-gray-400 tracking-vn-tight">Chọn danh mục</span>
          )}
        </div>
        <Icon name={isOpen ? "ChevronUp" : "ChevronDown"} size="sm" className="text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-[#1a0933] border border-purple-900/30 rounded-lg shadow-xl overflow-hidden">
          <div className="max-h-60 overflow-y-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`w-full text-left px-4 py-3 hover:bg-white/5 flex items-center gap-2 ${
                  selected === category.label ? 'bg-white/10' : ''
                }`}
                onClick={() => {
                  onChange(category.label);
                  setIsOpen(false);
                }}
              >
                <span className={`w-3 h-3 rounded-full ${getCategoryColor(category.label).bg}`}></span>
                <span className="tracking-vn-tight">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

// Create Post Form
export const CreatePostForm = memo(({ onSubmit, loading = false }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [error, setError] = useState('');

  const categories = [
    { id: 'discussion', label: 'Thảo luận' },
    { id: 'share', label: 'Chia sẻ' },
    { id: 'question', label: 'Câu hỏi' },
    { id: 'guide', label: 'Hướng dẫn' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề bài viết');
      return;
    }
    
    if (!content.trim()) {
      setError('Vui lòng nhập nội dung bài viết');
      return;
    }
    
    if (!category) {
      setError('Vui lòng chọn danh mục');
      return;
    }
    
    setError('');
    
    onSubmit({
      title,
      content,
      category,
      tags
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-white text-sm">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="post-title" className="block text-sm font-medium text-gray-300 mb-2 tracking-vn-tight">
          Tiêu đề bài viết
        </label>
        <input
          id="post-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nhập tiêu đề bài viết"
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#9370db]/50 focus:border-[#9370db] transition-all placeholder:text-gray-500 tracking-vn-tight"
          required
        />
      </div>
      
      <div>
        <label htmlFor="post-category" className="block text-sm font-medium text-gray-300 mb-2 tracking-vn-tight">
          Danh mục
        </label>
        <CategorySelect 
          categories={categories} 
          selected={category} 
          onChange={setCategory} 
        />
      </div>
      
      <div>
        <label htmlFor="post-content" className="block text-sm font-medium text-gray-300 mb-2 tracking-vn-tight">
          Nội dung bài viết
        </label>
        <RichTextEditor 
          value={content} 
          onChange={setContent} 
        />
      </div>
      
      <div>
        <label htmlFor="post-tags" className="block text-sm font-medium text-gray-300 mb-2 tracking-vn-tight">
          Thẻ (tối đa 5 thẻ)
        </label>
        <TagInput 
          tags={tags} 
          setTags={setTags} 
        />
        <p className="mt-1 text-xs text-gray-400 tracking-vn-tight">
          Thêm các thẻ để giúp người khác tìm thấy bài viết của bạn dễ dàng hơn
        </p>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={`py-3 px-6 rounded-lg bg-gradient-to-r from-[#8a2be2] to-[#9370db] text-white text-sm font-medium hover:shadow-xl hover:shadow-[#9370db]/20 transition-all hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden group ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#9370db]/80 to-[#8a2be2]/80 blur-md transform scale-105 opacity-0 group-hover:opacity-70 transition-all duration-500"></span>
          <span className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
          <span className="relative z-10 flex items-center justify-center tracking-vn-tight">
            {loading ? (
              <>
                <Icon
                  name="Loader2"
                  size="sm"
                  className="animate-spin -ml-1 mr-2 text-white"
                />
                Đang đăng bài...
              </>
            ) : 'Đăng bài viết'}
          </span>
        </button>
      </div>
    </form>
  );
});

// Edit Post Form
export const EditPostForm = memo(({ initialData, onSubmit, loading = false }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [tags, setTags] = useState(initialData?.tags || []);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      setCategory(initialData.category || '');
      setTags(initialData.tags || []);
    }
  }, [initialData]);

  const categories = [
    { id: 'discussion', label: 'Thảo luận' },
    { id: 'share', label: 'Chia sẻ' },
    { id: 'question', label: 'Câu hỏi' },
    { id: 'guide', label: 'Hướng dẫn' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề bài viết');
      return;
    }
    
    if (!content.trim()) {
      setError('Vui lòng nhập nội dung bài viết');
      return;
    }
    
    if (!category) {
      setError('Vui lòng chọn danh mục');
      return;
    }
    
    setError('');
    
    onSubmit({
      title,
      content,
      category,
      tags
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-white text-sm">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="post-title" className="block text-sm font-medium text-gray-300 mb-2 tracking-vn-tight">
          Tiêu đề bài viết
        </label>
        <input
          id="post-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nhập tiêu đề bài viết"
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#9370db]/50 focus:border-[#9370db] transition-all placeholder:text-gray-500 tracking-vn-tight"
          required
        />
      </div>
      
      <div>
        <label htmlFor="post-category" className="block text-sm font-medium text-gray-300 mb-2 tracking-vn-tight">
          Danh mục
        </label>
        <CategorySelect 
          categories={categories} 
          selected={category} 
          onChange={setCategory} 
        />
      </div>
      
      <div>
        <label htmlFor="post-content" className="block text-sm font-medium text-gray-300 mb-2 tracking-vn-tight">
          Nội dung bài viết
        </label>
        <RichTextEditor 
          value={content} 
          onChange={setContent} 
        />
      </div>
      
      <div>
        <label htmlFor="post-tags" className="block text-sm font-medium text-gray-300 mb-2 tracking-vn-tight">
          Thẻ (tối đa 5 thẻ)
        </label>
        <TagInput 
          tags={tags} 
          setTags={setTags} 
        />
        <p className="mt-1 text-xs text-gray-400 tracking-vn-tight">
          Thêm các thẻ để giúp người khác tìm thấy bài viết của bạn dễ dàng hơn
        </p>
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="py-3 px-6 rounded-lg border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition-all tracking-vn-tight"
          onClick={() => window.history.back()}
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`py-3 px-6 rounded-lg bg-gradient-to-r from-[#8a2be2] to-[#9370db] text-white text-sm font-medium hover:shadow-xl hover:shadow-[#9370db]/20 transition-all hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden group ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#9370db]/80 to-[#8a2be2]/80 blur-md transform scale-105 opacity-0 group-hover:opacity-70 transition-all duration-500"></span>
          <span className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
          <span className="relative z-10 flex items-center justify-center tracking-vn-tight">
            {loading ? (
              <>
                <Icon
                  name="Loader2"
                  size="sm"
                  className="animate-spin -ml-1 mr-2 text-white"
                />
                Đang lưu...
              </>
            ) : 'Cập nhật bài viết'}
          </span>
        </button>
      </div>
    </form>
  );
});

// Comment Form
export const CommentForm = memo(({ onSubmit, loading = false, replyTo = null }) => {
  const [content, setContent] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    onSubmit({
      content,
      replyTo
    });
    
    setContent('');
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        {replyTo && (
          <div className="px-3 py-2 mb-2 rounded-lg bg-white/5 border-l-2 border-[#9370db] text-gray-300 text-sm tracking-vn-tight">
            <p className="text-xs text-gray-400">Đang trả lời:</p>
            <p className="line-clamp-1">{replyTo.content}</p>
          </div>
        )}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={replyTo ? "Nhập trả lời của bạn..." : "Nhập bình luận của bạn..."}
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#9370db]/50 focus:border-[#9370db] transition-all placeholder:text-gray-500 min-h-[100px] resize-y tracking-vn-tight leading-vn"
          required
        />
      </div>
      
      <div className="flex justify-end">
        {replyTo && (
          <button
            type="button"
            className="mr-3 py-2 px-4 text-gray-400 hover:text-white transition-colors text-sm tracking-vn-tight"
            onClick={() => onSubmit({ cancelReply: true })}
          >
            Hủy trả lời
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className={`py-2 px-4 rounded-lg bg-gradient-to-r from-[#8a2be2] to-[#9370db] text-white text-sm font-medium hover:shadow-lg hover:shadow-[#9370db]/20 transition-all relative overflow-hidden group ${
            loading || !content.trim() ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          <span className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
          <span className="relative z-10 flex items-center justify-center tracking-vn-tight">
            {loading ? (
              <>
                <Icon
                  name="Loader2"
                  size="sm"
                  className="animate-spin -ml-1 mr-2 text-white"
                />
                Đang gửi...
              </>
            ) : replyTo ? 'Gửi trả lời' : 'Gửi bình luận'}
          </span>
        </button>
      </div>
    </form>
  );
});

// Comment Component
export const Comment = memo(({ comment, onReply, onLike, currentUser, isReply = false }) => {
  const [showReplies, setShowReplies] = useState(true);
  
  return (
    <div className={`${isReply ? 'pl-6 border-l border-white/10 mt-4' : 'border-b border-white/10 py-4'}`}>
      <div className="flex gap-3">
        <img 
          src={comment.author.avatar} 
          alt={comment.author.name} 
          className="w-10 h-10 rounded-full object-cover border-2 border-[#9370db]"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/40x40?text=User";
          }}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-white tracking-vn-tight">{comment.author.name}</span>
            {comment.author.isOP && (
              <span className="bg-[#9370db]/20 text-[#9370db] px-2 py-0.5 rounded-full text-xs tracking-vn-tight">
                Tác giả
              </span>
            )}
            <span className="text-xs text-gray-400 tracking-vn-tight">{comment.createdAt}</span>
          </div>
          <p className="text-gray-300 tracking-vn-tight leading-vn mb-3">{comment.content}</p>
          <div className="flex items-center gap-4 text-sm">
            <button 
              onClick={() => onLike(comment.id)}
              className={`flex items-center gap-1 hover:text-[#9370db] transition-colors ${
                comment.liked ? 'text-[#9370db]' : 'text-gray-400'
              }`}
            >
              <Icon
                name="Heart"
                className={comment.liked ? "fill-[#9370db]" : ""}
                size="sm"
              />
              <span>{comment.likes}</span>
            </button>
            <button 
              onClick={() => onReply(comment)}
              className="flex items-center gap-1 text-gray-400 hover:text-[#9370db] transition-colors"
            >
              <Icon name="CornerUpLeft" size="sm" />
              <span>Trả lời</span>
            </button>
          </div>
        </div>
      </div>
      
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-1 text-sm text-[#9370db] mb-3 hover:text-[#9370db]/80 transition-colors"
          >
            <Icon name={showReplies ? "ChevronDown" : "ChevronRight"} size="sm" />
            <span>{showReplies ? 'Ẩn' : 'Hiện'} {comment.replies.length} trả lời</span>
          </button>
          
          {showReplies && (
            <div className="space-y-4">
              {comment.replies.map((reply) => (
                <Comment
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  onLike={onLike}
                  currentUser={currentUser}
                  isReply={true}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

// Post Detail Component
export const PostDetail = memo(({ 
  post, 
  onLike, 
  onComment, 
  onReply, 
  onLikeComment, 
  currentUser = null,
  loading = {
    likeLoading: false,
    commentLoading: false
  }
}) => {
  const [replyingTo, setReplyingTo] = useState(null);
  
  const handleCommentSubmit = (data) => {
    if (data.cancelReply) {
      setReplyingTo(null);
      return;
    }
    
    if (replyingTo) {
      onReply(data, replyingTo);
      setReplyingTo(null);
    } else {
      onComment(data);
    }
  };
  
  const handleReply = (comment) => {
    setReplyingTo(comment);
    // Scroll to comment form
    document.getElementById('comment-form').scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="space-y-8">
      {/* Post Header */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className={`px-2 py-1 text-xs rounded-full tracking-vn-tight ${getCategoryColor(post.category).text} ${getCategoryColor(post.category).bg}`}>
            {post.category}
          </span>
          {post.isHot && (
            <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs tracking-vn-tight">
              Hot
            </span>
          )}
          {post.isFeatured && (
            <span className="bg-[#9370db]/20 text-[#9370db] px-2 py-1 rounded-full text-xs tracking-vn-tight">
              Nổi bật
            </span>
          )}
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-white tracking-vn-tight">{post.title}</h1>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img 
              src={post.author.avatar} 
              alt={post.author.name} 
              className="w-10 h-10 rounded-full object-cover border-2 border-[#9370db]"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/40x40?text=User";
              }}
            />
            <div>
              <p className="font-medium text-white tracking-vn-tight">{post.author.name}</p>
              <p className="text-xs text-gray-400 tracking-vn-tight">Đăng lúc {post.createdAt}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onLike(post.id)}
              disabled={loading.likeLoading}
              className={`flex items-center gap-1 hover:text-[#9370db] transition-colors ${
                post.liked ? 'text-[#9370db]' : 'text-gray-400'
              }`}
            >
              {loading.likeLoading ? (
                <Icon name="Loader2" size="sm" className="animate-spin" />
              ) : (
                <Icon name="Heart" className={post.liked ? "fill-[#9370db]" : ""} size="sm" />
              )}
              <span>{post.likes}</span>
            </button>
            <div className="flex items-center gap-1 text-gray-400">
              <Icon name="MessageCircle" size="sm" />
              <span>{post.comments?.length || 0}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag, index) => (
            <span key={index} className="bg-[#2a1045] text-gray-300 px-2 py-1 rounded-full text-xs tracking-vn-tight">
              #{tag}
            </span>
          ))}
        </div>
      </div>
      
      {/* Post Content */}
      <div className="bg-white/5 backdrop-blur-sm border border-purple-900/20 rounded-xl p-6">
        <div className="prose prose-invert max-w-none tracking-vn-tight leading-vn">
          {post.content}
        </div>
      </div>
      
      {/* Comments Section */}
      <div>
        <h2 className="text-xl font-bold mb-6 text-white tracking-vn-tight">
          Bình luận ({post.comments?.length || 0})
        </h2>
        
        <div id="comment-form" className="bg-white/5 backdrop-blur-sm border border-purple-900/20 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-medium mb-4 text-white tracking-vn-tight">
            {replyingTo ? 'Trả lời bình luận' : 'Thêm bình luận'}
          </h3>
          <CommentForm 
            onSubmit={handleCommentSubmit} 
            loading={loading.commentLoading} 
            replyTo={replyingTo}
          />
        </div>
        
        {post.comments && post.comments.length > 0 ? (
          <div className="space-y-0">
            {post.comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                onReply={handleReply}
                onLike={onLikeComment}
                currentUser={currentUser}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white/5 backdrop-blur-sm border border-purple-900/20 rounded-xl">
            <Icon 
              name="MessageCircle" 
              size="xl" 
              className="mx-auto text-gray-400 mb-4" 
            />
            <p className="text-lg text-gray-400 tracking-vn-tight">
              Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

// Helper function for category colors
const getCategoryColor = (category) => {
  switch (category) {
    case 'Thảo luận':
      return { 
        text: 'text-blue-400',
        bg: 'bg-blue-500/20'
      };
    case 'Chia sẻ':
      return { 
        text: 'text-green-400',
        bg: 'bg-green-500/20'
      };
    case 'Câu hỏi':
      return { 
        text: 'text-yellow-400',
        bg: 'bg-yellow-500/20'
      };
    case 'Hướng dẫn':
      return { 
        text: 'text-purple-400',
        bg: 'bg-purple-500/20'
      };
    default:
      return { 
        text: 'text-gray-400',
        bg: 'bg-gray-500/20'
      };
  }
}; 