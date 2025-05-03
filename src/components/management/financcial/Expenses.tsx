import { useState, useEffect } from "react";
import { useAppSettings } from "../../../contextApi/appContext";
import { ChevronLeft, ChevronRight, Edit } from "lucide-react";
import { TExpenses } from "../../../types";
import {
  addExpensesApi,
  getExpensesByMonthApi,
  updateExpensesByIdApi,
} from "../../../api/expenses";
import { toast } from "react-toastify";

function Expenses() {
  const [expenses, setExpenses] = useState<TExpenses>({
    id: "",
    month: "",
    rent: "0",
    taxes: "0",
    electricity_invoice: "0",
    water_invoice: "0",
    phone_and_internet_invoice: "0",
    purchases: [],
    installments: [],
    other_expenses: [],
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { darkMode } = useAppSettings();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    loadExpenses();
  }, [currentDate]);

  const loadExpenses = async () => {
    try {
      const result = await getExpensesByMonthApi(monthName);
      if (result) {
        setExpenses(result);
        setIsEditMode(false); // Show presentation mode when data exists
      } else {
        // Reset form for new month
        setExpenses({
          id: "",
          month: monthName,
          rent: "0",
          taxes: "0",
          electricity_invoice: "0",
          water_invoice: "0",
          phone_and_internet_invoice: "0",
          purchases: [],
          installments: [],
          other_expenses: [],
        });
        setIsEditMode(true); // Show form mode when no data exists
      }
    } catch (error) {
      console.error("Error loading expenses:", error);
      toast.error("Failed to load expenses");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedExpenses = {
      ...expenses,
      month: monthName,
    };

    try {
      if (updatedExpenses.id) {
        // Update existing expenses
        const success = await updateExpensesByIdApi(
          updatedExpenses.id,
          updatedExpenses
        );
        if (success) {
          toast.success("Expenses updated successfully");
          setIsEditMode(false);
        } else {
          toast.error("Failed to update expenses");
        }
      } else {
        // Add new expenses
        const result = await addExpensesApi(updatedExpenses);
        if (result) {
          setExpenses(result);
          toast.success("Expenses added successfully");
          setIsEditMode(false);
        }
      }
      await loadExpenses();
    } catch (error) {
      console.error("Error saving expenses:", error);
      toast.error("Failed to save expenses");
    }
  };

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

  const handleInputChange = (field: keyof TExpenses, value: string | any[]) => {
    setExpenses((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayChange = (
    type: "purchases" | "installments" | "other_expenses",
    index: number,
    field: string,
    value: string
  ) => {
    setExpenses((prev) => {
      const items = [...(prev[type] || [])];
      items[index] = {
        ...items[index],
        [field]: value,
      };
      return {
        ...prev,
        [type]: items,
      };
    });
  };

  const handleCancel = () => {
    loadExpenses(); // This will reload the data and set isEditMode to false
  };

  const ExpensesPresentation = () => (
    <div className="grid grid-cols-4 gap-16 w-full p-8">
      <div className="col-span-1">
        <h3 className="font-semibold mb-4">Basic Expenses</h3>
        <div className="space-y-4">
          <div>
            <span className="font-medium">Rent:</span> {expenses.rent}
          </div>
          <div>
            <span className="font-medium">Taxes:</span> {expenses.taxes}
          </div>
          <div>
            <span className="font-medium">Electricity:</span>{" "}
            {expenses.electricity_invoice}
          </div>
          <div>
            <span className="font-medium">Water:</span> {expenses.water_invoice}
          </div>
          <div>
            <span className="font-medium">Phone & Internet:</span>{" "}
            {expenses.phone_and_internet_invoice}
          </div>
        </div>
      </div>

      <div className="col-span-3 grid grid-cols-3 gap-8">
        <div>
          <h3 className="font-semibold mb-4">Purchases</h3>
          {expenses.purchases?.map((purchase, index) => (
            <div key={index} className="mb-2">
              <span className="font-medium">{purchase.item_name}:</span>{" "}
              {purchase.price}
            </div>
          ))}
        </div>

        <div>
          <h3 className="font-semibold mb-4">Installments</h3>
          {expenses.installments?.map((installment, index) => (
            <div key={index} className="mb-2">
              <span className="font-medium">
                {installment.insinternet_name}:
              </span>{" "}
              {installment.value}
            </div>
          ))}
        </div>

        <div>
          <h3 className="font-semibold mb-4">Other Expenses</h3>
          {expenses.other_expenses?.map((other, index) => (
            <div key={index} className="mb-2">
              <span className="font-medium">{other.other_expense_name}:</span>{" "}
              {other.value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="bg-blue-600 text-white p-4 w-1/3 m-auto relative">
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

      {expenses.id && !isEditMode ? (
        <div className="relative">
          <button
            onClick={() => setIsEditMode(true)}
            className="absolute right-8 top-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Edit expenses"
          >
            <Edit size={20} className="hover:text-green-500" />
          </button>
          <ExpensesPresentation />
        </div>
      ) : (
        <form className="w-full flex flex-col gap-36" onSubmit={handleSubmit}>
          <div className="grid grid-cols-4 gap-16 w-full">
            <div className="col-span-1">
              <label htmlFor="rent" className="block w-full mt-4">
                Rent
                <input
                  type="number"
                  id="rent"
                  value={expenses.rent || ""}
                  className={`${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  } border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                  onChange={(e) => handleInputChange("rent", e.target.value)}
                />
              </label>

              <label htmlFor="taxes" className="block w-full mt-4">
                Taxes
                <input
                  type="number"
                  id="taxes"
                  value={expenses.taxes || ""}
                  className={`${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  } border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                  onChange={(e) => handleInputChange("taxes", e.target.value)}
                />
              </label>

              <label htmlFor="electricity" className="block w-full mt-4">
                Electricity Invoice
                <input
                  type="number"
                  id="electricity"
                  value={expenses.electricity_invoice || ""}
                  className={`${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  } border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                  onChange={(e) =>
                    handleInputChange("electricity_invoice", e.target.value)
                  }
                />
              </label>

              <label htmlFor="water" className="block w-full mt-4">
                Water Invoice
                <input
                  type="number"
                  id="water"
                  value={expenses.water_invoice || ""}
                  className={`${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  } border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                  onChange={(e) =>
                    handleInputChange("water_invoice", e.target.value)
                  }
                />
              </label>

              <label htmlFor="internet" className="block w-full mt-4">
                phone & Internet Invoice
                <input
                  type="number"
                  id="internet"
                  value={expenses.phone_and_internet_invoice || ""}
                  className={`${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  } border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                  onChange={(e) =>
                    handleInputChange(
                      "phone_and_internet_invoice",
                      e.target.value
                    )
                  }
                />
              </label>
            </div>
            <div className="col-span-3 flex gap-2 px-4 ">
              <div className="mt-4 max-h-[500px] overflow-y-scroll custom-scrollbar">
                <label htmlFor="services" className="block">
                  Purchases
                </label>

                {expenses.purchases.map((purchase, index) => (
                  <div className="flex gap-2" key={index}>
                    <input
                      type="text"
                      className={`${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      } border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 mb-2 pl-4 p-2.5 transition-colors duration-200`}
                      value={purchase.item_name}
                      placeholder="item"
                      onChange={(e) => {
                        handleArrayChange(
                          "purchases",
                          index,
                          "item_name",
                          e.target.value
                        );
                      }}
                    />
                    <input
                      type="number"
                      className={`${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      } border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/3 mb-2 pl-4 p-2.5 transition-colors duration-200`}
                      value={purchase.price}
                      placeholder="Price"
                      onChange={(e) => {
                        handleArrayChange(
                          "purchases",
                          index,
                          "price",
                          e.target.value
                        );
                      }}
                    />
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={(e) => {
                        e.preventDefault();
                        setExpenses((prev) => ({
                          ...prev,
                          purchases: prev.purchases.filter(
                            (_, i) => i !== index
                          ),
                        }));
                      }}
                    >
                      x
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setExpenses((prev) => ({
                      ...prev,
                      purchases: [
                        ...prev.purchases,
                        { item_name: "", price: "0" },
                      ],
                    }));
                  }}
                  className="text-blue-500 hover:text-blue-600 mt-2"
                >
                  + Add Purchase
                </button>
              </div>

              <div className="mt-4 max-h-[500px] overflow-y-scroll custom-scrollbar">
                <label htmlFor="services" className="block">
                  Installments
                </label>

                {expenses.installments.map((installment, index) => (
                  <div className="flex gap-2" key={index}>
                    <input
                      type="text"
                      className={`${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      } border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 mb-2 pl-4 p-2.5 transition-colors duration-200`}
                      value={installment.insinternet_name}
                      placeholder="installment name"
                      onChange={(e) => {
                        handleArrayChange(
                          "installments",
                          index,
                          "insinternet_name",
                          e.target.value
                        );
                      }}
                    />
                    <input
                      type="number"
                      className={`${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      } border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/3 mb-2 pl-4 p-2.5 transition-colors duration-200`}
                      value={installment.value}
                      placeholder="value"
                      onChange={(e) => {
                        handleArrayChange(
                          "installments",
                          index,
                          "value",
                          e.target.value
                        );
                      }}
                    />
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={(e) => {
                        e.preventDefault();
                        setExpenses((prev) => ({
                          ...prev,
                          installments: prev.installments.filter(
                            (_, i) => i !== index
                          ),
                        }));
                      }}
                    >
                      x
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setExpenses((prev) => ({
                      ...prev,
                      installments: [
                        ...prev.installments,
                        { insinternet_name: "", value: "0" },
                      ],
                    }));
                  }}
                  className="text-blue-500 hover:text-blue-600 mt-2"
                >
                  + Add Installment
                </button>
              </div>
              <div className="mt-4 max-h-[500px] overflow-y-scroll custom-scrollbar">
                <label htmlFor="services" className="block">
                  Other Expenses
                </label>
                {expenses.other_expenses.map((otherExpense, index) => (
                  <div className="flex gap-2" key={index}>
                    <input
                      type="text"
                      className={`${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      } border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 mb-2 pl-4 p-2.5 transition-colors duration-200`}
                      value={otherExpense.other_expense_name}
                      placeholder="other expense "
                      onChange={(e) => {
                        handleArrayChange(
                          "other_expenses",
                          index,
                          "other_expense_name",
                          e.target.value
                        );
                      }}
                    />

                    <input
                      type="number"
                      className={`${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      } border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/3 mb-2 pl-4 p-2.5 transition-colors duration-200`}
                      value={otherExpense.value}
                      placeholder="value"
                      onChange={(e) => {
                        handleArrayChange(
                          "other_expenses",
                          index,
                          "value",
                          e.target.value
                        );
                      }}
                    />
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={(e) => {
                        e.preventDefault();
                        setExpenses((prev) => ({
                          ...prev,
                          other_expenses: prev.other_expenses.filter(
                            (_, i) => i !== index
                          ),
                        }));
                      }}
                    >
                      x
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setExpenses((prev) => ({
                      ...prev,
                      other_expenses: [
                        ...prev.other_expenses,
                        { other_expense_name: "", value: "0" },
                      ],
                    }));
                  }}
                  className="text-blue-500 hover:text-blue-600 mt-2"
                >
                  + Add Other Expense
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <button
              type="submit"
              className="mt-8 py-4 px-8 bg-green-500 rounded-lg w-1/3 m-auto  text-white  hover:bg-green-600 transition-colors "
            >
              Save
            </button>
            {expenses.id && (
              <button
                type="button"
                onClick={handleCancel}
                // className="py-4 px-8 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"

                className="mt-8 py-4 px-8 bg-red-500 rounded-lg w-1/3 m-auto text-white  hover:bg-red-600 transition-colors "
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

export default Expenses;
