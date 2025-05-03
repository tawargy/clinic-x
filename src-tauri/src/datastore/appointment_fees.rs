use super::db::get_db_connection;
use crate::types::{AppointmentFees, Service};
use rusqlite::{params, Result};
use serde_json;
use tauri::Manager;
use uuid::Uuid;

pub fn add_appointment_fees_db(
    appointment_fees: AppointmentFees,
    window: &tauri::Window,
) -> Result<String, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    // Generate new ID if not provided
    let id = if appointment_fees.id.is_empty() {
        Uuid::new_v4().to_string()
    } else {
        appointment_fees.id
    };

    // Convert services to JSON
    let services_json = match serde_json::to_string(&appointment_fees.services) {
        Ok(j) => j,
        Err(e) => return Err(format!("Failed to serialize services: {}", e)),
    };

    // Insert new record

    let result = conn.execute(
        "INSERT INTO appointment_fees (
            id,
            patient_id,
            patient_name,
            patient_phone,
            appointment_type,
            fee,
            services,
            total_fees,
            date,
            time_stamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        params![
            id,
            appointment_fees.patient_id,
            appointment_fees.patient_name,
            appointment_fees.patient_phone,
            appointment_fees.appointment_type,
            appointment_fees.fee,
            services_json,
            appointment_fees.total_fees,
            appointment_fees.date,
            appointment_fees.time_stamp
        ],
    );

    match result {
        Ok(_) => Ok(id),
        Err(e) => Err(format!("Failed to save appointment fees: {}", e)),
    }
}

// Optional: Add a function to retrieve appointment fees
pub fn get_appointment_fees_by_id_db(
    id: String,
    window: &tauri::Window,
) -> Result<AppointmentFees, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let mut stmt = match conn.prepare(

         "SELECT id, patient_id, patient_name, patient_phone, appointment_type, fee, services, total_fees, date, time_stamp
          FROM appointment_fees WHERE id = ?",
    ) {
        Ok(stmt) => stmt,
        Err(e) => return Err(format!("Failed to prepare statement: {}", e)),
    };

    let result = stmt.query_row([id], |row| {
        let services_json: String = row.get(6)?;
        let services: Vec<Service> = serde_json::from_str(&services_json).map_err(|e| {
            rusqlite::Error::FromSqlConversionFailure(0, rusqlite::types::Type::Text, Box::new(e))
        })?;

        Ok(AppointmentFees {
            id: row.get(0)?,
            patient_id: row.get(1)?,
            patient_name: row.get(2)?,
            patient_phone: row.get(3)?,
            appointment_type: row.get(4)?,
            fee: row.get(5)?,
            services,
            total_fees: row.get(7)?,
            date: row.get(8)?,
            time_stamp: row.get(9)?,
        })
    });

    match result {
        Ok(fees) => Ok(fees),
        Err(e) => Err(format!("Failed to fetch appointment fees: {}", e)),
    }
}

// Optional: Add a function to get appointment fees by patient ID
pub fn get_appointment_fees_by_patient_id_db(
    patient_id: String,
    window: &tauri::Window,
) -> Result<Vec<AppointmentFees>, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let mut stmt = match conn.prepare(

         "SELECT id, patient_id, patient_name, patient_phone, appointment_type, fee, services, total_fees, date, time_stamp
          FROM appointment_fees WHERE patient_id = ?",
    ) {
        Ok(stmt) => stmt,
        Err(e) => return Err(format!("Failed to prepare statement: {}", e)),
    };

    let fees_iter = stmt.query_map([patient_id], |row| {
        let services_json: String = row.get(6)?;
        let services: Vec<Service> = serde_json::from_str(&services_json).map_err(|e| {
            rusqlite::Error::FromSqlConversionFailure(0, rusqlite::types::Type::Text, Box::new(e))
        })?;

        Ok(AppointmentFees {
            id: row.get(0)?,
            patient_id: row.get(1)?,
            patient_name: row.get(2)?,
            patient_phone: row.get(3)?,
            appointment_type: row.get(4)?,
            fee: row.get(5)?,
            services,
            total_fees: row.get(7)?,
            date: row.get(8)?,
            time_stamp: row.get(9)?,
        })
    });

    match fees_iter {
        Ok(iter) => {
            let mut fees = Vec::new();
            for fee in iter {
                match fee {
                    Ok(f) => fees.push(f),
                    Err(e) => return Err(format!("Failed to process appointment fee: {}", e)),
                }
            }
            Ok(fees)
        }
        Err(e) => Err(format!("Failed to fetch appointment fees: {}", e)),
    }
}

