import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import { store, persistor } from './app/store/store';
import { HelmetProvider } from 'react-helmet-async';
import { StagewiseToolbar } from '@stagewise/toolbar-react';

// Sử dụng trực tiếp Google Client ID thay vì qua biến môi trường
const GOOGLE_CLIENT_ID = '511160505403-v44695f90lkv82qv1g6s35lb8j5c00g5.apps.googleusercontent.com';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HelmetProvider>
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <App />
          </GoogleOAuthProvider>
        </HelmetProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);