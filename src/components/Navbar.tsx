import { NavLink } from "react-router-dom";
import { useAppSettings } from "../contextApi/context";
import { MdDarkMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";
import { FiSettings } from "react-icons/fi";

function Navbar() {
  const { themeMode, setThemeMode } = useAppSettings();
  return (
    <nav className="flex justify-between items-center  p-4  mb-8">
      <h2>
        <NavLink className="nav-link text-red-500 text-2xl" to="/">
          Dctor X
        </NavLink>
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
          <NavLink className="nav-link dark:text-white" to="/calender">
            <FiSettings
              style={{
                fontSize: "25px",
                color: `${themeMode ? "#fff" : "#000"}`,
              }}
            />
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
