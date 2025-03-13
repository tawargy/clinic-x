use crate::datastore::appointment;
use crate::types::Appointment;

#[tauri::command]
pub async fn add_appointment(
    appointment: Appointment,
    window: tauri::Window,
) -> Result<String, String> {
    appointment::add_appointment_db(appointment, &window).map_err(|e| e.to_string())
}
