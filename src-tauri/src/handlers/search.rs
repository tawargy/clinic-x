use rusqlite::Row;
use serde::{Deserialize, Serialize};

use crate::datastore::db;

#[derive(Serialize, Deserialize)]
pub struct Patient {
    id: String,
    name: String,
}
impl Patient {
    fn from_row(row: &Row) -> rusqlite::Result<Self> {
        Ok(Patient {
            id: row.get(0)?,
            name: row.get(1)?,
        })
    }
    
}

#[tauri::command]
pub fn search_resualt(input: String, window : tauri::Window) -> Vec<Patient> {
    let conn = match db::get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };
    let mut stmt = conn.prepare("SELECT id,name FROM patients WHERE name ilike %?%").map_err(|e| e.to_string())?;

    let patient: Vec<Patient> = stmt.query_row([input], |row| Patient::from_row(row))
        .map_err(|e| e.to_string())?;
    Ok(patient)
}
