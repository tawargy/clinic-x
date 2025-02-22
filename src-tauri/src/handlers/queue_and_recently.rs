use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Patient {
    id: String,
    name: String,
}

#[tauri::command]
pub fn get_queue() -> Vec<Patient> {
    // For demonstration, returning hardcoded data
    vec![
        Patient {
            id: String::from("df99"),
            name: String::from("mohamed ali"),
        },
        Patient {
            id: String::from("df98"),
            name: String::from("ahmed hassan"),
        },
    ]
}

#[tauri::command]
pub fn get_recently() -> Vec<Patient> {
    // For demonstration, returning hardcoded data
    vec![
        Patient {
            id: String::from("df77"),
            name: String::from("mohamed ahmed"),
        },
        Patient {
            id: String::from("df76"),
            name: String::from("ali mahmoud"),
        },
    ]
}
