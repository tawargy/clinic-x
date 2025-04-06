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
// pub fn add_request_db(requests: Vec<Request>, window: &tauri::Window) -> Result<String, String> {
//     let conn = match get_db_connection(window.app_handle()) {
//         Ok(conn) => conn,
//         Err(_) => return Err(String::from("Failed to connect to database!")),
//     };

//     let id = Uuid::new_v4().to_string();
//     let all_requests = AllRequests {
//         id: id.clone(),
//         requests: Some(requests),
//     };

//     // Serialize requests to JSON string
//     let requests_json = match serde_json::to_string(&all_requests.requests) {
//         Ok(json) => json,
//         Err(e) => return Err(format!("Failed to serialize requests: {}", e)),
//     };

//     let result = conn.execute(
//         "INSERT INTO all_requests (id, request) VALUES (?1, ?2)",
//         params![id, requests_json],
//     );

//     match result {
//         Ok(_) => Ok(id),
//         Err(e) => Err(format!("Failed to add requests: {}", e)),
//     }
// }

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
