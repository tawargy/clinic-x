import { useState } from "react";
import { useAppSettings } from "../../contextApi/appContext";
import PrescriptionsPrint from "./PrescriptionsPrint";
import { X } from "lucide-react";
import { TPrescription } from "../../types";
import { getDrug } from "../../utils/drug";

import Select from "react-select";
type Tprops = {
  addPrescriptionHandler: (prescription: TPrescription[]) => void;
  setIsOpen: (isOpen: boolean) => void;
};

const prescriptionsInit = {
  name: "",
  dosage: "10mg",
  frequency: "daily",
  duration: "1 month",
};
function Prescriptions({ addPrescriptionHandler, setIsOpen }: Tprops) {
  const [prescriptions, setPrescriptions] = useState<TPrescription[]>([]);
  const [medicine, setMedicine] = useState<TPrescription>(prescriptionsInit);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    const matchingDrugs = getDrug(value);
    setSuggestions(matchingDrugs);
  };
  const { darkMode } = useAppSettings();
  const onChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setMedicine({ ...medicine, [name]: value });
  };
  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setPrescriptions([...prescriptions, medicine]);
    setMedicine(prescriptionsInit);
  };
  const saveAndCloseHandler = () => {
    addPrescriptionHandler(prescriptions);

    setIsOpen(false);
  };

  const handleSelectChange = (selectedOption: any, actionMeta: any) => {
    setMedicine((prev) => ({
      ...prev,
      [actionMeta.name]: selectedOption.value,
    }));
  };
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: darkMode ? "#374151" : "#F9FAFB",
      borderColor: darkMode ? "#4B5563" : "#D1D5DB",
      color: darkMode ? "white" : "black",
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: darkMode ? "#374151" : "#F9FAFB",
    }),
    option: (provided: any, state: any) => ({
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

  const frequencyOptions = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  const durationOptions = [
    { value: "1 month", label: "1 month" },
    { value: "2 month", label: "2 month" },
    { value: "3 month", label: "3 month" },
    { value: "4 month", label: "4 month" },
    { value: "5 month", label: "5 month" },
  ];

  return (
    <div className="flex  justify-center gap-4 min-h-screen p-4 ">
      <div className="flex w-full gap-4 max-w-7xl relative">
        <div
          className=" w-7 h-7 flex items-center justify-center bg-white  rounded-md absolute right-0 top-0  cursor-pointer"
          onClick={() => setIsOpen(false)}
        >
          <X
            className="w-full h-full rounded-md bg-red-500 text-white font-bold"
            size={20}
          />
        </div>
        <div
          className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-xl p-6 w-full `}
        >
          <form className=" w-1/2 m-auto mt-60 " onSubmit={onSubmitHandler}>
            {/* <label className="text-gray-500 text-sm block mt-4">
              Medcicn Name
            </label>
            <input
              className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"}
                  border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
              type="text"
              name="name"
              value={medicine.name}
              id="name"
              placeholder="Midicnt Name"
              onChange={onChangeHandler}
            />
            <label className="text-gray-500 text-sm block mt-4">Dosage</label> */}
            <div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Search drug..."
              />

              {/* Display suggestions */}
              {suggestions.length > 0 && (
                <ul className="suggestions-list">
                  {suggestions.map((drug, index) => (
                    <li key={index}>{drug.name}</li>
                  ))}
                </ul>
              )}
            </div>
            <Select
              styles={customStyles}
              options={dosageOptions}
              name="dosage"
              value={dosageOptions.find(
                (option) => option.value === medicine.dosage,
              )}
              onChange={(option, actionMeta) =>
                handleSelectChange(option, actionMeta)
              }
            />
            <label className="text-gray-500 text-sm block mt-4">
              Frequency
            </label>

            <Select
              styles={customStyles}
              options={frequencyOptions}
              name="frequency"
              value={frequencyOptions.find(
                (option) => option.value === medicine.frequency,
              )}
              onChange={(option, actionMeta) =>
                handleSelectChange(option, actionMeta)
              }
            />
            <label className="text-gray-500 text-sm block mt-4">Duration</label>

            <Select
              styles={customStyles}
              options={durationOptions}
              name="duration"
              value={durationOptions.find(
                (option) => option.value === medicine.duration,
              )}
              onChange={(option, actionMeta) =>
                handleSelectChange(option, actionMeta)
              }
            />
            <button
              type="submit"
              className="bg-blue-400 block w-1/3 m-auto mt-6  py-3 px-8 rounded-md  text-white hover:bg-blue-500"
            >
              Add
            </button>
          </form>
        </div>
        <PrescriptionsPrint
          prescriptions={prescriptions}
          saveAndCloseHandler={saveAndCloseHandler}
        />
      </div>
    </div>
  );
}

export default Prescriptions;
