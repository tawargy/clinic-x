import {
  createContext,
  ReactNode,
  useState,
  useMemo,
  useContext,
  useEffect,
} from "react";

// Step 1: Create the Context =================================================
interface AppContextType {
  themeMode: boolean;
  setThemeMode: (themeMode: boolean) => void;
  isAppointment: boolean;
  setIsAppointment: (status: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Step 2: Implement the Provider Component ===================================

function AppProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeMode] = useState(() => {
    const savedTheme = localStorage.getItem("themeMode");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });
  const [isAppointment, setIsAppointment] = useState(false);

  useEffect(() => {
    localStorage.setItem("themeMode", JSON.stringify(themeMode));
  }, [themeMode]);
  const memoizedValue = useMemo(
    () => ({
      themeMode,
      setThemeMode,
      isAppointment,
      setIsAppointment,
    }),
    [themeMode, isAppointment],
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
