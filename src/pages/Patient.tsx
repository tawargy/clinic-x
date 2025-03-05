import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
//import { TPatientInfo } from "../validations/patientInfoSchema";
import { useClinic } from "../contextApi/clinicContext";
import PatientInfo from "../components/PatientInfo";
import PatientMedicalInfo from "../components/PatientMedicalInfo";
import { dumy_patient } from "../initData";
import Visit from "../components/Visit";
import PatientLayout from "../layouts/PatientLayout";

function PatentBasicInfo() {
  // const [patient, setPatient] = useState<TPatientInfo | undefined>(patientInit);
  const { patientInfo, setPatientInfo } = useClinic();
  const navigate = useNavigate();
  const { id } = useParams();

  // const getPatientInfo = async () => {
  //   try {
  //     const res = await invoke<TPatientInfo>("get_patient_info", {
  //       patientId: id,
  //     });
  //     const formattedRes = {
  //       ...res,
  //       dob: res.dob
  //         ? new Date(res.dob.split("-").reverse().join("-"))
  //         : new Date(),
  //       // dob: new Date(res.dob),
  //     };
  //     setPatientInfo(formattedRes);
  //   } catch (e) {
  //     toastError("Failed to update patient");
  //     console.log(e);
  //   }
  // };
  useEffect(() => {
    // setPatient(dumy_patient);
    setPatientInfo(dumy_patient);
    //    getPatientInfo();
  }, []);

  const updatePatient = async () => {
    console.log(patientInfo);
  };

  // const onEdite = async (data: TPatientInfo) => {
  //   if (!data.dob) data.dob = "";
  //   if (data.dob instanceof Date)
  //     data.dob = new Date(data.dob)
  //       .toLocaleDateString("en-GB")
  //       .split("/")
  //       .join("-");
  //   try {
  //     const res = await invoke("update_patient", {
  //       patientId: id,
  //       data,
  //     });
  //     toastSuccess("Successfully updated patient");
  //     navigate("/");
  //     console.log(res);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  const onOpenVisit = async () => {
    navigate(`/appointment/${id}`);
  };
  const onSchedule = () => {
    navigate("/agenda");
  };
  return (
    <PatientLayout>
      <PatientInfo
        patient={patientInfo}
        onOpenViset={onOpenVisit}
        onSchedule={onSchedule}
        onPatientUpdate={setPatientInfo}
        onSavePatient={updatePatient}
      />
      <PatientMedicalInfo
        patient={patientInfo}
        onPatientUpdate={setPatientInfo}
        onSavePatient={updatePatient}
      />
      <Visit patient={PatientInfo} onPatientUpdate={setPatientInfo} />
    </PatientLayout>
  );
}
export default PatentBasicInfo;
