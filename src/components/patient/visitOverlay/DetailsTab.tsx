import { useState } from "react";
import { useAppSettings } from "../../../contextApi/appContext";
import DiagnosisTab from "./DiagnosisTab";
import PrescriptionsTab from "./PrescriptionsTab";
import { TAppointment } from "../../../types";
import { ClipboardList, FileText, Stethoscope } from "lucide-react";

type TProps = {
  appointment: TAppointment;
};

function DetailsTab({ appointment }: TProps) {
  const { darkMode } = useAppSettings();

  const [activeTab, setActiveTab] = useState("diagnosisTab");
  return (
    <div>
      <div className="flex gap-2 justify-end p-4">
        <button
          onClick={() => setActiveTab("diagnosisTab")}
          className={`p-2 rounded-md ${
            activeTab === "diagnosisTab"
              ? "bg-gray-200 dark:bg-gray-700"
              : "hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
          title="Visit Details"
        >
          <Stethoscope
            size={20}
            className={darkMode ? "text-gray-300" : "text-gray-700"}
          />
        </button>
        <button
          onClick={() => setActiveTab("prescriptionsTab")}
          className={`p-2 rounded-md ${
            activeTab === "prescriptionsTab"
              ? "bg-gray-200 dark:bg-gray-700"
              : "hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
          title="Prescriptions"
        >
          <ClipboardList
            size={20}
            className={darkMode ? "text-gray-300" : "text-gray-700"}
          />
        </button>
      </div>
      {activeTab === "diagnosisTab" && (
        <DiagnosisTab appointment={appointment} />
      )}
      {activeTab === "prescriptionsTab" && (
        <PrescriptionsTab appointment={appointment} />
      )}
    </div>
  );
}

export default DetailsTab;
