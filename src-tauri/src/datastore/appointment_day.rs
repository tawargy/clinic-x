use super::db::get_db_connection;
use crate::types::AppointmentDay;
use rusqlite::Result;
use serde_json;
use tauri::Manager;
use uuid::Uuid;

pub fn add_appointment_day_db(
    appointment_day: AppointmentDay,
    window: &tauri::Window,
) -> Result<String, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    // Check if day already exists
    let existing_day = get_appointment_days_by_date_db(appointment_day.day.clone(), window)?;

    match existing_day {
        Some(mut existing_appointment) => {
            // Day exists, append new patient data
            existing_appointment
                .patient_data
                .extend(appointment_day.patient_data);

            // Convert updated patient_data to JSON
            let updated_patient_data_json =
                match serde_json::to_string(&existing_appointment.patient_data) {
                    Ok(json) => json,
                    Err(_) => {
                        return Err(String::from("Failed to serialize updated patient data!"))
                    }
                };

            // Update existing record
            match conn.execute(
                "UPDATE appointment_days SET prescription_data = ?1 WHERE day = ?2",
                &[&updated_patient_data_json, &appointment_day.day],
            ) {
                Ok(_) => Ok(existing_appointment.id),
                Err(e) => Err(format!("Failed to update appointment day: {}", e)),
            }
        }
        None => {
            // Day doesn't exist, create new record
            let id = Uuid::new_v4().to_string();

            let patient_data_json = match serde_json::to_string(&appointment_day.patient_data) {
                Ok(json) => json,
                Err(_) => return Err(String::from("Failed to serialize patient data!")),
            };

            match conn.execute(
                "INSERT INTO appointment_days (id, day, prescription_data) VALUES (?1, ?2, ?3)",
                &[&id, &appointment_day.day, &patient_data_json],
            ) {
                Ok(_) => Ok(id),
                Err(e) => Err(format!("Failed to insert appointment day: {}", e)),
            }
        }
    }
}
pub fn get_appointment_days_by_date_db(
    date: String,
    window: &tauri::Window,
) -> Result<Option<AppointmentDay>, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let mut stmt = match conn
        .prepare("SELECT id, day, prescription_data FROM appointment_days WHERE day = ?1")
    {
        Ok(stmt) => stmt,
        Err(e) => return Err(format!("Failed to prepare statement: {}", e)),
    };

    let mut rows = match stmt.query(&[&date]) {
        Ok(rows) => rows,
        Err(e) => return Err(format!("Failed to execute query: {}", e)),
    };

    if let Some(row) = rows.next().unwrap_or(None) {
        let id: String = row.get(0).unwrap();
        let day: String = row.get(1).unwrap();
        let patient_data_json: String = row.get(2).unwrap();

        let patient_data = match serde_json::from_str(&patient_data_json) {
            Ok(data) => data,
            Err(_) => return Err(String::from("Failed to deserialize patient data!")),
        };

        Ok(Some(AppointmentDay {
            id,
            day,
            patient_data,
        }))
    } else {
        Ok(None)
    }
}

pub fn remove_patient_from_appointment_day_db(
    day: String,
    patient_id: String,
    window: &tauri::Window,
) -> Result<(), String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    // First get the appointment day
    let existing_day = get_appointment_days_by_date_db(day.clone(), window)?;

    match existing_day {
        Some(mut appointment_day) => {
            // Filter out the patient with matching ID
            appointment_day
                .patient_data
                .retain(|patient| patient.patient_id != patient_id);

            // Convert updated patient_data to JSON
            let updated_patient_data_json =
                match serde_json::to_string(&appointment_day.patient_data) {
                    Ok(json) => json,
                    Err(_) => {
                        return Err(String::from("Failed to serialize updated patient data!"))
                    }
                };

            // Update the database
            match conn.execute(
                "UPDATE appointment_days SET prescription_data = ?1 WHERE day = ?2",
                &[&updated_patient_data_json, &day],
            ) {
                Ok(_) => Ok(()),
                Err(e) => Err(format!("Failed to update appointment day: {}", e)),
            }
        }
        None => Err(String::from("Appointment day not found!")),
    }
}
