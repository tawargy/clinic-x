pub fn app_settings_schema() -> String {
    "CREATE TABLE IF NOT EXISTS app_settings (
                           id  TEXT PRIMARY KEY,
                           public_key TEXT ,
                           db_backup_path TEXT
                       );"
    .to_string()
}
