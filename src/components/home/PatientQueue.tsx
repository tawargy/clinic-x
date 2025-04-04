import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSettings } from "../../contextApi/appContext";
import { useClinic } from "../../contextApi/clinicContext";
import { followupNames } from "../../utils/followupNames";
import { getPatientInfoByIdApi } from "../../api/patient";
import { formatDate } from "../../utils/date";
import { Heart, Activity, Clipboard, Users } from "lucide-react";
import { TPatientInfoQ } from "../../types";

interface PatientQueueProps {
  patients: TPatientInfoQ[];
  currentDate: Date;
}

function PatientQueue({ patients, currentDate }: PatientQueueProps) {
  const [hoveredPatientId, setHoveredPatientId] = useState<string | null>(null);
  //const [patientInfoQ, setPatientInfoQ] = useState<TPatientInfo>(patientInit);
  const { darkMode } = useAppSettings();
  const navigate = useNavigate();
  const { patientInfo, setPatientInfo, setIsAppointment, setAppointmentType } =
    useClinic();

  const getPatientInfo = async (id: string) => {
    if (!id) return;
    try {
      const res = await getPatientInfoByIdApi(id);
      if (res) setPatientInfo(res);
    } catch (e) {
      console.log(e);
    }
  };
  const onPatientClick = (patientId: string, appointmentType: string) => {
    setIsAppointment(true);
    setAppointmentType(appointmentType);
    navigate(`/patient/${patientId}`);
  };

  const onHoverHandler = (id: string) => {
    setHoveredPatientId(id);
    getPatientInfo(id);
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800 text-white" : "bg-white"
      } rounded-lg shadow-md p-4 transition-colors duration-200 h-[calc(100vh-130px)] flex flex-col`}
    >
      <div>
        <div className="flex items-center justify-between mb-1">
          <h2
            className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-xl font-semibold flex items-center`}
          >
            <Users className="mr-2 text-blue-500" size={20} />
            Patient Queue
          </h2>
          <span
            className={`${
              darkMode
                ? "bg-blue-900 text-blue-100"
                : "bg-blue-100 text-blue-800"
            } font-medium px-2.5 py-0.5 rounded-full transition-colors duration-200`}
          >
            {patients.length}
          </span>
        </div>

        <span
          className={`${
            darkMode ? " text-gray-400" : " text-gray-500"
          } text-md pl-8`}
        >
          {formatDate(currentDate)}
        </span>
      </div>
      <div className="flex-grow overflow-hidden">
        <div className="h-full overflow-y-auto pr-1 custom-scrollbar">
          {patients.length === 0 ? (
            <div
              className={`text-center py-8 ${darkMode ? "text-gray-400" : " text-gray-500"} transition-colors duration-200`}
            >
              <p>No patients in queue</p>
            </div>
          ) : (
            <ul
              className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"} transition-colors duration-200`}
            >
              {patients.map((patient) => {
                const isHovered = hoveredPatientId === patient.patient_id;

                return (
                  <li
                    key={patient.patient_id}
                    className={`cursor-pointer py-3 flex flex-col justify-between ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"} px-2 rounded transition-colors duration-200 relative`}
                    onMouseEnter={() => onHoverHandler(patient.patient_id)}
                    onMouseLeave={() => setHoveredPatientId(null)}
                    onClick={() =>
                      onPatientClick(
                        patient.patient_id,
                        patient.appointment_type,
                      )
                    }
                  >
                    <div className="flex justify-between w-full">
                      <div>
                        <h3 className="font-medium">{patient.name}</h3>
                        <div
                          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} flex items-center transition-colors duration-200`}
                        >
                          <span
                            className={`${patient.appointment_type === "new" ? "text-green-400" : "text-yellow-600"} mr-3`}
                          >
                            {followupNames(patient.appointment_type)}
                          </span>
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
                              <span className="font-medium">Gender:</span>{" "}
                              {patientInfo?.gender}
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
                              <span className="font-medium">Age:</span>{" "}
                              {patientInfo?.age}
                              {patientInfo?.age * 1 <= 0 ? "" : " Years"}
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
                              <span className="font-medium">Born city:</span>{" "}
                              {patientInfo?.born_city}
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
                              <span className="font-medium">Marital:</span>{" "}
                              {patientInfo?.marital_status}
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
                                Appointment decription:
                              </span>{" "}
                              {patient.description}
                            </span>
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
      </div>
    </div>
  );
}

export default PatientQueue;
