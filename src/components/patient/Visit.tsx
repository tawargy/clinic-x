import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { TAppointment } from "../../types";
import { useAppSettings } from "../../contextApi/appContext";
import { X } from "lucide-react";
import { appointmentInit } from "../../initData";
import {
  Heart,
  Activity,
  Clipboard,
  Weight,
  Ruler,
  ThermometerSun,
  Leaf,
} from "lucide-react";
type Tprops = {
  appointment_id: string;
  onClose: () => void;
};
function Visit({ appointment_id, onClose }: Tprops) {
  const [appointment, setAppointment] = useState<TAppointment>(appointmentInit);
  const { darkMode } = useAppSettings();

  const getAppointment = async (id: string) => {
    try {
      const res = await invoke<TAppointment>("get_appointment_by_id", {
        appointmentId: id,
      });
      setAppointment(res);
    } catch (e) {
      console.log("error", e);
    }
  };
  useEffect(() => {
    getAppointment(appointment_id);
  }, [appointment_id]);

  return (
    <div className="flex w-full m-auto h-screen gap-4 max-w-7xl  items-center justify-center ">
      <div
        className={`${darkMode ? "bg-gray-800" : "bg-white"}  w-[70%]  h-[90vh]  rounded-md p-4 flex flex-col gap-4 relative`}
      >
        <div
          className=" w-7 h-7 flex items-center justify-center bg-white  rounded-md absolute right-0 top-0  cursor-pointer"
          onClick={() => onClose()}
        >
          <X
            className="w-full h-full rounded-md bg-red-500 text-white font-bold"
            size={20}
          />
        </div>
        <p className="text-lg font-semibold">Visit Details</p>

        <div
          className={`${darkMode ? "bg-gray-800" : "bg-white"}  rounded-lg shadow-md p-4 mb-2 transition-colors duration-200`}
        >
          <div className=" grid grid-cols-4 gap-4 ">
            <div className="flex items-center">
              <Ruler
                className={`mr-3 ${darkMode ? "text-purple-400" : "text-purpl-500 "}`}
                size={20}
              />
              <div>
                <p
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Hight: {appointment.height}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Weight
                className={`mr-3 ${darkMode ? "text-purple-400" : "text-purpl-500 "}`}
                size={20}
              />
              <div>
                <p
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Weight: {appointment.weight}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Heart
                className={`mr-3 ${darkMode ? "text-red-400" : "text-red-500"}`}
                size={20}
              />
              <div>
                <p
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  BP : {appointment.bp}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Activity
                className={`mr-3 ${darkMode ? "text-blue-400" : "text-blue-500"}`}
                size={20}
              />
              <div>
                <p
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  P: {appointment.p}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <ThermometerSun
                className={`mr-3 ${darkMode ? "text-orange-400" : "text-orange-500"}`}
                size={20}
              />
              <div>
                <p
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  T : {appointment.t}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <Clipboard
                className={`mr-3 ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}
                size={20}
              />
              <div>
                <p
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  RR : {appointment.rr}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Clipboard
                className={`mr-3 ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}
                size={20}
              />
              <div>
                <p
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  RBS : {appointment.rbs}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <Leaf
                className={`mr-3 ${darkMode ? "text-green-400" : "text-green-500"}`}
                size={20}
              />
              <div>
                <p
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  SPO2 : {appointment.spo2}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`${darkMode ? "bg-gray-800" : "bg-white"}  rounded-lg shadow-md p-4 mb-2 transition-colors duration-200`}
        >
          <h3>Complaint</h3>
          <p>{appointment.complaint}</p>
        </div>
        <div
          className={`${darkMode ? "bg-gray-800" : "bg-white"}  rounded-lg shadow-md p-4 mb-2 transition-colors duration-200`}
        >
          <h3>Present health problems:</h3>
          <p>{appointment.present_history}</p>
        </div>
        <div
          className={`${darkMode ? "bg-gray-800" : "bg-white"}  rounded-lg shadow-md p-4 mb-2 transition-colors duration-200`}
        >
          <h3>Examination:</h3>
          <p>{appointment.examination}</p>
        </div>
        <div
          className={`${darkMode ? "bg-gray-800" : "bg-white"}  rounded-lg shadow-md p-4 mb-2 transition-colors duration-200`}
        >
          <h3>Diagnosis:</h3>
          <p>{appointment.provisional_diagnosis}</p>
        </div>
        <div
          className={`${darkMode ? "bg-gray-800" : "bg-white"}  rounded-lg shadow-md p-4 mb-2 transition-colors duration-200`}
        >
          <h3>Diagnosis:</h3>
          <p>
            {appointment.prescription.map((p, i) => (
              <ul key={i}>
                <li>name: {p.name}</li>
                <li>dosage: {p.dosage}</li>
                <li>duration: {p.duration}</li>
                <li>frequency: {p.frequency}</li>
              </ul>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Visit;
