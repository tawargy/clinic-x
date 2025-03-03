import React from "react";
import { useAppSettings } from "../contextApi/appContext";

interface CalendarProps {
  currentDate: Date;
  events: Event[];
  onDayClick: (day: number) => void;
}

const Calendar: React.FC<CalendarProps> = ({ currentDate, onDayClick }) => {
  const { darkMode } = useAppSettings();
  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week for first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  // Create calendar days array
  const days = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-10 text-center"></div>);
  }

  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday =
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year;

    days.push(
      <div
        key={`day-${day}`}
        onClick={() => onDayClick(day)}
        className={`h-10 text-center flex flex-col items-center justify-center relative cursor-pointer
          ${isToday ? "bg-blue-100 text-blue-800 font-bold rounded-full" : "hover:bg-gray-100"} ${darkMode ? "hover:text-gray-800" : ""}`}
      >
        {day}
      </div>,
    );
  }

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="p-4">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day) => (
          <div key={day} className="text-center font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">{days}</div>
    </div>
  );
};

export default Calendar;
