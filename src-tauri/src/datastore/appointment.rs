use super::db::get_db_connection;
use crate::types::Appointment;
use rusqlite::{params, Result};
use tauri::Manager;
use uuid::Uuid;

pub fn add_appointment_db(
    mut appointment: Appointment,
    window: &tauri::Window,
) -> Result<String, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };
    // Convert prescription Vec to JSON string
    let prescription_json = match serde_json::to_string(&appointment.prescription) {
        Ok(json) => json,
        Err(_) => return Err(String::from("Failed to serialize prescription data")),
    };

    let id = Uuid::new_v4().to_string();
    appointment.id = id.clone();

    let result = conn.execute(
        "INSERT INTO appointments (
            id,
            patient_id,
            past_history,
            complaint,
            present_history,
            examination,
            bp,
            p,
            t,
            rr,
            rbs,
            spo2,
            weight,
            height,
            provisional_diagnosis,
            prescription
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16)",
        params![
            appointment.id,
            appointment.patient_id,
            appointment.past_history,
            appointment.complaint,
            appointment.present_history,
            appointment.examination,
            appointment.bp,
            appointment.p,
            appointment.t,
            appointment.rr,
            appointment.rbs,
            appointment.spo2,
            appointment.weight,
            appointment.height,
            appointment.provisional_diagnosis,
            prescription_json,
        ],
    );

    match result {
        Ok(_) => Ok(id),
        Err(e) => Err(format!("Failed to add appointment: {}", e)),
    }
}

pub fn get_appointments_by_patient_id_db(
    patient_id: String,
    window: &tauri::Window,
) -> Result<Vec<Appointment>, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let mut stmt = match conn
        .prepare("SELECT * FROM appointments WHERE patient_id = ? ORDER BY created_at DESC")
    {
        Ok(stmt) => stmt,
        Err(e) => return Err(format!("Failed to prepare statement: {}", e)),
    };

    let appointment_iter = stmt.query_map([patient_id], |row| {
        // Parse the prescription JSON string back to Vec
        let prescription_str: String = row.get(15)?;
        let prescription = serde_json::from_str(&prescription_str).map_err(|e| {
            rusqlite::Error::FromSqlConversionFailure(0, rusqlite::types::Type::Text, Box::new(e))
        })?;

        Ok(Appointment {
            id: row.get(0)?,
            patient_id: row.get(1)?,
            past_history: row.get(2)?,
            complaint: row.get(3)?,
            present_history: row.get(4)?,
            examination: row.get(5)?,
            bp: row.get(6)?,
            p: row.get(7)?,
            t: row.get(8)?,
            rr: row.get(9)?,
            rbs: row.get(10)?,
            spo2: row.get(11)?,
            weight: row.get(12)?,
            height: row.get(13)?,
            provisional_diagnosis: row.get(14)?,
            prescription,
            created_at: row.get(16)?,
        })
    });

    match appointment_iter {
        Ok(iter) => {
            let mut appointments = Vec::new();
            for appointment in iter {
                match appointment {
                    Ok(app) => appointments.push(app),
                    Err(e) => return Err(format!("Failed to parse appointment: {}", e)),
                }
            }
            Ok(appointments)
        }
        Err(e) => Err(format!("Failed to fetch appointments: {}", e)),
    }
}

pub fn get_appointment_by_id_db(
    appointment_id: String,
    window: &tauri::Window,
) -> Result<Appointment, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let mut stmt = match conn.prepare("SELECT * FROM appointments WHERE id = ?") {
        Ok(stmt) => stmt,
        Err(e) => return Err(format!("Failed to prepare statement: {}", e)),
    };

    let appointment_result = stmt.query_row([appointment_id], |row| {
        // Parse the prescription JSON string back to Vec
        let prescription_str: String = row.get(15)?;
        let prescription = serde_json::from_str(&prescription_str).map_err(|e| {
            rusqlite::Error::FromSqlConversionFailure(0, rusqlite::types::Type::Text, Box::new(e))
        })?;

        Ok(Appointment {
            id: row.get(0)?,
            patient_id: row.get(1)?,
            past_history: row.get(2)?,
            complaint: row.get(3)?,
            present_history: row.get(4)?,
            examination: row.get(5)?,
            bp: row.get(6)?,
            p: row.get(7)?,
            t: row.get(8)?,
            rr: row.get(9)?,
            rbs: row.get(10)?,
            spo2: row.get(11)?,
            weight: row.get(12)?,
            height: row.get(13)?,
            provisional_diagnosis: row.get(14)?,
            prescription,
            created_at: row.get(16)?,
        })
    });

    match appointment_result {
        Ok(appointment) => Ok(appointment),
        Err(e) => Err(format!("Failed to fetch appointment: {}", e)),
    }
}
