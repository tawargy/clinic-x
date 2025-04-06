use super::db::get_db_connection;
use crate::types::{AllDiagnosis, Diagnosis};
use rusqlite::{params, Result};
use serde_json;
use tauri::Manager;
use uuid::Uuid;

pub fn add_diagnosis_db(
    diagnosis: Vec<Diagnosis>,
    window: &tauri::Window,
) -> Result<String, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };
    // Generate new ID for AllDiagnosis
    let all_diagnosis_id = Uuid::new_v4().to_string();

    // Convert to JSON
    let json = match serde_json::to_string(&diagnosis) {
        Ok(j) => j,
        Err(e) => return Err(format!("Failed to serialize diagnoses: {}", e)),
    };

    // Insert new record
    let result = conn.execute(
        "INSERT INTO all_diagnosis (id, diagnosis) VALUES (?, ?)",
        params![all_diagnosis_id, json],
    );

    match result {
        Ok(_) => Ok(all_diagnosis_id),
        Err(e) => Err(format!("Failed to save diagnoses: {}", e)),
    }
}

pub fn get_all_diagnosis_by_id_db(
    all_diagnosis_id: String,
    window: &tauri::Window,
) -> Result<AllDiagnosis, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let mut stmt = match conn.prepare("SELECT diagnosis FROM all_diagnosis WHERE id = ?") {
        Ok(stmt) => stmt,
        Err(e) => return Err(format!("Failed to prepare statement: {}", e)),
    };

    let diagnosis_json: String = match stmt.query_row([all_diagnosis_id.clone()], |row| row.get(0))
    {
        Ok(json) => json,
        Err(e) => return Err(format!("Failed to fetch diagnosis: {}", e)),
    };

    let diagnoses: Vec<Diagnosis> = match serde_json::from_str(&diagnosis_json) {
        Ok(d) => d,
        Err(e) => return Err(format!("Failed to parse diagnosis JSON: {}", e)),
    };

    Ok(AllDiagnosis {
        id: all_diagnosis_id,
        diagnosis: Some(diagnoses),
    })
}

pub fn update_all_diagnosis_db(
    all_diagnosis: AllDiagnosis,
    window: &tauri::Window,
) -> Result<(), String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let json = match serde_json::to_string(&all_diagnosis.diagnosis) {
        Ok(j) => j,
        Err(e) => return Err(format!("Failed to serialize diagnosis: {}", e)),
    };

    let result = conn.execute(
        "UPDATE all_diagnosis SET diagnosis = ? WHERE id = ?",
        params![json, all_diagnosis.id],
    );

    match result {
        Ok(_) => Ok(()),
        Err(e) => Err(format!("Failed to update diagnosis: {}", e)),
    }
}
