import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDYUhE2lZ-ZFpShJAym0wrS9OBoRyx0G38",
  authDomain: "my-react-blog-73767.firebaseapp.com",
  projectId: "my-react-blog-73767",
  storageBucket: "my-react-blog-73767.appspot.com",
  messagingSenderId: "178999920863",
  appId: "1:178999920863:web:d13214af0776c02eafc16a"
};

const app = initializeApp(firebaseConfig);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
