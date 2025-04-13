import { useState } from "react";
import { useAppSettings } from "../../../contextApi/appContext";
import { TpatientMedicalHistory } from "../../../types";

type TProps = {
  isEdit: boolean;
  patientMedicalHistory: TpatientMedicalHistory;
  setPatientMedicalHistory: React.Dispatch<
    React.SetStateAction<TpatientMedicalHistory>
  >;
};
function FamilyHistoryAndNotes({
  isEdit,
  patientMedicalHistory,
  setPatientMedicalHistory,
}: TProps) {
  const { darkMode } = useAppSettings();
  const [expandedSections, setExpandedSections] = useState({
    familyHistory: true,
    notes: true,
  });
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  return (
    <div>
      <div
        className={`${darkMode ? "bg-gray-800" : "bg-white"} w-full rounded-lg shadow-md p-2 mb-1
            max-h-[300px] overflow-y-auto custom-scrollbar
             transition-colors duration-200`}
      >
        <div
          className="flex items-center cursor-pointer mb-2"
          onClick={() => toggleSection("familyHistory")}
        >
          <h4
            className={`text-lg font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Family History
          </h4>
          <span className="ml-2 text-gray-400">
            {expandedSections.familyHistory ? "▼" : "▲"}
          </span>
        </div>
        <h4
          className={`text-lg font-medium mb-1 mt-2 ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        ></h4>

        {expandedSections.familyHistory && (
          <div>
            {isEdit ? (
              <textarea
                className={`${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                } border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                value={patientMedicalHistory.family_history}
                onChange={(e) =>
                  setPatientMedicalHistory({
                    ...patientMedicalHistory,
                    family_history: e.target.value,
                  })
                }
              />
            ) : (
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {patientMedicalHistory.family_history}
              </p>
            )}
          </div>
        )}
      </div>

      <div
        className={`${darkMode ? "bg-gray-800" : "bg-white"} w-full rounded-lg shadow-md p-2 mb-1
            max-h-[300px] overflow-y-auto custom-scrollbar
             transition-colors duration-200`}
      >
        <div
          className="flex items-center cursor-pointer mb-2"
          onClick={() => toggleSection("notes")}
        >
          <h4
            className={`text-lg font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Notes
          </h4>
          <span className="ml-2 text-gray-400">
            {expandedSections.notes ? "▼" : "▲"}
          </span>
        </div>
        {expandedSections.notes && (
          <div>
            {isEdit ? (
              <textarea
                className={`${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                } border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                value={patientMedicalHistory.notes}
                onChange={(e) =>
                  setPatientMedicalHistory({
                    ...patientMedicalHistory,
                    notes: e.target.value,
                  })
                }
              />
            ) : (
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {patientMedicalHistory.notes}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FamilyHistoryAndNotes;
