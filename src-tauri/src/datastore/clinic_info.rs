use super::db::get_db_connection;
use crate::types::{AppointmentsTime, ClinicInfo};
use rusqlite::{params_from_iter, Result};
use serde_json;
use tauri::Manager;
use uuid::Uuid;

fn vec_to_string(data: &Option<Vec<String>>) -> Option<String> {
    data.as_ref()
        .map(|v| serde_json::to_string(v).unwrap_or_default())
}

fn string_to_vec(data: Option<String>) -> Option<Vec<String>> {
    data.and_then(|s| serde_json::from_str(&s).ok())
}

pub fn add_clinic_info_db(mut data: ClinicInfo, window: tauri::Window) -> Result<String, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    if data.id.is_empty() {
        data.id = Uuid::new_v4().to_string();
    }

    let query = "INSERT INTO clinic_info (
        id, clinic_name, speciality, memberships, address, contactus,
        appointments_from, appointments_to, appointments_excepting
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    let values = [
        &data.id as &dyn rusqlite::ToSql,
        &data.clinic_name as &dyn rusqlite::ToSql,
        &data.speciality as &dyn rusqlite::ToSql,
        &vec_to_string(&data.memberships) as &dyn rusqlite::ToSql,
        &data.address as &dyn rusqlite::ToSql,
        &vec_to_string(&data.contactus) as &dyn rusqlite::ToSql,
        &data.appointments.from as &dyn rusqlite::ToSql,
        &data.appointments.to as &dyn rusqlite::ToSql,
        &vec_to_string(&data.appointments.excepting) as &dyn rusqlite::ToSql,
    ];

    match conn.execute(query, params_from_iter(values.iter())) {
        Ok(_) => Ok(data.id),
        Err(e) => Err(format!("Failed to add clinic info: {}", e)),
    }
}

pub fn update_clinic_info_db(data: ClinicInfo, window: tauri::Window) -> Result<String, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let query = "UPDATE clinic_info SET
        clinic_name = ?,
        speciality = ?,
        memberships = ?,
        address = ?,
        contactus = ?,
        appointments_from = ?,
        appointments_to = ?,
        appointments_excepting = ?
        WHERE id = ?";

    let values = [
        &data.clinic_name as &dyn rusqlite::ToSql,
        &data.speciality as &dyn rusqlite::ToSql,
        &vec_to_string(&data.memberships) as &dyn rusqlite::ToSql,
        &data.address as &dyn rusqlite::ToSql,
        &vec_to_string(&data.contactus) as &dyn rusqlite::ToSql,
        &data.appointments.from as &dyn rusqlite::ToSql,
        &data.appointments.to as &dyn rusqlite::ToSql,
        &vec_to_string(&data.appointments.excepting) as &dyn rusqlite::ToSql,
        &data.id as &dyn rusqlite::ToSql,
    ];

    match conn.execute(query, params_from_iter(values.iter())) {
        Ok(rows) if rows > 0 => Ok(String::from("Clinic info updated successfully!")),
        Ok(_) => Err(String::from("No clinic info found with this ID")),
        Err(e) => Err(format!("Failed to update clinic info: {}", e)),
    }
}

pub fn get_clinic_info_db(window: tauri::Window) -> Result<ClinicInfo, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let mut stmt = conn
        .prepare(
            "SELECT id, clinic_name, speciality, memberships, address, contactus,
             appointments_from, appointments_to, appointments_excepting
             FROM clinic_info LIMIT 1",
        )
        .map_err(|e| e.to_string())?;

    let result = stmt.query_row([], |row| {
        Ok(ClinicInfo {
            id: row.get(0)?,
            clinic_name: row.get(1)?,
            speciality: row.get(2)?,
            memberships: string_to_vec(row.get(3)?),
            address: row.get(4)?,
            contactus: string_to_vec(row.get(5)?),
            appointments: AppointmentsTime {
                from: row.get(6)?,
                to: row.get(7)?,
                excepting: string_to_vec(row.get(8)?),
            },
        })
    });

    match result {
        Ok(info) => Ok(info),
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(ClinicInfo {
            id: String::new(),
            clinic_name: None,
            speciality: None,
            memberships: None,
            address: None,
            contactus: None,
            appointments: AppointmentsTime {
                from: None,
                to: None,
                excepting: None,
            },
        }),
        Err(e) => Err(e.to_string()),
    }
}
