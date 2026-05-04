import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';

const Router =
  import.meta.env.VITE_ROUTER_MODE === 'browser' ? BrowserRouter : HashRouter;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <Router>
        <App />
      </Router>
    </HelmetProvider>
  </React.StrictMode>,
);
