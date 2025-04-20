pub fn patient_schema() -> String {
    "CREATE TABLE IF NOT EXISTS patients (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        dob TEXT,
        age TEXT,
        gender TEXT,
        marital_status TEXT,
        born_city TEXT,
        residence TEXT,
        occupation TEXT,
        phone TEXT NOT NULL,
        email TEXT,
        insurance_provider TEXT,
        insurance_policy_number TEXT,
        insurance_group_number TEXT
    );"
    .to_string()
}
pub fn patient_medical_history_schema() -> String {
    "CREATE TABLE IF NOT EXISTS patient_medical_history (
                           id  TEXT PRIMARY KEY,
                           patient_id TEXT NOT NULL,
                           allergies TEXT,
                           medications TEXT,
                           conditions TEXT,
                           special_habits TEXT,
                           family_history TEXT,
                           notes TEXT,
                           FOREIGN KEY (patient_id) REFERENCES patients (id)
                       );"
    .to_string()
}
