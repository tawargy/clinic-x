import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useClinic } from "../contextApi/clinicContext";
import { useAppSettings } from "../contextApi/appContext";
import CalendarEvent from "../components/agenda/CalendarEvent";
import PatientsQueue from "../components/agenda/PatientsQueue";
import MonthHeader from "../components/comman/MonthHeader";
import Calendar from "../components/comman/Calendar";
import {
  addAppointmentDayApi,
  deleteAppointmentDayApi,
  getAppointmentDaysApi,
} from "../api/appointmentDay";
import { formatDate } from "../utils/date";
import { patientInit } from "../initData";
import { toastError, toastSuccess } from "../utils/toastify";
import { X } from "lucide-react";

export interface Event {
  id: string;
  date: Date;
  patientId: string;
  patientName: string;
  description?: string;
}
type TPatientData = {
  patient_id: string;
  name: string;
  appointment_type: string;
  description: string;
  time: string;
};

function Agenda() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [patientsQueue, setPatientsQueue] = useState<TPatientData[]>([]);
  const { patientInfo, setPatientInfo } = useClinic();
  const { darkMode } = useAppSettings();
  const navigate = useNavigate();

  const getAppointmentDays = async (date: string) => {
    try {
      const res = await getAppointmentDaysApi(date);
      console.log("res", res);

      res && setPatientsQueue(res);
    } catch (e) {
      console.error("Error getting appointment days:", e);
    }
  };
  const addAppointmentDay = async (data) => {
    try {
      const res = await addAppointmentDayApi(data);
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };
  const deleteAppointmentDay = async (patientId: string) => {
    try {
      const res = await deleteAppointmentDayApi(
        patientId,
        formatDate(selectedDate)
      );
      console.log(res);
      toastSuccess("The Appointment deleted successfly");
    } catch (e) {
      console.log(e);
      toastError("The Appointment deleted faild");
    }
  };
  useEffect(() => {
    setSelectedDate(new Date());
    getAppointmentDays(formatDate(currentDate));
  }, []);

  const nextMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const prevMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleDayClick = (day: number) => {
    // setPatientQueue(patientList);
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    getAppointmentDays(formatDate(clickedDate));
    setSelectedDate(clickedDate);
    if (patientInfo) setShowEventForm(true);
  };

  const closeForm = () => {
    setShowEventForm(false);
  };

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const addAppoimtmentDayHandler = (data: {
    appointment_type: string;
    description: string;
    time: string;
  }) => {
    const patientData = {
      ...data,

      patient_id: patientInfo?.id,
      name: patientInfo?.name,
    };
    const appointmentDay = {
      id: "",
      day: formatDate(selectedDate),
      patient_data: [patientData],
      time: data.time,
    };
    addAppointmentDay(appointmentDay);
    setShowEventForm(false);
    getAppointmentDays(formatDate(currentDate));
    setPatientInfo(patientInit);
  };

  const deletePatientHandler = (patientId: string) => {
    deleteAppointmentDay(patientId);
    getAppointmentDays(formatDate(currentDate));
  };

  return (
    <div className="container m-auto   p-4 relative">
      <div
        className=" w-7 h-7 flex items-center justify-center bg-white  rounded-md absolute right-0 top-0  cursor-pointer"
        onClick={() => navigate("/")}
      >
        <X
          className="w-full h-full rounded-md bg-red-500 text-white font-bold"
          size={20}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className={`${
            darkMode ? "bg-gray-800 text-white " : "bg-white"
          } w-full  rounded-lg shadow-md p-4 transition-colors
            duration-200 h-[50vh] flex flex-col`}
        >
          <MonthHeader
            prevMonth={prevMonth}
            nextMonth={nextMonth}
            monthName={monthName}
          />
          <Calendar currentDate={currentDate} onDayClick={handleDayClick} />
          {showEventForm && selectedDate && patientInfo?.id && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <CalendarEvent
                selectedDate={selectedDate}
                onAddAppoimtmentDate={addAppoimtmentDayHandler}
                onCancel={closeForm}
                patientId={patientInfo?.id}
              />
            </div>
          )}
        </div>
        <PatientsQueue
          patientsQueue={patientsQueue}
          deletePatient={deletePatientHandler}
          selectedDate={selectedDate}
          currentDate={currentDate}
        />
      </div>
    </div>
  );
}

export default Agenda;
