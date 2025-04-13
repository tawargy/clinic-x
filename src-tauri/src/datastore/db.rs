use super::migrations::*;
use rusqlite::{Connection, Result};
use tauri::Manager;

pub fn init_db(app_handle: &tauri::AppHandle) -> Result<()> {
    let app_dir = app_handle
        .path()
        .app_data_dir()
        .expect("Failed to get app data directory");
    std::fs::create_dir_all(&app_dir).expect("Failed to create app data directory");

    let db_path = app_dir.join("app.db");
    println!("Creating database at: {}", db_path.display());

    let conn = Connection::open(db_path)?;

    // Enable foreign key support
    conn.execute("PRAGMA foreign_keys = ON;", [])?;

    // Create patients table
    let patient_schema = patient::patient_schema();
    println!("Creating patients table...");
    conn.execute(&patient_schema, [])?;

    let appointment_wrapper_schema = appointment::appointment_wrapper_schema();
    println!("Creating appointment wrapper table...");
    conn.execute(&appointment_wrapper_schema, [])?;

    // Create appointments table
    let appointment_schema = appointment::appointment_schema();
    println!("Creating appointments table...");
    conn.execute(&appointment_schema, [])?;
    let diagnosis_schema = appointment::diagnosis_schema();
    println!("Creating diagnosis table...");
    conn.execute(&diagnosis_schema, [])?;

    let request_schema = appointment::request_schema();
    println!("Creating Request table...");
    conn.execute(&request_schema, [])?;

    let appointment_fees_schema = appointment_fees::appointment_fees_schema();
    println!("Creating appointment_fees table...");
    conn.execute(&appointment_fees_schema, [])?;

    // Create appointments day table
    let appointment_day_schema = appointment_day::appointment_day_schema();
    println!("Creating appointment days table...");
    conn.execute(&appointment_day_schema, [])?;
    // Create medical history table
    let patient_medical_history_schema = patient::patient_medical_history_schema();
    println!("Creating medical history table...");
    conn.execute(&patient_medical_history_schema, [])?;

    let clinic_info_schema = clinic_info::clinic_info_schema();
    println!("Creating clinic info table...");
    conn.execute(&clinic_info_schema, [])?;

    let employee_schema = employee::employee_schema();
    println!("Creating employee table...");
    conn.execute(&employee_schema, [])?;

    let fee_and_services_schema = fee_and_services::fee_and_services_schema();
    println!("Creating fee and services table...");
    conn.execute(&fee_and_services_schema, [])?;

    // Verify tables were created
    let mut stmt = conn.prepare("SELECT name FROM sqlite_master WHERE type='table'")?;
    let tables: Vec<String> = stmt
        .query_map([], |row| row.get(0))?
        .filter_map(Result::ok)
        .collect();
    println!("Created tables: {:?}", tables);

    Ok(())
}

pub fn get_db_connection(app_handle: &tauri::AppHandle) -> Result<Connection> {
    let app_dir = app_handle.path().app_data_dir().unwrap();
    let db_path = app_dir.join("app.db");
    println!("Database path: {}", db_path.display());
    if !db_path.exists() {
        init_db(app_handle)?;
    }
    Connection::open(db_path)
}
