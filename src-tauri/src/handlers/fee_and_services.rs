use crate::datastore::fee_and_services;
use crate::types::FeeAndServices;

#[tauri::command]
pub fn add_fee_and_services(data: FeeAndServices, window: tauri::Window) -> Result<String, String> {
    fee_and_services::add_fee_and_services_db(data, window)
}

#[tauri::command]
pub fn update_fee_and_services(data: FeeAndServices, window: tauri::Window) -> Result<(), String> {
    fee_and_services::update_fee_and_services_db(data, window)
}

#[tauri::command]
pub fn get_fee_and_services(window: tauri::Window) -> Result<FeeAndServices, String> {
    fee_and_services::get_fee_and_services_db(window)
}
