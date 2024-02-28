import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const router = createHashRouter([
  {
    index: true,
    path: '/*',
    element: <App />,
  },
]);

document.addEventListener('DOMContentLoaded', function () {
  const root = document.querySelector(
    '#flagged-questions-dashboard-root'
  ) as HTMLElement;

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
});
