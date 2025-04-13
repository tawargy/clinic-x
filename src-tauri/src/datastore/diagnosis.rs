use super::db::get_db_connection;
use crate::types::{AllDiagnosis, Diagnosis};
use rusqlite::{params, Result};
use serde_json;
use tauri::Manager;
use uuid::Uuid;

pub fn add_diagnosis_db(
    patient_id: String,
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
        "INSERT INTO all_diagnosis (id, patient_id, diagnosis) VALUES (?, ?, ?)",
        params![all_diagnosis_id, patient_id, json],
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

    let mut stmt =
        match conn.prepare("SELECT id, patient_id, diagnosis FROM all_diagnosis WHERE id = ?") {
            Ok(stmt) => stmt,
            Err(e) => return Err(format!("Failed to prepare statement: {}", e)),
        };

    let result = stmt.query_row([all_diagnosis_id], |row| {
        let diagnosis_json: String = row.get(2)?;
        let diagnoses: Vec<Diagnosis> = serde_json::from_str(&diagnosis_json).map_err(|e| {
            rusqlite::Error::FromSqlConversionFailure(0, rusqlite::types::Type::Text, Box::new(e))
        })?;

        Ok(AllDiagnosis {
            id: row.get(0)?,
            patient_id: row.get(1)?,
            diagnosis: Some(diagnoses),
        })
    });

    match result {
        Ok(all_diagnosis) => Ok(all_diagnosis),
        Err(e) => Err(format!("Failed to fetch diagnosis: {}", e)),
    }
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
        "UPDATE all_diagnosis SET diagnosis = ? WHERE id = ? AND patient_id = ?",
        params![json, all_diagnosis.id, all_diagnosis.patient_id],
    );

    match result {
        Ok(_) => Ok(()),
        Err(e) => Err(format!("Failed to update diagnosis: {}", e)),
    }
}

pub fn get_all_diagnosis_by_patient_id_db(
    patient_id: String,
    window: &tauri::Window,
) -> Result<Vec<AllDiagnosis>, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let mut stmt = match conn
        .prepare("SELECT id, patient_id, diagnosis FROM all_diagnosis WHERE patient_id = ?")
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
        let diagnosis_json: String = match row.get(2) {
            Ok(json) => json,
            Err(e) => return Err(format!("Failed to get diagnosis JSON: {}", e)),
        };

        let diagnoses: Vec<Diagnosis> = match serde_json::from_str(&diagnosis_json) {
            Ok(d) => d,
            Err(e) => return Err(format!("Failed to parse diagnosis JSON: {}", e)),
        };

        all_diagnoses.push(AllDiagnosis {
            id: row.get(0).map_err(|e| e.to_string())?,
            patient_id: row.get(1).map_err(|e| e.to_string())?,
            diagnosis: Some(diagnoses),
        });
    }

    Ok(all_diagnoses)
}
