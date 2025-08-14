import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PopupContextType {
  popupsEnabled: boolean;
  togglePopups: () => void;
  showToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

interface PopupProviderProps {
  children: ReactNode;
}

export const PopupProvider: React.FC<PopupProviderProps> = ({ children }) => {
  const [popupsEnabled, setPopupsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('popupsEnabled');
    return saved !== null ? JSON.parse(saved) : true; // 改為 true
  });

  useEffect(() => {
    localStorage.setItem('popupsEnabled', JSON.stringify(popupsEnabled));
  }, [popupsEnabled]);

  const togglePopups = () => {
    setPopupsEnabled(prev => !prev);
  };

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    if (popupsEnabled) {
      // Dynamic import to avoid circular dependencies
      import('sonner').then(({ toast }) => {
        switch (type) {
          case 'success':
            toast.success(message);
            break;
          case 'error':
            toast.error(message);
            break;
          case 'info':
            toast.info(message);
            break;
        }
      });
    }
  };

  return (
    <PopupContext.Provider value={{ popupsEnabled, togglePopups, showToast }}>
      {children}
    </PopupContext.Provider>
  );
};

export const usePopup = (): PopupContextType => {
  const context = useContext(PopupContext);
  if (context === undefined) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};