pub fn appointment_schema() -> String {
    String::from(
        "CREATE TABLE IF NOT EXISTS appointments (
                    id TEXT PRIMARY KEY,
                    patient_id TEXT NOT NULL,
                    past_history TEXT,
                    complaint TEXT,
                    present_history TEXT,
                    examination TEXT,
                    bp TEXT,
                    p TEXT,
                    t TEXT,
                    rr TEXT,
                    rbs TEXT,
                    spo2 TEXT,
                    weight TEXT,
                    height TEXT,
                    provisional_diagnosis TEXT,
                    prescription TEXT, -- This will store JSON string
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (patient_id) REFERENCES patients (id)
                );",
    )
}

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
                      date TEXT
                );",
    )
}
