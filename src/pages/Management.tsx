import { useState } from "react";
import { useAppSettings } from "../contextApi/appContext";
import { useNavigate } from "react-router-dom";
import ClinicSettings from "../components/management/ClinicSettings";
import Accounting from "../components/management/Accounting";
import Employees from "../components/management/Employees";
import Statistics from "../components/management/Statistics";
import { X } from "lucide-react";

function Manage() {
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
        <ul className="w-[20%] flex flex-col gap-4 ">
          <li>
            <button onClick={() => setShow("clinicSettings")}>
              Clinic Settings
            </button>
          </li>
          <li>
            <button onClick={() => setShow("accountment")}>Accountment</button>
          </li>
          <li>
            <button onClick={() => setShow("employees")}>Employees</button>
          </li>
          <li>
            <button onClick={() => setShow("statistics")}>Statistics</button>
          </li>
        </ul>
        <div className="w-full bg-gray-500">
          {show === "clinicSettings" && <ClinicSettings />}
          {show === "accountment" && <Accounting />}
          {show === "employees" && <Employees />}
          {show === "statistics" && <Statistics />}
        </div>
      </div>
    </div>
  );
}

export default Manage;
