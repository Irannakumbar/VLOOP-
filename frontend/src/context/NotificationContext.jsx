import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
  };

  return (
    <NotificationContext.Provider value={{ notify, addToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          maxWidth: '420px',
          width: 'calc(100% - 48px)',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';

          return (
            <div
              key={toast.id}
              style={{
                pointerEvents: 'auto',
                background: 'linear-gradient(145deg, #321D35 0%, #211326 100%)',
                border: `1px solid ${
                  isSuccess
                    ? 'rgba(60, 155, 118, 0.6)'
                    : isError
                    ? 'rgba(255, 107, 74, 0.6)'
                    : 'rgba(246, 200, 95, 0.5)'
                }`,
                borderRadius: '16px',
                padding: '14px 18px',
                color: '#FFFFFF',
                boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                backdropFilter: 'blur(10px)',
                animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div style={{ marginTop: '2px', flexShrink: 0 }}>
                {isSuccess && <CheckCircle2 size={20} color="#3C9B76" />}
                {isError && <AlertCircle size={20} color="#FF6B4A" />}
                {!isSuccess && !isError && <Info size={20} color="#F6C85F" />}
              </div>
              <div style={{ flex: 1, fontSize: '0.9rem', lineHeight: '1.4' }}>
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  padding: '2px',
                  lineHeight: 1,
                }}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

