# TarotSpirit

> Tarot Card Drawing System For Spirituality - A comprehensive web application for tarot readings, card meanings, community forums, and personal insights.

## 📋 Overview

TarotSpirit is a full-stack web application that provides users with a complete tarot experience. It enables daily readings, detailed card interpretations, community discussions, and personalized reading history.

## ✨ Features

- **Daily Tarot Reading**: Receive a new card and interpretation every day
- **Tarot Library**: Explore all 78 cards with detailed meanings and interpretations
- **Custom Readings**: Perform various types of readings based on your questions
- **User Accounts**: Register and login with email or social accounts (Google/Facebook)
- **Reading History**: Save and review your past readings
- **Community Forum**: Discuss tarot topics with other users
- **Premium Services**: Access exclusive features with premium subscription

## 🔧 Technology Stack

- **Frontend**: React.js, Redux, Tailwind CSS
- **Backend**: Node.js
- **Database**: MySQL
- **Authentication**: JWT, Google OAuth, Facebook Login

## 📦 Project Structure

- `/client`: Frontend React application
- `/server`: Backend Node.js API

## 📋 Requirements

- Node.js >= 14.0.0
- MySQL Server
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Google/Facebook developer accounts (for social login)

## 🚀 Installation

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create an `.env` file with the following variables:
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

4. Set up the database:
   ```bash
   # Create database
   mysql -u root -p -e "CREATE DATABASE tarot_app;"
   
   # Import schema
   mysql -u root -p tarot_app < database-schema.sql
   
   # Or use the sync script
   node sync-db.js
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create an `.env` file with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:3001/api
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
   REACT_APP_FACEBOOK_APP_ID=your_facebook_app_id
   ```

4. Start the application:
   ```bash
   npm start
   ```

5. Access the application at http://localhost:3000

## 📖 User Guide

### Authentication

Access the login page at http://localhost:3000/auth to:
- Create a new account
- Log in with email and password
- Log in with Google or Facebook
- Reset your password if forgotten

### Daily Tarot

- Visit the "Daily Tarot" page for your daily card
- Receive personalized insights based on the card drawn
- Save interpretations to your profile

### Tarot Library

Browse the complete collection of 78 tarot cards:
- Major Arcana (22 cards)
- Minor Arcana (56 cards): Wands, Cups, Swords, and Pentacles
- View detailed meanings including:
  - Upright and reversed interpretations
  - Symbolic meanings
  - Guidance for love, career, finances, and health

### Custom Readings

Perform personalized readings:
- Choose from different spread types:
  - Single card
  - 3-card spread (past, present, future)
  - Daily message
- Focus on your question while cards are drawn
- Receive detailed interpretations
- Save readings to your history (requires login)

### Community Forum

Engage with the tarot community:
- Browse discussion topics
- Create your own posts
- Comment on existing threads
- Share your experiences and insights

### User Profile

Manage your account through the profile page:
- Update personal information
- Change your avatar
- View reading history
- Adjust notification preferences and privacy settings

### Premium Features

Upgrade your experience with premium services:
- Access exclusive spread types
- Receive in-depth interpretations
- Unlimited reading history storage
- Ad-free experience

## ⚠️ Troubleshooting

### Backend Issues

- Verify MySQL connection settings in your `.env` file
- Check server logs for specific error messages
- Ensure correct database privileges are granted to your user

### Frontend Issues

- Confirm the backend is running on port 3001
- Verify API URL in the frontend `.env` file
- Check browser console for JavaScript errors

### Authentication Problems

- Validate your Google and Facebook credentials
- Ensure OAuth redirect URIs are properly configured
- Verify localhost or your domain is in the allowed origins list

## 🚀 Deployment

### Backend Deployment

1. Update environment variables for production:
   ```
   NODE_ENV=production
   DB_HOST=your_production_db_host
   JWT_SECRET=your_secure_production_secret
   ```

2. Execute deployment script:
   ```bash
   node deploy.js
   ```

### Frontend Deployment

1. Build the production bundle:
   ```bash
   cd client
   npm run build
   ```

2. Deploy the build directory to your hosting service (Netlify, Vercel, AWS, etc.)
