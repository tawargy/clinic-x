import { NavLink } from "react-router-dom";
import { useAppSettings } from "../../contextApi/appContext";

import { Settings2, SunMoon, Moon } from "lucide-react";
function Navbar() {
  const { darkMode, setDarkMode, isAppointment } = useAppSettings();
  return (
    <nav className="flex justify-between items-center  p-4  mb-2">
      <h2>
        {!isAppointment ? (
          <NavLink className="nav-link text-red-500 text-2xl" to="/">
            Doctor X
          </NavLink>
        ) : (
          <span className="nav-link text-blue-500 text-2xl"> Dctor X</span>
        )}
      </h2>

      <ul className="flex flex-row justify-between items-center gap-3 ">
        <li className="nav-item">
          <button
            className="nav-link dark:text-white block"
            onClick={() => setDarkMode((p) => !p)}
          >
            {darkMode ? (
              <SunMoon className="hover:text-yellow-400" size={28} />
            ) : (
              <Moon className="hover:text-blue-900 " size={28} />
            )}
          </button>
        </li>
        <li className="nav-item">
          {!isAppointment ? (
            <NavLink className="nav-link dark:text-white" to="/calender">
              <Settings2
                className="hover:text-green-500 duration-200"
                size={28}
              />
            </NavLink>
          ) : (
            <span className=" dark:text-white">
              <Settings2 size={28} />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
