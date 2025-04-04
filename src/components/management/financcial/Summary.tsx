import { useState } from "react";
import SummaryDay from "./SummaryDay";
import SummaryMonth from "./SummaryMonth";
function Summary() {
  const [show, setShow] = useState("day");
  return (
    <div>
      <ul className="flex gap-4 text-yellow-500 mb-4">
        <li>
          <button onClick={() => setShow("day")}>Day Summary</button>
        </li>
        <li>
          <button onClick={() => setShow("month")}>Month Summary</button>
        </li>
      </ul>
      {show === "day" && <SummaryDay />}
      {show === "month" && <SummaryMonth />}
    </div>
  );
}

export default Summary;
