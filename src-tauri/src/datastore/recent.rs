use super::db::get_db_connection;
use crate::types::Patient;
use rusqlite::Result;
use tauri::Manager;

pub fn get_recent_patients_db(window: tauri::Window) -> Result<Vec<Patient>, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let mut stmt = conn
        .prepare("SELECT * FROM patients ORDER BY rowid DESC LIMIT 10")
        .map_err(|e| e.to_string())?;

    let patients = stmt
        .query_map([], |row| {
            Ok(Patient {
                id: row.get(0)?,
                name: row.get(1)?,
                dob: row.get(2)?,
                age: row.get(3)?,
                gender: row.get(4)?,
                marital_status: row.get(5)?,
                born_city: row.get(6)?,
                residence: row.get(7)?,
                occupation: row.get(8)?,
                phone: row.get(9)?,
                email: row.get(10)?,
                insurance_provider: row.get(11)?,
                insurance_policy_number: row.get(12)?,
                insurance_group_number: row.get(13)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<Patient>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(patients)
}

//.prepare("SELECT * FROM patients ORDER BY created_at DESC LIMIT 10")
