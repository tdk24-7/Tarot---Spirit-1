import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Chính sách quyền riêng tư | Hệ thống Tarot</title>
        <meta name="description" content="Chính sách quyền riêng tư của Hệ thống Tarot, mô tả cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu cá nhân của bạn." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[#170b36] to-[#0f0a23] text-white">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-[#9370db] via-[#8a2be2] to-[#4e44ce] bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(147,112,219,0.3)]">
              Chính Sách Quyền Riêng Tư
            </h1>

            <div className="prose prose-invert prose-violet max-w-none">
              <p className="text-gray-300 mb-6">
                Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-purple-300">1. Giới thiệu</h2>
                <p>
                  Chúng tôi ("Hệ thống Tarot") cam kết bảo vệ quyền riêng tư của bạn. Chính sách quyền riêng tư này giải thích cách chúng tôi thu thập, sử dụng, tiết lộ, lưu trữ và bảo vệ thông tin cá nhân của bạn khi bạn sử dụng dịch vụ của chúng tôi.
                </p>
                <p>
                  Bằng việc sử dụng dịch vụ của chúng tôi, bạn đồng ý với việc thu thập và sử dụng thông tin theo chính sách này.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-purple-300">2. Thông tin chúng tôi thu thập</h2>
                <h3 className="text-xl font-medium mb-3 text-purple-200">2.1 Thông tin cá nhân</h3>
                <p>Chúng tôi có thể thu thập các loại thông tin cá nhân sau đây:</p>
                <ul>
                  <li>Thông tin nhận dạng (họ tên, ngày sinh)</li>
                  <li>Thông tin liên hệ (địa chỉ email, số điện thoại)</li>
                  <li>Thông tin tài khoản (tên người dùng, mật khẩu được mã hóa)</li>
                  <li>Thông tin hồ sơ (ảnh đại diện, tiểu sử)</li>
                </ul>

                <h3 className="text-xl font-medium mb-3 mt-6 text-purple-200">2.2 Thông tin từ đăng nhập mạng xã hội</h3>
                <p>
                  Khi bạn đăng nhập bằng tài khoản Facebook hoặc các nền tảng mạng xã hội khác, chúng tôi có thể thu thập:
                </p>
                <ul>
                  <li>ID người dùng mạng xã hội của bạn</li>
                  <li>Tên hiển thị công khai</li>
                  <li>Địa chỉ email (nếu được cung cấp)</li>
                  <li>Ảnh đại diện (URL ảnh)</li>
                </ul>
                <p>
                  Chúng tôi không lưu trữ mật khẩu mạng xã hội của bạn và không có quyền truy cập vào tài khoản của bạn ngoài những thông tin bạn cho phép chia sẻ.
                </p>

                <h3 className="text-xl font-medium mb-3 mt-6 text-purple-200">2.3 Thông tin sử dụng</h3>
                <p>Chúng tôi cũng thu thập thông tin về cách bạn sử dụng dịch vụ của chúng tôi:</p>
                <ul>
                  <li>Lịch sử truy cập và hoạt động trong ứng dụng</li>
                  <li>Thời gian truy cập và thời lượng sử dụng</li>
                  <li>Thông tin thiết bị (loại thiết bị, hệ điều hành)</li>
                  <li>Địa chỉ IP và dữ liệu địa lý (nếu có)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-purple-300">3. Cách chúng tôi sử dụng thông tin</h2>
                <p>Chúng tôi sử dụng thông tin thu thập được để:</p>
                <ul>
                  <li>Cung cấp, duy trì và cải thiện dịch vụ của chúng tôi</li>
                  <li>Tạo và quản lý tài khoản của bạn</li>
                  <li>Xác thực người dùng và đảm bảo an ninh</li>
                  <li>Cá nhân hóa trải nghiệm người dùng</li>
                  <li>Xử lý giao dịch (nếu có)</li>
                  <li>Gửi thông báo liên quan đến tài khoản và dịch vụ</li>
                  <li>Phân tích xu hướng sử dụng và cải thiện ứng dụng</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-purple-300">4. Chia sẻ thông tin</h2>
                <p>Chúng tôi có thể chia sẻ thông tin của bạn trong các trường hợp sau:</p>
                <ul>
                  <li><strong>Với sự đồng ý của bạn:</strong> Khi bạn cho phép chia sẻ thông tin cụ thể.</li>
                  <li><strong>Đối tác dịch vụ:</strong> Với các nhà cung cấp dịch vụ hỗ trợ hoạt động của chúng tôi (xử lý thanh toán, lưu trữ đám mây, phân tích dữ liệu).</li>
                  <li><strong>Tuân thủ pháp luật:</strong> Khi được yêu cầu bởi luật pháp hoặc để bảo vệ quyền lợi và an toàn.</li>
                </ul>
                <p>
                  Chúng tôi không bán thông tin cá nhân của bạn cho bên thứ ba.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-purple-300">5. Tích hợp mạng xã hội</h2>
                <p>
                  Ứng dụng của chúng tôi tích hợp đăng nhập thông qua Facebook và có thể bao gồm các nền tảng khác trong tương lai. Khi sử dụng tính năng này:
                </p>
                <ul>
                  <li>Chúng tôi nhận token xác thực từ nền tảng mạng xã hội.</li>
                  <li>Chúng tôi không lưu trữ mật khẩu mạng xã hội của bạn.</li>
                  <li>Việc thu thập và sử dụng dữ liệu của bạn bởi các nền tảng mạng xã hội tuân theo chính sách riêng tư của họ.</li>
                </ul>
                <p>
                  Chúng tôi khuyên bạn nên xem xét cài đặt quyền riêng tư trên các nền tảng mạng xã hội của mình để hiểu thông tin nào được chia sẻ với ứng dụng của chúng tôi.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-purple-300">6. Lưu trữ và bảo mật dữ liệu</h2>
                <p>
                  Chúng tôi thực hiện các biện pháp bảo mật hợp lý để bảo vệ thông tin cá nhân của bạn khỏi mất mát, truy cập trái phép, sử dụng sai mục đích, tiết lộ, thay đổi hoặc phá hủy.
                </p>
                <p>
                  Tuy nhiên, không có phương pháp truyền dẫn qua internet hoặc lưu trữ điện tử nào là an toàn 100%. Do đó, trong khi chúng tôi nỗ lực bảo vệ thông tin cá nhân của bạn, chúng tôi không thể đảm bảo an ninh tuyệt đối.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-purple-300">7. Quyền của bạn</h2>
                <p>Tùy thuộc vào luật pháp hiện hành, bạn có thể có quyền:</p>
                <ul>
                  <li>Truy cập thông tin cá nhân của bạn mà chúng tôi nắm giữ</li>
                  <li>Yêu cầu sửa đổi thông tin không chính xác</li>
                  <li>Yêu cầu xóa thông tin của bạn</li>
                  <li>Phản đối hoặc hạn chế một số hình thức xử lý</li>
                  <li>Rút lại sự đồng ý khi việc xử lý dựa trên sự đồng ý</li>
                </ul>
                <p>
                  Để thực hiện quyền của mình, vui lòng liên hệ với chúng tôi theo thông tin liên hệ được cung cấp bên dưới.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-purple-300">8. Thay đổi chính sách</h2>
                <p>
                  Chúng tôi có thể cập nhật Chính sách Quyền riêng tư này theo thời gian. Chúng tôi sẽ thông báo cho bạn về bất kỳ thay đổi quan trọng nào bằng cách đăng thông báo trên trang web hoặc ứng dụng của chúng tôi, hoặc bằng cách gửi email cho bạn.
                </p>
                <p>
                  Bạn nên kiểm tra chính sách này định kỳ để biết bất kỳ thay đổi nào.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-purple-300">9. Liên hệ với chúng tôi</h2>
                <p>
                  Nếu bạn có bất kỳ câu hỏi, lo ngại hoặc yêu cầu nào về Chính sách Quyền riêng tư này hoặc cách chúng tôi xử lý thông tin cá nhân của bạn, vui lòng liên hệ với chúng tôi tại:
                </p>
                <p className="ml-4">
                  Email: privacy@tarotsystem.com<br />
                  Địa chỉ: 123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh, Việt Nam
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

export default PrivacyPolicyPage; 