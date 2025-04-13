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

    // Convert arrays/objects to JSON strings
    let vitals_json = serde_json::to_string(&appointment.vitals)
        .map_err(|_| String::from("Failed to serialize vitals data"))?;
    let prescription_json = serde_json::to_string(&appointment.prescription)
        .map_err(|_| String::from("Failed to serialize prescription data"))?;
    // let services_json = serde_json::to_string(&appointment.services)
    //     .map_err(|_| String::from("Failed to serialize services data"))?;

    let id = Uuid::new_v4().to_string();
    appointment.id = id.clone();

    let result = conn.execute(
        "INSERT INTO appointments (
            id,
            patient_id,
            vitals,
            complaint,
            present_history,
            examination,
            provisional_diagnosis,
            prescription,
            requests,
            services,
            created_at
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, CURRENT_TIMESTAMP)",
        params![
            appointment.id,
            appointment.patient_id,
            vitals_json,
            appointment.complaint,
            appointment.present_history,
            appointment.examination,
            appointment.provisional_diagnosis,
            prescription_json,
            appointment.requests,
            // services_json,
            appointment.services,
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
        let vitals_str: String = row.get(2)?;
        let prescription_str: String = row.get(7)?;
        // let services_str: String = row.get(9)?;

        // Parse JSON strings back to their respective types
        let vitals = serde_json::from_str(&vitals_str).map_err(|e| {
            rusqlite::Error::FromSqlConversionFailure(0, rusqlite::types::Type::Text, Box::new(e))
        })?;
        let prescription = serde_json::from_str(&prescription_str).map_err(|e| {
            rusqlite::Error::FromSqlConversionFailure(0, rusqlite::types::Type::Text, Box::new(e))
        })?;
        // let services = serde_json::from_str(&services_str).map_err(|e| {
        //     rusqlite::Error::FromSqlConversionFailure(0, rusqlite::types::Type::Text, Box::new(e))
        // })?;

        Ok(Appointment {
            id: row.get(0)?,
            patient_id: row.get(1)?,
            vitals,
            complaint: row.get(3)?,
            present_history: row.get(4)?,
            examination: row.get(5)?,
            provisional_diagnosis: row.get(6)?,
            prescription,
            requests: row.get(8)?,
            services: row.get(9)?,
            created_at: row.get(10)?,
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
        let vitals_str: String = row.get(2)?;
        let prescription_str: String = row.get(7)?;
        // let services_str: String = row.get(9)?;

        // Parse JSON strings back to their respective types
        let vitals = serde_json::from_str(&vitals_str).map_err(|e| {
            rusqlite::Error::FromSqlConversionFailure(0, rusqlite::types::Type::Text, Box::new(e))
        })?;
        let prescription = serde_json::from_str(&prescription_str).map_err(|e| {
            rusqlite::Error::FromSqlConversionFailure(0, rusqlite::types::Type::Text, Box::new(e))
        })?;
        // let services = serde_json::from_str(&services_str).map_err(|e| {
        //     rusqlite::Error::FromSqlConversionFailure(0, rusqlite::types::Type::Text, Box::new(e))
        // })?;

        Ok(Appointment {
            id: row.get(0)?,
            patient_id: row.get(1)?,
            vitals,
            complaint: row.get(3)?,
            present_history: row.get(4)?,
            examination: row.get(5)?,
            provisional_diagnosis: row.get(6)?,
            prescription,
            requests: row.get(8)?,
            services: row.get(9)?,
            created_at: row.get(10)?,
        })
    });

    match appointment_result {
        Ok(appointment) => Ok(appointment),
        Err(e) => Err(format!("Failed to fetch appointment: {}", e)),
    }
}
