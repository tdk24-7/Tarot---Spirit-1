# Tarot API - Social Auth

API Backend xử lý đăng nhập xã hội (Facebook, Google) cho ứng dụng Tarot.

## Tính năng

- Xác thực người dùng qua Facebook và Google
- Tự động tạo tài khoản mới nếu người dùng chưa tồn tại
- Liên kết tài khoản xã hội với tài khoản hiện tại (dựa trên email)
- Tạo JWT token cho client
- Middleware xác thực bảo vệ routes

## Cài đặt

### Yêu cầu

- Node.js >= 14.0.0
- MySQL Server
- Đã tạo ứng dụng Facebook và Google OAuth

### Các bước cài đặt

1. Clone repository
2. Cài đặt dependencies:
   ```bash
   cd server
   npm install
   ```
3. Tạo file .env với các biến môi trường sau:
   ```
   PORT=3001
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=tarot_app
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=30d
   GOOGLE_CLIENT_ID=your_google_client_id
   FACEBOOK_APP_ID=your_facebook_app_id
   NODE_ENV=development
   ```

## Chạy ứng dụng

### Môi trường phát triển
```bash
npm run dev
```

### Môi trường production
```bash
npm start
```

## API Endpoints

### Social Authentication

#### Facebook Login
- **URL**: `/api/auth/social/facebook`
- **Method**: `POST`
- **Data**: 
  ```json
  {
    "token": "facebook_access_token"
  }
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": 1,
        "name": "Nguyen Van A",
        "email": "example@gmail.com",
        "avatar": "https://example.com/avatar.jpg",
        "isAdmin": false
      },
      "token": "jwt_token"
    }
  }
  ```

#### Google Login
- **URL**: `/api/auth/social/google`
- **Method**: `POST`
- **Data**: 
  ```json
  {
    "token": "google_id_token"
  }
  ```
- **Response**: (Same as Facebook Login)

### Kiểm tra xác thực

- **URL**: `/api/auth/me`
- **Method**: `GET`
- **Headers**: 
  ```
  Authorization: Bearer jwt_token
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": 1,
        "name": "Nguyen Van A",
        "email": "example@gmail.com",
        "avatar": "https://example.com/avatar.jpg",
        "role": "user",
        "isAdmin": false
      }
    }
  }
  ```

## Tạo Credentials cho Facebook và Google

### Facebook
1. Đăng nhập vào [Facebook Developer](https://developers.facebook.com/)
2. Tạo App mới (App Type: Consumer)
3. Thêm Facebook Login product
4. Cấu hình OAuth Redirect URI thành: `https://your-frontend-domain.com/auth/facebook/callback`
5. Lấy App ID và App Secret

### Google
1. Đăng nhập vào [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo Project mới
3. Vào APIs & Services > Credentials
4. Tạo OAuth 2.0 Client ID
5. Cấu hình Authorized JavaScript origins và Authorized redirect URIs
6. Lấy Client ID và Client Secret
