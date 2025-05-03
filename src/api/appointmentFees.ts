import { invoke } from "@tauri-apps/api/core";
import { TAppointmentFees } from "../types";

export const addAppointmentFeesApi = async (data: TAppointmentFees) => {
  try {
    const res = await invoke("add_appointment_fees", {
      appointmentFees: data,
    });
    return res as string;
  } catch (e) {
    console.error("Faild to add appointment Fees", e);
  }
};
export const getAppointmentFeesByDateApi = async (date: string) => {
  try {
    const res = await invoke<TAppointmentFees[]>(
      "get_appointment_fees_by_date",
      {
        date,
      }
    );
    return res;
  } catch (e) {
    console.error("Faild to get appointment Fees by date", e);
  }
};

export const getAppointmentFeesByMonthApi = async (month: string) => {
  try {
    // Format the month parameter to match the expected format (MM-YYYY)
    const formattedMonth = month.split('-')[1] + '-' + month.split('-')[2];
    const res = await invoke<TAppointmentFees[]>(
      "get_appointment_fees_by_month",
      {
        month: formattedMonth,
      }
    );
    return res;
  } catch (e) {
    console.error("Failed to get appointment fees by month", e);
    throw e;
  }
};
