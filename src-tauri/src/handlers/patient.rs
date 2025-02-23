use serde::{Deserialize, Serialize};
use tauri::{AppHandle,Manager};
use rusqlite::{Connection, Result, params, Row};
use uuid::Uuid;
use crate::datastore::db;


#[derive(Debug, Deserialize, Serialize)]
pub struct PatientInfo {
    id: String,
    name: String,
    dob: String,
    gender: String,
    occupation: String,
    residence: String,
    born_city: String,
    tel: String,
    email: String,
    marital: String,
    smoker: String,
    si: String,
    special_habits: String,
}
impl PatientInfo {
    fn from_row(row: &Row) -> rusqlite::Result<Self> {
        Ok(PatientInfo {
            id: row.get(0)?,
            name: row.get(1)?,
            dob: row.get(2)?,
            gender: row.get(3)?,
            occupation: row.get(4)?,
            residence: row.get(5)?,
            born_city: row.get(6)?,
            tel: row.get(7)?,
            email: row.get(8)?,
            marital: row.get(9)?,
            smoker: row.get(10)?,
            si: row.get(11)?,
            special_habits: row.get(12)?,
        })
    }
}

#[tauri::command]
pub fn add_patient(mut data: PatientInfo, window: tauri::Window) -> String {
    let conn = match db::get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return String::from("Failed to connect to database!"),
    };

    data.id = Uuid::new_v4().to_string(); // Generate a new UUID

    let insert_query = "INSERT INTO patients (
        id, name, dob, gender, occupation, residence, born_city, 
        tel, email, marital, smoker, si, special_habits
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    match conn.execute(
        insert_query,
        params![
            &data.id, &data.name, &data.dob, &data.gender, &data.occupation,
            &data.residence, &data.born_city, &data.tel, &data.email,
            &data.marital, &data.smoker, &data.si, &data.special_habits
        ],
    ) {
        Ok(_) => String::from(&data.id),
        Err(_) => String::from("Failed to add new patient!"),
    }
}

#[tauri::command]
pub fn get_patient_info(patient_id: String, window: tauri::Window) -> Result<PatientInfo, String> {
    let conn = match db::get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };
    let mut stmt = conn.prepare("SELECT * FROM patients WHERE id = ?").map_err(|e| e.to_string())?;

    let patient: PatientInfo = stmt.query_row([patient_id], |row| PatientInfo::from_row(row))
        .map_err(|e| e.to_string())?;
    Ok(patient)
}