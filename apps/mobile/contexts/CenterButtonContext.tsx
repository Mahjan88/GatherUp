import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface CenterButtonContextType {
  customAction: (() => void) | null;
  setCustomAction: (action: (() => void) | null) => void;
}

const CenterButtonContext = createContext<CenterButtonContextType>({
  customAction: null,
  setCustomAction: () => {},
});

export function CenterButtonProvider({ children }: { children: ReactNode }) {
  const [customAction, setCustomAction] = useState<(() => void) | null>(null);

  const setAction = useCallback((action: (() => void) | null) => {
    setCustomAction(() => action);
  }, []);

  return (
    <CenterButtonContext.Provider value={{ customAction, setCustomAction: setAction }}>
      {children}
    </CenterButtonContext.Provider>
  );
}

export function useCenterButton() {
  return useContext(CenterButtonContext);
}
