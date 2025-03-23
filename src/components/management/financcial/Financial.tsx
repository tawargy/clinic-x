import { useState } from "react";
import VeesAndServices from "./VeesAndServices";
function Financial() {
  const [show, setShow] = useState("vees");
  return (
    <div>
      <div className="mb-4">
        <button
          onClick={() => setShow("vees")}
          className="bg-red-200 py-2 px-4 rounded-lg"
        >
          Vees & Services
        </button>
      </div>
      {show === "vees" && <VeesAndServices />}
    </div>
  );
}

export default Financial;
