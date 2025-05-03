import { useState } from "react";
import { useAppSettings } from "../../contextApi/appContext";
import PrescriptionsPrint from "../comman/PrescriptionsPrint";
import { X } from "lucide-react";
import { TPrescription } from "../../types";
import { getDrug } from "../../utils/drug";
import Select, { SingleValue, ActionMeta } from "react-select";
import Rx from "../../assets/rx.png";

type Drug = {
  name: string;
};

type Tprops = {
  addPrescriptionHandler: (prescription: TPrescription[]) => void;
  setIsOpen: (isOpen: boolean) => void;
};

const prescriptionsInit: TPrescription = {
  name: "",
  dosage: "10mg",
  duration: "1 month",
};

function Prescriptions({ addPrescriptionHandler, setIsOpen }: Tprops) {
  const [prescriptions, setPrescriptions] = useState<TPrescription[]>([]);
  const [medicine, setMedicine] = useState<TPrescription>(prescriptionsInit);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Drug[]>([]);
  const { darkMode } = useAppSettings();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    const matchingDrugs = getDrug(value);
    setSuggestions(matchingDrugs);
  };

  const handleSelectChange = (
    selectedOption: SingleValue<{ value: string; label: string }>,
    actionMeta: ActionMeta<{ value: string; label: string }>
  ) => {
    if (selectedOption && actionMeta.name) {
      const fieldName = actionMeta.name as keyof TPrescription;
      setMedicine((prev) => ({
        ...prev,
        [fieldName]: selectedOption.value,
      }));
    }
  };

  const handleSuggestionClick = (drugName: string) => {
    setSearchTerm(drugName);
    setMedicine((prev) => ({ ...prev, name: drugName }));
    setSuggestions([]);
  };

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPrescriptions([...prescriptions, medicine]);
    setMedicine(prescriptionsInit);
    setSearchTerm("");
  };

  const saveAndCloseHandler = () => {
    addPrescriptionHandler(prescriptions);
    setIsOpen(false);
  };

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: darkMode ? "#374151" : "#F9FAFB",
      borderColor: darkMode ? "#4B5563" : "#D1D5DB",
      color: darkMode ? "white" : "black",
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: darkMode ? "#374151" : "#F9FAFB",
    }),
    option: (provided: any, state: { isSelected: boolean }) => ({
      ...provided,
      backgroundColor: darkMode
        ? state.isSelected
          ? "#4B5563"
          : "#374151"
        : state.isSelected
        ? "#E5E7EB"
        : "#F9FAFB",
      color: darkMode ? "white" : "black",
      "&:hover": {
        backgroundColor: darkMode ? "#4B5563" : "#E5E7EB",
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: darkMode ? "white" : "black",
    }),
  };

  const dosageOptions = [
    { value: "10mg", label: "10mg" },
    { value: "20mg", label: "20mg" },
    { value: "30mg", label: "30mg" },
    { value: "40mg", label: "40mg" },
    { value: "50mg", label: "50mg" },
  ];

  const durationOptions = [
    { value: "1 month", label: "1 month" },
    { value: "2 month", label: "2 month" },
    { value: "3 month", label: "3 month" },
    { value: "4 month", label: "4 month" },
    { value: "5 month", label: "5 month" },
  ];

  return (
    <div className="flex justify-center gap-4 min-h-screen p-4">
      <div className="flex w-full gap-4 max-w-7xl relative">
        <div
          className="w-7 h-7 flex items-center justify-center bg-white rounded-md absolute right-0 top-0 cursor-pointer"
          onClick={() => setIsOpen(false)}
        >
          <X
            className="w-full h-full rounded-md bg-red-500 text-white font-bold"
            size={20}
          />
        </div>
        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow-xl p-6 w-full`}
        >
          <form className="w-1/2 m-auto mt-60" onSubmit={onSubmitHandler}>
            <div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Search drug..."
                className={`${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }
                  border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
              />

              {suggestions.length > 0 && (
                <ul className="suggestions-list max-h-[200px] overflow-y-auto bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg mt-1">
                  {suggestions.map((drug, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick(drug.name)}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                    >
                      {drug.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-4">
              <label className="text-gray-500 text-sm block mb-2">Dosage</label>
              <Select
                styles={customStyles}
                options={dosageOptions}
                name="dosage"
                value={dosageOptions.find(
                  (option) => option.value === medicine.dosage
                )}
                onChange={(option, actionMeta) =>
                  handleSelectChange(option, actionMeta)
                }
              />
            </div>

            <div className="mt-4">
              <label className="text-gray-500 text-sm block mb-2">
                Duration
              </label>
              <Select
                styles={customStyles}
                options={durationOptions}
                name="duration"
                value={durationOptions.find(
                  (option) => option.value === medicine.duration
                )}
                onChange={(option, actionMeta) =>
                  handleSelectChange(option, actionMeta)
                }
              />
            </div>

            <button
              type="submit"
              className="bg-blue-400 block w-1/3 m-auto mt-6 py-3 px-8 rounded-md text-white hover:bg-blue-500"
            >
              Add
            </button>
          </form>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Current Prescriptions</h3>
            {prescriptions.map((p, i) => (
              <div
                key={i}
                className={`${
                  darkMode ? "border-gray-700" : "border-gray-300"
                } border mb-2 rounded-lg p-4`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="flex items-center gap-2">
                    <img src={Rx} alt="Rx" className="w-[20px] h-[20px]" />
                    <span>{p.name}</span>
                  </h4>
                </div>
                <p className="flex gap-4 text-gray-500 mt-2">
                  <span>Dosage: {p.dosage}</span>
                  <span>Duration: {p.duration}</span>
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={saveAndCloseHandler}
            className="bg-green-500 text-white px-6 py-2 rounded-md mt-4 hover:bg-green-600"
          >
            Save & Close
          </button>
        </div>
        <div className="w-1/2">
          <PrescriptionsPrint
            setIsOpen={setIsOpen}
            visitDate={new Date().toISOString()}
            printDate={new Date()}
            prescriptions={prescriptions}
          />
        </div>
      </div>
    </div>
  );
}

export default Prescriptions;
