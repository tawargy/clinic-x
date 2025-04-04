import { invoke } from "@tauri-apps/api/core";
import { TPatientInfoQ } from "../types";

export const getAppointmentDaysApi = async (date: string) => {
  try {
    const res = await invoke("get_appointment_days", {
      date,
    });

    return res?.patient_data as TPatientInfoQ[];
  } catch (e) {
    console.error("Error getting appointment days:", e);
  }
};
export const addAppointmentDayApi = async (data: object) => {
  try {
    const res = await invoke("add_appointment_day", {
      appointmentDay: data,
    });
    return res;
  } catch (e) {
    console.error("Error saving appointment:", e);
  }
};

export const deleteAppointmentDayApi = async (
  patientId: string,
  day: string,
) => {
  try {
    const res = await invoke("remove_patient_from_appointment_day", {
      day: day,
      patientId: patientId,
    });
    return res;
  } catch (e) {
    console.error("Error removing patient from appointment day:", e);
  }
};
