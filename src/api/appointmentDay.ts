import { invoke } from "@tauri-apps/api/core";
import { TPatientInfoQ } from "../types";

export const getAppointmentDaysApi = async (date: string) => {
  try {
    const res = await invoke("get_appointment_days", {
      date,
    });

    return res?.patient_data;
    //return res;
  } catch (e) {
    console.error("Error getting appointment days:", e);
    return [];
  }
};
export const addAppointmentDayApi = async (data: {
  id?: string;
  day: string;
  patient_data: TPatientInfoQ[];
}) => {
  console.log(data);

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

export const updatePatientTimeApi = async (
  day: string,
  patientId: string,
  newTime: string,
) => {
  try {
    const res = await invoke("update_patient_time", {
      day,
      patientId,
      newTime,
    });
    return res;
  } catch (e) {
    console.error("Error updating patient time:", e);
    throw e;
  }
};
