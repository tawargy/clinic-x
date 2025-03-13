import { useNavigate, useParams } from "react-router-dom";
import PatientInfo from "../components/PatientInfo";
import PatientMedicalInfo from "../components/PatientMedicalInfo";
import PatientLayout from "../layouts/PatientLayout";
import Visit from "../components/appointment/Visit";

function PatentBasicInfo() {
  const navigate = useNavigate();
  const { id } = useParams();

  // const onOpenVisit = async () => {
  //   navigate(`/appointment/${id}`);
  // };
  const onSchedule = () => {
    navigate("/agenda");
  };
  return (
    <PatientLayout>
      <PatientInfo id={id} onSchedule={onSchedule} />
      <PatientMedicalInfo id={id} />
      <Visit patient_id={id} />
    </PatientLayout>
  );
}
export default PatentBasicInfo;
