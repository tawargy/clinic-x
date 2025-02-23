// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
//

mod handlers;
mod datastore;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            handlers::patient::get_patient_info,
            handlers::patient::add_patient,
            handlers::appointment::add_appointment_data,
            handlers::queue_and_recently::get_queue,
            handlers::queue_and_recently::get_recently,
            handlers::search::search_resualt
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
