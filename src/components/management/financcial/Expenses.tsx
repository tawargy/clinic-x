import { useState } from "react";
import { useAppSettings } from "../../../contextApi/appContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Purchase = {
  item_name: string;
  price: number;
};

type Installment = {
  insinternet_name: string;
  value: number;
};
type OtherExpense = {
  other_expense_name: string;
  value: number;
};
type TExpenses = {
  id: string;
  month: string;
  rent: number;
  taxes: number;
  electricity_invoice: number;
  water_invoice: number;
  phone_and_internet_invoice: number;
  purchases: Array<Purchase>;
  installments: Array<Installment>;
  other_expenses: Array<OtherExpense>;
};

function Expenses() {
  const [expenses, setExpenses] = useState<TExpenses>({
    id: "",
    month: "",
    rent: 0,
    taxes: 0,
    electricity_invoice: 0,
    water_invoice: 0,
    phone_and_internet_invoice: 0,
    purchases: [{ item_name: "", price: 0 }],
    installments: [{ insinternet_name: "", value: 0 }],
    other_expenses: [{ other_expense_name: "", value: 0 }],
  });
  const [purchases, setPurchases] = useState<Array<Purchase>>([]);
  const [installments, setInstallments] = useState<Array<Installment>>([]);
  const [otherExpenses, setOtherExpenses] = useState<Array<OtherExpense>>([]);
  const { darkMode } = useAppSettings();

  const [currentDate, setCurrentDate] = useState(new Date());

  const submetHandler = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedExpenses = {
      ...expenses,
      month: monthName,
      purchases: purchases,
      installments: installments,
      other_expenses: otherExpenses,
    };
    console.log(updatedExpenses);
  };
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
      <div className="bg-blue-600 text-white p-4 w-1/3 m-auto">
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
      <form className="w-full flex flex-col gap-36" onSubmit={submetHandler}>
        <div className="grid grid-cols-4 gap-16 w-full">
          <div className="col-span-1">
            <label htmlFor="Rent" className="block w-full mt-4">
              Rent
              <input
                type="number"
                id="rent"
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"} border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                onChange={(e) =>
                  setExpenses({
                    ...expenses,
                    rent: Number(e.target.value),
                  })
                }
              />
            </label>
            <label htmlFor="electricity" className="block w-full mt-4">
              Electricity Invoice
              <input
                type="number"
                id="electricity"
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"} border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                onChange={(e) =>
                  setExpenses({
                    ...expenses,
                    electricity_invoice: Number(e.target.value),
                  })
                }
              />
            </label>

            <label htmlFor="water" className="block w-full mt-4">
              Water Invoice
              <input
                type="number"
                id="water"
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"} border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                onChange={(e) =>
                  setExpenses({
                    ...expenses,
                    water_invoice: Number(e.target.value),
                  })
                }
              />
            </label>

            <label htmlFor="internet" className="block w-full mt-4">
              phone & Internet Invoice
              <input
                type="number"
                id="internet"
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"} border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                onChange={(e) =>
                  setExpenses({
                    ...expenses,
                    phone_and_internet_invoice: Number(e.target.value),
                  })
                }
              />
            </label>
          </div>
          <div className="col-span-3 flex gap-2 px-4 ">
            <div className="mt-4 max-h-[500px] overflow-y-scroll custom-scrollbar">
              <label htmlFor="services" className="block">
                Purchases
              </label>

              {purchases.map((purchase, index) => (
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
                      const updatedPurchases = [...purchases];
                      updatedPurchases[index] = {
                        ...purchase,
                        item_name: e.target.value,
                      };
                      setPurchases(updatedPurchases);
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
                      const updatedPurchases = [...purchases];
                      updatedPurchases[index] = {
                        ...purchase,
                        price: Number(e.target.value),
                      };
                      setPurchases(updatedPurchases);
                    }}
                  />
                  <button
                    type="button"
                    className="text-red-500"
                    onClick={(e) => {
                      e.preventDefault();
                      setPurchases(purchases.filter((_, i) => i !== index));
                    }}
                  >
                    x
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setPurchases([
                    ...purchases,
                    { item_name: "", price: 0 }, // Initialize with empty name and 0 vees
                  ]);
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

              {installments.map((installment, index) => (
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
                      const updatedInstallments = [...installments];
                      updatedInstallments[index] = {
                        ...installment,
                        insinternet_name: e.target.value,
                      };
                      setInstallments(updatedInstallments);
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
                      const updatedInstallments = [...installments];
                      updatedInstallments[index] = {
                        ...installment,
                        value: Number(e.target.value),
                      };
                      setInstallments(updatedInstallments);
                    }}
                  />
                  <button
                    type="button"
                    className="text-red-500"
                    onClick={(e) => {
                      e.preventDefault();
                      setInstallments(
                        installments.filter((_, i) => i !== index),
                      );
                    }}
                  >
                    x
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setInstallments([
                    ...installments,
                    { insinternet_name: "", value: 0 }, // Initialize with empty name and 0 vees
                  ]);
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
              {otherExpenses.map((otherExpense, index) => (
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
                      const updatedOtherExpenses = [...otherExpenses];
                      updatedOtherExpenses[index] = {
                        ...otherExpense,
                        other_expense_name: e.target.value,
                      };
                      setOtherExpenses(updatedOtherExpenses);
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
                      const updatedOtherExpenses = [...otherExpenses];
                      updatedOtherExpenses[index] = {
                        ...otherExpense,
                        value: Number(e.target.value),
                      };
                      setOtherExpenses(updatedOtherExpenses);
                    }}
                  />
                  <button
                    type="button"
                    className="text-red-500"
                    onClick={(e) => {
                      e.preventDefault();
                      setOtherExpenses(
                        otherExpenses.filter((_, i) => i !== index),
                      );
                    }}
                  >
                    x
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setOtherExpenses([
                    ...otherExpenses,
                    { other_expense_name: "", value: 0 }, // Initialize with empty name and 0 vees
                  ]);
                }}
                className="text-blue-500 hover:text-blue-600 mt-2"
              >
                + Add Other Expense
              </button>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="py-4 px-8 bg-green-500 rounded-lg w-1/6 m-auto"
        >
          Save
        </button>
      </form>
    </div>
  );
}

export default Expenses;
