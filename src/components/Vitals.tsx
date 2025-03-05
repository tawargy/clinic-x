import { useAppSettings } from "../contextApi/appContext";
import { Patient } from "../types";

import { Heart, Activity, Clipboard } from "lucide-react";
type TProps = {
  patient: Patient;
  onPatientUpdate: (patient: Patient) => void;
  isEdit: boolean;
};
function Vitals({ patient, onPatientUpdate, isEdit }: TProps) {
  const { darkMode } = useAppSettings();

  return (
    <div
      className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-1 mb-2 transition-colors duration-200`}
    >
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div
          className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} px-4 py-1 rounded-lg`}
        >
          <p
            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} mb-1`}
          >
            Height
          </p>
          {isEdit ? (
            <input
              className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
              type="text"
              value={patient.height}
              name="height"
              onChange={(e) =>
                onPatientUpdate({ ...patient, height: e.target.value })
              }
            />
          ) : (
            <p className="font-medium">{patient.height}</p>
          )}
        </div>
        <div
          className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} px-4 py-1 rounded-lg`}
        >
          <p
            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} mb-1`}
          >
            Weight
          </p>
          {isEdit ? (
            <input
              className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
              type="text"
              value={patient.weight}
              name="weight"
              onChange={(e) =>
                onPatientUpdate({ ...patient, weight: e.target.value })
              }
            />
          ) : (
            <p className="font-medium">{patient.weight}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <Heart
            className={`mr-3 ${darkMode ? "text-red-400" : "text-red-500"}`}
            size={20}
          />
          <div>
            <p
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Blood Pressure
            </p>
            {isEdit ? (
              <input
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
                type="text"
                value={patient.bloodPressure}
                name="bloodPressure"
                onChange={(e) =>
                  onPatientUpdate({
                    ...patient,
                    bloodPressure: e.target.value,
                  })
                }
              />
            ) : (
              <p className="font-medium">{patient.bloodPressure} mmHg</p>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <Activity
            className={`mr-3 ${darkMode ? "text-blue-400" : "text-blue-500"}`}
            size={20}
          />
          <div>
            <p
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Heart Rate
            </p>
            {isEdit ? (
              <input
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
                type="text"
                value={patient.heartRate}
                name="heartRate"
                onChange={(e) =>
                  onPatientUpdate({ ...patient, heartRate: e.target.value })
                }
              />
            ) : (
              <p className="font-medium">{patient.heartRate} bpm</p>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <Clipboard
            className={`mr-3 ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}
            size={20}
          />
          <div>
            <p
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Temperature
            </p>
            {isEdit ? (
              <input
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-200 border-gray-300 text-gray-900"} w-[80%] text-sm p-1 rounded-md`}
                type="text"
                value={patient.temperature}
                name="temperature"
                onChange={(e) =>
                  onPatientUpdate({ ...patient, temperature: e.target.value })
                }
              />
            ) : (
              <p className="font-medium">{patient.temperature} °C</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Vitals;
