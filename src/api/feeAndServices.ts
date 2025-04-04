import { invoke } from "@tauri-apps/api/core";
import { TFeeAndServices } from "../types";
export const getFeeAndServicesApi = async () => {
  try {
    const result = await invoke<TFeeAndServices>("get_fee_and_services");
    return result;
  } catch (error) {
    console.log(error);
  }
};
export const addFeeAndServicesApi = async (data: TFeeAndServices) => {
  try {
    const res = await invoke<TFeeAndServices>("add_fee_and_services", {
      data,
    });
    return res;
  } catch (error) {
    console.error("Error adding fee and services:", error);
  }
};

export const updateFeeAndServicesApi = async (data: TFeeAndServices) => {
  try {
    const res = await invoke("update_fee_and_services", { data });

    return res;
  } catch (error) {
    console.error("Error updating fee and services:", error);
  }
};
