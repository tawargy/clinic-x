use crate::datastore::diagnosis;
use crate::types::{AllDiagnosis, Diagnosis};

#[tauri::command]
pub async fn add_diagnosis(
    diagnosis: Vec<Diagnosis>,
    window: tauri::Window,
) -> Result<String, String> {
    diagnosis::add_diagnosis_db(diagnosis, &window)
}

#[tauri::command]
pub async fn get_diagnosis_by_id(
    diagnosis_id: String,
    window: tauri::Window,
) -> Result<AllDiagnosis, String> {
    diagnosis::get_all_diagnosis_by_id_db(diagnosis_id, &window)
}

#[tauri::command]
pub async fn update_diagnosis(
    diagnosis: AllDiagnosis,
    window: tauri::Window,
) -> Result<(), String> {
    diagnosis::update_all_diagnosis_db(diagnosis, &window)
}
