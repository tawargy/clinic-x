import { useClinic } from "../contextApi/clinicContext";
import { prescriptionsInit, patientInit } from "../initData";

function useClinicInit() {
  const { setMedicine, setPatientInfo, setIsAppointment, setPrescriptions } =
    useClinic();
  function setClinicInit() {
    setPatientInfo(patientInit);
    setIsAppointment(false);
    setPrescriptions([]);
    setMedicine(prescriptionsInit);
  }
  return { setClinicInit };
}
export default useClinicInit;
