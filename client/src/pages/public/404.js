// src/containers/Public/404.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../../../src/index.css'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-900 text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-8">Trang bạn tìm kiếm không tồn tại.</p>
      <Link to="/" className="bg-orange-500 px-6 py-3 rounded-lg text-xl hover:bg-orange-600">
        Quay về trang chủ
      </Link>
    </div>
  );
};

export default NotFound;