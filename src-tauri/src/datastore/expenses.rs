use super::db::get_db_connection;
use crate::types::{Expenses, Installment, OtherExpense, Purchases};
use rusqlite::{Result, Row};
use serde_json;
use tauri::Manager;
use uuid::Uuid;

pub fn add_expenses_db(data: Expenses, window: tauri::Window) -> Result<String, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let id = Uuid::new_v4().to_string();
    let purchases = serde_json::to_string(&data.purchases).unwrap_or_default();
    let installments = serde_json::to_string(&data.installments).unwrap_or_default();
    let other_expenses = serde_json::to_string(&data.other_expenses).unwrap_or_default();

    match conn.execute(
        "INSERT INTO expenses (
            id,
            month,
            rent,
            taxes,
            electricity_invoice,
            water_invoice,
            phone_and_internet_invoice,
            purchases,
            installments,
            other_expenses
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)",
        (
            &id,
            &data.month,
            &data.rent,
            &data.taxes,
            &data.electricity_invoice,
            &data.water_invoice,
            &data.phone_and_internet_invoice,
            &purchases,
            &installments,
            &other_expenses,
        ),
    ) {
        Ok(_) => Ok(id),
        Err(e) => Err(e.to_string()),
    }
}

pub fn update_expenses_db(data: Expenses, window: tauri::Window) -> Result<String, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let purchases = serde_json::to_string(&data.purchases).unwrap_or_default();
    let installments = serde_json::to_string(&data.installments).unwrap_or_default();
    let other_expenses = serde_json::to_string(&data.other_expenses).unwrap_or_default();

    match conn.execute(
        "UPDATE expenses SET 
            month = ?2,
            rent = ?3,
            taxes = ?4,
            electricity_invoice = ?5,
            water_invoice = ?6,
            phone_and_internet_invoice = ?7,
            purchases = ?8,
            installments = ?9,
            other_expenses = ?10
        WHERE id = ?1",
        (
            &data.id,
            &data.month,
            &data.rent,
            &data.taxes,
            &data.electricity_invoice,
            &data.water_invoice,
            &data.phone_and_internet_invoice,
            &purchases,
            &installments,
            &other_expenses,
        ),
    ) {
        Ok(_) => Ok(data.id),
        Err(e) => Err(e.to_string()),
    }
}

pub fn update_expenses_by_id_db(
    id: String,
    data: Expenses,
    window: tauri::Window,
) -> Result<bool, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let purchases = serde_json::to_string(&data.purchases).unwrap_or_default();
    let installments = serde_json::to_string(&data.installments).unwrap_or_default();
    let other_expenses = serde_json::to_string(&data.other_expenses).unwrap_or_default();

    match conn.execute(
        "UPDATE expenses SET 
            month = ?2,
            rent = ?3,
            taxes = ?4,
            electricity_invoice = ?5,
            water_invoice = ?6,
            phone_and_internet_invoice = ?7,
            purchases = ?8,
            installments = ?9,
            other_expenses = ?10
        WHERE id = ?1",
        (
            &id,
            &data.month,
            &data.rent,
            &data.taxes,
            &data.electricity_invoice,
            &data.water_invoice,
            &data.phone_and_internet_invoice,
            &purchases,
            &installments,
            &other_expenses,
        ),
    ) {
        Ok(rows_affected) => Ok(rows_affected > 0),
        Err(e) => Err(e.to_string()),
    }
}

fn row_to_expenses(row: &Row) -> Result<Expenses, rusqlite::Error> {
    let purchases_str: String = row.get(7)?;
    let installments_str: String = row.get(8)?;
    let other_expenses_str: String = row.get(9)?;

    let purchases: Vec<Purchases> = serde_json::from_str(&purchases_str).unwrap_or_default();
    let installments: Vec<Installment> =
        serde_json::from_str(&installments_str).unwrap_or_default();
    let other_expenses: Vec<OtherExpense> =
        serde_json::from_str(&other_expenses_str).unwrap_or_default();

    Ok(Expenses {
        id: row.get(0)?,
        month: row.get(1)?,
        rent: row.get(2)?,
        taxes: row.get(3)?,
        electricity_invoice: row.get(4)?,
        water_invoice: row.get(5)?,
        phone_and_internet_invoice: row.get(6)?,
        purchases: Some(purchases),
        installments: Some(installments),
        other_expenses: Some(other_expenses),
    })
}

pub fn get_expenses_by_month_db(
    month: String,
    window: tauri::Window,
) -> Result<Option<Expenses>, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err("Failed to connect to database".to_string()),
    };

    let mut stmt = match conn.prepare("SELECT * FROM expenses WHERE month = ?1") {
        Ok(stmt) => stmt,
        Err(e) => return Err(e.to_string()),
    };

    let mut rows = match stmt.query([&month]) {
        Ok(rows) => rows,
        Err(e) => return Err(e.to_string()),
    };

    match rows.next() {
        Ok(Some(row)) => match row_to_expenses(row) {
            Ok(expenses) => Ok(Some(expenses)),
            Err(e) => Err(e.to_string()),
        },
        Ok(None) => Ok(None),
        Err(e) => Err(e.to_string()),
    }
}
