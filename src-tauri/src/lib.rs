// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
//

mod datastore;
mod handlers;
mod types;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            // Initialize database
            match datastore::db::init_db(app.handle()) {
                Ok(_) => println!("Database initialized successfully"),
                Err(e) => println!("Error initializing database: {}", e),
            }
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            handlers::patient::get_patient_by_id,
            handlers::patient::add_patient,
            handlers::patient::update_patient,
            handlers::patient::delete_patient,
            handlers::patient::search_patients,
            handlers::appointment::add_appointment,
            handlers::appointment::get_appointments_by_patient_id,
            handlers::appointment::get_appointment_by_id,
            handlers::queue_and_recently::get_queue,
            handlers::queue_and_recently::get_recently,
            handlers::patient_medical_history::get_patient_medical_history,
            handlers::patient_medical_history::add_patient_medical_history,
            handlers::patient_medical_history::update_patient_medical_history,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
