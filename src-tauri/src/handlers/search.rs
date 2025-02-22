use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Patient {
    id: String,
    name: String,
}

#[tauri::command]
pub fn search_resualt(input: String) -> Vec<Patient> {
    // For demonstration, returning hardcoded data
    if input == "test" {
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
    } else {
        vec![]
    }
}
