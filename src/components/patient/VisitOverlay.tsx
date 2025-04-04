import { useState, useEffect } from "react";
import { useAppSettings } from "../../contextApi/appContext";
import { useClinic } from "../../contextApi/clinicContext";
import PrescriptionsPrint from "../comman/PrescriptionsPrint";
import { TAppointment, TAppointmentWrapper } from "../../types";
import { appointmentInit } from "../../initData";
import { formatDateDB } from "../../utils/date";
import { invoke } from "@tauri-apps/api/core";
import { getAppointmentWrapperByIdApi } from "../../api/appointmentWrapper";
import {
  X,
  Printer,
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
  appointment_wrapper_id: string;
  onClose: () => void;
  visitDate: string;
  followupIds: string[];
};

function VisitOverlay({
  appointment_id,
  appointment_wrapper_id,
  onClose,
  visitDate,
  followupIds,
}: Tprops) {
  const [appointment, setAppointment] = useState<TAppointment>(appointmentInit);

  const { darkMode } = useAppSettings();
  const [isPrint, setIsPrint] = useState(false);
  const { setPrescriptions } = useClinic();
  const [pId, setPId] = useState(appointment_id);
  const [appointmentWrapper, setAppointmentWrapper] =
    useState<TAppointmentWrapper>();
  const getAppointment = async (id: string) => {
    try {
      const res = await invoke<TAppointment>("get_appointment_by_id", {
        appointmentId: id,
      });

      setAppointment(res);
      setPrescriptions(res.prescription);
      console.log("appointment", res);
    } catch (e) {
      console.log("error", e);
    }
  };
  const getAppointmentWrapper = async () => {
    try {
      const res = await getAppointmentWrapperByIdApi(appointment_wrapper_id);
      res && setAppointmentWrapper(res);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getAppointmentWrapper();
  }, []);

  useEffect(() => {
    getAppointment(appointment_id);
    return () => setPrescriptions([]);
  }, [appointment_id]);

  const followupStatus = () => {
    if (!appointmentWrapper) return;
    const folloNames = [
      "First follow up",
      "Second follow up",
      "Third follow up",
      "Fourth follow up",
    ];

    return (
      <div>
        <p>
          Case Status :
          <span
            className={`${appointmentWrapper?.appointment_status === "Closed" ? "text-red-600" : "text-green-600"} ml-4`}
          >
            {appointmentWrapper?.appointment_status}{" "}
          </span>
        </p>
        <div className="flex gap-4">
          <button
            className={`${appointment_id === pId ? "text-yellow-600" : "text-gray-600"}`}
            onClick={() => {
              setPId(appointment_id);
              getAppointment(appointment_id);
            }}
          >
            Encounter
          </button>
          {followupIds.map((id, i) => (
            <button
              className={`${id === pId ? "text-yellow-400" : "text-gray-500"}`}
              onClick={() => {
                setPId(id);
                getAppointment(id);
              }}
              key={i}
            >
              {folloNames[i]}
            </button>
          ))}
        </div>
      </div>
    );
  };

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
        <div className="pb-8">
          <p className="text-lg font-semibold text-center">Visit Details</p>
          {followupStatus()}
          <p> Date: {formatDateDB(appointment.created_at)}</p>
        </div>
        <div className="absolute right-5 bottom-5">
          <button onClick={() => setIsPrint(true)}>
            <Printer
              className="text-yellow-500 hover:text-yellow-600"
              size={40}
            />
          </button>
        </div>
        {isPrint && (
          <PrescriptionsPrint
            setIsOpen={setIsPrint}
            printDate={new Date()}
            visitDate={visitDate}
          />
        )}

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
        <div className="grid grid-cols-2 gap-4 overflow-y-auto custom-scrollbar">
          <div>
            <div
              className={`${darkMode ? "bg-gray-800" : "bg-white"}  rounded-lg shadow-md p-4 mb-2 transition-colors duration-200`}
            >
              <h3 className="text-gray-500">Complaint</h3>
              <p className="text-gray-400">{appointment.complaint}</p>
            </div>
            <div
              className={`${darkMode ? "bg-gray-800" : "bg-white"}  rounded-lg shadow-md p-4 mb-2 transition-colors duration-200`}
            >
              <h3 className="text-gray-500">Present health problems:</h3>
              <p className="text-gray-400">{appointment.present_history}</p>
            </div>
            <div
              className={`${darkMode ? "bg-gray-800" : "bg-white"}  rounded-lg shadow-md p-4 mb-2 transition-colors duration-200`}
            >
              <h3 className="text-gray-500">Examination:</h3>
              <p className="text-gray-400">{appointment.examination}</p>
            </div>
            <div
              className={`${darkMode ? "bg-gray-800" : "bg-white"}  rounded-lg shadow-md p-4 mb-2 transition-colors duration-200`}
            >
              <h3 className="text-gray-500">Diagnosis:</h3>
              <p className="text-gray-400">
                {appointment.provisional_diagnosis}
              </p>
            </div>
          </div>

          <div
            className={`${darkMode ? "bg-gray-800" : "bg-white"}  rounded-lg shadow-md pb-2  transition-colors duration-200`}
          >
            <h3 className="pb-2 text-gray-500">Prescriptions:</h3>
            <div
              className="

            "
            >
              {appointment.prescription.map((p, i) => (
                <div key={i}>
                  <p
                    className={`${darkMode ? "text-gray-300" : "text-gray-600"} pt-2`}
                  >
                    name: {p.name}
                  </p>
                  <span className="text-gray-400">dosage: {p.dosage} - </span>
                  <span className="text-gray-400">
                    duration: {p.duration} -{" "}
                  </span>
                  <span className="text-gray-400">
                    frequency: {p.frequency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VisitOverlay;
