use serde::{Deserialize, Serialize};
use tauri::Manager;
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
pub fn add_patient(app_handle: tauri::AppHandle, data: PatientInfo) -> String {
    let conn = db::get_db_connection(&app_handle);
    
    println!("Received patient data: {:?}", data);

    println!("Received appointment data: {:?}", data);
    format!("Ok Patient is Added !")
}#[tauri::command]
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
