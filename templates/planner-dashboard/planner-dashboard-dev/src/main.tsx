import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

document.addEventListener('DOMContentLoaded', function () {
  ReactDOM.createRoot(
    document.getElementById('planner-dashboard-root') as HTMLElement
  ).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
