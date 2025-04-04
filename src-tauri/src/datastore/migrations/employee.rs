pub fn employee_schema() -> String {
    String::from(
        "CREATE TABLE IF NOT EXISTS employees (
            id TEXT PRIMARY KEY,
            name TEXT,
            n_id TEXT,
            phone TEXT,
            address TEXT,
            contactus TEXT,
            role TEXT,
            salary TEXT
        );",
    )
}
