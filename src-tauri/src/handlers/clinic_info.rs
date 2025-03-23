use crate::datastore::clinic_info;
use crate::types::ClinicInfo;

#[tauri::command]
pub async fn add_clinic_info(data: ClinicInfo, window: tauri::Window) -> Result<String, String> {
    clinic_info::add_clinic_info_db(data, window)
}

#[tauri::command]
pub async fn update_clinic_info(data: ClinicInfo, window: tauri::Window) -> Result<String, String> {
    clinic_info::update_clinic_info_db(data, window)
}

#[tauri::command]
pub async fn get_clinic_info(window: tauri::Window) -> Result<ClinicInfo, String> {
    clinic_info::get_clinic_info_db(window)
}
