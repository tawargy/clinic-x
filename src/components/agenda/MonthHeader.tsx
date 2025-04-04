import { ChevronRight, ChevronLeft } from "lucide-react";

type TProps = {
  prevMonth: () => void;
  nextMonth: () => void;
  monthName: string;
};

function MonthHeader({ prevMonth, nextMonth, monthName }: TProps) {
  return (
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
  );
}

export default MonthHeader;
