use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct AppointmentForm {
    patient_id: String,
    past_history: String,
    family_history: String,
    complaint: String,
    present_history: String,
    examination: String,
    bp: String,
    p: String,
    t: String,
    rr: String,
    rbs: String,
    spo2: String,
    weight: String,
    height: String,
    provisional_diagnosis: String,
}

#[tauri::command]
pub fn add_appointment_data(formdata: AppointmentForm) -> String {
    println!("Received appointment data: {:?}", formdata);
    format!("Ok Data is Added !")
}
