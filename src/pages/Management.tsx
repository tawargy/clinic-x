import { useState } from "react";
import { useAppSettings } from "../contextApi/appContext";
import { useNavigate } from "react-router-dom";
import ClinicInfo from "../components/management/ClinicInfo";
import Financial from "../components/management/financcial/Financial";
import Employees from "../components/management/Employees";
import AppSettings from "../components/management/AppSettings";
import { X } from "lucide-react";

function Management() {
  const [show, setShow] = useState("clinicSettings");
  const { darkMode } = useAppSettings();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto  relative  ">
      <div
        className=" w-7 h-7 flex items-center justify-center bg-white  rounded-md absolute right-0 top-0  cursor-pointer"
        onClick={() => navigate("/")}
      >
        <X
          className="w-full h-full rounded-md bg-red-500 text-white font-bold"
          size={20}
        />
      </div>
      <div
        className={`${darkMode ? "bg-gray-800 text-white" : "bg-white"} min-h-[85vh] flex w-full   rounded-lg shadow-md p-4 transition-colors duration-200  `}
      >
        <ul className="w-[20%] flex flex-col gap-4 pt-4 ">
          <li>
            <button onClick={() => setShow("clinicSettings")}>
              Clinic Info
            </button>
          </li>

          <li>
            <button onClick={() => setShow("accountment")}>Financial</button>
          </li>
          <li>
            <button onClick={() => setShow("employees")}>Employees</button>
          </li>
          <li>
            <button onClick={() => setShow("appsettings")}>App Settings</button>
          </li>
        </ul>
        <div
          className={`${darkMode ? "border border-gray-700" : " border border-gray-300"} w-full   rounded-lg p-4 `}
        >
          {show === "clinicSettings" && <ClinicInfo />}
          {show === "employees" && <Employees />}
          {show === "accountment" && <Financial />}
          {show === "appsettings" && <AppSettings />}
        </div>
      </div>
    </div>
  );
}

export default Management;
