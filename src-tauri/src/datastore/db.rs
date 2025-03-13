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

    // Create appointments table
    let appointment_schema = appointment::appointment_schema();
    println!("Creating appointments table...");
    conn.execute(&appointment_schema, [])?;

    // Create medical history table
    let patient_medical_history_schema = patient::patient_medical_history_schema();
    println!("Creating medical history table...");
    conn.execute(&patient_medical_history_schema, [])?;

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
