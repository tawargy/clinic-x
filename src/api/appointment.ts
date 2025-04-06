import { invoke } from "@tauri-apps/api/core";
import { formatDate } from "../utils/date";
import { TPrescription, TAppointment } from "../types";

export const addAppointmentApi = async (appointment: TAppointment) => {
  try {
    const res = await invoke<string>("add_appointment", {
      appointment,
    });

    return res;
  } catch (e) {
    console.error("Error saving appointment:", e);
  }
};
export const deleteAppointmentDayApi = async (patientId: string) => {
  try {
    const res = await invoke("remove_patient_from_appointment_day", {
      day: formatDate(new Date()), // Format date as needed
      patientId: patientId,
    });
    console.log("delete", res);
  } catch (e) {
    console.log(e);
  }
};
