import { useState } from "react";
import { useAppSettings } from "../../../contextApi/appContext";
import DayReport from "./DayReport";
import MonthReport from "./MonthReport";
function Report() {
  const { darkMode } = useAppSettings();
  const [show, setShow] = useState("day");
  return (
    <div>
      <ul className="flex gap-4  mb-4 pl-4">
        <li>
          <button
            onClick={() => setShow("day")}
            className={`${
              darkMode ? "text-gray-300" : "text-gray-700"
            } py-2 px-4 ${
              show === "day"
                ? "border-b-2 border-gray-500 font-semibold"
                : "hover:border-b-2 hover:border-gray-300"
            }`}
          >
            Day Report
          </button>
        </li>
        <li>
          <button
            onClick={() => setShow("month")}
            className={`${
              darkMode ? "text-gray-300" : "text-gray-700"
            } py-2 px-4 ${
              show === "month"
                ? "border-b-2 border-gray-500 font-semibold"
                : "hover:border-b-2 hover:border-gray-300"
            }`}
          >
            Month Report
          </button>
        </li>
      </ul>
      {show === "day" && <DayReport />}
      {show === "month" && <MonthReport />}
    </div>
  );
}

export default Report;
