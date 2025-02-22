import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
interface IPatientInfo {
  name: string;
  dob: string;
  gender: string;
  occupation: string;
  residence: string;
  born_city: string;
  tel: string;
  email: string;
  marital: string;
  smoker: string;
  si: string;
  special_habits: string;
}
function PatentBasicInfo() {
  const [patient, setPatient] = useState<IPatientInfo | undefined>(undefined);
  const id = "fds77898";
  const getPatientInfo = async () => {
    try {
      const res = await invoke<IPatientInfo>("get_patient_info", { id });
      setPatient(res);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getPatientInfo();
  }, []); // Added dependency array to prevent infinite loop

  return (
    <div>
      <h2>Patient Basic info</h2>
      <p>Name: {patient?.name}</p>
      <p>Date of Birth: {patient?.dob}</p>
      <p>Gender: {patient?.gender}</p>
      <p>Occupation: {patient?.occupation}</p>
      <p>Residence: {patient?.residence}</p>
      <p>Born City: {patient?.born_city}</p>
      <p>Tel: {patient?.tel}</p>
      <p>Email: {patient?.email}</p>
      <p>Marital Status: {patient?.marital}</p>
      <p>Smoker: {patient?.smoker}</p>
      <p>SI: {patient?.si}</p>
      <p>Special Habits: {patient?.special_habits}</p>
    </div>
  );
}
export default PatentBasicInfo;
