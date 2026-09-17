import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

// Filter noisy third-party browser extension errors (e.g. sender-wallet, metamask, etc.)
if (typeof window !== 'undefined') {
  const isExtensionNoise = (args: any[]): boolean => {
    try {
      for (const item of args) {
        if (!item) continue;
        const str = typeof item === 'string' ? item : typeof item === 'object' && item !== null ? JSON.stringify(item) : String(item || '');
        const lower = str.toLowerCase();
        if (
          lower.includes('sender-wallet') ||
          lower.includes('sender_getproviderstate') ||
          lower.includes('sender:') ||
          lower.includes('no account exist') ||
          lower.includes('sender-wallet-providerresult') ||
          lower.includes('failed to get initial state') ||
          lower.includes('sender_')
        ) {
          return true;
        }
      }
    } catch (_) {}
    return false;
  };

  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    if (isExtensionNoise(args)) return;
    originalConsoleError.apply(console, args);
  };

  const originalConsoleWarn = console.warn;
  console.warn = (...args: any[]) => {
    if (isExtensionNoise(args)) return;
    originalConsoleWarn.apply(console, args);
  };

  const originalConsoleLog = console.log;
  console.log = (...args: any[]) => {
    if (isExtensionNoise(args)) return;
    originalConsoleLog.apply(console, args);
  };

  const originalOnError = window.onerror;
  window.onerror = (msg, url, lineNo, columnNo, error) => {
    if (isExtensionNoise([msg, url, error?.message, error])) {
      return true;
    }
    if (originalOnError) {
      return originalOnError(msg, url, lineNo, columnNo, error);
    }
    return false;
  };

  window.addEventListener(
    'error',
    (event) => {
      if (isExtensionNoise([event.message, event.filename, event.error])) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
    },
    true
  );

  window.addEventListener(
    'unhandledrejection',
    (event) => {
      if (isExtensionNoise([event.reason?.message, event.reason])) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
    },
    true
  );

  window.addEventListener(
    'message',
    (event) => {
      if (isExtensionNoise([event.data])) {
        event.stopImmediatePropagation();
      }
    },
    true
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
);

