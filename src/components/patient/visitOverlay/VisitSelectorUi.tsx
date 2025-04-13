import { useEffect } from "react";
import { useAppSettings } from "../../../contextApi/appContext";
import { TAppointment, TAppointmentWrapper } from "../../../types";
import { formatDateDB } from "../../../utils/date";

type TProps = {
  appointmentWrapper: TAppointmentWrapper;
  appointmentId: string;
  setAppointmentId: (id: string) => void;
  appointment: TAppointment;
};
function VisitSelectorUi({
  appointmentWrapper,
  appointmentId,
  setAppointmentId,
  appointment,
}: TProps) {
  const { darkMode } = useAppSettings();

  useEffect(() => {
    setAppointmentId(appointmentWrapper.main_appointment);
  }, [appointmentWrapper.main_appointment]);

  const followupNames = [
    "First follow up",
    "Second follow up",
    "Third follow up",
    "Fourth follow up",
  ];
  return (
    <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-4`}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2
            className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}
          >
            Appointment Details
          </h2>
        </div>
        <div
          className={`flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-700"} mr-16`}
        >
          <span>Case Status:</span>
          <span
            className={`px-2 py-1 rounded-full text-sm font-medium ${
              appointmentWrapper.appointment_status === "Closed"
                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            }`}
          >
            {appointmentWrapper.appointment_status}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 mb-4">
        <button
          className={`px-4 py-2 rounded-t-lg transition-colors ${
            appointmentId === appointmentWrapper.main_appointment
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-b-2 border-yellow-500"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
          onClick={() => setAppointmentId(appointmentWrapper.main_appointment)}
        >
          Initial Encounter
        </button>

        {appointmentWrapper.followup_appointments.map((id, i) => (
          <button
            key={i}
            className={`px-4 py-2 rounded-t-lg transition-colors ${
              id === appointmentId
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-b-2 border-yellow-500"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            onClick={() => setAppointmentId(id)}
          >
            {followupNames[i]}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <p
            className={`${darkMode ? "text-gray-300" : "text-gray-700"} flex gap-2`}
          >
            <span> Date:</span>
            <span
              className={`text-sm px-2 py-0.5 rounded ${darkMode ? "bg-gray-700 text-blue-300" : "bg-blue-50 text-blue-700"}`}
            >
              {formatDateDB(appointment.created_at)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default VisitSelectorUi;
