use crate::datastore::app_settings::{
    add_db_backup_path_db, get_db_backup_path_db, update_db_backup_path_db,
};
use crate::datastore::db::get_db_path;
use std::fs;
use std::path::Path;
use tauri::Manager;

#[tauri::command]
pub fn backup_sqlite_db(
    target_backup_path: String,
    window: tauri::Window,
) -> Result<String, String> {
    // Get the source path from the app
    let source_db_path = get_db_path(&window.app_handle())
        .to_str()
        .ok_or_else(|| "Failed to convert database path to string".to_string())?
        .to_string();

    let source = Path::new(&source_db_path);
    let target = Path::new(&target_backup_path);

    // Check if source file exists
    if !source.exists() {
        return Err(format!(
            "Source database file does not exist: {}",
            source.display()
        ));
    }

    // Create target directory if it doesn't exist
    if let Some(parent) = target.parent() {
        if !parent.exists() {
            if let Err(e) = fs::create_dir_all(parent) {
                return Err(format!("Failed to create target directory: {}", e));
            }
        }
    }

    // Perform the copy
    match fs::copy(source, target) {
        Ok(bytes) => Ok(format!(
            "Database backup completed successfully to {}. {} bytes copied.",
            target.display(),
            bytes
        )),
        Err(e) => Err(format!("Failed to backup database: {}", e)),
    }
}

#[tauri::command]
pub fn add_db_backup_path(backup_path: String, window: tauri::Window) -> Result<String, String> {
    add_db_backup_path_db(backup_path, window)
}

#[tauri::command]
pub fn get_db_backup_path(window: tauri::Window) -> Result<Option<String>, String> {
    get_db_backup_path_db(window)
}

// Add new function to set or update the backup path
#[tauri::command]
pub fn set_db_backup_path(backup_path: String, window: tauri::Window) -> Result<String, String> {
    update_db_backup_path_db(backup_path, window)
}
