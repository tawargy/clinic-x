import { invoke } from "@tauri-apps/api/core";
import { TAppointmentFees } from "../types";

export const addAppointmentFeesApi = async (data: TAppointmentFees) => {
  try {
    const res = await invoke("add_appointment_fees", {
      appointmentFees: data,
    });
    return res as string;
  } catch (e) {
    console.error("Faild to add wrapper", e);
  }
};
export const getAppointmentFeesByDateApi = async (date: string) => {
  try {
    const res = await invoke<TAppointmentFees[]>(
      "get_appointment_fees_by_date",
      {
        date,
      },
    );
    return res;
  } catch (e) {
    console.error("Faild to add wrapper", e);
  }
};
