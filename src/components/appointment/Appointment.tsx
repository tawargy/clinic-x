import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { appointmentInit } from "../../initData";
import { toastError, toastSuccess } from "../../utils/toastify";
import { formatDate } from "../../utils/date";
import { useClinic } from "../../contextApi/clinicContext";
import Main from "./Main";
import Prescriptions from "./Prescriptions";
import Requests from "./Requests";
import Services from "./Services";
import PrescriptionsPrint from "../comman/PrescriptionsPrint";
import {
  addAppointmentWrapperApi,
  getLastAppointmentWrapperApi,
  updateAppointmentWrapperApi,
} from "../../api/appointmentWrapper";
import {
  addAppointmentApi,
  deleteAppointmentDayApi,
} from "../../api/appointment";
import { getFeeAndServicesApi } from "../../api/feeAndServices";
//import PrescriptionsPrint from "./PrescriptionsPrint";
import { followupNames } from "../../utils/followupNames";
import { Stethoscope } from "lucide-react";
import Diagnosis from "./Diagnosis";
import PatientColLayout from "../../layouts/PatientColLayout";
import { addDiagnosisApi } from "../../api/diagnosis";
import { addRequsetApi } from "../../api/request";
import {
  TAppointment,
  TAppointmentWrapper,
  TFeeAndServices,
  TDiagnosis,
  TRequest,
} from "../../types";
type Tprops = {
  patient_id: string | undefined;
};

