import { NavLink } from "react-router-dom";
import { useAppSettings } from "../../contextApi/appContext";
import { useClinic } from "../../contextApi/clinicContext";
import { CalendarDays } from "lucide-react";
import { Settings2, SlidersHorizontal } from "lucide-react";

function Navbar() {
  const { darkMode, setDarkMode } = useAppSettings();
  const { isAppointment } = useClinic();
  return (
    <nav className="flex justify-between items-center  p-4  mb-2">
      <h2>
        {isAppointment ? (
          <span className="nav-link text-blue-500 text-2xl font-medium">
            Doctor X
          </span>
        ) : (
          <NavLink
            className="nav-link text-blue-500 text-2xl font-medium"
            to="/"
          >
            Doctor X
          </NavLink>
        )}
      </h2>

      <ul className="flex flex-row justify-between items-center gap-4 ">
        <li>
          {isAppointment ? (
            <span className="flex items-center gap-1 nav-link dark:tems-centernav-link dark:text-white bg-gray-500 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg">
              Agenda
            </span>
          ) : (
            <NavLink
              className="flex items-center gap-1 nav-link dark:tems-centernav-link dark:text-white bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
              to="/agenda"
            >
              <CalendarDays size={20} />
              Agenda
            </NavLink>
          )}
        </li>
        <li className="nav-item">
          <button
            className="nav-link  block "
            onClick={() => setDarkMode((p) => !p)}
          >
            {/* {darkMode ? (
              <SunMoon className="hover:text-yellow-400" size={28} />
            ) : (
              <Moon className="hover:text-blue-900 " size={28} />
            )} */}
            {darkMode ? "🌞" : "🌙"}
          </button>
        </li>
        <li className="nav-item">
          {isAppointment ? (
            <span>
              <Settings2
                className="hover:text-gray-500 duration-200"
                size={28}
              />
            </span>
          ) : (
            <NavLink
              className={`${darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"} nav-link `}
              to="/manage"
            >
              <SlidersHorizontal />
            </NavLink>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
