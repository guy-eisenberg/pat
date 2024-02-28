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
  ReactDOM.createRoot(
    document.getElementById('targets-dashboard-root') as HTMLElement
  ).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
});
