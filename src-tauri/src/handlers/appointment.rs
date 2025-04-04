use crate::datastore::appointment;
use crate::datastore::appointment_wrapper;
use crate::types::{Appointment, AppointmentWrapper};

#[tauri::command]
pub async fn get_all_appointment_wrappers(
    patient_id: String, // Added patient_id parameter
    window: tauri::Window,
) -> Result<Vec<AppointmentWrapper>, String> {
    appointment_wrapper::get_all_appointment_wrappers_db(patient_id, &window)
}
#[tauri::command]
pub async fn get_last_appointment_wrapper_by_patient(
    patient_id: String,
    window: tauri::Window,
) -> Result<AppointmentWrapper, String> {
    // Changed return type to non-Optional
    appointment_wrapper::get_last_appointment_wrapper_by_patient_id(patient_id, &window)
}
#[tauri::command]
pub async fn add_appointment_wrapper(
    appointment: AppointmentWrapper,
    window: tauri::Window,
) -> Result<String, String> {
    appointment_wrapper::add_appointment_wrapper_db(appointment, &window).map_err(|e| e.to_string())
}
#[tauri::command]
pub async fn get_appointment_wrapper_by_id(
    id: String,
    window: tauri::Window,
) -> Result<AppointmentWrapper, String> {
    appointment_wrapper::get_appointment_wrapper_by_id_db(id, &window)
}
#[tauri::command]
pub async fn get_appointment_wrapper_by_patient_id(
    id: String,
    window: tauri::Window,
) -> Result<AppointmentWrapper, String> {
    appointment_wrapper::get_appointment_wrapper_by_patient_id_db(id, &window)
}
#[tauri::command]
pub async fn update_appointment_wrapper(
    appointment: AppointmentWrapper,
    window: tauri::Window,
) -> Result<(), String> {
    appointment_wrapper::update_appointment_wrapper_db(appointment, &window)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn add_appointment(
    appointment: Appointment,
    window: tauri::Window,
) -> Result<String, String> {
    appointment::add_appointment_db(appointment, &window).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_appointments_by_patient_id(
    patient_id: String,
    window: tauri::Window,
) -> Result<Vec<Appointment>, String> {
    appointment::get_appointments_by_patient_id_db(patient_id, &window)
}

#[tauri::command]
pub async fn get_appointment_by_id(
    appointment_id: String,
    window: tauri::Window,
) -> Result<Appointment, String> {
    appointment::get_appointment_by_id_db(appointment_id, &window)
}
