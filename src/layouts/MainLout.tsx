import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAppSettings } from "../contextApi/context";
import { ToastContainer } from "react-toastify";

function MainLayout() {
  const { themeMode } = useAppSettings();
  return (
    <div className={`${themeMode && "dark"}`}>
      <div className={`min-h-screen bg-bg-light dark:bg-bg-dark p-2`}>
        <Navbar />
        <Outlet />
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
}

export default MainLayout;
