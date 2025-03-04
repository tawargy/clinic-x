import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import Form from "../components/comman/form/Form";
//import { TPatientInfo } from "../validations/patientInfoSchema";
import { toastSuccess, toastError } from "../utils/toastify";
import { useClinic } from "../contextApi/clinicContext";
import { useAppSettings } from "../contextApi/appContext";
import PatientInfo from "../components/PatientInfo";
import PatientMedicalInfo from "../components/PatientMedicalInfo";
import PatientVisitHistory from "../components/PatientVisitHistory";
import { X } from "lucide-react";
import { TPatientInfo } from "../types";
import { dumy_patient, patientInit } from "../initData";

function PatentBasicInfo() {
  // const [patient, setPatient] = useState<TPatientInfo | undefined>(patientInit);
  const { patientInfo, setPatientInfo } = useClinic();
  const navigate = useNavigate();
  const { darkMode } = useAppSettings();
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
    <div className="container mx-auto px-4 relative">
      <div
        className=" w-7 h-7 flex items-center justify-center bg-white  rounded-md absolute right-0 top-0  cursor-pointer"
        onClick={() => navigate("/")}
      >
        <X
          className="w-full h-full rounded-md bg-red-500 text-white font-bold"
          size={20}
        />
      </div>
      <div
        className={`${darkMode ? "bg-gray-800 text-white" : "bg-white"} w-full  rounded-lg shadow-md p-4 transition-colors duration-200  flex flex-col`}
      >
        {/* Main content */}
        <main className="container mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Patient info */}
            <PatientInfo
              patient={patientInfo}
              onOpenViset={onOpenVisit}
              onSchedule={onSchedule}
              onPatientUpdate={setPatientInfo}
              onSavePatient={updatePatient}
            />
            <div className="lg:col-span-2 flex gap-6 ">
              {/* Right column - Medical info */}
              <PatientMedicalInfo
                patient={patientInfo}
                onPatientUpdate={setPatientInfo}
                onSavePatient={updatePatient}
              />
              {/* Visit History */}
              <PatientVisitHistory patient={patientInfo} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
export default PatentBasicInfo;
