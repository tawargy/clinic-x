import { useNavigate, useParams } from "react-router-dom";
import PatientInfo from "../components/patient/PatientInfo";
import PatientMedicalInfo from "../components/patient/PatientMedicalInfo";
import PatientLayout from "../layouts/PatientLayout";
import Appointment from "../components/appointment/Appointment";

function PatentBasicInfo() {
  const navigate = useNavigate();
  const { id } = useParams();

  const onSchedule = () => {
    navigate("/agenda");
  };
  return (
    <PatientLayout>
      <PatientInfo id={id} onSchedule={onSchedule} />
      <PatientMedicalInfo id={id} />
      <Appointment patient_id={id} />
    </PatientLayout>
  );
}
export default PatentBasicInfo;
