import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

document.addEventListener('DOMContentLoaded', function () {
  const root = document.getElementById('assessments-admin-menu-root');

  if (!root) return;

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
