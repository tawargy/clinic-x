import { invoke } from "@tauri-apps/api/core";
import { TPatientInfo } from "../types";
type TPatient = {
  id: string;
  name: string;
};
export const addPatientApi = async (data: TPatientInfo) => {
  try {
    const res = await invoke<string>("add_patient", { data: data });
    return res;
  } catch (e) {
    console.log(e);
  }
};
export const getPatientInfoByIdApi = async (id: string) => {
  if (!id) return;
  try {
    const res = await invoke<TPatientInfo>("get_patient_by_id", {
      patientId: id,
    });
    return res;
  } catch (e) {
    console.log(e);
  }
};
export const searchPatientApi = async (input: string) => {
  try {
    const res = await invoke<TPatient[]>("search_patients", {
      searchTerm: input,
    });
    return res;
  } catch (e) {
    console.log("Search error", e);
  }
};
export const updatePatientApi = async (id: string, patient: TPatientInfo) => {
  try {
    const res = await invoke("update_patient", {
      id,
      data: patient,
    });
    return res;
  } catch (e) {
    console.log(e);
  }
};
