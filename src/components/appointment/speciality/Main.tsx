import { useAppSettings } from "../../../contextApi/appContext";
import Vitals from "../Vitals";

import { TAppointment } from "../../../types";

type TProps = {
  appointment: TAppointment;
  onChangeHandler: (e: any) => void;
};

function Main({ appointment, onChangeHandler }: TProps) {
  const { darkMode } = useAppSettings();
  return (
    <>
      <div>
        <Vitals appointment={appointment} onChangeHandler={onChangeHandler} />
        <h4
          className={`text-lg font-medium mb-1 mt-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
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
      <div>
        <h4
          className={`text-lg font-medium mb-1 mt-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
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
      <div>
        <h4
          className={`text-lg font-medium mb-1 mt-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
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
      <div>
        <h4
          className={`text-lg font-medium mb-1 mt-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
        >
          Provisional Diagnosis
        </h4>
        <textarea
          className={`${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900"} border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 p-2.5 transition-colors duration-200`}
          value={appointment.provisional_diagnosis}
          name="provisional_diagnosis"
          onChange={onChangeHandler}
        />
      </div>
    </>
  );
}

export default Main;
