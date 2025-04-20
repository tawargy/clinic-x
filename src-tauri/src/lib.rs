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
            handlers::appointment::add_appointment_wrapper,
            handlers::appointment::update_appointment_wrapper,
            handlers::appointment::get_all_appointment_wrappers,
            handlers::appointment::get_last_appointment_wrapper_by_patient,
            handlers::appointment::get_appointment_wrapper_by_id,
            handlers::appointment::get_appointment_wrapper_by_patient_id,
            handlers::appointment::add_appointment,
            handlers::appointment::get_appointments_by_patient_id,
            handlers::appointment::get_appointment_by_id,
            handlers::appointment_day::add_appointment_day,
            handlers::appointment_day::get_appointment_days,
            handlers::appointment_day::remove_patient_from_appointment_day,
            handlers::diagnosis::add_diagnoses,
            handlers::diagnosis::get_diagnoses_by_id,
            handlers::diagnosis::update_diagnoses,
            handlers::diagnosis::get_all_diagnoses_by_patient_id,
            handlers::request::add_request,
            handlers::request::get_request_by_id,
            handlers::request::update_request,
            handlers::request::update_request_by_id,
            handlers::appointment_fees::add_appointment_fees,
            handlers::appointment_fees::get_appointment_fees_by_date,
            handlers::appointment_fees::get_appointment_fees_by_id,
            handlers::appointment_fees::get_appointment_fees_by_patient_id,
            //
            handlers::queue_and_recently::get_queue,
            handlers::queue_and_recently::get_recently,
            handlers::patient_medical_history::get_patient_medical_history,
            handlers::patient_medical_history::add_patient_medical_history,
            handlers::patient_medical_history::update_patient_medical_history,
            handlers::clinic_info::add_clinic_info,
            handlers::clinic_info::update_clinic_info,
            handlers::clinic_info::get_clinic_info,
            handlers::employee::add_employee,
            handlers::employee::update_employee_by_id,
            handlers::employee::get_employees,
            handlers::employee::get_employee_by_id,
            handlers::employee::delete_employee,
            handlers::fee_and_services::add_fee_and_services,
            handlers::fee_and_services::update_fee_and_services,
            handlers::fee_and_services::get_fee_and_services,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
