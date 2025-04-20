use super::db::get_db_connection;
use crate::types::{AllRequests, Request};
use rusqlite::{params, Result};
use tauri::Manager;
use uuid::Uuid;

pub fn add_request_db(requests: Vec<Request>, window: &tauri::Window) -> Result<String, String> {
    println!("Starting add_request_db with requests: {:?}", requests);

    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(e) => {
            println!("Database connection error: {:?}", e);
            return Err(String::from("Failed to connect to database!"));
        }
    };

    let id = Uuid::new_v4().to_string();
    println!("Generated UUID: {}", id);

    let all_requests = AllRequests {
        id: id.clone(),
        requests: Some(requests),
    };
    println!("Created AllRequests: {:?}", all_requests);

    // Serialize the entire AllRequests struct
    let requests_json = match serde_json::to_string(&all_requests.requests) {
        Ok(json) => {
            println!("Successfully serialized JSON: {}", json);
            json
        }
        Err(e) => {
            println!("Serialization error: {:?}", e);
            return Err(format!("Failed to serialize requests: {}", e));
        }
    };

    println!("Executing SQL insert...");
    let result = conn.execute(
        "INSERT INTO all_requests (id, request) VALUES (?1, ?2)",
        params![id, requests_json],
    );

    match result {
        Ok(_) => {
            println!("Successfully inserted request with id: {}", id);
            Ok(id)
        }
        Err(e) => {
            println!("Database insertion error: {:?}", e);
            Err(format!("Failed to add requests: {}", e))
        }
    }
}

pub fn get_request_by_id_db(
    request_id: String,
    window: &tauri::Window,
) -> Result<AllRequests, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let mut stmt = match conn.prepare("SELECT * FROM all_requests WHERE id = ?") {
        Ok(stmt) => stmt,
        Err(e) => return Err(format!("Failed to prepare statement: {}", e)),
    };

    let request_result = stmt.query_row([request_id.clone()], |row| {
        let requests_json: String = row.get(1)?;
        let requests: Option<Vec<Request>> = match serde_json::from_str(&requests_json) {
            Ok(r) => r,
            Err(_) => None,
        };

        Ok(AllRequests {
            id: request_id.clone(),
            requests,
        })
    });

    match request_result {
        Ok(requests) => Ok(requests),
        Err(e) => Err(format!("Failed to fetch requests: {}", e)),
    }
}

pub fn update_request_db(all_requests: AllRequests, window: &tauri::Window) -> Result<(), String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    // Serialize requests to JSON string
    let requests_json = match serde_json::to_string(&all_requests.requests) {
        Ok(json) => json,
        Err(e) => return Err(format!("Failed to serialize requests: {}", e)),
    };

    let result = conn.execute(
        "UPDATE all_requests SET request = ?2 WHERE id = ?1",
        params![all_requests.id, requests_json],
    );

    match result {
        Ok(_) => Ok(()),
        Err(e) => Err(format!("Failed to update requests: {}", e)),
    }
}

pub fn update_request_by_id_db(
    all_requests_id: String,
    request_id: String,
    updated_request: Request,
    window: &tauri::Window,
) -> Result<(), String> {
    println!(
        "Starting update_request_by_id_db for request ID: {}",
        request_id
    );

    // Get the current AllRequests collection
    let mut all_requests = match get_request_by_id_db(all_requests_id.clone(), window) {
        Ok(req) => req,
        Err(e) => return Err(format!("Failed to fetch AllRequests: {}", e)),
    };

    // Find and update the specific request with the given ID
    if let Some(requests) = &mut all_requests.requests {
        let mut found = false;

        for req in requests.iter_mut() {
            if let Some(id) = &req.id {
                if id == &request_id {
                    // Preserve the original ID when updating
                    let original_id = req.id.clone();
                    *req = updated_request;
                    req.id = original_id;
                    found = true;
                    break;
                }
            }
        }

        if !found {
            return Err(format!("Request with ID {} not found", request_id));
        }

        // Save the updated AllRequests back to the database
        match update_request_db(all_requests, window) {
            Ok(_) => {
                println!("Successfully updated request with ID: {}", request_id);
                Ok(())
            }
            Err(e) => Err(format!("Failed to save updated request: {}", e)),
        }
    } else {
        Err("No requests found in the collection".to_string())
    }
}
