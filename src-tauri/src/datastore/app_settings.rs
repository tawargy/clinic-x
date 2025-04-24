use super::db::get_db_connection;
use rusqlite::{params, Result};
use tauri::Manager;

const APP_SETTINGS_ID: &str = "app_settings"; // Constant ID for the single app settings record

// Complete the add_public_key_db function
pub fn add_public_key_db(public_key: String, window: tauri::Window) -> Result<String, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    match conn.execute(
        "INSERT INTO app_settings (id, public_key) VALUES (?1, ?2)
         ON CONFLICT(id) DO UPDATE SET public_key = ?2",
        params![APP_SETTINGS_ID, public_key],
    ) {
        Ok(_) => Ok(String::from("Public key added successfully")),
        Err(e) => Err(format!("Failed to add public key: {}", e)),
    }
}

// Get public key from database
pub fn get_public_key_db(window: tauri::Window) -> Result<Option<String>, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let mut stmt = match conn.prepare("SELECT public_key FROM app_settings WHERE id = ?1") {
        Ok(stmt) => stmt,
        Err(e) => return Err(format!("Failed to prepare statement: {}", e)),
    };

    let public_key = match stmt.query_row(params![APP_SETTINGS_ID], |row| {
        row.get::<_, Option<String>>(0)
    }) {
        Ok(key) => key,
        Err(rusqlite::Error::QueryReturnedNoRows) => None,
        Err(e) => return Err(format!("Failed to query public key: {}", e)),
    };

    Ok(public_key)
}

// Update public key in database
pub fn update_public_key_db(public_key: String, window: tauri::Window) -> Result<String, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    match conn.execute(
        "UPDATE app_settings SET public_key = ?1 WHERE id = ?2",
        params![public_key, APP_SETTINGS_ID],
    ) {
        Ok(updated) => {
            if updated == 0 {
                // No rows were updated, insert instead
                return add_public_key_db(public_key, window);
            }
            Ok(String::from("Public key updated successfully"))
        }
        Err(e) => Err(format!("Failed to update public key: {}", e)),
    }
}

// Add or update db_backup_path
pub fn add_db_backup_path_db(backup_path: String, window: tauri::Window) -> Result<String, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    match conn.execute(
        "INSERT INTO app_settings (id, db_backup_path) VALUES (?1, ?2)
         ON CONFLICT(id) DO UPDATE SET db_backup_path = ?2",
        params![APP_SETTINGS_ID, backup_path],
    ) {
        Ok(_) => Ok(String::from("Backup path added successfully")),
        Err(e) => Err(format!("Failed to add backup path: {}", e)),
    }
}

// Get db_backup_path from database
pub fn get_db_backup_path_db(window: tauri::Window) -> Result<Option<String>, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let mut stmt = match conn.prepare("SELECT db_backup_path FROM app_settings WHERE id = ?1") {
        Ok(stmt) => stmt,
        Err(e) => return Err(format!("Failed to prepare statement: {}", e)),
    };

    let backup_path = match stmt.query_row(params![APP_SETTINGS_ID], |row| {
        row.get::<_, Option<String>>(0)
    }) {
        Ok(path) => path,
        Err(rusqlite::Error::QueryReturnedNoRows) => None,
        Err(e) => return Err(format!("Failed to query backup path: {}", e)),
    };

    Ok(backup_path)
}

// Update db_backup_path in database
pub fn update_db_backup_path_db(
    backup_path: String,
    window: tauri::Window,
) -> Result<String, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    match conn.execute(
        "UPDATE app_settings SET db_backup_path = ?1 WHERE id = ?2",
        params![backup_path, APP_SETTINGS_ID],
    ) {
        Ok(updated) => {
            if updated == 0 {
                // No rows were updated, insert instead
                return add_db_backup_path_db(backup_path, window);
            }
            Ok(String::from("Backup path updated successfully"))
        }
        Err(e) => Err(format!("Failed to update backup path: {}", e)),
    }
}
