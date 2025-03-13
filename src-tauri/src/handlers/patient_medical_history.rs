use crate::datastore::patient_midcal_history;
use crate::types::PatientMedicalHistory;

#[tauri::command]
pub fn get_patient_medical_history(
    id: String,
    window: tauri::Window,
) -> Result<PatientMedicalHistory, String> {
    let patien_med = patient_midcal_history::get_patient_medical_history_db(id, window);
    patien_med
}

#[tauri::command]
pub async fn add_patient_medical_history(
    id: String,
    data: PatientMedicalHistory,
    window: tauri::Window,
) -> Result<String, String> {
    patient_midcal_history::add_patient_medical_history_db(id, data, window)
}

#[tauri::command]
pub async fn update_patient_medical_history(
    data: PatientMedicalHistory,
    window: tauri::Window,
) -> Result<String, String> {
    patient_midcal_history::update_patient_medical_history_db(data, window)
}
