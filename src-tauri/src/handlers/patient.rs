use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager};
use rusqlite::{params, params_from_iter, Connection, Result, Row};
use uuid::Uuid;
use crate::datastore::db::{self, get_db_connection};

#[derive(Debug, Deserialize, Serialize)]
pub struct PatientInfo {
    id: String,
    name: Option<String>,
    dob: Option<String>,
    gender: Option<String>,
    height: Option<String>,
    weight: Option<String>,
    blood_pressure: Option<String>,
    heart_rate: Option<String>,
    marital: Option<String>,
    born_city: Option<String>,
    occupation: Option<String>,
    temperature: Option<String>,
    allergies: Option<Vec<String>>,
    medications: Option<Vec<String>>,
    conditions: Option<Vec<String>>,
    special_habits: Option<Vec<String>>,
    notes: Option<String>,
    history: Option<Vec<HistoryEntry>>,
    contact_info: Option<ContactInfo>,
    insurance: Option<InsuranceInfo>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct HistoryEntry {
    date: String,
    reason: String,
    diagnosis: String,
    treatment: String,
    doctor: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ContactInfo {
    phone: String,
    email: String,
    address: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct InsuranceInfo {
    provider: String,
    policy_number: String,
    group_number: String,
}

impl PatientInfo {
    fn from_row(row: &Row) -> rusqlite::Result<Self> {
        Ok(PatientInfo {
            id: row.get(0)?,
            name: row.get(1).ok(),
            dob: row.get(2).ok(),
            gender: row.get(3).ok(),
            height: row.get(4).ok(),
            weight: row.get(5).ok(),
            blood_pressure: row.get(6).ok(),
            heart_rate: row.get(7).ok(),
            marital: row.get(8).ok(),
            born_city: row.get(9).ok(),
            occupation: row.get(10).ok(),
            temperature: row.get(11).ok(),
            allergies: serde_json::from_str(&row.get::<_, String>(12).unwrap_or_default()).ok(),
            medications: serde_json::from_str(&row.get::<_, String>(13).unwrap_or_default()).ok(),
            conditions: serde_json::from_str(&row.get::<_, String>(14).unwrap_or_default()).ok(),
            special_habits: serde_json::from_str(&row.get::<_, String>(15).unwrap_or_default()).ok(),
            notes: row.get(16).ok(),
            history: serde_json::from_str(&row.get::<_, String>(17).unwrap_or_default()).ok(),
            contact_info: serde_json::from_str(&row.get::<_, String>(18).unwrap_or_default()).ok(),
            insurance: serde_json::from_str(&row.get::<_, String>(19).unwrap_or_default()).ok(),
        })
    }
}

#[tauri::command]
pub fn add_patient(mut data: serde_json::Value, window: tauri::Window) -> String {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return String::from("Failed to connect to database!"),
    };
    
    let id = Uuid::new_v4().to_string();
    data["id"] = serde_json::Value::String(id.clone());
    
    let mut query = String::from("INSERT INTO patients (");
    let mut placeholders = String::from("");
    let mut values: Vec<String> = Vec::new();
    let mut first = true; // Flag to track the first field
    
    for (key, value) in data.as_object().unwrap() {
        if !first {
            query.push_str(", ");
            placeholders.push_str(", ");
        }
        query.push_str(key);
        placeholders.push_str("?");
        values.push(value.as_str().unwrap_or_default().to_string());
        
        first = false; // After the first iteration, subsequent fields should have commas
    }
    
    query.push_str(") VALUES (");
    query.push_str(&placeholders);
    query.push_str(")");

    println!("Generated Query: {}", query);  // Log the generated query

    match conn.execute(&query, params_from_iter(values.iter())) {
        Ok(rows_affected) => {
            if rows_affected > 0 {
                println!("Patient added successfully! Rows affected: {}", rows_affected);
                id
            } else {
                println!("No rows were affected. Check the database or query.");
                String::from("Failed to add new patient!")
            }
        },
        Err(e) => {
            println!("Error executing query: {}", e);  // Log the actual error
            String::from("Failed to add new patient!")
        }
    }
}


#[tauri::command]
pub fn get_patient_info(patient_id: String, window: tauri::Window) -> Result<serde_json::Value, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };
    
