import { invoke } from "@tauri-apps/api/core";
import { TDiagnosis, TAllDiagnosis } from "../types";

export const getDiagnosisByIdApi = async (diagnosisId: string) => {
  try {
    const res = await invoke<TAllDiagnosis>("get_diagnosis_by_id", {
      diagnosisId,
    });
    return res;
  } catch (e) {
    console.error("Error getting appointment days:", e);
  }
};
export const addDiagnosisApi = async (
  allDiagnosis: TDiagnosis[],
  patientId: string,
) => {
  try {
    const res = await invoke("add_diagnosis", {
      patientId,
      diagnosis: allDiagnosis,
    });
    return res as string;
  } catch (e) {
    console.error("Error adding diagnosis:", e);
  }
};
