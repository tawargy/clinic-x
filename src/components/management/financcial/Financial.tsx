import { useState } from "react";
import { useAppSettings } from "../../../contextApi/appContext";
import FeesAndServices from "./FeesAndServices";
import Expenses from "./Expenses";
import Report from "./Report";

function Financial() {
  const { darkMode } = useAppSettings();
  const [show, setShow] = useState("fees");
  return (
    <div>
      <div className="mb-4 flex gap-4">
        <button
          onClick={() => setShow("fees")}
          className={`${
            darkMode ? "text-yellow-400" : "text-yellow-500"
          } py-2 px-4 ${
            show === "fees"
              ? "border-b-2 border-yellow-500 font-semibold"
              : "hover:border-b-2 hover:border-yellow-300"
          }`}
        >
          Fees & Services
        </button>
        <button
          onClick={() => setShow("expenses")}
          className={`${
            darkMode ? "text-yellow-400" : "text-yellow-500"
          } py-2 px-4 ${
            show === "expenses"
              ? "border-b-2 border-yellow-500 font-semibold"
              : "hover:border-b-2 hover:border-yellow-300"
          }`}
        >
          Expenses
        </button>
        <button
          onClick={() => setShow("report")}
          className={`${
            darkMode ? "text-yellow-400" : "text-yellow-500"
          } py-2 px-4 ${
            show === "summary"
              ? "border-b-2 border-yellow-500 font-semibold"
              : "hover:border-b-2 hover:border-yellow-300"
          }`}
        >
          Reports
        </button>
      </div>
      {show === "fees" && <FeesAndServices />}
      {show === "expenses" && <Expenses />}
      {show === "report" && <Report />}
    </div>
  );
}

export default Financial;
