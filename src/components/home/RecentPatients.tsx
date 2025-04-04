import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TPatientInfo } from "../../types";
import { Heart, Activity, Clipboard, Clock } from "lucide-react";

type TRecentPatientsProps = {
  patients: TPatientInfo[];
  darkMode: boolean;
};

function RecentPatients({ patients, darkMode }: TRecentPatientsProps) {
  const [hoveredPatientId, setHoveredPatientId] = useState<string | undefined>(
    "",
  );

  const navigate = useNavigate();
  const onPatientClick = (patientId: string | undefined) => {
    const patient = patients.find((patient) => patient.id === patientId);
    if (patient) {
      // setPatientInfo(patient);
      navigate(`/patient/${patientId}`);
    }
  };
  return (
    <div
      className={`${
        darkMode ? "bg-gray-800 text-white" : "bg-white"
      } rounded-lg shadow-md p-4 transition-colors duration-200 h-[calc(100vh-130px)] flex flex-col`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2
          className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-xl font-semibold flex items-center`}
        >
          <Clock className="mr-2 text-green-500" size={20} />
          Recent Patients
        </h2>
      </div>
      <div className="flex-grow overflow-hidden">
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
                    onMouseLeave={() => setHoveredPatientId("")}
                    onClick={() => onPatientClick(patient.id)}
                  >
                    <div className="flex justify-between w-full">
                      <div>
                        <h3 className="font-medium">{patient.name}</h3>
                        <div
                          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} flex items-center transition-colors duration-500`}
                        >
                          <span className="mr-3"> {patient.gender},&nbsp;</span>
                          <span className="mr-3"> {patient.age} Years</span>
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
                              <span className="font-medium">
                                Born city:&nbsp; {patient.born_city}
                              </span>{" "}
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
                              <span className="font-medium">
                                Occupation:&nbsp;{patient.occupation}
                              </span>{" "}
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
                              <span className="font-medium">
                                Marital Status:&nbsp; {patient.marital_status}
                              </span>{" "}
                            </span>
                          </div>
                          <div className="flex items-start"></div>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecentPatients;
