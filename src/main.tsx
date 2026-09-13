import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Filter noisy third-party browser extension errors (e.g. sender-wallet, metamask, etc.)
if (typeof window !== 'undefined') {
  const originalOnError = window.onerror;
  window.onerror = (msg, url, lineNo, columnNo, error) => {
    const errorStr = typeof msg === 'string' ? msg : error?.message || '';
    if (
      errorStr.includes('sender-wallet') ||
      errorStr.includes('sender_getProviderState') ||
      errorStr.includes('Sender:') ||
      errorStr.includes('No account exist')
    ) {
      // Suppress noisy external browser extension errors from breaking application logs
      return true;
    }
    if (originalOnError) {
      return originalOnError(msg, url, lineNo, columnNo, error);
    }
    return false;
  };

  window.addEventListener('unhandledrejection', (event) => {
    const reasonStr = event.reason?.message || String(event.reason || '');
    if (
      reasonStr.includes('sender-wallet') ||
      reasonStr.includes('sender_getProviderState') ||
      reasonStr.includes('Sender:') ||
      reasonStr.includes('No account exist')
    ) {
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

