import { invoke } from "@tauri-apps/api/core";
import { formatDate } from "../utils/date";
import { toastError, toastSuccess } from "../utils/toastify";
import { TPrescription, TAppointment } from "../types";

export const addAppointmentApi = async (appointment) => {
  try {
    // const appointmentData = {
    //   id: "",
    //   patient_id: patient_id || "",
    //   complaint: appointment.complaint || null,
    //   present_history: appointment.present_history || null,
    //   examination: appointment.examination || null,
    //   provisional_diagnosis: appointment.provisional_diagnosis || null,
    //   past_history: appointment.past_history || null,
    //   bp: appointment.bp || null,
    //   p: appointment.p || null,
    //   t: appointment.t || null,
    //   rr: appointment.rr || null,
    //   rbs: appointment.rbs || null,
    //   spo2: appointment.spo2 || null,
    //   weight: appointment.weight || null,
    //   height: appointment.height || null,
    //   prescription: prescriptions || [],
    //   created_at: formatDate(new Date()),
    // };

    const res = await invoke<string>("add_appointment", {
      appointment,
    });

    return res;
    toastSuccess("Appointment saved & closed successfully!");
  } catch (e) {
    toastError("Faild to save");
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
    toastError("Faild to remove patient from appointment day");
  }
};
