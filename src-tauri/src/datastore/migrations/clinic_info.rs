pub fn clinic_info_schema() -> String {
    String::from(
        "CREATE TABLE IF NOT EXISTS clinic_info (
            id TEXT PRIMARY KEY,
            clinic_name TEXT,
            speciality TEXT,
            memberships TEXT,
            address TEXT,
            contactus TEXT,
            appointments_from TEXT,
            appointments_to TEXT,
            appointments_excepting TEXT
        );",
    )
}
