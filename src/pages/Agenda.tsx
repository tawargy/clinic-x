import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Calendar from "../components/Calendar";
import CalendarEvent from "../components/CalendarEvent";
import { useClinic } from "../contextApi/clinicContext";
import { useAppSettings } from "../contextApi/appContext";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { formatDate } from "../utils/date";
import { invoke } from "@tauri-apps/api/core";

import { toastError, toastSuccess } from "../utils/toastify";
export interface Event {
  id: string;
  date: Date;
  patientId: string;
  patientName: string;
  description?: string;
}
type Patient = {
  id: string;
  name: string;
};

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [patientQueue, setPatientQueue] = useState([]);
  const { patientInfo, setPatientInfo } = useClinic();
  const { darkMode } = useAppSettings();
  const navigate = useNavigate();

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
  const getAppointmentDays = async (date) => {
    try {
      const res = await invoke("get_appointment_days", {
        date,
      });
      console.log(res);
      if (res) {
        setPatientQueue(res.patient_data);
      } else {
        setPatientQueue([]);
      }
    } catch (e) {
      console.error("Error getting appointment days:", e);
    }
  };
  useEffect(() => {
    getAppointmentDays(formatDate(currentDate));
  }, []);

  const handleDayClick = (day: number) => {
    // setPatientQueue(patientList);
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
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

  // Get events for the current month
  const currentMonthEvents = events.filter(
    (event) =>
      event.date.getMonth() === currentDate.getMonth() &&
      event.date.getFullYear() === currentDate.getFullYear(),
  );
  const addAppointmentDay = async (data) => {
    try {
      const res = await invoke("add_appointment_day", {
        appointmentDay: data,
      });
      console.log(res);
      toastSuccess("Appointment saved successfully!");
    } catch (e) {
      toastError("Faild to save");
      console.error("Error saving appointment:", e);
    }
  };
  const onAddAppoimtmentDate = (data: {
    appointment_type: string;
    description: string;
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
    };
    addAppointmentDay(appointmentDay);

    setShowEventForm(false);
  };
  const deleteAppointmentDay = async (patientId: string) => {
    try {
      const res = await invoke("remove_patient_from_appointment_day", {
        day: formatDate(selectedDate), // Format date as needed
        patientId: patientId,
      });
      console.log(res);
      toastSuccess("Patient removed from appointment day successfully!");
    } catch (e) {
      toastError("Faild to remove patient from appointment day");
      console.error("Error removing patient from appointment day:", e);
    }
  };

  const deletePatientHandler = (patientId: string) => {
    deleteAppointmentDay(patientId);
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
          className={`${darkMode ? "bg-gray-800 text-white " : "bg-white"} w-full  rounded-lg shadow-md p-4 transition-colors duration-200 h-[calc(100vh-120px)] flex flex-col`}
        >
          <div className="bg-blue-600 text-white p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={prevMonth}
                className="p-2 rounded-full hover:bg-blue-700 transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft size={24} />
              </button>
              <h1 className="text-xl font-bold">{monthName}</h1>
              <button
                onClick={nextMonth}
                className="p-2 rounded-full hover:bg-blue-700 transition-colors"
                aria-label="Next month"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
          <Calendar
            currentDate={currentDate}
            events={currentMonthEvents}
            onDayClick={handleDayClick}
          />
          {showEventForm && selectedDate && patientInfo?.id && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <CalendarEvent
                selectedDate={selectedDate}
                onAddAppoimtmentDate={onAddAppoimtmentDate}
                onCancel={closeForm}
              />
            </div>
          )}
        </div>
        <div
          className={`${darkMode ? "bg-gray-800 text-white " : "bg-white"} w-full  rounded-lg shadow-md p-4 transition-colors duration-200 h-[calc(100vh-120px)] flex flex-col`}
        >
          <h3 className="text-center py-4 text-lg">
            {" "}
            {formatDate(selectedDate)}
            <span className="text-blue-500 rounded-full bg-green-200 px-2 w-[30px] h-[30px] inline-flex justify-center items-center itext-lg ml-4">
              {patientQueue?.length}
            </span>
          </h3>
          <ul className=" p-4 w-[90%] lg:w-[70%] mt-2 mx-auto overflow-y-auto custom-scrollbar ">
            {patientQueue?.map((patient) => (
              <li
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"}} flex items-center justify-between bg-blue-100 p-2 lg:p-4 mb-4 rounded-md`}
                key={patient.patient_id}
              >
                <p> {patient.name}</p>
                <button>
                  <X
                    className="w-full h-full rounded-md bg-red-500 text-white font-bold"
                    size={20}
                    onClick={() => deletePatientHandler(patient.patient_id)}
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
