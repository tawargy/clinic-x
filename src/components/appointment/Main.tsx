import { useAppSettings } from "../../contextApi/appContext";
import Vitals from "./Vitals";

import { TAppointment, TDiagnosis } from "../../types";
import { ArrowBigRightDash } from "lucide-react";

type TProps = {
  appointment: TAppointment;
  onChangeHandler: (e: any) => void;
  setStage: (t: string) => void;

  addDiagnosis: (d: TDiagnosis) => void;
};

function Main({ appointment, onChangeHandler, setStage }: TProps) {
  const { darkMode } = useAppSettings();
  return (
    <div className="h-[calc(100vh-190px)] flex flex-col justify-between">
      <div>
        <Vitals appointment={appointment} onChangeHandler={onChangeHandler} />
        <div className="max-h-[600px]   overflow-y-auto custom-scrollbar ">
          <div
            className={`${darkMode ? "bg-gray-800" : "bg-white"}  rounded-lg shadow-md p-1 pb-2 mb-1 transition-colors duration-200`}
          >
            <h4
              className={`text-lg font-medium  py-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Complaint
            </h4>
            <textarea
              className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"} border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
              value={appointment.complaint}
              name="complaint"
              onChange={onChangeHandler}
            />
          </div>
          <div
            className={`${darkMode ? "bg-gray-800" : "bg-white"}  rounded-lg shadow-md p-1 pb-2 mb-2 transition-colors duration-200`}
          >
            <h4
              className={`text-lg font-medium by-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Present health problems
            </h4>
            <textarea
              className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"} border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
              value={appointment.present_history}
              name="present_history"
              onChange={onChangeHandler}
            />
          </div>
          <div
            className={`${darkMode ? "bg-gray-800" : "bg-white"}  rounded-lg shadow-md p-1 pb-2 mb-2 transition-colors duration-200`}
          >
            <h4
              className={`text-lg font-medium by-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Examination
            </h4>
            <textarea
              className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"} border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
              value={appointment.examination}
              name="examination"
              onChange={onChangeHandler}
            />
          </div>
        </div>
      </div>
      <div className="flex mt-4  flex-row-reverse">
        <button className="py-4 px-2 " onClick={() => setStage("diagnosis")}>
          <ArrowBigRightDash
            className="text-yellow-500 hover:text-yellow-700"
            size={40}
          />
        </button>
      </div>
    </div>
  );
}

export default Main;
