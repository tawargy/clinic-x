import { useAppSettings } from "../contextApi/appContext";
import { TPatientInfo } from "../types";
import { History, Calendar } from "lucide-react";

type Tprops = {
  patient: TPatientInfo;
};
function PatientVisitHistory({ patient }: Tprops) {
  const { darkMode } = useAppSettings();
  return (
    <div
      className={`${darkMode ? "bg-gray-800" : "bg-white"} w-full rounded-lg shadow-md p-6 transition-colors duration-200`}
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <History className="mr-2" size={18} />
        Visit History
      </h3>

      {patient.history.length > 0 ? (
        <div className="space-y-6 max-h-[700px] overflow-y-auto custom-scrollbar pr-2">
          {patient.history.map((visit, index) => (
            <div
              key={index}
              className={`${darkMode ? "border-gray-700" : "border-gray-200"} border-l-4 pl-4 ${
                index !== patient.history.length - 1 ? "pb-6" : ""
              }`}
            >
              <div className="flex items-center mb-2">
                <Calendar
                  className={`mr-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  size={16}
                />
                <p
                  className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-medium`}
                >
                  {new Date(visit.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p
                    className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Reason for Visit
                  </p>
                  <p
                    className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {visit.reason}
                  </p>
                </div>
                <div>
                  <p
                    className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Diagnosis
                  </p>
                  <p
                    className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {visit.diagnosis}
                  </p>
                </div>
                <div>
                  <p
                    className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Treatment
                  </p>
                  <p
                    className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {visit.treatment}
                  </p>
                </div>
                <div>
                  <p
                    className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Doctor
                  </p>
                  <p
                    className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {visit.doctor}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          No visit history available
        </p>
      )}
    </div>
  );
}

export default PatientVisitHistory;
