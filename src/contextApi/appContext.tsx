import {
  createContext,
  ReactNode,
  useState,
  useMemo,
  useContext,
  useEffect,
} from "react";
import {
  verifyActivationApi,
  patientsCountApi,
  getDbBackupPathApi,
} from "../api/appSettings";
import { toastWarning } from "../utils/toastify";

// Step 1: Create the Context =================================================
interface AppContextType {
  darkMode: boolean;
  setDarkMode: (sthemeMode: boolean) => void;
  isAppointment: boolean;
  setIsAppointment: (status: boolean) => void;
  isAuth: boolean;
  setIsAuth: (status: boolean) => void;
  activation: () => void;
  dbBackupPath: string;
  setDbBackupPath: (path: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Step 2: Implement the Provider Component ===================================

function AppProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("darkMode");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });
  const [isAppointment, setIsAppointment] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [dbBackupPath, setDbBackupPath] = useState("");

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    activation();
    getDbBackupPath();
  }, []);

  const activation = async () => {
    const verifyActivation = await verifyActivationApi();
    const patientsCount = await patientsCountApi();
    if (verifyActivation) {
      setIsAuth(true);
    }
    if (patientsCount && patientsCount <= 5) {
      setIsAuth(true);
    }
  };
  const getDbBackupPath = async () => {
    const path = await getDbBackupPathApi();
    if (path) setDbBackupPath(path);
    if (path === "") {
      toastWarning("Please set up a backup path in the settings");
    }
  };

  const memoizedValue = useMemo(
    () => ({
      darkMode,
      setDarkMode,
      isAppointment,
      setIsAppointment,
      isAuth,
      setIsAuth,
      activation,
      dbBackupPath,
      setDbBackupPath,
    }),
    [darkMode, isAppointment, isAuth],
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
