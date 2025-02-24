import { NavLink } from "react-router-dom";
import { useAppSettings } from "../contextApi/context";
import { MdDarkMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";
import { FiSettings } from "react-icons/fi";

function Navbar() {
  const { themeMode, setThemeMode, isAppointment } = useAppSettings();
  return (
    <nav className="flex justify-between items-center  p-4  mb-2">
      <h2>
        {!isAppointment ? (
          <NavLink className="nav-link text-red-500 text-2xl" to="/">
            Dctor X
          </NavLink>
        ) : (
          <span className="nav-link text-blue-500 text-2xl"> Dctor X</span>
        )}
      </h2>

      <ul className="flex flex-row justify-between items-center gap-3 ">
        <li className="nav-item">
          <button
            className="nav-link dark:text-white block"
            onClick={() => setThemeMode((p) => !p)}
          >
            {themeMode ? (
              <MdOutlineDarkMode style={{ fontSize: "30px", color: "#fff" }} />
            ) : (
              <MdDarkMode style={{ fontSize: "30px", color: "#000" }} />
            )}
          </button>
        </li>
        <li className="nav-item">
          {!isAppointment ? (
            <NavLink className="nav-link dark:text-white" to="/calender">
              <FiSettings
                style={{
                  fontSize: "25px",
                  color: `${themeMode ? "#fff" : "#000"}`,
                }}
              />
            </NavLink>
          ) : (
            <span className=" dark:text-white">
              <FiSettings
                style={{
                  fontSize: "25px",
                  color: `${themeMode ? "#fff" : "#000"}`,
                }}
              />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
