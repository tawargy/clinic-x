import { useState, useEffect } from "react";
import { patientMedicalHistoryInit } from "../../../initData";
import { invoke } from "@tauri-apps/api/core";
import { toastError, toastSuccess } from "../../../utils/toastify";
import { TpatientMedicalHistory } from "../../../types";

import { Pencil, Save, X, Pill } from "lucide-react";
import PatientColLayout from "../../../layouts/PatientColLayout";
import PastHistory from "./PastHistory";
import MedicalHistory from "./MedicalHistory";
import FamilyHistoryAndNotes from "./FamilyHistoryAndNotes";

type Tprops = {
  id: string | undefined;
};
function PatientMedicalInfo({ id }: Tprops) {
  const [isEdit, setIsEdit] = useState(false);
  const [isPatientMedicalHistory, setIsPatientMedicalHistory] = useState(false);
  const [originalPatientMedicalHistory, setOriginalPatientMedicalHistory] =
    useState<TpatientMedicalHistory>(patientMedicalHistoryInit);
  const [patientMedicalHistory, setPatientMedicalHistory] =
    useState<TpatientMedicalHistory>(patientMedicalHistoryInit);

  const getPatientMedicalHistory = async () => {
    try {
      const res = (await invoke("get_patient_medical_history", {
        id,
      })) as TpatientMedicalHistory;
      if (res.id === "") return;
      console.log("hhhh", res);
      setPatientMedicalHistory(res);
      setOriginalPatientMedicalHistory(res);
      setIsPatientMedicalHistory(true);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getPatientMedicalHistory();
  }, []);

  const addPatientMedicalHistory = async (data: TpatientMedicalHistory) => {
    try {
      const res = (await invoke("add_patient_medical_history", {
        id,
        data,
      })) as TpatientMedicalHistory;
      toastSuccess("Medical History Added Successfully");
      console.log("add", res);
    } catch (e) {
      toastError("Error Adding Medical History");
      console.log("add", e);
    }
  };
  const updatePatientMedicalHistory = async (data: TpatientMedicalHistory) => {
    console.log("data update", data);
    try {
      const res = (await invoke("update_patient_medical_history", {
        data,
      })) as TpatientMedicalHistory;
      toastSuccess("Medical History Updated Successfully");
      console.log("update", res);
    } catch (e) {
      toastError("Error Updating Medical History");
      console.log("update", e);
    }
  };

  const onSaveHandler = () => {
    const updatedMedicalHistory = {
      ...patientMedicalHistory,
      id: patientMedicalHistory.id,
      patient_id: id || "", // Make sure patient_id is included
    };
    if (isPatientMedicalHistory) {
      updatePatientMedicalHistory(updatedMedicalHistory);
    } else {
      addPatientMedicalHistory(updatedMedicalHistory);
    }
    setIsEdit(false);
  };
  const onCancelUpdate = () => {
    setPatientMedicalHistory(originalPatientMedicalHistory);
    setIsEdit(false);
  };

  return (
    <PatientColLayout>
      <div>
        <div className=" text-lg font-semibold mb-4 flex items-center justify-between ">
          <h3 className="flex items-center gap-2 ">
            <Pill className="mr-2 text-green-500" size={18} />
            <span>Medical Information</span>
          </h3>

          {isEdit ? (
            <div className="flex items-center gap-2">
              <span onClick={onSaveHandler} className="cursor-pointer ml-8">
                <Save className="text-green-400" size={35} />
              </span>
              <span onClick={onCancelUpdate} className="cursor-pointer">
                <X className="text-red-400" size={35} />
              </span>
            </div>
          ) : (
            <span
              onClick={() => {
                setIsEdit(!isEdit);
              }}
              className="cursor-pointer ml-8"
            >
              <Pencil
                className="text-gray-500 hover:text-green-500"
                size={22}
              />
            </span>
          )}
        </div>
        <MedicalHistory
          isEdit={isEdit}
          patientMedicalHistory={patientMedicalHistory}
          setPatientMedicalHistory={setPatientMedicalHistory}
        />
        <PastHistory
          patientId={id || ""}
          isEdit={isEdit}
          patientMedicalHistory={patientMedicalHistory}
          setPatientMedicalHistory={setPatientMedicalHistory}
        />
        <FamilyHistoryAndNotes
          isEdit={isEdit}
          patientMedicalHistory={patientMedicalHistory}
          setPatientMedicalHistory={setPatientMedicalHistory}
        />
      </div>
    </PatientColLayout>
  );
}

export default PatientMedicalInfo;
