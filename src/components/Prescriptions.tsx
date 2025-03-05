import { useState } from "react";
import { useAppSettings } from "../contextApi/appContext";
import PrescriptionsPrint from "./PrescriptionsPrint";
import { X } from "lucide-react";

type Tprops = {
  setIsOpen: (isOpen: boolean) => void;
};
type TMedicine = {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
};
const dumyPrescriptions = [
  {
    name: "Any medicine",
    dosage: "10mg",
    frequency: "daily",
    duration: "1 month",
  },
];
function Prescriptions({ setIsOpen }: Tprops) {
  const [prescriptions, setPrescriptions] = useState(dumyPrescriptions);
  const [medicine, setMedicine] = useState<TMedicine>({
    name: "",
    dosage: "10mg",
    frequency: "daily",
    duration: "1 month",
  });

  const { darkMode } = useAppSettings();
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMedicine({ ...medicine, [e.target.name]: e.target.value });
  };
  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (medicine) {
      setPrescriptions([...prescriptions, medicine]);
      setMedicine({
        name: "",
        dosage: "10mg",
        frequency: "daily",
        duration: "1 month",
      });
    }
  };
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
            <label className="text-gray-500 text-sm block mt-4">
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
            <label className="text-gray-500 text-sm block mt-4">Dosage</label>
            <select
              className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"}
                  border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
              name="dosage"
              value={medicine.dosage}
              id="dosage"
              placeholder="Dosage"
              onChange={onChangeHandler}
            >
              <option value="10mg">10mg</option>
              <option value="20mg">20mg</option>
              <option value="30mg">30mg</option>
              <option value="40mg">40mg</option>
              <option value="50mg">50mg</option>
            </select>
            <label className="text-gray-500 text-sm block mt-4">
              Frequency
            </label>
            <select
              className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"}
                  border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
              name="frequency"
              value={medicine.frequency}
              id="frequency"
              placeholder="Frequency"
              onChange={onChangeHandler}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <label className="text-gray-500 text-sm block mt-4">Duration</label>
            <select
              className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"}
                  border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
              name="duration"
              value={medicine.duration}
              id="duration"
              placeholder="Duration"
              onChange={onChangeHandler}
            >
              <option value="1 month">1 month</option>
              <option value="2 month">2 month</option>
              <option value="3 month">3 month</option>
              <option value="4 month">4 month</option>
              <option value="5 month">5 month</option>
            </select>
            <button
              type="submit"
              className="bg-blue-400 block w-1/3 m-auto mt-6  py-3 px-8 rounded-md  text-white hover:bg-blue-500"
            >
              Add
            </button>
          </form>
        </div>
        <PrescriptionsPrint prescriptions={prescriptions} />
      </div>
    </div>
  );
}

export default Prescriptions;
