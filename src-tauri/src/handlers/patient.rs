use crate::datastore::patient;
use crate::datastore::search;
use crate::types::Patient;

#[tauri::command]
pub fn add_patient(data: Patient, window: tauri::Window) -> Result<String, String> {
    let id = patient::add_patient_db(data, window);
    id
}

#[tauri::command]
pub fn get_patient_by_id(patient_id: String, window: tauri::Window) -> Result<Patient, String> {
    let patient_res = patient::get_patient_by_id_db(patient_id, window);
    patient_res
}

#[tauri::command]
pub fn update_patient(id: String, data: Patient, window: tauri::Window) -> Result<String, String> {
    patient::update_patient_db(id, data, window)
}

#[tauri::command]
pub fn delete_patient(id: String, window: tauri::Window) -> Result<String, String> {
    patient::delete_patient_db(id, window)
}

#[tauri::command]
pub fn search_patients(search_term: String, window: tauri::Window) -> Result<Vec<Patient>, String> {
    search::search_patients_db(search_term, window)
}
