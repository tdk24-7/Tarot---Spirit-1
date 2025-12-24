import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const TermsPage = () => {
  return (
    <>
      <Helmet>
        <title>Điều khoản sử dụng | Hệ thống Tarot</title>
        <meta name="description" content="Điều khoản sử dụng của Hệ thống Tarot, mô tả các quy định và điều kiện khi sử dụng dịch vụ của chúng tôi." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[#170b36] to-[#0f0a23] text-white">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-[#9370db] via-[#8a2be2] to-[#4e44ce] bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(147,112,219,0.3)]">
              Điều Khoản Sử Dụng
            </h1>

            <div className="prose prose-invert prose-violet max-w-none">
              <p className="text-gray-300 mb-6">
                Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-purple-300">1. Chấp Nhận Điều Khoản</h2>
                <p>
                  Bằng việc truy cập và sử dụng Hệ thống Tarot ("Dịch vụ"), bạn đồng ý bị ràng buộc bởi các Điều khoản Sử dụng này. Nếu bạn không đồng ý với bất kỳ phần nào của điều khoản này, vui lòng không sử dụng Dịch vụ của chúng tôi.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-purple-300">2. Sử Dụng Dịch Vụ</h2>
                <p>
                  Dịch vụ của chúng tôi cung cấp công cụ và nội dung liên quan đến Tarot. Bạn đồng ý sử dụng Dịch vụ chỉ cho các mục đích hợp pháp và theo cách không vi phạm quyền của bất kỳ bên thứ ba nào.
                </p>
                <p>
                  Bạn có trách nhiệm duy trì tính bảo mật của tài khoản và mật khẩu của mình. Bạn đồng ý chịu trách nhiệm về tất cả các hoạt động diễn ra dưới tài khoản của bạn.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-purple-300">3. Nội Dung và Quyền Sở Hữu Trí Tuệ</h2>
                <p>
                  Dịch vụ và tất cả nội dung, đồ họa, thiết kế, và các tài liệu khác trong đó đều thuộc sở hữu của chúng tôi hoặc các bên cấp phép của chúng tôi và được bảo vệ bởi luật sở hữu trí tuệ.
                </p>
                <p>
                  Bạn không được sao chép, phân phối, sửa đổi, hiển thị công khai, thực hiện công khai, tái xuất bản, tải xuống, lưu trữ hoặc truyền tải bất kỳ nội dung nào của Dịch vụ, ngoại trừ được cho phép theo Điều khoản Sử dụng này.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-purple-300">4. Nội Dung Người Dùng</h2>
                <p>
                  Khi bạn đăng tải hoặc chia sẻ nội dung thông qua Dịch vụ, bạn vẫn giữ quyền sở hữu đối với nội dung đó, nhưng bạn cấp cho chúng tôi giấy phép toàn cầu, không độc quyền để sử dụng, sao chép, sửa đổi, và hiển thị nội dung đó.
                </p>
                <p>
                  Bạn đảm bảo rằng bạn có tất cả các quyền cần thiết để cấp giấy phép này và nội dung của bạn không vi phạm quyền của bất kỳ bên thứ ba nào.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-purple-300">5. Giới Hạn Trách Nhiệm</h2>
                <p>
                  Dịch vụ của chúng tôi được cung cấp "nguyên trạng" và "như có sẵn" mà không có bất kỳ bảo đảm nào, dù rõ ràng hay ngụ ý. Chúng tôi không đảm bảo rằng Dịch vụ sẽ không bị gián đoạn, không có lỗi, hoặc an toàn.
                </p>
                <p>
                  Trong mọi trường hợp, chúng tôi sẽ không chịu trách nhiệm đối với bất kỳ thiệt hại gián tiếp, ngẫu nhiên, đặc biệt, hậu quả hoặc trừng phạt phát sinh từ việc sử dụng hoặc không có khả năng sử dụng Dịch vụ.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-purple-300">6. Thay Đổi Điều Khoản</h2>
                <p>
                  Chúng tôi có thể sửa đổi Điều khoản Sử dụng này vào bất kỳ thời điểm nào bằng cách đăng các điều khoản đã sửa đổi trên trang web của chúng tôi. Việc bạn tiếp tục sử dụng Dịch vụ sau khi đăng bất kỳ sửa đổi nào sẽ cấu thành sự chấp nhận của bạn đối với các điều khoản đã sửa đổi.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-purple-300">7. Chấm Dứt</h2>
                <p>
                  Chúng tôi có thể chấm dứt hoặc đình chỉ quyền truy cập của bạn vào Dịch vụ ngay lập tức, mà không cần thông báo trước, vì bất kỳ lý do gì, bao gồm nhưng không giới hạn ở việc vi phạm Điều khoản Sử dụng.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-purple-300">8. Luật Áp Dụng</h2>
                <p>
                  Các Điều khoản Sử dụng này sẽ được điều chỉnh và giải thích theo luật pháp của Việt Nam, mà không xét đến các nguyên tắc xung đột pháp luật.
                </p>
              </section>

              <div className="mt-12 text-center">
                <Link 
                  to="/" 
                  className="inline-block py-3 px-6 bg-gradient-to-r from-[#8a2be2] to-[#9370db] rounded-lg text-white hover:shadow-lg hover:shadow-[#9370db]/20 transition-all"
                >
                  Quay lại trang chủ
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default TermsPage; 