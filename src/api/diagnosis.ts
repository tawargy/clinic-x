import { invoke } from "@tauri-apps/api/core";
import { TDiagnosis, TDiagnoses } from "../types";

export const getDiagnosesByIdApi = async (diagnosesId: string) => {
  try {
    const res = await invoke<TDiagnoses>("get_diagnoses_by_id", {
      diagnosesId,
    });
    return res;
  } catch (e) {
    console.error("Error getting diagnoses:", e);
  }
};

export const addDiagnosesApi = async (
  diagnosesArray: TDiagnosis[],
  patientId: string,
) => {
  try {
    const res = await invoke<string>("add_diagnoses", {
      patientId,
      diagnoses: diagnosesArray,
      date: new Date().toISOString(),
    });
    return res;
  } catch (e) {
    console.error("Error adding diagnoses:", e);
  }
};

export const getAllDiagnosesByPatientIdApi = async (patientId: string) => {
  try {
    const res = await invoke<TDiagnoses[]>("get_all_diagnoses_by_patient_id", {
      patientId,
    });
    return res;
  } catch (e) {
    console.error("Error getting patient diagnoses:", e);
    return [];
  }
};

export const updateDiagnosesApi = async (diagnoses: TDiagnoses) => {
  try {
    await invoke<void>("update_diagnoses", {
      diagnoses,
    });
    return true;
  } catch (e) {
    console.error("Error updating diagnoses:", e);
    return false;
  }
};
export const updateDiagnosisApi = async (
  diagnosesId: string,
  diagnosisId: string,
  diagnosisData: {
    diagnosis_title: string;
    diagnosis_type: string;
    start: string;
    end: string;
    comment: string;
  },
) => {
  try {
    // Step 1: Get the complete current diagnoses object
    const diagnoses = await getDiagnosesByIdApi(diagnosesId);

    if (!diagnoses) {
      throw new Error("Diagnoses not found");
    }

    // Step 2: Update the specific diagnosis in the array
    if (diagnoses.diagnoses) {
      diagnoses.diagnoses = diagnoses.diagnoses.map((diagnosis) => {
        if (diagnosis.id === diagnosisId) {
          return {
            ...diagnosis,
            diagnosis_title: diagnosisData.diagnosis_title,
            diagnosis_type: diagnosisData.diagnosis_type,
            start: diagnosisData.start,
            end: diagnosisData.end,
            comment: diagnosisData.comment,
          };
        }
        return diagnosis;
      });
    }

    // Step 3: Update the timestamp
    diagnoses.date = new Date().toISOString();

    // Step 4: Call the existing updateDiagnosesApi to save to backend
    return await updateDiagnosesApi(diagnoses);
  } catch (e) {
    console.error("Error updating diagnosis:", e);
    return false;
  }
};
