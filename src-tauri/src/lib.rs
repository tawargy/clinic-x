// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
//

use std::sync::{Arc, Mutex};
mod datastore;
mod handlers;
mod types;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let handling_close = Arc::new(Mutex::new(false));
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            // Initialize database
            match datastore::db::init_db(app.handle()) {
                Ok(_) => println!("Database initialized successfully"),
                Err(e) => println!("Error initializing database: {}", e),
            }

            Ok(())
        })
        .on_window_event({
            let handling_close = handling_close.clone();
            move |window, event| {
                if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                    // Check if we're already handling a close request
                    let mut handling = handling_close.lock().unwrap();
                    if *handling {
                        // We're already handling a close, so let this one proceed normally
                        return;
                    }

                    // Set the flag to indicate we're handling a close
                    *handling = true;

                    // Prevent the default close behavior for now
                    api.prevent_close();

                    // Get the backup path from settings
                    match handlers::db_backup::get_db_backup_path(window.clone()) {
                        Ok(Some(backup_path)) => {
                            // Perform backup
                            match handlers::db_backup::backup_sqlite_db(backup_path, window.clone())
                            {
                                Ok(_) => {
                                    println!("Backup completed successfully on app close");
                                }
                                Err(err) => {
                                    println!("Backup failed: {}", err);
                                }
                            }
                        }
                        _ => {
                            println!("No backup path configured");
                        }
                    }

                    // Instead of calling window.close(), use exit API to terminate the app
                    std::process::exit(0);
                }
            }
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            handlers::patient::get_patient_by_id,
            handlers::patient::add_patient,
            handlers::patient::update_patient,
            handlers::patient::delete_patient,
            handlers::patient::search_patients,
            handlers::patient::get_patients_count,
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
            handlers::appointment_day::update_patient_time,
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
            handlers::appointment_fees::get_appointment_fees_by_month,
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
            handlers::expenses::add_expenses,
            handlers::expenses::update_expenses,
            handlers::expenses::update_expenses_by_id,
            handlers::expenses::get_expenses_by_month,
            handlers::auth::serial_hash,
            handlers::auth::set_public_key,
            handlers::auth::verify_activation,
            handlers::db_backup::backup_sqlite_db,
            handlers::db_backup::get_db_backup_path,
            handlers::db_backup::add_db_backup_path,
            handlers::db_backup::set_db_backup_path,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