pub fn get_appointment_fees_by_date_db(
    date: String,
    window: &tauri::Window,
) -> Result<Vec<AppointmentFees>, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let mut stmt = match conn.prepare(

         "SELECT id, patient_id, patient_name, patient_phone, appointment_type, fee, services, total_fees, date, time_stamp
          FROM appointment_fees WHERE date = ? ORDER BY patient_name",
    ) {
        Ok(stmt) => stmt,
        Err(e) => return Err(format!("Failed to prepare statement: {}", e)),
    };

    let fees_iter = stmt.query_map([date], |row| {
        let services_json: String = row.get(6)?;
        let services: Vec<Service> = serde_json::from_str(&services_json).map_err(|e| {
            rusqlite::Error::FromSqlConversionFailure(0, rusqlite::types::Type::Text, Box::new(e))
        })?;

        Ok(AppointmentFees {
            id: row.get(0)?,
            patient_id: row.get(1)?,
            patient_name: row.get(2)?,
            patient_phone: row.get(3)?,
            appointment_type: row.get(4)?,
            fee: row.get(5)?,
            services,
            total_fees: row.get(7)?,
            date: row.get(8)?,
            time_stamp: row.get(9)?,
        })
    });

    match fees_iter {
        Ok(iter) => {
            let mut fees = Vec::new();
            for fee in iter {
                match fee {
                    Ok(f) => fees.push(f),
                    Err(e) => return Err(format!("Failed to process appointment fee: {}", e)),
                }
            }
            Ok(fees)
        }
        Err(e) => Err(format!("Failed to fetch appointment fees: {}", e)),
    }
}

pub fn get_appointment_fees_by_month_db(
    month: String,
    window: &tauri::Window,
) -> Result<Vec<AppointmentFees>, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let mut stmt = match conn.prepare(
        "SELECT id, patient_id, patient_name, patient_phone, appointment_type, fee, services, total_fees, date, time_stamp
         FROM appointment_fees WHERE substr(date, 4) = ? ORDER BY date",
    ) {
        Ok(stmt) => stmt,
        Err(e) => return Err(format!("Failed to prepare statement: {}", e)),
    };

    let fees_iter = stmt.query_map([month], |row| {
        let services_json: String = row.get(6)?;
        let services: Vec<Service> = serde_json::from_str(&services_json).map_err(|e| {
            rusqlite::Error::FromSqlConversionFailure(0, rusqlite::types::Type::Text, Box::new(e))
        })?;

        Ok(AppointmentFees {
            id: row.get(0)?,
            patient_id: row.get(1)?,
            patient_name: row.get(2)?,
            patient_phone: row.get(3)?,
            appointment_type: row.get(4)?,
            fee: row.get(5)?,
            services,
            total_fees: row.get(7)?,
            date: row.get(8)?,
            time_stamp: row.get(9)?,
        })
    });

    match fees_iter {
        Ok(iter) => {
            let mut fees = Vec::new();
            for fee in iter {
                match fee {
                    Ok(f) => fees.push(f),
                    Err(e) => return Err(format!("Failed to process appointment fee: {}", e)),
                }
            }
            Ok(fees)
        }
        Err(e) => Err(format!("Failed to fetch appointment fees: {}", e)),
    }
}
