import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAppSettings } from "../contextApi/context";

function MainLayout() {
  const { themeMode } = useAppSettings();
  return (
    <div className={`${themeMode && "dark"}`}>
      <div className={`min-h-screen bg-bg-light dark:bg-bg-dark p-2`}>
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
