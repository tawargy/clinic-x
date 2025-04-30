import { useAppSettings } from "../../contextApi/appContext";
import { useClinic } from "../../contextApi/clinicContext";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/date";
import { followupNames } from "../../utils/followupNames";
import { getAppointmentDaysApi } from "../../api/appointmentDay";
import { X } from "lucide-react";

type TPatientData = {
  patient_id: string;
  name: string;
  appointment_type: string;
  description: string;
};
type TProps = {
  patientsQueue: TPatientData[];
  deletePatient: (id: string) => void;
  selectedDate: Date | null;
  currentDate: Date;
};

function PatientsQueue({
  patientsQueue,
  deletePatient,
  selectedDate,
  currentDate,
}: TProps) {
  const { setIsAppointment, setAppointmentType } = useClinic();
  const { darkMode } = useAppSettings();
  const navigate = useNavigate();

  const getQueue = async () => {
    try {
      const res = await getAppointmentDaysApi(formatDate(currentDate));
      return res;
    } catch (e) {
      console.log(e);
    }
  };

  const isPatientInQueue = async (id: string) => {
    const patients = await getQueue();
    if (patients) {
      return patients.some((patient) => patient.patient_id === id);
    }
    return false;
  };

  const openPatientInfoHandeler = async (
    id: string,
    appointmentType: string,
  ) => {
    setIsAppointment(await isPatientInQueue(id));
    setAppointmentType(appointmentType);
    navigate(`/patient/${id}`);
  };
  return (
    <div
      className={`${darkMode ? "bg-gray-800 text-white " : "bg-white"} w-full  rounded-lg shadow-md p-4 transition-colors
        duration-200 h-[calc(100vh-130px)] flex flex-col`}
    >
      <h3 className="text-center py-4 text-lg">
        <span className="text-lg text-blue-500">
          {formatDate(selectedDate)}
        </span>
        <span className="text-blue-500 rounded-full bg-blue-200 px-2 w-[30px] h-[30px] inline-flex justify-center items-center itext-lg ml-4">
          {patientsQueue?.length}
        </span>
      </h3>
      <ul className=" p-4 w-[90%] lg:w-[70%] mt-2 mx-auto overflow-y-auto custom-scrollbar ">
        {patientsQueue?.map((patient) => (
          <li
            className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-100 border-gray-300 text-gray-900"}}
              flex items-center justify-between bg-blue-100 p-1 lg:p-2 mb-4 rounded-md`}
            key={patient.patient_id}
          >
            <button
              className="flex flex-col"
              onClick={() =>
                openPatientInfoHandeler(
                  patient.patient_id,
                  patient.appointment_type,
                )
              }
            >
              <span className="hover:text-blue-500"> {patient.name}</span>
              <span
                className={`${patient.appointment_type === "new" ? "text-green-500" : "text-yellow-600"} `}
              >
                {followupNames(patient.appointment_type)}
              </span>
            </button>
            <button>
              <X
                className="w-full h-full rounded-md bg-red-500 text-white font-bold"
                size={20}
                onClick={() => deletePatient(patient.patient_id)}
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PatientsQueue;
