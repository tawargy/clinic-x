use crate::datastore::appointment_day;
use crate::types::AppointmentDay;

#[tauri::command]
pub fn add_appointment_day(
    appointment_day: AppointmentDay,
    window: tauri::Window,
) -> Result<String, String> {
    println!("{:?}", appointment_day);
    appointment_day::add_appointment_day_db(appointment_day, &window)
}

#[tauri::command]
pub fn get_appointment_days(
    date: String,
    window: tauri::Window,
) -> Result<Option<AppointmentDay>, String> {
    appointment_day::get_appointment_days_by_date_db(date, &window)
}
#[tauri::command]
pub fn remove_patient_from_appointment_day(
    day: String,
    patient_id: String,
    window: tauri::Window,
) -> Result<(), String> {
    appointment_day::remove_patient_from_appointment_day_db(day, patient_id, &window)
}
