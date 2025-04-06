pub fn appointment_wrapper_schema() -> String {
    String::from(
        "CREATE TABLE IF NOT EXISTS appointment_wrappers (
                    id TEXT PRIMARY KEY,
                    patient_id TEXT NOT NULL,
                    main_complaint TEXT,
                      main_appointment TEXT,
                      followups_num TEXT,
                      followup_appointments TEXT,
                      appointment_status TEXT,
                      date TEXT,
                      FOREIGN KEY (patient_id) REFERENCES patients (id)
                );",
    )
}

pub fn appointment_schema() -> String {
    String::from(
        "CREATE TABLE IF NOT EXISTS appointments (
            id TEXT PRIMARY KEY,
            patient_id TEXT NOT NULL,
            vitals TEXT, -- This will store JSON array of Vitals
            complaint TEXT,
            present_history TEXT,
            examination TEXT,
            provisional_diagnosis TEXT, -- FOREIGN KEY to diagnosis table
            prescription TEXT, -- This will store JSON array of Prescription
            requests TEXT, -- FOREIGN KEY to requests table
            services TEXT, -- This will store JSON array of Service
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (patient_id) REFERENCES patients (id)
        );",
    )
}

pub fn diagnosis_schema() -> String {
    String::from(
        "CREATE TABLE IF NOT EXISTS all_diagnosis (
            id TEXT PRIMARY KEY,
            diagnosis TEXT  -- This will store JSON array of Diagnosis
        );",
    )
}
pub fn request_schema() -> String {
    String::from(
        "CREATE TABLE IF NOT EXISTS all_requests (
            id TEXT PRIMARY KEY,
            request TEXT  -- This will store JSON array of Requests
        );",
    )
}

// FOREIGN KEY (provisional_diagnosis) REFERENCES all_diagnosis (id),
// FOREIGN KEY (requests) REFERENCES all_requests (id)
