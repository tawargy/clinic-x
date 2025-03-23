use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct Patient {
    pub id: String,
    pub name: String,
    pub dob: String,
    pub age: String,
    pub gender: String,
    pub marital_status: String,
    pub born_city: String,
    pub residence: String,
    pub occupation: String,
    pub phone: String,
    pub email: String,
    pub insurance_provider: String,
    pub insurance_policy_number: String,
    pub insurance_group_number: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Med {
    pub med_name: String,
    pub dosage: String,
}
#[derive(Debug, Deserialize, Serialize)]
pub struct PatientMedicalHistory {
    pub id: String,
    pub patient_id: String,
    pub allergies: Option<Vec<String>>,
    pub medications: Option<Vec<Med>>,
    pub conditions: Option<Vec<String>>,
    pub special_habits: Option<Vec<String>>,
    pub past_history: Option<String>,
    pub family_history: Option<String>,
    pub notes: Option<String>,
}
#[derive(Debug, Deserialize, Serialize)]
pub struct Appointment {
    pub id: String,
    pub patient_id: String,
    pub past_history: Option<String>,
    pub complaint: Option<String>,
    pub present_history: Option<String>,
    pub examination: Option<String>,
    pub bp: Option<String>,
    pub p: Option<String>,
    pub t: Option<String>,
    pub rr: Option<String>,
    pub rbs: Option<String>,
    pub spo2: Option<String>,
    pub weight: Option<String>,
    pub height: Option<String>,
    pub provisional_diagnosis: Option<String>,
    pub prescription: Option<Vec<Prescription>>,
    pub created_at: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Prescription {
    pub name: String,
    pub dosage: String,
    pub frequency: String,
    pub duration: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct AppointmentDay {
    pub id: String,
    pub day: String,
    pub patient_data: Vec<PatientData>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct PatientData {
    pub patient_id: String,
    pub name: String,
    pub appointment_type: String,
    pub description: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct AppointmentsTime {
    pub from: Option<String>,
    pub to: Option<String>,
    pub excepting: Option<Vec<String>>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ClinicInfo {
    pub id: String,
    pub clinic_name: Option<String>,
    pub speciality: Option<String>,
    pub memberships: Option<Vec<String>>,
    pub address: Option<String>,
    pub contactus: Option<Vec<String>>,
    pub appointments: AppointmentsTime,
}
