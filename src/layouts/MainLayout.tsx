import { Outlet } from "react-router-dom";
import Navbar from "../components/comman/Navbar";
import { useAppSettings } from "../contextApi/appContext";
import { ToastContainer } from "react-toastify";

function MainLayout() {
  const { darkMode } = useAppSettings();
  return (
    <div className={`${darkMode && "dark"}`}>
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
