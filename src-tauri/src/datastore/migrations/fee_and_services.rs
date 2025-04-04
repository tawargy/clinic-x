pub fn fee_and_services_schema() -> String {
    String::from(
        "CREATE TABLE IF NOT EXISTS fee_and_services (
            id TEXT PRIMARY KEY,
            fee TEXT NOT NULL,
            followups TEXT,
            services TEXT

        );",
    )
}
