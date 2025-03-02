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
  darkMode: boolean;
  setDarkMode: (sthemeMode: boolean) => void;
  isAppointment: boolean;
  setIsAppointment: (status: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Step 2: Implement the Provider Component ===================================

function AppProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("darkMode");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });
  const [isAppointment, setIsAppointment] = useState(false);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);
  const memoizedValue = useMemo(
    () => ({
      darkMode,
      setDarkMode,
      isAppointment,
      setIsAppointment,
    }),
    [darkMode, isAppointment],
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
