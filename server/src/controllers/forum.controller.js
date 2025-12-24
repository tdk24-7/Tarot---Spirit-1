const db = require('../models');
const ForumPost = db.forumPosts;
const Comment = db.comments;
const User = db.users;
const Report = db.reports;
const sanitizeHtml = require('sanitize-html');

// Lấy danh sách bài viết
exports.getPosts = async (req, res, next) => {
  try {
    const {
      limit = 10,
      offset = 0,
      category,
      tag,
      search,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    // Xây dựng điều kiện tìm kiếm
    const where = { is_approved: true };
    
    // Lọc theo danh mục
    if (category) {
      where.category = category;
    }
    
    // Lọc theo tag
    if (tag) {
      where.tags = { [db.Sequelize.Op.contains]: [tag] };
    }
    
    // Tìm kiếm
    if (search) {
      where[db.Sequelize.Op.or] = [
        { title: { [db.Sequelize.Op.iLike]: `%${search}%` } },
        { content: { [db.Sequelize.Op.iLike]: `%${search}%` } }
      ];
    }

    // Đếm tổng số kết quả
    const total = await ForumPost.count({ where });

    // Lấy các bài viết với phân trang và sắp xếp
    const posts = await ForumPost.findAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder.toUpperCase()]],
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'role', 'is_premium']
        },
        {
          model: Comment,
          as: 'comments',
          attributes: ['id'],
          where: { parent_comment_id: null }, // Chỉ đếm comment gốc
          required: false
        }
      ]
    });

    // Format dữ liệu trả về
    const formattedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content.substring(0, 200) + (post.content.length > 200 ? '...' : ''),
      category: post.category,
      tags: post.tags,
      likes: post.likes,
      views: post.views,
      isPinned: post.is_pinned,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      author: {
        id: post.author.id,
        username: post.author.username,
        role: post.author.role,
        isPremium: post.author.is_premium
      },
      commentsCount: post.comments?.length || 0
    }));

    res.status(200).json({
      status: 'success',
      count: posts.length,
      total,
      data: {
        posts: formattedPosts
      }
    });
  } catch (error) {
    next(error);
  }
};

// Xem chi tiết bài viết
exports.getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Lấy thông tin bài viết
    const post = await ForumPost.findOne({
      where: {
        id,
        is_approved: true
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'role', 'is_premium']
        },
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'username', 'role', 'is_premium']
            },
            {
              model: Comment,
              as: 'replies',
              include: [{
                model: User,
                as: 'author',
                attributes: ['id', 'username', 'role', 'is_premium']
              }]
            }
          ]
        }
      ]
    });

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found or not approved'
      });
    }

    // Tăng lượt xem
    await post.increment('views');

    // Format dữ liệu comments theo dạng cây (chỉ 2 cấp - comment và replies)
    const formatComments = (comments) => {
      return comments
        .filter(comment => !comment.parent_comment_id) // Chỉ lấy comment gốc
        .map(comment => ({
          id: comment.id,
          content: comment.content,
          likes: comment.likes,
          createdAt: comment.created_at,
          updatedAt: comment.updated_at,
          author: {
            id: comment.author.id,
            username: comment.author.username,
            role: comment.author.role,
            isPremium: comment.author.is_premium
          },
          replies: comment.replies?.map(reply => ({
            id: reply.id,
            content: reply.content,
            likes: reply.likes,
            createdAt: reply.created_at,
            updatedAt: reply.updated_at,
            author: {
              id: reply.author.id,
              username: reply.author.username,
              role: reply.author.role,
              isPremium: reply.author.is_premium
            }
          })) || []
        }));
    };

    // Format bài viết
    const formattedPost = {
      id: post.id,
      title: post.title,
      content: post.content,
      category: post.category,
      tags: post.tags,
      likes: post.likes,
      views: post.views + 1, // Tăng thêm 1 vì vừa xem
      isPinned: post.is_pinned,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      author: {
        id: post.author.id,
        username: post.author.username,
        role: post.author.role,
        isPremium: post.author.is_premium
      },
      comments: formatComments(post.comments)
    };

    res.status(200).json({
      status: 'success',
      data: {
        post: formattedPost
      }
    });
  } catch (error) {
    next(error);
  }
};

