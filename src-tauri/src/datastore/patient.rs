use super::db::get_db_connection;
use crate::types::Patient;
use rusqlite::{params_from_iter, Result, Row};
use tauri::Manager;
use uuid::Uuid;

pub fn add_patient_db(mut data: Patient, window: tauri::Window) -> Result<String, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };
    let id = Uuid::new_v4().to_string();
    data.id = id.clone();
    println!("Data: {:?}", data);
    let query = "INSERT INTO patients (id, name, dob, age ,gender ,
                           marital_status ,
                           born_city ,
                           residence ,
                           occupation ,
                           phone ,
                           email ,
                           insurance_provider ,
                           insurance_policy_number ,
                           insurance_group_number ) VALUES (?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    let values = [
        &id,
        &data.name,
        &data.dob,
        &data.age,
        &data.gender,
        &data.marital_status,
        &data.born_city,
        &data.residence,
        &data.occupation,
        &data.phone,
        &data.email,
        &data.insurance_provider,
        &data.insurance_policy_number,
        &data.insurance_group_number,
    ];
    match conn.execute(query, params_from_iter(values.iter())) {
        Ok(_) => Ok(id),
        Err(e) => Err(format!("Failed to add new patient: {}", e)),
    }
}
pub fn get_patient_by_id_db(patient_id: String, window: tauri::Window) -> Result<Patient, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let mut stmt = conn
        .prepare("SELECT * FROM patients WHERE id = ?")
        .map_err(|e| e.to_string())?;
    stmt.query_row([&patient_id], |row: &Row| {
        Ok(Patient {
            id: row.get(0)?,
            name: row.get(1)?,
            dob: row.get(2)?,
            age: row.get(3)?,
            gender: row.get(4)?,
            marital_status: row.get(5)?,
            born_city: row.get(6)?,
            residence: row.get(7)?,
            occupation: row.get(8)?,
            phone: row.get(9)?,
            email: row.get(10)?,
            insurance_provider: row.get(11)?,
            insurance_policy_number: row.get(12)?,
            insurance_group_number: row.get(13)?,
        })
    })
    .map_err(|e| e.to_string())
}

pub fn update_patient_db(
    id: String,
    data: Patient,
    window: tauri::Window,
) -> Result<String, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let query = "UPDATE patients SET
                name = ?,
                dob = ?,
                age = ?,
                gender = ?,
                marital_status = ?,
                born_city = ?,
                residence = ?,
                occupation = ?,
                phone = ?,
                email = ?,
                insurance_provider = ?,
                insurance_policy_number = ?,
                insurance_group_number = ?
                WHERE id = ?";

    let values = [
        &data.name,
        &data.dob,
        &data.age,
        &data.gender,
        &data.marital_status,
        &data.born_city,
        &data.residence,
        &data.occupation,
        &data.phone,
        &data.email,
        &data.insurance_provider,
        &data.insurance_policy_number,
        &data.insurance_group_number,
        &id,
    ];

    match conn.execute(query, params_from_iter(values.iter())) {
        Ok(rows) if rows > 0 => Ok(String::from("Patient updated successfully!")),
        Ok(_) => Err(String::from("No patient found with this ID")),
        Err(e) => Err(format!("Failed to update patient: {}", e)),
    }
}

pub fn delete_patient_db(id: String, window: tauri::Window) -> Result<String, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let query = "DELETE FROM patients WHERE id = ?";

    match conn.execute(query, [&id]) {
        Ok(rows) if rows > 0 => Ok(String::from("Patient deleted successfully!")),
        Ok(_) => Err(String::from("No patient found with this ID")),
        Err(e) => Err(format!("Failed to delete patient: {}", e)),
    }
}

pub fn get_patients_count_db(window: tauri::Window) -> Result<usize, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let query = "SELECT COUNT(*) FROM patients";

    match conn.query_row(query, [], |row| row.get::<_, i64>(0)) {
        Ok(count) => Ok(count as usize),
        Err(e) => Err(format!("Failed to count patients: {}", e)),
    }
}
