import { invoke } from "@tauri-apps/api/core";
import { TClinicInfo } from "../types";

export const getClinicInfoApi = async () => {
  try {
    const res = await invoke<TClinicInfo>("get_clinic_info", {});
    return res;
  } catch (e) {
    console.error("Error getting appointment days:", e);
  }
};
export const addClinicInfoApi = async (data: TClinicInfo) => {
  try {
    const res = await invoke<TClinicInfo>("add_clinic_info", { data });
    return res;
  } catch (e) {
    console.error("Error added clinic info:", e);
  }
};
export const updateClinicInfoApi = async (data: TClinicInfo) => {
  try {
    const res = await invoke<TClinicInfo>("update_clinic_info", { data });
    return res;
  } catch (e) {
    console.error("Error clinic info updat:", e);
  }
};
