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

pub fn expenses_schema() -> String {
    String::from(
        "CREATE TABLE IF NOT EXISTS expenses (
            id TEXT PRIMARY KEY,
            month TEXT,
            rent TEXT,
            taxes TEXT,
            electricity_invoice TEXT,
            water_invoice TEXT,
            phone_and_internet_invoice TEXT,
            purchases TEXT,
            installments TEXT,
            other_expenses TEXT 

        );",
    )
}