    let mut stmt = conn.prepare("SELECT * FROM patients WHERE id = ?").map_err(|e| e.to_string())?;
    let result = stmt.query_row([&patient_id], |row: &Row| {
        let mut patient = serde_json::Map::new();
        let columns = [
            "id", "name", "dob", "gender", "height", "weight", "blood_pressure", 
            "heart_rate", "marital", "born_city", "occupation", "temperature", 
            "allergies", "medications", "conditions", "special_habits", "notes", 
            "history", "contact_info", "insurance"
        ];
        
        for (i, &col) in columns.iter().enumerate() {
            if let Ok(value) = row.get::<_, String>(i) {
                if !value.is_empty() {
                    patient.insert(col.to_string(), serde_json::Value::String(value));
                } else {
                    patient.insert(col.to_string(), serde_json::Value::Null);
                }
            } else {
                patient.insert(col.to_string(), serde_json::Value::Null);
            }
        }
        
        Ok(serde_json::Value::Object(patient))
    });
    
    result.map_err(|e| e.to_string())
}
#[tauri::command]
pub fn update_patient(data: PatientInfo, window: tauri::Window) -> String {
    let conn = match db::get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return String::from("Failed to connect to database!"),
    };

    let mut updates = vec![];
    let mut params: Vec<Box<dyn rusqlite::ToSql>> = vec![];

    if let Some(name) = &data.name { updates.push("name = ?"); params.push(Box::new(name)); }
    if let Some(dob) = &data.dob { updates.push("age = ?"); params.push(Box::new(dob)); }
    if let Some(gender) = &data.gender { updates.push("gender = ?"); params.push(Box::new(gender)); }
    if let Some(height) = &data.height { updates.push("height = ?"); params.push(Box::new(height)); }
    if let Some(weight) = &data.weight { updates.push("weight = ?"); params.push(Box::new(weight)); }
    if let Some(blood_pressure) = &data.blood_pressure { updates.push("blood_pressure = ?"); params.push(Box::new(blood_pressure)); }
    if let Some(heart_rate) = &data.heart_rate { updates.push("heart_rate = ?"); params.push(Box::new(heart_rate)); }
    if let Some(marital) = &data.marital { updates.push("marital = ?"); params.push(Box::new(marital)); }
    if let Some(born_city) = &data.born_city { updates.push("born_city = ?"); params.push(Box::new(born_city)); }
    if let Some(occupation) = &data.occupation { updates.push("occupation = ?"); params.push(Box::new(occupation)); }
    if let Some(temperature) = &data.temperature { updates.push("temperature = ?"); params.push(Box::new(temperature)); }
    if let Some(allergies) = &data.allergies { updates.push("allergies = ?"); params.push(Box::new(serde_json::to_string(allergies).unwrap())); }
    if let Some(medications) = &data.medications { updates.push("medications = ?"); params.push(Box::new(serde_json::to_string(medications).unwrap())); }
    if let Some(conditions) = &data.conditions { updates.push("conditions = ?"); params.push(Box::new(serde_json::to_string(conditions).unwrap())); }
    if let Some(special_habits) = &data.special_habits { updates.push("special_habits = ?"); params.push(Box::new(serde_json::to_string(special_habits).unwrap())); }
    if let Some(notes) = &data.notes { updates.push("notes = ?"); params.push(Box::new(notes)); }
    if let Some(history) = &data.history { updates.push("history = ?"); params.push(Box::new(serde_json::to_string(history).unwrap())); }
    if let Some(contact_info) = &data.contact_info { updates.push("contact_info = ?"); params.push(Box::new(serde_json::to_string(contact_info).unwrap())); }
    if let Some(insurance) = &data.insurance { updates.push("insurance = ?"); params.push(Box::new(serde_json::to_string(insurance).unwrap())); }
    
    if updates.is_empty() {
        return String::from("No fields to update!");
    }

    let query = format!("UPDATE patients SET {} WHERE id = ?", updates.join(", "));
    params.push(Box::new(data.id));

    match conn.execute(&query, rusqlite::params_from_iter(params.iter().map(|p| &**p))) {
        Ok(rows_affected) if rows_affected > 0 => String::from("Patient record updated successfully!"),
        Ok(_) => String::from("No patient record found with the given ID."),
        Err(_) => String::from("Failed to update patient record!"),
    }
}
