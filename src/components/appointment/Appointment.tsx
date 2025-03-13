import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useAppSettings } from "../../contextApi/appContext";
import Vitals from "./Vitals";
import { Stethoscope } from "lucide-react";
import { TAppointment } from "../../types";
import Prescriptions from "./Prescriptions";
import { appointmentInit } from "../../initData";
import { toastError, toastSuccess } from "../../utils/toastify";
import { formatDate } from "../../utils/date";

type Tprops = {
  patient_id: string | undefined;
};

function Appointment({ patient_id }: Tprops) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisit, setIsVisit] = useState(false);
  const [appointment, setAppointment] = useState<TAppointment>(appointmentInit);

  const { darkMode } = useAppSettings();

  const onChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setAppointment((p) => {
      return { ...p, [name]: value };
    });
  };
  const saveOnDatabase = async () => {
    try {
      console.log("Saving appointment:", appointment); // Debug log

      const appointmentData = {
        id: "", // Let backend generate this
        patient_id: patient_id || "",
        complaint: appointment.complaint || null,
        present_history: appointment.present_history || null,
        examination: appointment.examination || null,
        provisional_diagnosis: appointment.provisional_diagnosis || null,
        past_history: appointment.past_history || null,
        bp: appointment.bp || null,
        p: appointment.p || null,
        t: appointment.t || null,
        rr: appointment.rr || null,
        rbs: appointment.rbs || null,
        spo2: appointment.spo2 || null,
        weight: appointment.weight || null,
        height: appointment.height || null,
        prescription: appointment.prescription || [],
        created_at: formatDate(new Date()),
      };

      console.log("Sending to backend:", appointmentData); // Debug log

      const res = await invoke("add_appointment", {
        appointment: appointmentData,
      });
      console.log("Response from backend:", res);
      toastSuccess("Appointment saved successfully!");
    } catch (e) {
      toastError("Faild to save");
      console.error("Error saving appointment:", e);
    }
  };
  const onSaveHandler = () => {
    saveOnDatabase();
    setIsVisit(false);
  };
  return (
    <div
      className={`${darkMode ? "bg-gray-800" : "bg-white"} flex flex-col justify-between  h-[100%] w-full  rounded-lg shadow-md p-6 mb-6 transition-colors duration-200`}
    >
      <div>
        <h2 className=" text-lg font-semibold mb-4 flex items-center">
          <Stethoscope className="mr-2" size={18} />
          Visit
          {isVisit ? (
            <span className="text-sm text-gray-400 ml-2">
              {formatDate(new Date())}
            </span>
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
              <Vitals
                appointment={appointment}
                onChangeHandler={onChangeHandler}
              />
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
                onClick={onSaveHandler}
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
export default Appointment;
