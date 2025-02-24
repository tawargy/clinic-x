import { createContext, ReactNode, useState, useMemo, useContext } from "react";

// Step 1: Create the Context =================================================
interface AppContextType {
  themeMode: boolean;
  setThemeMode: (themeMode: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Step 2: Implement the Provider Component ===================================

function AppProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeMode] = useState(false);

  const memoizedValue = useMemo(
    () => ({
      themeMode,
      setThemeMode,
    }),
    [themeMode],
  );

  return (
    <AppContext.Provider value={memoizedValue}>{children}</AppContext.Provider>
  );
}

const useAppSettings = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useCounter must be used within a CounterProvider");
  }
  return context;
};

export { AppProvider, useAppSettings };