// Tạo bài viết mới
exports.createPost = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, content, category, tags } = req.body;

    // Làm sạch nội dung HTML
    const sanitizedContent = sanitizeHtml(content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        'img': ['src', 'alt']
      }
    });

    // Kiểm tra xem cần duyệt bài viết không (tùy theo role của user)
    const requireApproval = req.user.role !== 'admin';

    // Tạo bài viết mới
    const post = await ForumPost.create({
      user_id: userId,
      title,
      content: sanitizedContent,
      category,
      tags: tags || [],
      likes: 0,
      views: 0,
      is_pinned: false,
      is_approved: !requireApproval // Admin không cần duyệt
    });

    // Cập nhật thống kê của user
    await db.userStats.increment('forum_posts_count', {
      where: { user_id: userId }
    });

    res.status(201).json({
      status: 'success',
      message: requireApproval ? 'Post created and waiting for approval' : 'Post created successfully',
      data: {
        post: {
          id: post.id,
          title: post.title,
          content: post.content,
          category: post.category,
          tags: post.tags,
          createdAt: post.created_at,
          isApproved: post.is_approved
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật bài viết
exports.updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, content, category, tags } = req.body;

    // Tìm bài viết
    const post = await ForumPost.findByPk(id);

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    // Kiểm tra quyền (chỉ tác giả hoặc admin có thể sửa)
    if (post.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to update this post'
      });
    }

    // Làm sạch nội dung HTML nếu có cập nhật content
    let sanitizedContent = post.content;
    if (content) {
      sanitizedContent = sanitizeHtml(content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          'img': ['src', 'alt']
        }
      });
    }

    // Kiểm tra xem cần duyệt lại bài viết không
    const requireReapproval = req.user.role !== 'admin' && (title || content || category);

    // Cập nhật bài viết
    await post.update({
      title: title || post.title,
      content: content ? sanitizedContent : post.content,
      category: category || post.category,
      tags: tags || post.tags,
      is_approved: requireReapproval ? false : post.is_approved // Cần duyệt lại nếu nội dung thay đổi
    });

    res.status(200).json({
      status: 'success',
      message: requireReapproval ? 'Post updated and waiting for approval' : 'Post updated successfully',
      data: {
        post: {
          id: post.id,
          title: post.title,
          content: post.content,
          category: post.category,
          tags: post.tags,
          updatedAt: post.updated_at,
          isApproved: post.is_approved
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Xóa bài viết
exports.deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Tìm bài viết
    const post = await ForumPost.findByPk(id);

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    // Kiểm tra quyền (chỉ tác giả hoặc admin có thể xóa)
    if (post.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to delete this post'
      });
    }

    // Xóa tất cả comment của bài viết
    await Comment.destroy({ where: { post_id: id } });

    // Xóa bài viết
    await post.destroy();

    // Cập nhật thống kê của user nếu bài viết đã được duyệt
    if (post.is_approved) {
      await db.userStats.decrement('forum_posts_count', {
        where: { user_id: post.user_id }
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Post deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Like/Unlike bài viết
exports.toggleLikePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Tìm bài viết
    const post = await ForumPost.findOne({
      where: {
        id,
        is_approved: true
      }
    });

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found or not approved'
      });
    }

    // Tìm like hiện tại
    const like = await db.postLikes.findOne({
      where: {
        post_id: id,
        user_id: userId
      }
    });

    // Toggle like
    if (like) {
      // Đã like, giờ unlike
      await like.destroy();
      await post.decrement('likes');
      
      res.status(200).json({
        status: 'success',
        message: 'Post unliked successfully',
        data: {
          liked: false,
          likesCount: post.likes - 1
        }
      });
    } else {
      // Chưa like, giờ like
      await db.postLikes.create({
        post_id: id,
        user_id: userId
      });
      await post.increment('likes');
      
      res.status(200).json({
        status: 'success',
        message: 'Post liked successfully',
        data: {
          liked: true,
          likesCount: post.likes + 1
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

// Thêm bình luận
exports.addComment = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user.id;
    const { content, parentCommentId } = req.body;

    // Kiểm tra bài viết tồn tại và đã được duyệt
    const post = await ForumPost.findOne({
      where: {
        id: postId,
        is_approved: true
      }
    });

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found or not approved'
      });
    }

    // Nếu có parentCommentId, kiểm tra comment cha tồn tại
    if (parentCommentId) {
      const parentComment = await Comment.findOne({
        where: {
          id: parentCommentId,
          post_id: postId
        }
      });

      if (!parentComment) {
        return res.status(404).json({
          status: 'error',
          message: 'Parent comment not found'
        });
      }
    }

    // Làm sạch nội dung
    const sanitizedContent = sanitizeHtml(content);

    // Tạo comment mới
    const comment = await Comment.create({
      post_id: postId,
      user_id: userId,
      content: sanitizedContent,
      parent_comment_id: parentCommentId || null,
      likes: 0,
      is_approved: true // Mặc định comment được duyệt luôn
    });

    // Cập nhật thống kê của user
    await db.userStats.increment('forum_comments_count', {
      where: { user_id: userId }
    });

    // Lấy thông tin user
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'role', 'is_premium']
    });

    res.status(201).json({
      status: 'success',
      message: 'Comment added successfully',
      data: {
        comment: {
          id: comment.id,
          content: comment.content,
          parentCommentId: comment.parent_comment_id,
          createdAt: comment.created_at,
          author: {
            id: user.id,
            username: user.username,
            role: user.role,
            isPremium: user.is_premium
          }
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật bình luận
exports.updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { content } = req.body;

    // Tìm comment
    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({
        status: 'error',
        message: 'Comment not found'
      });
    }

    // Kiểm tra quyền (chỉ tác giả hoặc admin có thể sửa)
    if (comment.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to update this comment'
      });
    }

    // Làm sạch nội dung
    const sanitizedContent = sanitizeHtml(content);

    // Cập nhật comment
    await comment.update({
      content: sanitizedContent
    });

    res.status(200).json({
      status: 'success',
      message: 'Comment updated successfully',
      data: {
        comment: {
          id: comment.id,
          content: comment.content,
          updatedAt: comment.updated_at
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Xóa bình luận
exports.deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Tìm comment
    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({
        status: 'error',
        message: 'Comment not found'
      });
    }

    // Kiểm tra quyền (chỉ tác giả hoặc admin có thể xóa)
    if (comment.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to delete this comment'
      });
    }

    // Nếu là comment cha, xóa tất cả comment con
    if (!comment.parent_comment_id) {
      await Comment.destroy({
        where: {
          parent_comment_id: id
        }
      });
    }

    // Xóa comment
    await comment.destroy();

    // Cập nhật thống kê của user
    await db.userStats.decrement('forum_comments_count', {
      where: { user_id: comment.user_id }
    });

    res.status(200).json({
      status: 'success',
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Like/Unlike bình luận
exports.toggleLikeComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Tìm comment
    const comment = await Comment.findOne({
      where: {
        id,
        is_approved: true
      }
    });

    if (!comment) {
      return res.status(404).json({
        status: 'error',
        message: 'Comment not found or not approved'
      });
    }

    // Tìm like hiện tại
    const like = await db.commentLikes.findOne({
      where: {
        comment_id: id,
        user_id: userId
      }
    });

    // Toggle like
    if (like) {
      // Đã like, giờ unlike
      await like.destroy();
      await comment.decrement('likes');
      
      res.status(200).json({
        status: 'success',
        message: 'Comment unliked successfully',
        data: {
          liked: false,
          likesCount: comment.likes - 1
        }
      });
    } else {
      // Chưa like, giờ like
      await db.commentLikes.create({
        comment_id: id,
        user_id: userId
      });
      await comment.increment('likes');
      
      res.status(200).json({
        status: 'success',
        message: 'Comment liked successfully',
        data: {
          liked: true,
          likesCount: comment.likes + 1
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

// Báo cáo bài viết
exports.reportPost = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user.id;
    const { reason, details } = req.body;

    // Kiểm tra bài viết tồn tại
    const post = await ForumPost.findByPk(postId);

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    // Kiểm tra đã báo cáo chưa
    const existingReport = await Report.findOne({
      where: {
        reporter_id: userId,
        target_id: postId,
        report_type: 'post'
      }
    });

    if (existingReport) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already reported this post'
      });
    }

    // Tạo báo cáo mới
    await Report.create({
      report_type: 'post',
      reporter_id: userId,
      target_id: postId,
      reason,
      details: details || null,
      status: 'pending'
    });

    res.status(201).json({
      status: 'success',
      message: 'Report submitted successfully'
    });
  } catch (error) {
    next(error);
  }
}; 