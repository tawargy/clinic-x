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
                    prescription TEXT,  
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (patient_id) REFERENCES patients (id)
                );",
    )
}
