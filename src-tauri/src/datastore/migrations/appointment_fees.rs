pub fn appointment_fees_schema() -> String {
    String::from(
        "CREATE TABLE IF NOT EXISTS appointment_fees (
            id TEXT PRIMARY KEY,
            patient_id TEXT,
            patient_name TEXT,
            patient_phone TEXT,
            appointment_type TEXT,
            fee Text,
            services TEXT,  -- This will store JSON serialized services
            total_fees TEXT,
            date TEXT
        );",
    )
}
