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
