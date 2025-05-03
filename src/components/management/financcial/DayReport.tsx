import { useState, useEffect } from "react";
import Calendar from "../../comman/Calendar";
import MonthHeader from "../../comman/MonthHeader";
import { getAppointmentFeesByDateApi } from "../../../api/appointmentFees";
import { formatDate } from "../../../utils/date";
import { TAppointmentFees } from "../../../types";
import { useAppSettings } from "../../../contextApi/appContext";
import { totalFees } from "../../../utils/totalFees";

function DayReport() {
  const [currentDate, setCurrentMonth] = useState(new Date());
  const [selectedDayFees, setSelectedDayFees] = useState<TAppointmentFees[]>(
    []
  );
  const [selectedDate, setSelectedDate] = useState<string>("");
  const { darkMode } = useAppSettings();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const loadAppointmentFees = async (date: string) => {
    try {
      const res = await getAppointmentFeesByDateApi(date);
      if (res) {
        setSelectedDayFees(res);
      } else {
        setSelectedDayFees([]);
      }
    } catch (e) {
      console.error("Error fetching appointment fees:", e);
      setSelectedDayFees([]);
    }
  };

  // Load initial data when component mounts
  useEffect(() => {
    const today = formatDate(new Date());
    setSelectedDate(today);
    loadAppointmentFees(today);
  }, []);

  const nextMonth = () => {
    setCurrentMonth((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const prevMonth = () => {
    setCurrentMonth((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleDayClick = async (day: number) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const formattedDate = formatDate(clickedDate);
    setSelectedDate(formattedDate);
    loadAppointmentFees(formattedDate);
  };

  return (
    <div className="flex gap-8">
      <div className="w-1/4">
        <MonthHeader
          nextMonth={nextMonth}
          prevMonth={prevMonth}
          monthName={monthName}
        />
        <Calendar
          currentDate={currentDate}
          onDayClick={(day) => handleDayClick(day)}
        />
      </div>
      <div className="w-3/4">
        {selectedDate && (
          <div className="p-4">
            {selectedDayFees.length > 0 && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <p className="text-lg font-semibold flex justify-between items-center">
                  <span>Total Income for {selectedDate}</span>
                  <span className="text-green-600 dark:text-green-400 text-xl">
                    {selectedDayFees
                      .reduce((total, fee) => total + totalFees(fee), 0)
                      .toFixed(2)}
                  </span>
                </p>
              </div>
            )}

            {selectedDayFees.length > 0 ? (
              <div className="space-y-4  h-[500px] max-h-[500px] overflow-y-auto ">
                {selectedDayFees.map((fee) => (
                  <div
                    key={fee.id}
                    className={`p-4 rounded-lg ${
                      darkMode ? "bg-gray-800" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-lg">
                          {fee.patient_name}
                        </h4>
                        <p className="text-gray-500">{fee.appointment_type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">Base Fee: {fee.fee}</p>
                        <p className="text-green-500 font-semibold">
                          Total: {totalFees(fee)}
                        </p>
                      </div>
                    </div>
                    {fee.services.length > 0 && (
                      <div className="mt-2">
                        <p className="font-medium mb-1">Services:</p>
                        <ul className="space-y-1">
                          {fee.services.map((service, index) => (
                            <li key={index} className="flex justify-between">
                              <span>{service.service_name}</span>
                              <span>{service.service_fee}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No appointments found for this date
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DayReport;
