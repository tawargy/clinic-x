use serde::{Deserialize, Serialize};
use tauri::{AppHandle,Manager};
use rusqlite::{Connection, Result, params};
use crate::datastore::db;


#[derive(Debug, Deserialize, Serialize)]
pub struct PatientInfo {
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

#[tauri::command]
pub fn add_patient(data: PatientInfo, window: tauri::Window) -> String {
    let conn = match db::get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return String::from("Failed to connect to database!"),
    };

    let insert_query = "INSERT INTO patients (
        name, dob, gender, occupation, residence, born_city, 
        tel, email, marital, smoker, si, special_habits
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    match conn.execute(
        insert_query,
        (
            data.name, data.dob, data.gender, data.occupation,
            data.residence, data.born_city, data.tel, data.email,
            data.marital, data.smoker, data.si, data.special_habits
        ),
    ) {
        Ok(_) => String::from("New patient added successfully!"),
        Err(_) => String::from("Failed to add new patient!"),
    }
}


#[tauri::command]
pub fn get_patient_info(_id: String) -> PatientInfo {
    PatientInfo {
        name: String::from("John Doe"),
        dob: String::from("1990-01-01"),
        gender: String::from("Male"),
        occupation: String::from("Software Engineer"),
        residence: String::from("123 Main Street"),
        born_city: String::from("New York"),
        tel: String::from("+1234567890"),
        email: String::from("john.doe@example.com"),
        marital: String::from("Single"),
        smoker: String::from("No"),
        si: String::from("None"),
        special_habits: String::from("Regular exercise"),
    }
}
