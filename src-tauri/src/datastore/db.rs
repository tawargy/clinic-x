use rusqlite::{Connection, Result};
use std::path::PathBuf;
use tauri::api::path::app_data_dir;

pub fn init_db(app_handle: &tauri::AppHandle) -> Result<()> {
    let app_dir = app_data_dir(&app_handle.config()).unwrap();
    std::fs::create_dir_all(&app_dir)?;
    let db_path = app_dir.join("app.db");

    let conn = Connection::open(db_path)?;

    // Create patients table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS patients (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            dob TEXT,
            gender TEXT,
            occupation TEXT,
            residence TEXT,
            born_city TEXT,
            tel TEXT,
            email TEXT,
            marital TEXT,
            smoker TEXT,
            si TEXT,
            special_habits TEXT
        )",
        [],
    )?;

    // Create appointments table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS appointments (
            id TEXT PRIMARY KEY,
            patient_id TEXT NOT NULL,
            past_history TEXT,
            family_history TEXT,
            complaint TEXT,
            present_history TEXT,
            examination TEXT,
            bp TEXT,
            p TEXT,
            t TEXT,
            rr TEXT,
            rbs TEXT,
            spo2 TEXT,
            weight TEXT,
            height TEXT,
            provisional_diagnosis TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (patient_id) REFERENCES patients (id)
        )",
        [],
    )?;

    Ok(())
}

pub fn get_db_connection(app_handle: &tauri::AppHandle) -> Result<Connection> {
    let app_dir = app_data_dir(&app_handle.config()).unwrap();
    let db_path = app_dir.join("app.db");
    Connection::open(db_path)
}
