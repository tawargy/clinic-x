import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function SummaryMont() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
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
  return (
    <div>
      <div className="bg-blue-600 text-white p-4 w-1/2">
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
    </div>
  );
}

export default SummaryMont;
