import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Patient } from "../types";
import { Clock, Heart, Activity, Pill, Clipboard } from "lucide-react";

interface RecentPatientsProps {
  patients: Patient[];
  darkMode: boolean;
}

const RecentPatients: React.FC<RecentPatientsProps> = ({
  patients,
  darkMode,
}) => {
  const [hoveredPatientId, setHoveredPatientId] = useState<number | null>(null);
  const formatCompletionTime = (checkInTime: string | undefined) => {
    if (!checkInTime) return "Unknown";

    const date = new Date(checkInTime);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const navigate = useNavigate();
  const onPatientClick = (patientId: number) => {
    navigate(`/patient/${patientId}`);
  };
  return (
    <div className="h-full overflow-y-auto pr-1 custom-scrollbar">
      {patients.length === 0 ? (
        <div
          className={`text-center py-8 ${darkMode ? "text-gray-400" : "text-gray-500"} transition-colors duration-200`}
        >
          <p>No recent patients</p>
        </div>
      ) : (
        <ul
          className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"} transition-colors duration-200`}
        >
          {patients.map((patient) => {
            const isHovered = hoveredPatientId === patient.id;
            return (
              <li
                key={patient.id}
                className={`cursor-pointer py-3 flex flex-col justify-between ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"} px-2 rounded transition-colors duration-500 relative`}
                onMouseEnter={() => setHoveredPatientId(patient.id)}
                onMouseLeave={() => setHoveredPatientId(null)}
                onClick={() => onPatientClick(patient.id)}
              >
                <div className="flex justify-between w-full">
                  <div>
                    <h3 className="font-medium">{patient.name}</h3>
                    <div
                      className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} flex items-center transition-colors duration-500`}
                    >
                      <span className="mr-3">Age: {patient.age}</span>
                      {patient.checkInTime && (
                        <span className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          {/* Wait: {formatWaitTime(patient.checkInTime)} */}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Patient details card that appears on hover */}
                {isHovered && (
                  <div
                    className={`${
                      darkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-200"
                    } border rounded-md p-3 mt-2 shadow-lg transition-all duration-200 z-10`}
                  >
                    <h4 className="font-medium mb-2">Patient Details</h4>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center">
                        <Heart
                          className={`mr-2 ${darkMode ? "text-red-400" : "text-red-500"}`}
                          size={16}
                        />
                        <span
                          className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                        >
                          <span className="font-medium">BP:</span>{" "}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Activity
                          className={`mr-2 ${darkMode ? "text-blue-400" : "text-blue-500"}`}
                          size={16}
                        />
                        <span
                          className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                        >
                          <span className="font-medium">Heart Rate:</span>{" "}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clipboard
                          className={`mr-2 ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}
                          size={16}
                        />
                        <span
                          className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                        >
                          <span className="font-medium">Temp:</span>{" "}
                        </span>
                      </div>
                      <div className="flex items-start">
                        <Pill
                          className={`mr-2 mt-0.5 ${darkMode ? "text-purple-400" : "text-purple-500"}`}
                          size={16}
                        />
                        <div className="flex flex-col">
                          <span
                            className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                          >
                            <span className="font-medium">Medications:</span>{" "}
                          </span>
                          <span
                            className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"} mt-1`}
                          >
                            <span className="font-medium">Allergies:</span>{" "}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default RecentPatients;
