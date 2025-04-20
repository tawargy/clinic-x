import { invoke } from "@tauri-apps/api/core";
import { TAppointmentWrapper } from "../types";

export const addAppointmentWrapperApi = async (data: TAppointmentWrapper) => {
  try {
    const res = await invoke("add_appointment_wrapper", {
      appointment: data,
    });
    return res;
  } catch (e) {
    console.error("Faild to add wrapper", e);
  }
};
export const updateAppointmentWrapperApi = async (
  data: TAppointmentWrapper,
) => {
  console.log("wrapperApi", data);

  try {
    const res = await invoke("update_appointment_wrapper", {
      appointment: data,
    });
    console.log("update wrapper", res);
  } catch (e) {
    console.error("Faild to update wrapper", e);
  }
};
export const getLastAppointmentWrapperApi = async (
  patientId: string,
  setFn?: (arg: TAppointmentWrapper) => void,
) => {
  try {
    const lastWrapper = await invoke<TAppointmentWrapper>(
      "get_last_appointment_wrapper_by_patient",
      { patientId },
    );
    setFn && setFn(lastWrapper);
    return lastWrapper;
  } catch (error) {
    console.error("Error fetching last appointment wrapper:", error);
    return null;
  }
};

export const getAllAppointmentWrappersApi = async (id: string) => {
  try {
    const wrappers = await invoke<TAppointmentWrapper[]>(
      "get_all_appointment_wrappers",
      { patientId: id },
    );
    return wrappers;
  } catch (error) {
    console.error("Error fetching last appointment wrapper:", error);
  }
};
export const getAppointmentWrapperByIdApi = async (id: string) => {
  try {
    const wrapper = await invoke<TAppointmentWrapper>(
      "get_appointment_wrapper_by_id",
      { id },
    );
    return wrapper;
  } catch (error) {
    console.error("Error fetching last appointment wrapper:", error);
  }
};
