import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJournal, updateJournal } from '../../../features/tarot/services/tarotAPI';

const JournalForm = ({ initialData, readingId, isEditing = false }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    mood: initialData?.mood || '',
    tags: initialData?.tags || '',
    is_private: initialData?.is_private !== undefined ? initialData.is_private : true,
    reading_id: readingId || initialData?.reading_id || null
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditing) {
        await updateJournal(initialData.id, formData);
        navigate(`/journal/${initialData.id}`);
      } else {
        const result = await createJournal(formData);
        navigate(`/journal/${result.id}`);
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-white font-medium mb-2">
          Tiêu đề
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-purple-900/30 text-white focus:border-[#9370db] focus:outline-none focus:ring-1 focus:ring-[#9370db]"
          placeholder="Nhập tiêu đề nhật ký..."
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-white font-medium mb-2">
          Nội dung
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows={8}
          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-purple-900/30 text-white focus:border-[#9370db] focus:outline-none focus:ring-1 focus:ring-[#9370db]"
          placeholder="Viết suy nghĩ, cảm xúc hoặc phản ánh của bạn..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="mood" className="block text-white font-medium mb-2">
            Tâm trạng
          </label>
          <input
            type="text"
            id="mood"
            name="mood"
            value={formData.mood}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-purple-900/30 text-white focus:border-[#9370db] focus:outline-none focus:ring-1 focus:ring-[#9370db]"
            placeholder="Vui vẻ, Trầm tư, Hào hứng..."
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-white font-medium mb-2">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-purple-900/30 text-white focus:border-[#9370db] focus:outline-none focus:ring-1 focus:ring-[#9370db]"
            placeholder="tarot,suy nghĩ,tình yêu... (phân cách bằng dấu phẩy)"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_private"
          name="is_private"
          checked={formData.is_private}
          onChange={handleChange}
          className="w-4 h-4 text-[#9370db] rounded border-purple-900/30 focus:ring-[#9370db] bg-white/5"
        />
        <label htmlFor="is_private" className="ml-2 text-white">
          Riêng tư (chỉ bạn mới xem được)
        </label>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-6 py-2 border border-white/20 rounded-lg text-white hover:bg-white/5 transition-colors"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white rounded-lg hover:shadow-lg transition-shadow disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang lưu...
            </span>
          ) : (
            <span>{isEditing ? 'Cập nhật' : 'Lưu nhật ký'}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default JournalForm; 