import { useState } from "react";
import { useAppSettings } from "../../contextApi/appContext";
import { useClinic } from "../../contextApi/clinicContext";

import {
  X,
  ArrowBigRightDash,
  ArrowBigLeftDash,
  Edit2,
  Save,
} from "lucide-react";
import { TPrescription } from "../../types";

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
function Next({ setStage }: TProps) {
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
  };
  return (
    <div>
      <div
        className={`${darkMode ? "bg-gray-800" : "bg-white"} min-h-[70vh]  rounded-lg shadow-xl p-1 w-full  flex flex-col justify-between`}
      >
        <div className="max-h-[520px] overflow-y-auto custom-scrollbar ">
          {prescriptions.map((p, i) => (
            <div key={i} className="relative">
              {isIndex === i ? (
                <div className={`${darkMode ? "bg-gray-700" : "bg-gray-300"} `}>
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
                        Frequency
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
        <form className=" w-full   " onSubmit={onSubmitHandler}>
          <div className="grid grid-cols-3 gap-4 ">
            <div>
              <label
                className="text-gray-500 text-sm block mt-4"
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
                Frequency
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
          <button
            type="submit"
            className="bg-blue-400 block w-1/4 m-auto mt-6  py-3 px-8 rounded-md  text-white hover:bg-blue-500"
          >
            Add
          </button>
        </form>
      </div>
      <div className="mt-4 flex justify-between ">
        <button className="py-4 px-2" onClick={() => setStage("main")}>
          <ArrowBigLeftDash
            className="text-gray-500 hover:text-gray-400"
            size={40}
          />
        </button>
        <button className="  py-4  px-2 " onClick={() => setStage("more")}>
          <ArrowBigRightDash
            className="text-yellow-500 hover:text-yellow-700"
            size={40}
          />
        </button>
      </div>
    </div>
  );
}

export default Next;
