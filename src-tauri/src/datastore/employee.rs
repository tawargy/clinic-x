use super::db::get_db_connection;
use crate::types::Employee;
use rusqlite::Result;
use tauri::Manager;
use uuid::Uuid;

pub fn add_employee_db(mut data: Employee, window: tauri::Window) -> Result<String, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    // Generate UUID if not provided
    if data.id.is_empty() {
        data.id = Uuid::new_v4().to_string();
    }

    let sql = "INSERT INTO employees (
        id, name, n_id, phone, address, role, salary
    ) VALUES (?, ?, ?, ?, ?, ?, ?)";

    match conn.execute(
        sql,
        (
            &data.id,
            &data.name,
            &data.n_id,
            &data.phone,
            &data.address,
            &data.role,
            &data.salary,
        ),
    ) {
        Ok(_) => Ok(data.id),
        Err(e) => Err(e.to_string()),
    }
}

pub fn update_employee_by_id_db(
    id: &str,
    data: Employee,
    window: tauri::Window,
) -> Result<(), String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let sql = "UPDATE employees SET
        name = ?,
        n_id = ?,
        phone = ?,
        address = ?,
        role = ?,
        salary = ?
        WHERE id = ?";

    match conn.execute(
        sql,
        (
            &data.name,
            &data.n_id,
            &data.phone,
            &data.address,
            &data.role,
            &data.salary,
            id,
        ),
    ) {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

pub fn get_employees_db(window: tauri::Window) -> Result<Vec<Employee>, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let mut stmt =
        match conn.prepare("SELECT id, name, n_id, phone, address, role, salary FROM employees") {
            Ok(stmt) => stmt,
            Err(e) => return Err(e.to_string()),
        };

    let employee_iter = stmt.query_map([], |row| {
        Ok(Employee {
            id: row.get(0)?,
            name: row.get(1)?,
            n_id: row.get(2)?,
            phone: row.get(3)?,
            address: row.get(4)?,
            role: row.get(5)?,
            salary: row.get(6)?,
        })
    });

    match employee_iter {
        Ok(iter) => {
            let mut employees = Vec::new();
            for employee in iter {
                match employee {
                    Ok(emp) => employees.push(emp),
                    Err(e) => return Err(e.to_string()),
                }
            }
            Ok(employees)
        }
        Err(e) => Err(e.to_string()),
    }
}

pub fn get_employee_by_id_db(id: &str, window: tauri::Window) -> Result<Employee, String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    let mut stmt = match conn
        .prepare("SELECT id, name, n_id, phone, address, role, salary FROM employees WHERE id = ?")
    {
        Ok(stmt) => stmt,
        Err(e) => return Err(e.to_string()),
    };

    let employee = stmt.query_row([id], |row| {
        Ok(Employee {
            id: row.get(0)?,
            name: row.get(1)?,
            n_id: row.get(2)?,
            phone: row.get(3)?,
            address: row.get(4)?,
            role: row.get(5)?,
            salary: row.get(6)?,
        })
    });

    match employee {
        Ok(emp) => Ok(emp),
        Err(e) => Err(e.to_string()),
    }
}

pub fn delete_employee_db(id: &str, window: tauri::Window) -> Result<(), String> {
    let conn = match get_db_connection(window.app_handle()) {
        Ok(conn) => conn,
        Err(_) => return Err(String::from("Failed to connect to database!")),
    };

    match conn.execute("DELETE FROM employees WHERE id = ?", [id]) {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}
