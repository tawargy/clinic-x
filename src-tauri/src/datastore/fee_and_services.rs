use super::db::get_db_connection;
use crate::types::{FeeAndServices, Folloup, Service};
use rusqlite::Result;
use serde_json;
use tauri::Manager;
use uuid::Uuid;

pub fn add_fee_and_services_db(
    data: FeeAndServices,
    window: tauri::Window,
) -> Result<String, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let id = Uuid::new_v4().to_string();

    // Convert followups and services to JSON strings
    let followups_json = serde_json::to_string(&data.followups)
        .map_err(|_| String::from("Failed to serialize followups"))?;
    let services_json = serde_json::to_string(&data.services)
        .map_err(|_| String::from("Failed to serialize services"))?;

    match conn.execute(
        "INSERT INTO fee_and_services (id, fee, followups, services) VALUES (?1, ?2, ?3, ?4)",
        (&id, &data.fee, &followups_json, &services_json),
    ) {
        Ok(_) => Ok(id),
        Err(_) => Err(String::from("Failed to add fee and services!")),
    }
}

pub fn get_fee_and_services_db(window: tauri::Window) -> Result<FeeAndServices, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };
    let mut stmt =
        match conn.prepare("SELECT id, fee, followups, services FROM fee_and_services LIMIT 1") {
            // Added id to SELECT
            Ok(stmt) => stmt,
            Err(_) => return Err(String::from("Failed to prepare statement!")),
        };
    println!("stmt {:?}", stmt);
    let mut rows = stmt
        .query([])
        .map_err(|_| String::from("Failed to execute query!"))?;

    if let Some(row) = rows
        .next()
        .map_err(|_| String::from("Failed to read row!"))?
    {
        let id: String = row.get(0).map_err(|_| String::from("Failed to get id!"))?; // Get id
        let fee: String = row.get(1).map_err(|_| String::from("Failed to get fee!"))?;
        let followups_json: String = row
            .get(2)
            .map_err(|_| String::from("Failed to get followups!"))?;
        let services_json: String = row
            .get(3)
            .map_err(|_| String::from("Failed to get services!"))?;

        let followups: Vec<Folloup> = serde_json::from_str(&followups_json)
            .map_err(|_| String::from("Failed to deserialize followups"))?;
        let services: Vec<Service> = serde_json::from_str(&services_json)
            .map_err(|_| String::from("Failed to deserialize services"))?;
        println!("xxxxxxxxx");
        Ok(FeeAndServices {
            id,
            fee,
            followups,
            services,
        })
    } else {
        Err(String::from("No fee and services found!"))
    }
}

pub fn update_fee_and_services_db(
    data: FeeAndServices,
    window: tauri::Window,
) -> Result<(), String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    // Convert followups and services to JSON strings
    let followups_json = serde_json::to_string(&data.followups)
        .map_err(|_| String::from("Failed to serialize followups"))?;
    let services_json = serde_json::to_string(&data.services)
        .map_err(|_| String::from("Failed to serialize services"))?;

    // Changed from INSERT to UPDATE
    match conn.execute(
        "UPDATE fee_and_services SET fee = ?1, followups = ?2, services = ?3 WHERE id = ?4",
        (&data.fee, &followups_json, &services_json, &data.id),
    ) {
        Ok(_) => Ok(()),
        Err(_) => Err(String::from("Failed to update fee and services!")),
    }
}
