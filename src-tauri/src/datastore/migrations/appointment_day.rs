pub fn appointment_day_schema() -> String {
    String::from(
        "CREATE TABLE IF NOT EXISTS appointment_days (
                    id TEXT PRIMARY KEY,
                    day TEXT NOT NULL,
                    prescription_data TEXT -- This will store JSON string
                );",
    )
}
