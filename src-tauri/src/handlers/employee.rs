use crate::datastore::employee;
use crate::types::Employee;

#[tauri::command]
pub async fn add_employee(data: Employee, window: tauri::Window) -> Result<String, String> {
    employee::add_employee_db(data, window)
}

#[tauri::command]
pub async fn update_employee_by_id(
    id: String,
    data: Employee,
    window: tauri::Window,
) -> Result<(), String> {
    employee::update_employee_by_id_db(&id, data, window)
}

#[tauri::command]
pub async fn get_employees(window: tauri::Window) -> Result<Vec<Employee>, String> {
    employee::get_employees_db(window)
}

#[tauri::command]
pub async fn get_employee_by_id(id: String, window: tauri::Window) -> Result<Employee, String> {
    employee::get_employee_by_id_db(&id, window)
}

#[tauri::command]
pub async fn delete_employee(id: String, window: tauri::Window) -> Result<(), String> {
    employee::delete_employee_db(&id, window)
}
