import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useClinic } from "../../contextApi/clinicContext";
import { useAppointment } from "../../contextApi/appointmentContext";
import PatientColLayout from "../../layouts/PatientColLayout";
import Main from "./Main";
import Prescriptions from "./Prescriptions";
import Diagnosis from "./Diagnosis";
import Requests from "./Requests";
import Services from "./Services";
import { getFeeAndServicesApi } from "../../api/feeAndServices";
import { addDiagnosesApi } from "../../api/diagnosis";
import { addRequsetApi } from "../../api/request";
import {
  addAppointmentWrapperApi,
  getLastAppointmentWrapperApi,
  updateAppointmentWrapperApi,
} from "../../api/appointmentWrapper";
import {
  addAppointmentApi,
  deleteAppointmentDayApi,
} from "../../api/appointment";
import { addAppointmentFeesApi } from "../../api/appointmentFees";
import { followupNames } from "../../utils/followupNames";
import { formatDate } from "../../utils/date";
import { toastError, toastSuccess } from "../../utils/toastify";
import { BriefcaseMedical } from "lucide-react";
import { TAppointmentWrapper, TFeeAndServices } from "../../types";
import { totalFees } from "../../utils/totalFees";

type Tprops = {
  patient_id: string | undefined;
};

function Appointment({ patient_id }: Tprops) {
  const { appointment, diagnoses, requests, appointmentFees } =
    useAppointment();
  const { isAppointment, appointmentType, patientInfo } = useClinic();
  //const [isPrecisionOpen, setIsPrecisionOpen] = useState(false);
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
      const diagnosesId = await addDiagnosesApi(diagnoses, patient_id);
      const requestId = await addRequsetApi(requests);
      const feesId = await addAppointmentFeesApi({
        ...appointmentFees,
        patient_id: patient_id || "",
        patient_name: patientInfo?.name || "",
        patient_phone: patientInfo?.phone || "",
        appointment_type: appointmentType,
        total_fees: totalFees(appointmentFees).toString(),
        date: formatDate(new Date()),
      });
      if (diagnosesId && requestId && feesId) {
        const appointmentData = {
          ...appointment,
          patient_id: patient_id || "",
          provisional_diagnosis: diagnosesId,
          requests: requestId,
          services: feesId,
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

      if (followupsLength > followupsNum) return;
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

  return (
    <PatientColLayout>
      <div>
        <div>
          <div className=" text-lg font-semibold  flex items-center mb-6 ">
            <BriefcaseMedical className="mr-2 text-blue-500" size={18} />
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
          {stage === "main" && isAppointment && <Main setStage={setStage} />}
          {stage === "diagnosis" && isAppointment && (
            <Diagnosis setStage={setStage} />
          )}
          {stage === "prescription" && isAppointment && (
            <Prescriptions setStage={setStage} />
          )}
          {stage === "requests" && isAppointment && (
            <Requests setStage={setStage} />
          )}
          {stage === "services" && isAppointment && (
            <Services setStage={setStage} saveHandler={onSaveHandler} />
          )}
        </div>
      </div>
    </PatientColLayout>
  );
}
export default Appointment;
