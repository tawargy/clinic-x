use super::db::get_db_connection;
use crate::types::PatientMedicalHistory;
use rusqlite::{params_from_iter, Result};
use tauri::Manager;
use uuid::Uuid;

pub fn get_patient_medical_history_db(
    patient_id: String,
    window: tauri::Window,
) -> Result<PatientMedicalHistory, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let mut stmt = conn
        .prepare(
        "SELECT id, patient_id, allergies, medications, conditions, special_habits, past_history, family_history, notes
         FROM patient_medical_history
         WHERE patient_id = ?"
    )
     .map_err(|e| e.to_string())?;

    let result = stmt.query_row([&patient_id], |row| {
        Ok(PatientMedicalHistory {
            id: row.get(0)?,
            patient_id: row.get(1)?,
            allergies: parse_string_to_vec(row.get(2)?),
            medications: parse_string_to_vec(row.get(3)?),
            conditions: parse_string_to_vec(row.get(4)?),
            special_habits: parse_string_to_vec(row.get(5)?),
            past_history: row.get(6)?,
            family_history: row.get(7)?,
            notes: row.get(8)?,
        })
    });

    match result {
        Ok(history) => Ok(history),
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(PatientMedicalHistory {
            id: String::new(),
            patient_id,
            allergies: None,
            medications: None,
            conditions: None,
            special_habits: None,
            past_history: None,
            family_history: None,
            notes: None,
        }),
        Err(e) => Err(e.to_string()),
    }
}

pub fn add_patient_medical_history_db(
    patient_id: String,
    mut data: PatientMedicalHistory,
    window: tauri::Window,
) -> Result<String, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };
    if data.id.is_empty() {
        data.id = Uuid::new_v4().to_string();
    }

    let query = "INSERT INTO patient_medical_history (
        id, patient_id, allergies, medications, conditions,
        special_habits, past_history, family_history, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    let values = [
        &data.id,
        &patient_id,
        &vec_to_string(&data.allergies) as &dyn rusqlite::ToSql,
        &vec_to_string(&data.medications) as &dyn rusqlite::ToSql,
        &vec_to_string(&data.conditions) as &dyn rusqlite::ToSql,
        &vec_to_string(&data.special_habits) as &dyn rusqlite::ToSql,
        &data.past_history as &dyn rusqlite::ToSql,
        &data.family_history as &dyn rusqlite::ToSql,
        &data.notes as &dyn rusqlite::ToSql,
    ];

    match conn.execute(query, params_from_iter(values.iter())) {
        Ok(_) => Ok(data.id),
        Err(e) => Err(format!("Failed to add medical history: {}", e)),
    }
}

pub fn update_patient_medical_history_db(
    data: PatientMedicalHistory,
    window: tauri::Window,
) -> Result<String, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let query = "UPDATE patient_medical_history SET
        allergies = ?,
        medications = ?,
        conditions = ?,
        special_habits = ?,
        past_history = ?,
        family_history = ?,
        notes = ?
        WHERE id = ?";

    let values = [
        &vec_to_string(&data.allergies) as &dyn rusqlite::ToSql,
        &vec_to_string(&data.medications) as &dyn rusqlite::ToSql,
        &vec_to_string(&data.conditions) as &dyn rusqlite::ToSql,
        &vec_to_string(&data.special_habits) as &dyn rusqlite::ToSql,
        &data.past_history as &dyn rusqlite::ToSql,
        &data.family_history as &dyn rusqlite::ToSql,
        &data.notes as &dyn rusqlite::ToSql,
        &data.id as &dyn rusqlite::ToSql,
    ];

    match conn.execute(query, params_from_iter(values.iter())) {
        Ok(rows) if rows > 0 => Ok(String::from("Medical history updated successfully!")),
        Ok(_) => Err(String::from("No medical history found with this ID")),
        Err(e) => Err(format!("Failed to update medical history: {}", e)),
    }
}

// Helper function to convert Vec<String> to comma-separated string
fn vec_to_string(data: &Option<Vec<String>>) -> Option<String> {
    data.as_ref().map(|v| v.join(","))
}

fn parse_string_to_vec(data: Option<String>) -> Option<Vec<String>> {
    data.map(|s| {
        s.split(',')
            .map(|item| item.trim().to_string())
            .filter(|item| !item.is_empty())
            .collect()
    })
}
