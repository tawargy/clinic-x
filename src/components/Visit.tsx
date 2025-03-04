import { useAppSettings } from "../contextApi/appContext";
import { Stethoscope } from "lucide-react";
import { TPatientInfo } from "../types";

type Tprops = {
  patient: TPatientInfo;

  onPatientUpdate: (patient: TPatientInfo) => void;
};

function Visit({ patient, onPatientUpdate }: Tprops) {
  const { darkMode } = useAppSettings();
  return (
    <div
      className={`${darkMode ? "bg-gray-800" : "bg-white"} h-[100%] w-full  rounded-lg shadow-md p-6 mb-6 transition-colors duration-200`}
    >
      <h2 className=" text-lg font-semibold mb-4 flex items-center">
        <Stethoscope className="mr-2" size={18} />
        Visit <span className="text-sm text-gray-400 ml-2">3/3/2022</span>
      </h2>
      <div>
        <h4
          className={`text-lg font-medium mb-1 mt-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
        >
          Notes
        </h4>
        <textarea
          className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"} border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
          value={patient.notes}
          onChange={(e) =>
            onPatientUpdate({ ...patient, notes: e.target.value })
          }
        />
      </div>
    </div>
  );
}

export default Visit;
