import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getJournalById, deleteJournal } from '../../../features/tarot/services/tarotAPI';
import Navbar from '../../../shared/ui/NavBar';
import Footer from '../../../shared/ui/Footer';
import { path } from '../../../shared/utils/routes';

const JournalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchJournal();
  }, [id]);

  const fetchJournal = async () => {
    try {
      setLoading(true);
      const data = await getJournalById(id);
      setJournal(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching journal:', err);
      setError(err.message || 'Không thể tải thông tin nhật ký');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteJournal(id);
      navigate(path.PROTECTED.JOURNAL);
    } catch (err) {
      console.error('Error deleting journal:', err);
      alert('Không thể xóa nhật ký. Vui lòng thử lại.');
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a0933] to-[#0f051d] text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-20 max-w-3xl text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9370db] mb-4"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !journal) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a0933] to-[#0f051d] text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-20 max-w-3xl">
          <div className="bg-red-500/10 border border-red-500/50 text-red-600 p-6 rounded-xl text-center">
            <h2 className="text-xl font-bold mb-2">Đã xảy ra lỗi</h2>
            <p>{error || 'Không tìm thấy nhật ký'}</p>
            <button
              onClick={() => navigate(path.PROTECTED.JOURNAL)}
              className="mt-4 px-6 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0933] to-[#0f051d] text-white">
      <Helmet>
        <title>{journal.title} | Nhật ký | Bói Tarot</title>
        <meta name="description" content={`${journal.title} - Nhật ký cá nhân của bạn.`} />
      </Helmet>

      <Navbar />

      <div className="container mx-auto px-4 py-20 max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <Link
            to={path.PROTECTED.JOURNAL}
            className="text-[#9370db] hover:text-[#8a2be2] transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Quay lại danh sách
          </Link>

          <div className="flex space-x-3">
            <Link
              to={`/journal/${id}/edit`}
              className="px-4 py-2 border border-[#9370db] text-[#9370db] rounded-lg hover:bg-[#9370db]/10 transition-colors"
            >
              Chỉnh sửa
            </Link>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
            >
              Xóa
            </button>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-purple-900/20 p-6 rounded-xl mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{journal.title}</h1>
              <p className="text-gray-400">{formatDate(journal.entry_date)}</p>
            </div>
            {journal.is_private && (
              <div className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                Riêng tư
              </div>
            )}
          </div>

          <div className="mb-8">
            <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{journal.content}</p>
          </div>

          {(journal.mood || journal.tags) && (
            <div className="flex flex-wrap gap-2 mb-4 border-t border-purple-900/20 pt-4">
              {journal.mood && (
                <div className="bg-[#9370db]/20 text-[#9370db] px-3 py-1 rounded-full">
                  Tâm trạng: {journal.mood}
                </div>
              )}
              
              {journal.tags && journal.tags.split(',').map((tag, index) => (
                <div key={index} className="bg-gray-800/80 text-gray-300 px-3 py-1 rounded-full">
                  #{tag.trim()}
                </div>
              ))}
            </div>
          )}

          {journal.reading && (
            <div className="border-t border-purple-900/20 pt-4 mt-6">
              <h2 className="text-xl font-semibold mb-3">Phiên đọc bài liên quan</h2>
              <Link
                to={`/reading/${journal.reading.id}`}
                className="block bg-white/5 backdrop-blur-sm border border-purple-900/30 p-4 rounded-lg hover:bg-white/10 transition-colors"
              >
                <p className="font-medium mb-1">Câu hỏi: {journal.reading.question || 'Không có câu hỏi'}</p>
                <p className="text-sm text-gray-400">{formatDate(journal.reading.date_created)}</p>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1a0933] border border-purple-900/50 p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Xác nhận xóa</h2>
            <p className="text-gray-300 mb-6">Bạn có chắc chắn muốn xóa nhật ký này? Hành động này không thể hoàn tác.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-600 rounded-lg text-white hover:bg-white/5"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
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

export default JournalDetailPage; 