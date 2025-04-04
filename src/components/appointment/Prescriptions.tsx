import { useState } from "react";
import { useAppSettings } from "../../contextApi/appContext";
import { useClinic } from "../../contextApi/clinicContext";
import { getDrug } from "../../utils/drug";

import {
  X,
  ArrowBigRightDash,
  ArrowBigLeftDash,
  Edit2,
  Save,
} from "lucide-react";
// import { TPrescription } from "../../types";

const prescriptionsInit = {
  name: "",
  dosage: "10mg",
  frequency: "daily",
  duration: "1 month",
};
type TProps = {
  setStage: (stage: string) => void;
  // onSaveHandler: () => void;
  // addPrescriptionHandler: (prescription: TPrescription[]) => void;
};
function Prescriptions({ setStage }: TProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const { medicine, setMedicine, prescriptions, setPrescriptions } =
    useClinic();

  const [isIndex, setIsIndex] = useState<number | undefined>(undefined);
  const { darkMode } = useAppSettings();

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMedicine({ ...medicine, [name]: value });
  };
  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPrescriptions([...prescriptions, medicine]);
    setMedicine(prescriptionsInit);
    setSearchTerm("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    const matchingDrugs = getDrug(value);
    setSuggestions(matchingDrugs);
  };

  const handleSuggestionClick = (drugName: string) => {
    setSearchTerm(drugName);
    setMedicine({ ...medicine, name: drugName });
    setSuggestions([]);
  };
  return (
    <div>
      <div className="h-[calc(100vh-280px)] flex flex-col gap-4   ">
        <div className=" h-[480px] max-h-[480px] overflow-y-auto custom-scrollbar   rounded-lg shadow-md px-4 ">
          <h3>Prescriptions</h3>
          <div className="  ">
            {prescriptions.map((p, i) => (
              <div key={i} className="relative">
                {isIndex === i ? (
                  <div
                    className={`${darkMode ? "bg-gray-700" : "bg-gray-300"} `}
                  >
                    <button
                      onClick={() => setIsIndex(undefined)}
                      className="absolute right-1 top-1"
                    >
                      <Save className="text-green-500" />
                    </button>
                    <div className="grid grid-cols-3 gap-2 pb-2 px-1 pt-6 ">
                      <div>
                        <label
                          className="text-gray-500 text-sm block "
                          htmlFor="name"
                        >
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
                      </div>
                      <div>
                        <label
                          className="text-gray-500 text-sm block"
                          htmlFor="dosage"
                        >
                          Dosage
                        </label>
                        <input
                          className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"}
                                          border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                          type="text"
                          name="dosage"
                          value={medicine.dosage}
                          id="dosage"
                          placeholder="Dosage"
                          onChange={onChangeHandler}
                        />
                      </div>
                      <div>
                        <label
                          className="text-gray-500 text-sm block "
                          htmlFor="duration"
                        >
                          Duration
                        </label>
                        <input
                          className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"}
                                          border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                          type="text"
                          name="duration"
                          value={medicine.duration}
                          id="duration"
                          placeholder="Duration"
                          onChange={onChangeHandler}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    key={i}
                    className={`${darkMode ? "border-gray-700" : "border-gray-300"} border  mb-1 rounded-lg px-2`}
                  >
                    <h4 className="flex  items-center justify-between">
                      <span>{p.name}</span>
                      <div className="flex items-center gap-4 py-1">
                        <button onClick={() => setIsIndex(i)}>
                          <Edit2
                            className="text-blue-300 hover:text-blue-500"
                            size={18}
                          />
                        </button>
                        <button>
                          <X className="text-red-300 hover:text-red-500" />
                        </button>
                      </div>
                    </h4>
                    <p className="flex gap-4 text-gray-500 ">
                      <span>{p.dosage}</span>
                      <span>{p.duration}</span>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <form className=" w-full   " onSubmit={onSubmitHandler}>
          <div className="grid grid-cols-3 gap-4 ">
            <div className=" bg-gray-50 col-span-3">
              <input
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"}
                    border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Drug Name..."
              />

              {/* Display suggestions */}
              {suggestions.length > 0 && (
                <ul className="suggestions-list max-h-[300px]   overflow-y-auto custom-scrollbar">
                  {suggestions.map((drug, index) => (
                    <li
                      className="cursor-pointer"
                      key={index}
                      onClick={() => handleSuggestionClick(drug.name)}
                    >
                      {drug.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex gap-4  col-span-3">
              <div className="w-1/2">
                <label
                  className="text-gray-500 text-sm block mt-4"
                  htmlFor="dosage"
                >
                  Dosage
                </label>
                <input
                  className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"}
                          border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                  type="text"
                  name="dosage"
                  value={medicine.dosage}
                  id="dosage"
                  placeholder="Dosage"
                  onChange={onChangeHandler}
                />
              </div>
              <div>
                <label
                  className="text-gray-500 text-sm block mt-4"
                  htmlFor="duration"
                >
                  Duration
                </label>
                <input
                  className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"}
                          border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                  type="text"
                  name="duration"
                  value={medicine.duration}
                  id="duration"
                  placeholder="Duration"
                  onChange={onChangeHandler}
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="bg-green-500 block w-1/4 m-auto mt-4  py-2 px-6 rounded-md  text-white hover:bg-blue-500"
          >
            Add
          </button>
        </form>
      </div>
      <div className="mt-1 flex justify-between ">
        <button className="py-4 px-2" onClick={() => setStage("diagnosis")}>
          <ArrowBigLeftDash
            className="text-gray-500 hover:text-gray-400"
            size={40}
          />
        </button>
        <button className="  py-4  px-2 " onClick={() => setStage("requests")}>
          <ArrowBigRightDash
            className="text-yellow-500 hover:text-yellow-700"
            size={40}
          />
        </button>
      </div>
    </div>
  );
}

export default Prescriptions;
