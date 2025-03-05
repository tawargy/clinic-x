import { useState } from "react";
import { useAppSettings } from "../contextApi/appContext";

import { Stethoscope } from "lucide-react";
import { TPatientInfo } from "../types";
import Prescriptions from "./Prescriptions";

type Tprops = {
  patient: TPatientInfo;

  onPatientUpdate: (patient: TPatientInfo) => void;
};

function Visit({ patient, onPatientUpdate }: Tprops) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisit, setIsVisit] = useState(false);
  const { darkMode } = useAppSettings();
  return (
    <div
      className={`${darkMode ? "bg-gray-800" : "bg-white"} flex flex-col justify-between  h-[100%] w-full  rounded-lg shadow-md p-6 mb-6 transition-colors duration-200`}
    >
      <div>
        <h2 className=" text-lg font-semibold mb-4 flex items-center">
          <Stethoscope className="mr-2" size={18} />
          Visit
          {isVisit ? (
            <span className="text-sm text-gray-400 ml-2">3/3/2022</span>
          ) : (
            <button
              className="bg-green-500 text-white ml-2 text-sm py-1  px-2 rounded-md hover:bg-green-700"
              onClick={() => setIsVisit(true)}
            >
              Oppen Visit
            </button>
          )}
        </h2>
        {isVisit && (
          <>
            <div>
              <h4
                className={`text-lg font-medium mb-1 mt-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Complaint
              </h4>
              <textarea
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"} border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                value={patient.notes}
                onChange={(e) =>
                  onPatientUpdate({ ...patient, notes: e.target.value })
                }
              />
            </div>
            <div>
              <h4
                className={`text-lg font-medium mb-1 mt-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Present health problems
              </h4>
              <textarea
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"} border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                value={patient.notes}
                onChange={(e) =>
                  onPatientUpdate({ ...patient, notes: e.target.value })
                }
              />
            </div>
            <div>
              <h4
                className={`text-lg font-medium mb-1 mt-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Examination
              </h4>
              <textarea
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"} border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                value={patient.notes}
                onChange={(e) =>
                  onPatientUpdate({ ...patient, notes: e.target.value })
                }
              />
            </div>
            <div>
              <h4
                className={`text-lg font-medium mb-1 mt-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Provisional Diagnosis
              </h4>
              <textarea
                className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"} border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
                value={patient.notes}
                onChange={(e) =>
                  onPatientUpdate({ ...patient, notes: e.target.value })
                }
              />
            </div>
            {isOpen ? (
              <div className="fixed inset-0 bg-black bg-opacity-50  z-50 ">
                <Prescriptions setIsOpen={setIsOpen} />
              </div>
            ) : (
              ""
            )}
            <div className="flex gap-8 mt-8">
              <button
                className="w-1/2 m-auto  bg-green-500 text-white py-4  px-2 rounded-md hover:bg-green-700"
                onClick={() => console.log("p")}
              >
                Save & Close
              </button>
              <button
                className="w-1/2 m-auto  bg-purple-500 text-white py-4  px-2 rounded-md hover:bg-purple-700"
                onClick={() => setIsOpen(true)}
              >
                Prescriptions
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default Visit;
