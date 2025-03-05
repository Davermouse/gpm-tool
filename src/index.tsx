import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

import { GPMToolContext } from './context/GPMToolContext';
import { FileStore } from './stores/FileStore';
import { GPMEventStore } from './stores/GPMEventStore';

const element = document.getElementById('root');

if (element === null) {
  throw new Error('Unable to find root element');
}

const fileStore = new FileStore();
const gpmEventStore = new GPMEventStore(fileStore);

const root = createRoot(element);

root.render(
  <React.StrictMode>
    <GPMToolContext.Provider value={{ fileStore, gpmEventStore }}>
      <App />
    </GPMToolContext.Provider>
  </React.StrictMode>
);
