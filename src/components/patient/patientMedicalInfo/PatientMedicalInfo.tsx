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
      setPatientMedicalHistory(res);
      setOriginalPatientMedicalHistory(res);
      setIsPatientMedicalHistory(res.id !== "");
      // console.log("Medical history data:", res);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getPatientMedicalHistory();
  }, []);

  const addPatientMedicalHistory = async (data: TpatientMedicalHistory) => {
    // console.log("id", id, "data", data);
    try {
      const res = (await invoke("add_patient_medical_history", {
        id,
        data,
      })) as TpatientMedicalHistory;

      await getPatientMedicalHistory();
      toastSuccess("Medical History Added Successfully");
      //   console.log("add", res);
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

      await getPatientMedicalHistory();
      toastSuccess("Medical History Updated Successfully");
      // console.log("update", res);
    } catch (e) {
      toastError("Error Updating Medical History");
      console.log("update", e);
    }
  };

  const onSaveHandler = () => {
    const updatedMedicalHistory = {
      ...patientMedicalHistory,
      id: patientMedicalHistory.id,
      patient_id: id || "",
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

  const savePatientMedicalHistory = async (
    updatedData: TpatientMedicalHistory,
  ) => {
    const dataToSave = {
      ...updatedData,
      patient_id: id || "",
    };

    try {
      if (isPatientMedicalHistory) {
        await invoke("update_patient_medical_history", { data: dataToSave });
        toastSuccess("Medical History Updated Successfully");
      } else {
        await invoke("add_patient_medical_history", { id, data: dataToSave });
        toastSuccess("Medical History Added Successfully");
      }

      await getPatientMedicalHistory();
    } catch (e) {
      console.error("Error saving medical history:", e);
      toastError("Error Saving Medical History");
    }
  };
  return (
    <PatientColLayout>
      <div>
        <div className="text-lg font-semibold mb-4 flex items-center">
          <h3 className="flex items-center gap-2">
            <Pill className="mr-2 text-green-500" size={18} />
            <span>Medical Information</span>
          </h3>
        </div>
        <MedicalHistory
          patientMedicalHistory={patientMedicalHistory}
          setPatientMedicalHistory={setPatientMedicalHistory}
          originalData={originalPatientMedicalHistory}
          onSave={savePatientMedicalHistory}
        />
        <PastHistory
          patientId={id || ""}
          isEdit={isEdit}
          patientMedicalHistory={patientMedicalHistory}
          setPatientMedicalHistory={setPatientMedicalHistory}
        />
        <FamilyHistoryAndNotes
          patientMedicalHistory={patientMedicalHistory}
          setPatientMedicalHistory={setPatientMedicalHistory}
          originalData={originalPatientMedicalHistory}
          onSave={savePatientMedicalHistory}
        />
      </div>
    </PatientColLayout>
  );
}

export default PatientMedicalInfo;
