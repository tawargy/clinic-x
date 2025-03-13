use crate::datastore::recent::get_recent_patients_db;
use crate::types::Patient;

#[tauri::command]
pub fn get_queue() -> Result<Vec<Patient>, String> {
    Ok(vec![])
}

#[tauri::command]
pub fn get_recently(window: tauri::Window) -> Result<Vec<Patient>, String> {
    get_recent_patients_db(window)
}
