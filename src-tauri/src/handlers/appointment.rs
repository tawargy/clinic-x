use crate::datastore::appointment;
use crate::types::Appointment;

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
