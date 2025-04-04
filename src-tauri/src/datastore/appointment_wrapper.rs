use super::db::get_db_connection;
use crate::types::AppointmentWrapper;
use rusqlite::{params, Result};
use tauri::Manager;
use uuid::Uuid;

pub fn add_appointment_wrapper_db(
    mut appointment_wrapper: AppointmentWrapper,
    window: &tauri::Window,
) -> Result<String, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    // Generate UUID if not provided
    if appointment_wrapper.id.is_empty() {
        appointment_wrapper.id = Uuid::new_v4().to_string();
    }

    // Convert followup_appointments Vec to JSON string
    let followup_appointments_json =
        serde_json::to_string(&appointment_wrapper.followup_appointments)
            .map_err(|e| format!("Failed to serialize followup appointments: {}", e))?;

    let result = conn.execute(
        "INSERT INTO appointment_wrappers (
            id,
            patient_id,
            main_complaint,
            main_appointment,
            followups_num,
            followup_appointments,
            appointment_status,
            date
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
        params![
            appointment_wrapper.id,
            appointment_wrapper.patient_id,
            appointment_wrapper.main_complaint,
            appointment_wrapper.main_appointment,
            appointment_wrapper.followups_num,
            followup_appointments_json,
            appointment_wrapper.appointment_status,
            appointment_wrapper.date,
        ],
    );

    match result {
        Ok(_) => Ok(appointment_wrapper.id),
        Err(e) => Err(format!("Failed to add appointment wrapper: {}", e)),
    }
}

pub fn update_appointment_wrapper_db(
    appointment_wrapper: AppointmentWrapper,
    window: &tauri::Window,
) -> Result<(), String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    // Convert followup_appointments Vec to JSON string
    let followup_appointments_json =
        serde_json::to_string(&appointment_wrapper.followup_appointments)
            .map_err(|e| format!("Failed to serialize followup appointments: {}", e))?;

    let result = conn.execute(
        "UPDATE appointment_wrappers
        SET patient_id = ?2,
            main_complaint = ?3,
            main_appointment = ?4,
            followups_num = ?5,
            followup_appointments = ?6,
            appointment_status = ?7,
            date= ?8
        WHERE id = ?1",
        params![
            appointment_wrapper.id,
            appointment_wrapper.patient_id,
            appointment_wrapper.main_complaint,
            appointment_wrapper.main_appointment,
            appointment_wrapper.followups_num,
            followup_appointments_json,
            appointment_wrapper.appointment_status,
            appointment_wrapper.date,
        ],
    );

    match result {
        Ok(_) => Ok(()),
        Err(e) => Err(format!("Failed to update appointment wrapper: {}", e)),
    }
}

pub fn get_all_appointment_wrappers_db(
    patient_id: String, // Added patient_id parameter
    window: &tauri::Window,
) -> Result<Vec<AppointmentWrapper>, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let mut stmt = conn
        .prepare(
            "SELECT id, patient_id, main_complaint, main_appointment,
             followups_num, followup_appointments, appointment_status, date
             FROM appointment_wrappers
             WHERE patient_id = ?1", // Added WHERE clause to filter by patient_id
        )
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    let wrapper_iter = stmt
        .query_map(params![patient_id], |row| {
            // Added params![patient_id]
            let followup_appointments_json: String = row.get(5)?;
            let followup_appointments: Vec<String> =
                serde_json::from_str(&followup_appointments_json).map_err(|e| {
                    rusqlite::Error::FromSqlConversionFailure(
                        0,
                        rusqlite::types::Type::Text,
                        Box::new(e),
                    )
                })?;

            Ok(AppointmentWrapper {
                id: row.get(0)?,
                patient_id: row.get(1)?,
                main_complaint: row.get(2)?,
                main_appointment: row.get(3)?,
                followups_num: row.get(4)?,
                followup_appointments,
                appointment_status: row.get(6)?,
                date: row.get(7)?,
            })
        })
        .map_err(|e| format!("Failed to execute query: {}", e))?;

    let mut appointment_wrappers = Vec::new();
    for wrapper in wrapper_iter {
        match wrapper {
            Ok(w) => appointment_wrappers.push(w),
            Err(e) => return Err(format!("Error processing row: {}", e)),
        }
    }

    Ok(appointment_wrappers)
}

