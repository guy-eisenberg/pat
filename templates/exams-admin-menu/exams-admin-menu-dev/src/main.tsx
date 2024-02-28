import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import './index.css';
import { ExamPage, ExamsPage, HomePage } from './pages';

document.addEventListener('DOMContentLoaded', function () {
  const root = document.getElementById('exams-admin-menu-root');

  if (!root) return;

  ReactDOM.createRoot(root as HTMLElement).render(
    <React.StrictMode>
      <HashRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<HomePage />} />
            <Route path="exams" element={<ExamsPage />} />
            <Route path="exams/:id/:tab/*" element={<ExamPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </React.StrictMode>
  );
});
