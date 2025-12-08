import React from 'react';
import ReactDOM from 'react-dom/client';

import '@/styles/global.scss';
import RouterProvider from '@/router';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root not found in index.html');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <RouterProvider />
  </React.StrictMode>
);