pub fn get_last_appointment_wrapper_by_patient_id(
    patient_id: String,
    window: &tauri::Window,
) -> Result<AppointmentWrapper, String> {
    // Changed return type to non-Optional
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let mut stmt = conn
        .prepare(
            "SELECT id, patient_id, main_complaint, main_appointment,
             followups_num, followup_appointments, appointment_status, date
             FROM appointment_wrappers
             WHERE patient_id = ?1
             ORDER BY rowid DESC
             LIMIT 1",
        )
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    let wrapper_iter = stmt
        .query_map(params![patient_id], |row| {
            let followup_appointments_json: String = row.get(5)?;
            let followup_appointments: Vec<String> =
                serde_json::from_str(&followup_appointments_json).map_err(|e| {
                    rusqlite::Error::FromSqlConversionFailure(
                        0,
                        rusqlite::types::Type::Text,
                        Box::new(e),
                    )
                })?;

            Ok(AppointmentWrapper {
                id: row.get(0)?,
                patient_id: row.get(1)?,
                main_complaint: row.get(2)?,
                main_appointment: row.get(3)?,
                followups_num: row.get(4)?,
                followup_appointments,
                appointment_status: row.get(6)?,
                date: row.get(7)?,
            })
        })
        .map_err(|e| format!("Failed to execute query: {}", e))?;

    let mut found_wrapper = None;
    for wrapper_result in wrapper_iter {
        match wrapper_result {
            Ok(wrapper) => {
                found_wrapper = Some(wrapper);
                break;
            }
            Err(e) => return Err(format!("Error processing row: {}", e)),
        }
    }

    match found_wrapper {
        Some(wrapper) => Ok(wrapper),
        None => Err(String::from(
            "No appointment wrapper found for this patient",
        )),
    }
}

pub fn get_appointment_wrapper_by_patient_id_db(
    id: String,
    window: &tauri::Window,
) -> Result<AppointmentWrapper, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let mut stmt = conn
        .prepare(
            "SELECT id, patient_id, main_complaint, main_appointment,
             followups_num, followup_appointments, appointment_status, date
             FROM appointment_wrappers
             WHERE id = ?1",
        )
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    let wrapper_iter = stmt
        .query_map(params![id], |row| {
            let followup_appointments_json: String = row.get(5)?;
            let followup_appointments: Vec<String> =
                serde_json::from_str(&followup_appointments_json).map_err(|e| {
                    rusqlite::Error::FromSqlConversionFailure(
                        0,
                        rusqlite::types::Type::Text,
                        Box::new(e),
                    )
                })?;

            Ok(AppointmentWrapper {
                id: row.get(0)?,
                patient_id: row.get(1)?,
                main_complaint: row.get(2)?,
                main_appointment: row.get(3)?,
                followups_num: row.get(4)?,
                followup_appointments,
                appointment_status: row.get(6)?,
                date: row.get(7)?,
            })
        })
        .map_err(|e| format!("Failed to execute query: {}", e))?;

    let mut found_wrapper = None;
    for wrapper_result in wrapper_iter {
        match wrapper_result {
            Ok(wrapper) => {
                found_wrapper = Some(wrapper);
                break;
            }
            Err(e) => return Err(format!("Error processing row: {}", e)),
        }
    }

    match found_wrapper {
        Some(wrapper) => Ok(wrapper),
        None => Err(String::from("No appointment wrapper found with this ID")),
    }
}

pub fn get_appointment_wrapper_by_id_db(
    id: String,
    window: &tauri::Window,
) -> Result<AppointmentWrapper, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let mut stmt = conn
        .prepare(
            "SELECT id, patient_id, main_complaint, main_appointment,
            followups_num, followup_appointments, appointment_status, date
            FROM appointment_wrappers
            WHERE id = ?1",
        )
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    let wrapper_iter = stmt
        .query_map(params![id], |row| {
            let followup_appointments_json: String = row.get(5)?;
            let followup_appointments: Vec<String> =
                serde_json::from_str(&followup_appointments_json).map_err(|e| {
                    rusqlite::Error::FromSqlConversionFailure(
                        0,
                        rusqlite::types::Type::Text,
                        Box::new(e),
                    )
                })?;

            Ok(AppointmentWrapper {
                id: row.get(0)?,
                patient_id: row.get(1)?,
                main_complaint: row.get(2)?,
                main_appointment: row.get(3)?,
                followups_num: row.get(4)?,
                followup_appointments,
                appointment_status: row.get(6)?,
                date: row.get(7)?,
            })
        })
        .map_err(|e| format!("Failed to execute query: {}", e))?;

    let mut found_wrapper = None;
    for wrapper_result in wrapper_iter {
        match wrapper_result {
            Ok(wrapper) => {
                found_wrapper = Some(wrapper);
                break;
            }
            Err(e) => return Err(format!("Error processing row: {}", e)),
        }
    }

    match found_wrapper {
        Some(wrapper) => Ok(wrapper),
        None => Err(String::from("No appointment wrapper found with this ID")),
    }
}
