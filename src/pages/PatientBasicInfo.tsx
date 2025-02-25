import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import { FaWindowClose } from "react-icons/fa";

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
  const navigate = useNavigate();
  const [patient, setPatient] = useState<IPatientInfo | undefined>(undefined);
  const { id } = useParams();
  const getPatientInfo = async () => {
    try {
      const res = await invoke<IPatientInfo>("get_patient_info", {
        patientId: id,
      });
      setPatient(res);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getPatientInfo();
  }, []);

  return (
    <div className="flex justify-between relative pt-[50px] h-[80vh]  gap-4 p-4 bg-gray-100 mt-4 w-[97%] m-auto  rounded-lg shadow-lg dark:bg-bg-dark  dark:shadow-blue-500/50 ">
      <div className=" w-7 h-7 flex items-center justify-center bg-white p-[1px] rounded-md absolute right-3 top-3  cursor-pointer">
        <FaWindowClose
          onClick={() => navigate("/")}
          className="w-full h-full text-red-500"
        />
      </div>
      <div className="w-[50%] bg-white rounded-md ">
        <h2 className="bg-blue-700 text-center py-4 rounded-t-md text-white lg:text-lg">
          Patient Basic info
        </h2>
        <div className="flex flex-col gap-4 p-4">
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
      </div>
      <div className="w-[50%] bg-white rounded-md flex flex-col gap-4">
        <h2 className="bg-blue-700 text-center py-4 rounded-t-md text-white lg:text-lg">
          Timeline
        </h2>
      </div>
    </div>
  );
}
export default PatentBasicInfo;
