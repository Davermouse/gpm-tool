import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { GPMToolContext } from './context/GPMToolContext';
import { FileStore } from './stores/FileStore';

ReactDOM.render(
  <React.StrictMode>
    <GPMToolContext.Provider value={{ fileStore: new FileStore() }}>
      <App />
    </GPMToolContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
