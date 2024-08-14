import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import Context from './Context/Context';
import 'react-toastify/dist/ReactToastify.css';
import 'react-quill/dist/quill.bubble.css';
import 'react-tagsinput/react-tagsinput.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Context>
        <App />
      </Context>
    </BrowserRouter>
  </React.StrictMode>
);

