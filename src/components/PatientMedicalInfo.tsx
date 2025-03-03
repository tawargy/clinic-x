import { useAppSettings } from "../contextApi/appContext";
import { TPatientInfo } from "../types";

import { Pill } from "lucide-react";
type Tprops = {
  patient: TPatientInfo;
};
function PatientMedicalInfo({ patient }: Tprops) {
  const { darkMode } = useAppSettings();
  return (
    <div
      className={`${darkMode ? "bg-gray-800" : "bg-white"} h-[100%] w-full  rounded-lg shadow-md p-6 mb-6 transition-colors duration-200`}
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Pill className="mr-2" size={18} />
        Medical Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4
            className={`text-md font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Allergies
          </h4>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            {patient.allergies || "None reported"}
          </p>
        </div>
        <div>
          <h4
            className={`text-md font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Medications
          </h4>
          {patient.medications.length > 0 ? (
            <ul
              className={`list-disc pl-5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              {patient.medications.map((med, index) => (
                <li key={index}>{med}</li>
              ))}
            </ul>
          ) : (
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              None
            </p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h4
          className={`text-md font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
        >
          Conditions
        </h4>
        {patient.conditions.length > 0 ? (
          <ul
            className={`list-disc pl-5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            {patient.conditions.map((condition, index) => (
              <li key={index}>{condition}</li>
            ))}
          </ul>
        ) : (
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            No conditions reported
          </p>
        )}
      </div>
      <div>
        <h4
          className={`text-md font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
        >
          Special Habits
        </h4>
        <div className={`${darkMode ? "text-gray-400" : "text-gray-600"} mb-2`}>
          {patient.specialHabits.map((h) => (
            <p key={h}>• {h}</p>
          ))}
        </div>
      </div>
      <div>
        <h4
          className={`text-md font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
        >
          Notes
        </h4>
        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          {patient.notes}
        </p>
      </div>
    </div>
  );
}

export default PatientMedicalInfo;
