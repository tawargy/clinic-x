import { useState } from "react";
import { useAppSettings } from "../../contextApi/appContext";
import { useClinic } from "../../contextApi/clinicContext";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/date";
import { followupNames } from "../../utils/followupNames";
import {
  getAppointmentDaysApi,
  updatePatientTimeApi,
} from "../../api/appointmentDay";
import { X, Edit, Save, XCircle } from "lucide-react";
import { formatTimeTo12Hour } from "../../utils/timeTo12Hour";

import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

type TPatientData = {
  patient_id: string;
  name: string;
  appointment_type: string;
  description: string;
  time: string;
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

  const [editingPatientId, setEditingPatientId] = useState<string | null>(null);
  const [editedTime, setEditedTime] = useState<string>("");

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

  const editHandler = (patient: TPatientData) => {
    setEditingPatientId(patient.patient_id);
    setEditedTime(patient.time);
  };

  const saveHandler = async (patient: TPatientData) => {
    try {
      // First validate time format (should be HH:MM)
      if (!/^\d{1,2}:\d{2}$/.test(editedTime)) {
        alert("Please enter a valid time in HH:MM format");
        return;
      }

      await updatePatientTimeApi(
        formatDate(selectedDate || currentDate),
        patient.patient_id,
        editedTime,
      );
      // Exit edit mode
      setEditingPatientId(null);

      // Refresh the queue to show the updated time
      // refreshQueue();
    } catch (error) {
      console.error("Failed to update appointment time:", error);
      alert("Failed to update appointment time. Please try again.");
    }
  };

  const cancelEdit = () => {
    setEditingPatientId(null);
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
        {[...patientsQueue]
          .sort((a, b) => a.time.localeCompare(b.time))
          .map((patient) => (
            <li
              className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-100 border-gray-300 text-gray-900"}}
               bg-blue-100 p-1 lg:p-2 mb-4 rounded-md relative`}
              key={patient.patient_id}
            >
              <div className="flex flex-col">
                <h4
                  className=" text-xl  font-bold hover:text-blue-500 cursor-pointer"
                  onClick={() =>
                    openPatientInfoHandeler(
                      patient.patient_id,
                      patient.appointment_type,
                    )
                  }
                >
                  {patient.name}
                </h4>
                {editingPatientId === patient.patient_id ? (
                  <div className="flex items-center mt-1 space-x-2   w-full">
                    <TimePicker
                      onChange={(value) => setEditedTime(value as string)}
                      value={editedTime}
                      clearIcon={null}
                      disableClock={true}
                      className="w-1/2 text-gray-600 light-time-picker"
                    />
                    <button
                      onClick={() => saveHandler(patient)}
                      className="p-1 bg-green-100 text-green-600 rounded-md"
                    >
                      <Save size={16} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-1 bg-red-100 text-red-600 rounded-md"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 ">
                    {formatTimeTo12Hour(patient.time)}
                  </p>
                )}
                <span
                  className={`${patient.appointment_type === "new" ? "text-green-500" : "text-yellow-600"} `}
                >
                  {followupNames(patient.appointment_type)}
                </span>
              </div>
              <div className="flex gap-1 absolute right-1 top-1">
                <button>
                  <Edit
                    className="w-full h-full rounded-md  text-green-500 font-bold"
                    size={20}
                    onClick={() => editHandler(patient)}
                  />
                </button>
                <button>
                  <X
                    className="w-full h-full rounded-md text-red-500 font-bold"
                    size={20}
                    onClick={() => deletePatient(patient.patient_id)}
                  />
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default PatientsQueue;
