import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex justify-between items-center bg-gray-100 p-4 w-[96%] m-auto rounded-md mt-2">
      <h2>
        <NavLink className="nav-link text-red-500 text-2xl" to="/">
          Dctor X
        </NavLink>
      </h2>
      <ul className="flex flex-row justify-between items-center gap-3">
        <li className="nav-item">
          <NavLink className="nav-link" to="/add-patient">
            AddPatient
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink className="nav-link" to="/calender">
            Calender
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
