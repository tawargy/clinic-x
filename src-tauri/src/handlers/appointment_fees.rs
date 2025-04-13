use crate::datastore::appointment_fees;
use crate::types::AppointmentFees;

#[tauri::command]
pub fn add_appointment_fees(
    appointment_fees: AppointmentFees,
    window: tauri::Window,
) -> Result<String, String> {
    appointment_fees::add_appointment_fees_db(appointment_fees, &window)
}
#[tauri::command]
pub fn get_appointment_fees_by_date(
    date: String,
    window: tauri::Window,
) -> Result<Vec<AppointmentFees>, String> {
    appointment_fees::get_appointment_fees_by_date_db(date, &window)
}
#[tauri::command]
pub fn get_appointment_fees_by_id(
    id: String,
    window: tauri::Window,
) -> Result<AppointmentFees, String> {
    appointment_fees::get_appointment_fees_by_id_db(id, &window)
}

#[tauri::command]
pub fn get_appointment_fees_by_patient_id(
    patient_id: String,
    window: tauri::Window,
) -> Result<Vec<AppointmentFees>, String> {
    appointment_fees::get_appointment_fees_by_patient_id_db(patient_id, &window)
}
