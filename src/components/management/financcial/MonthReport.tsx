import { useState, useEffect } from "react";
import { useAppSettings } from "../../../contextApi/appContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TExpenses, TAppointmentFees } from "../../../types";
import { getExpensesByMonthApi } from "../../../api/expenses";
import { formatDate } from "../../../utils/date";
import { getAppointmentFeesByMonthApi } from "../../../api/appointmentFees";
import { totalFees } from "../../../utils/totalFees";

function MonthReport() {
  const { darkMode } = useAppSettings();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [expenses, setExpenses] = useState<TExpenses | null>(null);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [appointmentFees, setAppointmentFees] = useState<TAppointmentFees[]>(
    []
  );
  const [totalIncome, setTotalIncome] = useState(0);

  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const calculateTotalExpenses = (expenses: TExpenses) => {
    let total = 0;

    // Add basic expenses
    total += parseFloat(expenses.rent || "0");
    total += parseFloat(expenses.taxes || "0");
    total += parseFloat(expenses.electricity_invoice || "0");
    total += parseFloat(expenses.water_invoice || "0");
    total += parseFloat(expenses.phone_and_internet_invoice || "0");

    // Add purchases
    expenses.purchases?.forEach((purchase) => {
      total += parseFloat(purchase.price || "0");
    });

    // Add installments
    expenses.installments?.forEach((installment) => {
      total += parseFloat(installment.value || "0");
    });

    // Add other expenses
    expenses.other_expenses?.forEach((expense) => {
      total += parseFloat(expense.value || "0");
    });

    return total;
  };

  const calculateTotalIncome = (fees: TAppointmentFees[]) => {
    return fees.reduce((total, appointment) => {
      return total + totalFees(appointment);
    }, 0);
  };

  const loadExpenses = async () => {
    try {
      const result = await getExpensesByMonthApi(monthName);
      if (result && result.id) {
        // Only set expenses if we have valid data with an ID
        setExpenses(result);
        const total = calculateTotalExpenses(result);
        setTotalExpenses(total);
      } else {
        setExpenses(null);
        setTotalExpenses(0);
      }
    } catch (error) {
      console.error("Error loading expenses:", error);
      setExpenses(null);
      setTotalExpenses(0);
    }
  };

  const loadIncome = async () => {
    const month = formatDate(currentMonth);
    try {
      const result = await getAppointmentFeesByMonthApi(month);
      if (result && result.length > 0) {
        setAppointmentFees(result);
        const total = calculateTotalIncome(result);
        setTotalIncome(total);
      } else {
        setAppointmentFees([]);
        setTotalIncome(0);
      }
    } catch (error) {
      console.error("Error loading income:", error);
      setAppointmentFees([]);
      setTotalIncome(0);
    }
  };

  useEffect(() => {
    loadExpenses();
    loadIncome();
  }, [monthName]);

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

  return (
    <div>
      <div className="bg-blue-600 text-white p-4 w-1/4 m-auto">
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
      <div className="mt-8 p-4">
        <div className="grid grid-cols-2 gap-8">
          <div
            className={`${
              darkMode ? "bg-gray-700" : "bg-gray-50"
            } p-4 rounded-lg`}
          >
            <h4 className="text-lg font-semibold mb-4">Total Income</h4>
            {appointmentFees.length > 0 ? (
              <>
                <p className="text-2xl font-bold text-green-500">
                  {totalIncome.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Total appointments: {appointmentFees.length}
                </p>
              </>
            ) : (
              <p className="text-gray-500 text-lg">
                No income yet for {monthName}
              </p>
            )}
          </div>

          <div
            className={`${
              darkMode ? "bg-gray-700" : "bg-gray-50"
            } p-4 rounded-lg`}
          >
            <h4 className="text-lg font-semibold mb-4">Total Expenses</h4>
            {expenses && expenses.id ? (
              <>
                <p className="text-2xl font-bold text-red-500">
                  {totalExpenses.toFixed(2)}
                </p>
                <div className="mt-4 space-y-2">
                  <p>
                    <span className="font-medium">Rent:</span>{" "}
                    {expenses.rent || 0}
                  </p>
                  <p>
                    <span className="font-medium">Taxes:</span>{" "}
                    {expenses.taxes || 0}
                  </p>
                  <p>
                    <span className="font-medium">Electricity:</span>{" "}
                    {expenses.electricity_invoice || 0}
                  </p>
                  <p>
                    <span className="font-medium">Water:</span>{" "}
                    {expenses.water_invoice || 0}
                  </p>
                  <p>
                    <span className="font-medium">Phone & Internet:</span>{" "}
                    {expenses.phone_and_internet_invoice || 0}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-lg">
                No expenses yet for {monthName}
              </p>
            )}
          </div>

          <div
            className={`${
              darkMode ? "bg-gray-700" : "bg-gray-50"
            } p-4 rounded-lg col-span-2`}
          >
            <h4 className="text-lg font-semibold mb-4">Net Income</h4>
            <p
              className={`text-2xl font-bold ${
                totalIncome - totalExpenses >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {(totalIncome - totalExpenses).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonthReport;
