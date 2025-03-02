import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Calendar from "../components/Calendar";
import CalendarEvent from "../components/CalendarEvent";
import { useClinic } from "../contextApi/clinicContext";
import { useAppSettings } from "../contextApi/appContext";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

export interface Event {
  id: string;
  date: Date;
  patientId: string;
  patientName: string;
  description?: string;
}

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
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

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    setSelectedDate(clickedDate);
    if (patientInfo) setShowEventForm(true);
  };

  const addEvent = (event: Omit<Event, "id" | "date">) => {
    // TODO: add appointment date for this patient
    if (!selectedDate) return;

    const newEvent: Event = {
      id: Date.now().toString(),
      date: selectedDate,
      ...event,
    };
    console.log(newEvent);

    setEvents((prevEvents) => [...prevEvents, newEvent]);
    setShowEventForm(false);
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
          {showEventForm && selectedDate && patientInfo && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <CalendarEvent
                selectedDate={selectedDate}
                onSubmit={addEvent}
                onCancel={closeForm}
                patientId={patientInfo?.id || ""}
                patientName={patientInfo?.name}
              />
            </div>
          )}
        </div>
        <div
          className={`${darkMode ? "bg-gray-800 text-white " : "bg-white"} w-full  rounded-lg shadow-md p-4 transition-colors duration-200 h-[calc(100vh-120px)] flex flex-col`}
        >
          Queue
        </div>
      </div>
    </div>
  );
}

export default App;
