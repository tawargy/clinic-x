use crate::datastore::diagnosis;
use crate::types::{Diagnoses, Diagnosis};

#[tauri::command]
pub async fn add_diagnoses(
    patient_id: String,
    diagnoses: Vec<Diagnosis>,
    date: String,
    window: tauri::Window,
) -> Result<String, String> {
    diagnosis::add_diagnoses_db(patient_id, diagnoses, date, &window)
}

#[tauri::command]
pub async fn get_diagnoses_by_id(
    diagnoses_id: String,
    window: tauri::Window,
) -> Result<Diagnoses, String> {
    diagnosis::get_diagnoses_by_id_db(diagnoses_id, &window)
}

#[tauri::command]
pub async fn update_diagnoses(diagnoses: Diagnoses, window: tauri::Window) -> Result<(), String> {
    diagnosis::update_diagnoses_db(diagnoses, &window)
}

#[tauri::command]
pub async fn get_all_diagnoses_by_patient_id(
    patient_id: String,
    window: tauri::Window,
) -> Result<Vec<Diagnoses>, String> {
    diagnosis::get_all_diagnoses_by_patient_id_db(patient_id, &window)
}
