const db = require('../models');
const Journal = db.journals;
const TarotReading = db.tarotReadings;

// Lấy danh sách nhật ký với phân trang và filter
exports.getJournals = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      limit = 10,
      offset = 0,
      sortBy = 'created_at',
      sortOrder = 'desc',
      mood,
      tag,
      search
    } = req.query;

    // Xây dựng điều kiện tìm kiếm
    const where = { user_id: userId };
    
    // Filter theo mood
    if (mood) {
      where.mood = mood;
    }
    
    // Filter theo tag
    if (tag) {
      where.tags = { [db.Sequelize.Op.contains]: [tag] };
    }
    
    // Tìm kiếm theo tiêu đề hoặc nội dung
    if (search) {
      where[db.Sequelize.Op.or] = [
        { title: { [db.Sequelize.Op.iLike]: `%${search}%` } },
        { content: { [db.Sequelize.Op.iLike]: `%${search}%` } }
      ];
    }

    // Đếm tổng số kết quả
    const total = await Journal.count({ where });

    // Lấy kết quả với phân trang và sắp xếp
    const journals = await Journal.findAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder.toUpperCase()]],
      include: [{
        model: TarotReading,
        as: 'associatedReading',
        attributes: ['id', 'type', 'question'],
        required: false
      }]
    });

    // Format kết quả trả về
    const formattedJournals = journals.map(journal => ({
      id: journal.id,
      title: journal.title,
      content: journal.content.substring(0, 150) + (journal.content.length > 150 ? '...' : ''),
      mood: journal.mood,
      tags: journal.tags,
      createdAt: journal.created_at,
      updatedAt: journal.updated_at,
      associatedReading: journal.associatedReading ? {
        id: journal.associatedReading.id,
        type: journal.associatedReading.type,
        question: journal.associatedReading.question
      } : null
    }));

    res.status(200).json({
      status: 'success',
      count: journals.length,
      total,
      data: {
        journals: formattedJournals
      }
    });
  } catch (error) {
    next(error);
  }
};

// Tạo nhật ký mới
exports.createJournal = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      title,
      content,
      mood,
      tags,
      associatedReadingId
    } = req.body;

    // Kiểm tra associatedReadingId nếu có
    if (associatedReadingId) {
      const reading = await TarotReading.findOne({
        where: {
          id: associatedReadingId,
          user_id: userId
        }
      });

      if (!reading) {
        return res.status(404).json({
          status: 'error',
          message: 'Associated reading not found or does not belong to you'
        });
      }
    }

    // Tạo nhật ký mới
    const journal = await Journal.create({
      user_id: userId,
      title,
      content,
      mood: mood || 'neutral',
      tags: tags || [],
      associated_reading_id: associatedReadingId || null
    });

    res.status(201).json({
      status: 'success',
      message: 'Journal created successfully',
      data: {
        journal: {
          id: journal.id,
          title: journal.title,
          content: journal.content,
          mood: journal.mood,
          tags: journal.tags,
          createdAt: journal.created_at,
          associatedReadingId: journal.associated_reading_id
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Lấy chi tiết một nhật ký
exports.getJournalById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Lấy thông tin nhật ký
    const journal = await Journal.findOne({
      where: {
        id,
        user_id: userId
      },
      include: [{
        model: TarotReading,
        as: 'associatedReading',
        required: false
      }]
    });

    if (!journal) {
      return res.status(404).json({
        status: 'error',
        message: 'Journal not found or does not belong to you'
      });
    }

    // Format kết quả trả về
    const journalData = {
      id: journal.id,
      title: journal.title,
      content: journal.content,
      mood: journal.mood,
      tags: journal.tags,
      createdAt: journal.created_at,
      updatedAt: journal.updated_at,
      associatedReading: journal.associatedReading ? {
        id: journal.associatedReading.id,
        type: journal.associatedReading.type,
        question: journal.associatedReading.question,
        createdAt: journal.associatedReading.created_at
      } : null
    };

    res.status(200).json({
      status: 'success',
      data: {
        journal: journalData
      }
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật nhật ký
exports.updateJournal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const {
      title,
      content,
      mood,
      tags
    } = req.body;

    // Kiểm tra nhật ký tồn tại
    const journal = await Journal.findOne({
      where: {
        id,
        user_id: userId
      }
    });

    if (!journal) {
      return res.status(404).json({
        status: 'error',
        message: 'Journal not found or does not belong to you'
      });
    }

    // Cập nhật nhật ký
    await journal.update({
      title: title || journal.title,
      content: content || journal.content,
      mood: mood || journal.mood,
      tags: tags || journal.tags
    });

    res.status(200).json({
      status: 'success',
      message: 'Journal updated successfully',
      data: {
        journal: {
          id: journal.id,
          title: journal.title,
          content: journal.content,
          mood: journal.mood,
          tags: journal.tags,
          createdAt: journal.created_at,
          updatedAt: journal.updated_at
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Xóa nhật ký
exports.deleteJournal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Kiểm tra nhật ký tồn tại
    const journal = await Journal.findOne({
      where: {
        id,
        user_id: userId
      }
    });

    if (!journal) {
      return res.status(404).json({
        status: 'error',
        message: 'Journal not found or does not belong to you'
      });
    }

    // Xóa nhật ký
    await journal.destroy();

    res.status(200).json({
      status: 'success',
      message: 'Journal deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}; 