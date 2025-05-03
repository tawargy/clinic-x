use crate::datastore::expenses::{
    add_expenses_db, get_expenses_by_month_db, update_expenses_by_id_db, update_expenses_db,
};
use crate::types::Expenses;

#[tauri::command]
pub fn add_expenses(data: Expenses, window: tauri::Window) -> Result<String, String> {
    add_expenses_db(data, window)
}

#[tauri::command]
pub fn update_expenses(data: Expenses, window: tauri::Window) -> Result<String, String> {
    update_expenses_db(data, window)
}

#[tauri::command]
pub fn get_expenses_by_month(
    month: String,
    window: tauri::Window,
) -> Result<Option<Expenses>, String> {
    get_expenses_by_month_db(month, window)
}

#[tauri::command]
pub fn update_expenses_by_id(
    id: String,
    data: Expenses,
    window: tauri::Window,
) -> Result<bool, String> {
    update_expenses_by_id_db(id, data, window)
}
