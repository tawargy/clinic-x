use rusqlite::{Connection, Result};
use tauri::Manager;

pub fn init_db(app_handle: &tauri::AppHandle) -> Result<()> {
    let app_dir = app_handle.path().app_data_dir().expect("Failed to get app data directory");
    std::fs::create_dir_all(&app_dir).expect("Failed to create app data directory");

    let db_path = app_dir.join("app.db");
    let conn = Connection::open(db_path)?;

    // Create patients table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS patients (
            id TEXT PRIMARY KEY,
            name TEXT,
            dob TEXT,
            gender TEXT,
            height TEXT,
            weight TEXT,
            blood_pressure TEXT,
            heart_rate TEXT,
            marital TEXT,
            born_city TEXT,
            occupation TEXT,
            temperature TEXT,
            allergies TEXT,  -- Stores a JSON string
            medications TEXT,  -- Stores a JSON string
            conditions TEXT,  -- Stores a JSON string
            special_habits TEXT,  -- Stores a JSON string
            notes TEXT,
            history TEXT,  -- Stores a JSON string
            contact_info TEXT,  -- Stores a JSON string
            insurance TEXT   -- Stores a JSON string
        );",
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
    let app_dir = app_handle.path().app_data_dir().unwrap();
    let db_path = app_dir.join("app.db");
    println!("Database path: {}", db_path.display());
    if !db_path.exists() { init_db(app_handle)?; }
    Connection::open(db_path)
}
