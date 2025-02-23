use std::fmt::Debug;

use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager, Window};
use rusqlite::{params, Connection, Error, Result, Row};

use crate::datastore::db;

#[derive(Serialize, Deserialize, Debug)]
pub struct Patient {
    id: String,
    name: String,
}

impl Patient {
    fn from_row(row: &Row) -> rusqlite::Result<Self> {
        Ok(Patient {
            id: row.get(0)?,
            name: row.get(1)?,
        })
    }
}

#[tauri::command]
pub fn search_result(input: String, window: Window) -> Result<Vec<Patient>, String> {
    let conn = db::get_db_connection(window.app_handle())
        .map_err(|_| "Failed to connect to database!".to_string())?;

    let mut stmt = conn.prepare("SELECT id, name FROM patients WHERE name LIKE ?")
        .map_err(|e| e.to_string())?;

    let patients: Result<Vec<Patient>, rusqlite::Error> = stmt
        .query_map(params![format!("%{}%", input)], |row| Patient::from_row(row))
        .map(|rows| rows.filter_map(Result::ok).collect());
    
    println!("{:?}",stmt.expanded_sql().unwrap().as_str());
    
    match patients {
        Ok(patients) => Ok(patients),
        Err(e) => Err(e.to_string())
    }
}