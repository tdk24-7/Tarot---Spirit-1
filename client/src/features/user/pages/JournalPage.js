import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getJournals, deleteJournal } from '../../../features/tarot/services/tarotAPI';
import { path } from '../../../shared/utils/routes';
import Navbar from '../../../shared/ui/NavBar';
import Footer from '../../../shared/ui/Footer';

const JournalPage = () => {
  const navigate = useNavigate();
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    startDate: '',
    endDate: '',
    tag: '',
    mood: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async (params = {}) => {
    setLoading(true);
    try {
      const activeFilters = {};
      if (filter.startDate) activeFilters.startDate = filter.startDate;
      if (filter.endDate) activeFilters.endDate = filter.endDate;
      if (filter.tag) activeFilters.tag = filter.tag;
      if (filter.mood) activeFilters.mood = filter.mood;

      const result = await getJournals({ ...activeFilters, ...params });
      // Xử lý response từ API (chuẩn: result.data.journals, hoặc fallback nếu cấu trúc thay đổi)
      const journalsList = result.data?.journals || result.journals || (Array.isArray(result) ? result : []);
      setJournals(journalsList);
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi tải nhật ký');
      console.error('Error fetching journals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value
    });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchJournals();
  };

  const handleDeleteJournal = async (id) => {
    try {
      await deleteJournal(id);
      setJournals(journals.filter(journal => journal.id !== id));
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting journal:', err);
      alert('Không thể xóa nhật ký. Vui lòng thử lại.');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0933] to-[#0f051d] text-white">
      <Helmet>
        <title>Nhật ký | Bói Tarot</title>
        <meta
          name="description"
          content="Quản lý nhật ký cá nhân liên quan đến các phiên đọc bài Tarot của bạn."
        />
      </Helmet>

      <Navbar />

      <div className="container mx-auto px-4 py-20 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Nhật ký của bạn</h1>
          <Link
            to={path.PROTECTED.JOURNAL_NEW}
            className="bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-shadow"
          >
            Tạo nhật ký mới
          </Link>
        </div>

        {/* Filter Section */}
        <div className="bg-white/5 backdrop-blur-sm border border-purple-900/20 p-4 rounded-xl mb-8">
          <h2 className="text-xl font-semibold mb-4">Bộ lọc</h2>
          <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium mb-1">
                Từ ngày
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={filter.startDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-purple-900/30 text-white focus:border-[#9370db] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium mb-1">
                Đến ngày
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={filter.endDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-purple-900/30 text-white focus:border-[#9370db] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="tag" className="block text-sm font-medium mb-1">
                Tag
              </label>
              <input
                type="text"
                id="tag"
                name="tag"
                value={filter.tag}
                onChange={handleFilterChange}
                placeholder="Nhập tag..."
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-purple-900/30 text-white focus:border-[#9370db] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="mood" className="block text-sm font-medium mb-1">
                Tâm trạng
              </label>
              <input
                type="text"
                id="mood"
                name="mood"
                value={filter.mood}
                onChange={handleFilterChange}
                placeholder="Nhập tâm trạng..."
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-purple-900/30 text-white focus:border-[#9370db] focus:outline-none"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-[#9370db] text-white rounded-lg hover:bg-[#8a2be2] transition-colors"
              >
                Lọc
              </button>
            </div>
          </form>
        </div>

        {/* Journals List */}
        {loading ? (
          <div className="py-10 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9370db] mb-4"></div>
            <p>Đang tải nhật ký...</p>
          </div>
        ) : error ? (
          <div className="py-10 text-center">
            <div className="bg-red-500/10 border border-red-500/50 text-red-600 p-4 rounded-lg inline-block">
              {error}
            </div>
          </div>
        ) : journals.length === 0 ? (
          <div className="py-10 text-center">
            <div className="bg-white/5 backdrop-blur-sm border border-purple-900/20 p-8 rounded-xl">
              <h3 className="text-xl font-semibold mb-2">Chưa có nhật ký nào</h3>
              <p className="text-gray-300 mb-6">Hãy tạo nhật ký đầu tiên của bạn để bắt đầu ghi lại những cảm nhận và suy nghĩ.</p>
              <Link
                to={path.PROTECTED.JOURNAL_NEW}
                className="bg-gradient-to-r from-[#9370db] to-[#8a2be2] text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow inline-block"
              >
                Tạo nhật ký mới
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {journals.map((journal) => (
              <div
                key={journal.id}
                className="bg-white/5 backdrop-blur-sm border border-purple-900/20 p-5 rounded-xl hover:shadow-lg transition-shadow relative group"
              >
                {journal.is_private && (
                  <div className="absolute top-3 right-3 bg-gray-800 px-2 py-1 rounded-full text-xs">
                    Riêng tư
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-1">{journal.title}</h3>
                  <p className="text-sm text-gray-400">{formatDate(journal.entry_date)}</p>
                </div>

                <p className="text-gray-300 line-clamp-3 mb-4">{journal.content}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {journal.mood && (
                    <span className="bg-[#9370db]/20 text-[#9370db] px-2 py-1 rounded-full text-xs">
                      {journal.mood}
                    </span>
                  )}

                  {journal.tags && (Array.isArray(journal.tags) ? journal.tags : (typeof journal.tags === 'string' ? journal.tags.split(',') : [])).map((tag, index) => (
                    <span key={index} className="bg-gray-800/80 text-gray-300 px-2 py-1 rounded-full text-xs">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <Link
                    to={`/journal/${journal.id}`}
                    className="text-[#9370db] hover:text-[#8a2be2] transition-colors"
                  >
                    Đọc tiếp
                  </Link>

                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      to={`/journal/${journal.id}/edit`}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Sửa
                    </Link>
                    <button
                      onClick={() => setShowDeleteConfirm(journal.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1a0933] border border-purple-900/50 p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Xác nhận xóa</h2>
            <p className="text-gray-300 mb-6">Bạn có chắc chắn muốn xóa nhật ký này? Hành động này không thể hoàn tác.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-600 rounded-lg text-white hover:bg-white/5"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDeleteJournal(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default JournalPage; 