function Appointment({ patient_id }: Tprops) {
  const { isAppointment, prescriptions, appointmentType } = useClinic();
  const [allDiagnosis, setAllDiagnosis] = useState<TDiagnosis[]>([]);
  const [isPrecisionOpen, setIsPrecisionOpen] = useState(false);
  const [appointment, setAppointment] = useState<TAppointment>(appointmentInit);
  const [requstes, setRequstes] = useState<TRequest[]>([]);
  const [feeAndServices, setFeeAndServices] = useState<TFeeAndServices>({
    id: "",
    fee: "0",
    followups: [],
    services: [],
  });

  const [stage, setStage] = useState("main");
  const navigate = useNavigate();

  const getFeeAndServices = async () => {
    try {
      const res = await getFeeAndServicesApi();
      res && setFeeAndServices(res);
    } catch (error) {
      console.error("Error getting fee and services:", error);
    }
  };

  const onSaveHandler = async () => {
    try {
      const res = await addAppointment();
      res && checkAppointmentType(res);
      deleteAppointmentDayApi(patient_id || "");
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  const addAppointment = async () => {
    try {
      const diagnosisId = await addDiagnosisApi(allDiagnosis);
      const requestId = await addRequsetApi(requstes);
      console.log("d", diagnosisId, "req", requestId);
      if (diagnosisId && requestId) {
        const appointmentData = {
          id: "",
          patient_id: patient_id || "",
          vitals: appointment.vitals || [],
          complaint: appointment.complaint || "",
          present_history: appointment.present_history || "",
          examination: appointment.examination || "",
          provisional_diagnosis: diagnosisId,
          prescription: prescriptions || [],
          requests: requestId,
          services: appointment.services || [],
          created_at: formatDate(new Date()),
        };
        const res = await addAppointmentApi(appointmentData);
        if (res) {
          toastSuccess("Appointment saved & closed successfully!");
        }
        return res;
      }
    } catch (e) {
      toastError("Faild to save");
      console.error("Error saving appointment:", e);
    }
  };
  useEffect(() => {
    getLastAppointmentWrapperApi(patient_id || "");
    getFeeAndServices();
  }, []);

  const checkAppointmentType = async (appointmentId: string) => {
    if (appointmentType === "new") {
      const data: TAppointmentWrapper = {
        id: "",
        patient_id: patient_id || "",
        main_complaint: appointment.complaint,
        main_appointment: appointmentType === "new" ? appointmentId : "",
        followups_num: feeAndServices.followups.length.toString(),
        followup_appointments: [],
        appointment_status: "Open",
        date: formatDate(new Date()),
      };

      addAppointmentWrapperApi(data);
    } else {
      if (!patient_id) return;
      const lastWrapper = await getLastAppointmentWrapperApi(patient_id);
      if (!lastWrapper) return;
      const followupsLength = Number(
        lastWrapper.followup_appointments.length + 1,
      );
      const followupsNum = Number(lastWrapper.followups_num);
      let caseStatus = "Open";
      console.log(
        "followupsnum",
        followupsNum,
        "followupsLength",
        followupsLength,
      );
      if (followupsNum < followupsLength) return;
      if (followupsNum === followupsLength) {
        caseStatus = "Closed";
      }
      const arr = lastWrapper.followup_appointments;
      const id = appointmentId;
      const data: TAppointmentWrapper = {
        ...lastWrapper,
        followup_appointments: [...arr, id],
        appointment_status: caseStatus,
      };
      updateAppointmentWrapperApi(data);
    }
  };

  const onVitalsChangeHandler = (name: string, value: string) => {
    setAppointment((prev) => {
      const newVitals = [...prev.vitals];
      const vitalIndex = newVitals.findIndex((v) => v.v_name === name);

      if (vitalIndex !== -1) {
        // Update existing vital
        newVitals[vitalIndex] = { ...newVitals[vitalIndex], v_value: value };
      } else {
        // Add new vital
        newVitals.push({ v_name: name, v_value: value });
      }

      return { ...prev, vitals: newVitals };
    });
  };
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setAppointment((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const addDiagnosisHandler = (d: TDiagnosis) => {
    setAllDiagnosis((prev) => [...prev, d]);
  };
  const onDeleteDiagnosisHandler = (i: number) => {
    setAllDiagnosis((prevDiagnosis) =>
      prevDiagnosis.filter((_, index) => index !== i),
    );
  };
  return (
    // <div
    //   className={`${darkMode ? "bg-gray-800" : "bg-white"}  flex flex-col justify-between   h-[calc(100vh-130px)] w-full
    //     rounded-lg shadow-md   transition-colors duration-200`}
    // >
    <PatientColLayout>
      <div>
        <div>
          <div className=" text-lg font-semibold  flex items-center mb-6 ">
            <Stethoscope className="mr-2 text-blue-500" size={18} />
            <h4> Encounter</h4>
            {/* {isAppointment ? (
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
          )} */}
            {isAppointment && (
              <div className="flex flex-col justify-start ml-16 text-center mt-1 mb-1">
                <span
                  className={`${appointmentType === "new" ? "text-green-500" : "text-yellow-600"} text-sm`}
                >
                  {followupNames(appointmentType)}
                </span>
                <span className="text-sm text-gray-400 ml-2">
                  {formatDate(new Date())}
                </span>
              </div>
            )}
          </div>
          {stage === "main" && isAppointment && (
            <Main
              appointment={appointment}
              onVitalsChangeHandler={onVitalsChangeHandler}
              onChangeHandler={onChangeHandler}
              setStage={setStage}
              addDiagnosis={addDiagnosisHandler}
            />
          )}
          {stage === "diagnosis" && isAppointment && (
            <Diagnosis
              addDiagnosis={addDiagnosisHandler}
              setStage={setStage}
              diagnosis={allDiagnosis}
              deletedDiagnosis={onDeleteDiagnosisHandler}
            />
          )}
          {stage === "prescription" && isAppointment && (
            <Prescriptions setStage={setStage} />
          )}
          {stage === "requests" && isAppointment && (
            <Requests
              setStage={setStage}
              requstes={requstes}
              setRequstes={setRequstes}
            />
          )}
          {stage === "services" && isAppointment && (
            <Services
              setStage={setStage}
              saveHandler={onSaveHandler}
              prescriptionOpen={setIsPrecisionOpen}
            />
          )}
        </div>

        {isPrecisionOpen ? (
          <div className="fixed inset-0 bg-black bg-opacity-50  z-50 ">
            <PrescriptionsPrint
              setIsOpen={setIsPrecisionOpen}
              printDate={new Date()}
              visitDate={formatDate(new Date())}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </PatientColLayout>
  );
}
export default Appointment;
