use crate::datastore::request;
use crate::types::{AllRequests, Request};

#[tauri::command]
pub async fn add_request(requests: Vec<Request>, window: tauri::Window) -> Result<String, String> {
    println!("Handler - Received requests: {:?}", requests);
    request::add_request_db(requests, &window)
}

#[tauri::command]
pub async fn get_request_by_id(
    request_id: String,
    window: tauri::Window,
) -> Result<AllRequests, String> {
    request::get_request_by_id_db(request_id, &window)
}

#[tauri::command]
pub async fn update_request(
    all_requests: AllRequests,
    window: tauri::Window,
) -> Result<(), String> {
    request::update_request_db(all_requests, &window)
}

#[tauri::command]
pub async fn update_request_by_id(
    all_requests_id: String,
    request_id: String,
    updated_request: Request,
    window: tauri::Window,
) -> Result<(), String> {
    request::update_request_by_id_db(all_requests_id, request_id, updated_request, &window)
}
