import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

import { GPMToolContext } from './context/GPMToolContext';
import { FileStore } from './stores/FileStore';

const element = document.getElementById('root');

if (element === null) {
  throw new Error('Unable to find root element');
}

const root = createRoot(element);

root.render(
  <React.StrictMode>
    <GPMToolContext.Provider value={{ fileStore: new FileStore() }}>
      <App />
    </GPMToolContext.Provider>
  </React.StrictMode>
);
