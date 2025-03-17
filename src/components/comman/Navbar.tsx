import { NavLink } from "react-router-dom";
import { useAppSettings } from "../../contextApi/appContext";
import { CalendarDays } from "lucide-react";

import { Settings2, SunMoon, Moon } from "lucide-react";
function Navbar() {
  const { darkMode, setDarkMode } = useAppSettings();
  return (
    <nav className="flex justify-between items-center  p-4  mb-2">
      <h2>
        <NavLink className="nav-link text-blue-500 text-2xl font-medium" to="/">
          Doctor X
        </NavLink>
      </h2>

      <ul className="flex flex-row justify-between items-center gap-3 ">
        <li>
          <NavLink
            className="flex items-center gap-1 nav-link dark:tems-centernav-link dark:text-white bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
            to="/agenda"
          >
            <CalendarDays size={20} />
            Agenda
          </NavLink>
        </li>
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
          <NavLink className="nav-link dark:text-white" to="/manage">
            <Settings2
              className="hover:text-green-500 duration-200"
              size={28}
            />
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
