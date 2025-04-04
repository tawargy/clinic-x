import { useState } from "react";
import FeesAndServices from "./FeesAndServices";
import Expenses from "./Expenses";
import Summary from "./Summary";

function Financial() {
  const [show, setShow] = useState("vees");
  return (
    <div>
      <div className="mb-4 flex gap-4">
        <button
          onClick={() => setShow("vees")}
          className="bg-blue-400 py-2 px-4 rounded-lg"
        >
          Fees & Services
        </button>
        <button
          onClick={() => setShow("expenses")}
          className="bg-blue-400 py-2 px-4 rounded-lg"
        >
          Expenses
        </button>
        <button
          onClick={() => setShow("summary")}
          className="bg-blue-400 py-2 px-4 rounded-lg"
        >
          Summary
        </button>
      </div>
      {show === "vees" && <FeesAndServices />}
      {show === "expenses" && <Expenses />}
      {show === "summary" && <Summary />}
    </div>
  );
}

export default Financial;
