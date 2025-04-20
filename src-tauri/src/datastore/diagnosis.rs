use super::db::get_db_connection;
use crate::types::{Diagnoses, Diagnosis};
use rusqlite::{params, Result};
use serde_json;
use tauri::Manager;
use uuid::Uuid;

pub fn add_diagnoses_db(
    patient_id: String,
    diagnoses: Vec<Diagnosis>,
    date: String,
    window: &tauri::Window,
) -> Result<String, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };
    // Generate new ID for Diagnoses
    let diagnoses_id = Uuid::new_v4().to_string();

    // Convert to JSON
    let json = match serde_json::to_string(&diagnoses) {
        Ok(j) => j,
        Err(e) => return Err(format!("Failed to serialize diagnoses: {}", e)),
    };

    // Insert new record
    let result = conn.execute(
        "INSERT INTO all_diagnoses (id, patient_id, diagnoses, date) VALUES (?, ?, ?, ?)",
        params![diagnoses_id, patient_id, json, date],
    );

    match result {
        Ok(_) => Ok(diagnoses_id),
        Err(e) => Err(format!("Failed to save diagnoses: {}", e)),
    }
}

pub fn get_diagnoses_by_id_db(
    diagnoses_id: String,
    window: &tauri::Window,
) -> Result<Diagnoses, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let mut stmt = match conn
        .prepare("SELECT id, patient_id, diagnoses, date FROM all_diagnoses WHERE id = ?")
    {
        Ok(stmt) => stmt,
        Err(e) => return Err(format!("Failed to prepare statement: {}", e)),
    };

    let result = stmt.query_row([diagnoses_id], |row| {
        let diagnoses_json: String = row.get(2)?;
        let diagnoses_vec: Vec<Diagnosis> = serde_json::from_str(&diagnoses_json).map_err(|e| {
            rusqlite::Error::FromSqlConversionFailure(0, rusqlite::types::Type::Text, Box::new(e))
        })?;

        Ok(Diagnoses {
            id: row.get(0)?,
            patient_id: row.get(1)?,
            diagnoses: Some(diagnoses_vec),
            date: row.get(3)?,
        })
    });

    match result {
        Ok(diagnoses) => Ok(diagnoses),
        Err(e) => Err(format!("Failed to fetch diagnoses: {}", e)),
    }
}

pub fn update_diagnoses_db(diagnoses: Diagnoses, window: &tauri::Window) -> Result<(), String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let json = match serde_json::to_string(&diagnoses.diagnoses) {
        Ok(j) => j,
        Err(e) => return Err(format!("Failed to serialize diagnoses: {}", e)),
    };

    let result = conn.execute(
        "UPDATE all_diagnoses SET diagnoses = ?, date = ? WHERE id = ? AND patient_id = ?",
        params![json, diagnoses.date, diagnoses.id, diagnoses.patient_id],
    );

    match result {
        Ok(_) => Ok(()),
        Err(e) => Err(format!("Failed to update diagnoses: {}", e)),
    }
}

pub fn get_all_diagnoses_by_patient_id_db(
    patient_id: String,
    window: &tauri::Window,
) -> Result<Vec<Diagnoses>, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let mut stmt = match conn
        .prepare("SELECT id, patient_id, diagnoses, date FROM all_diagnoses WHERE patient_id = ?")
    {
        Ok(stmt) => stmt,
        Err(e) => return Err(format!("Failed to prepare statement: {}", e)),
    };

    let mut rows = match stmt.query([patient_id.clone()]) {
        Ok(rows) => rows,
        Err(e) => return Err(format!("Failed to execute query: {}", e)),
    };

    let mut all_diagnoses = Vec::new();

    while let Ok(Some(row)) = rows.next() {
        let diagnoses_json: String = match row.get(2) {
            Ok(json) => json,
            Err(e) => return Err(format!("Failed to get diagnoses JSON: {}", e)),
        };

        let diagnoses_vec: Vec<Diagnosis> = match serde_json::from_str(&diagnoses_json) {
            Ok(d) => d,
            Err(e) => return Err(format!("Failed to parse diagnoses JSON: {}", e)),
        };

        all_diagnoses.push(Diagnoses {
            id: row.get(0).map_err(|e| e.to_string())?,
            patient_id: row.get(1).map_err(|e| e.to_string())?,
            diagnoses: Some(diagnoses_vec),
            date: row.get(3).map_err(|e| e.to_string())?,
        });
    }

    Ok(all_diagnoses)
}
