import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "react-router-dom";
import { useAppSettings } from "../../contextApi/appContext";
import { Stethoscope } from "lucide-react";
import { TAppointment } from "../../types";
import { appointmentInit } from "../../initData";
import { toastError, toastSuccess } from "../../utils/toastify";
import { formatDate } from "../../utils/date";
import { useClinic } from "../../contextApi/clinicContext";
import Main from "./speciality/Main";
import Next from "./Next";
import More from "./More";
import PrescriptionsPrint from "./PrescriptionsPrint";
import { ArrowBigRightDash } from "lucide-react";

type Tprops = {
  patient_id: string | undefined;
};

function Appointment({ patient_id }: Tprops) {
  const [isPrecisionOpen, setIsPrecisionOpen] = useState(false);
  const [appointment, setAppointment] = useState<TAppointment>(appointmentInit);
  const { isAppointment, setIsAppointment } = useClinic();
  const { darkMode } = useAppSettings();
  const [stage, setStage] = useState("main");
  const navigate = useNavigate();
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
      toastSuccess("Appointment saved & closed successfully!");
    } catch (e) {
      toastError("Faild to save");
      console.error("Error saving appointment:", e);
    }
  };
  const deleteAppointmentDay = async (patientId: string) => {
    try {
      const res = await invoke("remove_patient_from_appointment_day", {
        day: formatDate(new Date()), // Format date as needed
        patientId: patientId,
      });
      console.log(res);
    } catch (e) {
      toastError("Faild to remove patient from appointment day");
    }
  };
  const onSaveHandler = () => {
    saveOnDatabase();
    deleteAppointmentDay(patient_id || "");
    navigate("/");
  };
  // const addPrescriptionHandler = (prescription: TPrescription[]) => {
  //   console.log("Prescription:", prescription);
  //   setAppointment((prev) => ({ ...prev, prescription: prescription }));

  //   console.log("AAA", appointment);
  // };

  return (
    <div
      className={`${darkMode ? "bg-gray-800" : "bg-white"} min-h-[80vh] flex flex-col justify-between  h-[100%] w-full  rounded-lg shadow-md   transition-colors duration-200`}
    >
      <div>
        <h2 className=" text-lg font-semibold mb-4 flex items-center">
          <Stethoscope className="mr-2 text-blue-500" size={18} />
          Visit
          {isAppointment ? (
            <span className="text-sm text-gray-400 ml-2">
              {formatDate(new Date())}
            </span>
          ) : (
            <button
              className="bg-green-500 text-white ml-2 text-sm py-1  px-2 rounded-md hover:bg-green-700"
              onClick={() => {
                setIsAppointment(true);
              }}
            >
              Oppen Visit
            </button>
          )}
        </h2>
        {stage === "main" && isAppointment && (
          <>
            <Main appointment={appointment} onChangeHandler={onChangeHandler} />

            <div className="flex gap-8 mt-44 flex-row-reverse">
              <button
                className="py-4 px-2 "
                onClick={() => setStage("prescription")}
              >
                <ArrowBigRightDash
                  className="text-yellow-500 hover:text-yellow-700"
                  size={40}
                />
              </button>
            </div>
          </>
        )}
        {stage === "prescription" && isAppointment && (
          <Next setStage={setStage} />
        )}
        {stage === "more" && isAppointment && (
          <More
            setStage={setStage}
            prescriptionOpen={setIsPrecisionOpen}
            saveHandler={onSaveHandler}
          />
        )}
      </div>

      {isPrecisionOpen ? (
        <div className="fixed inset-0 bg-black bg-opacity-50  z-50 ">
          <PrescriptionsPrint setIsOpen={setIsPrecisionOpen} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
export default Appointment;
