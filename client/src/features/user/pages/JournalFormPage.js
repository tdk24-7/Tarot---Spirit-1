import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getJournalById } from '../../../features/tarot/services/tarotAPI';
import JournalForm from '../components/JournalForm';
import Navbar from '../../../shared/ui/NavBar';
import Footer from '../../../shared/ui/Footer';

const JournalFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState(null);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      fetchJournal();
    }
  }, [id]);

  const fetchJournal = async () => {
    try {
      setLoading(true);
      const result = await getJournalById(id);
      // Handle nested API response structure
      const journalData = result.data?.journal || result.journal || result;
      setJournal(journalData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching journal:', err);
      setError(err.message || 'Không thể tải thông tin nhật ký');
      setLoading(false);
    }
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a0933] to-[#0f051d] text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-20 max-w-3xl">
          <div className="bg-red-500/10 border border-red-500/50 text-red-600 p-6 rounded-xl text-center">
            <h2 className="text-xl font-bold mb-2">Đã xảy ra lỗi</h2>
            <p>{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-6 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              Quay lại
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
        <title>{isEditing ? 'Chỉnh sửa nhật ký' : 'Tạo nhật ký mới'} | Bói Tarot</title>
        <meta
          name="description"
          content={isEditing ? 'Chỉnh sửa nhật ký cá nhân của bạn.' : 'Tạo nhật ký cá nhân mới để ghi lại cảm xúc và suy nghĩ.'}
        />
      </Helmet>

      <Navbar />

      <div className="container mx-auto px-4 py-20 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {isEditing ? 'Chỉnh sửa nhật ký' : 'Tạo nhật ký mới'}
          </h1>
          <p className="text-gray-300">
            {isEditing
              ? 'Cập nhật nội dung nhật ký của bạn.'
              : 'Ghi lại cảm xúc, suy nghĩ hoặc thông tin liên quan đến phiên đọc bài Tarot của bạn.'}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-purple-900/20 p-6 rounded-xl">
          <JournalForm initialData={journal} isEditing={isEditing} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JournalFormPage; 