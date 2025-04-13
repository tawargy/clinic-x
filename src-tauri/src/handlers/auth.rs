use std::process::Command;
use std::string::String;
use sysinfo::{System, SystemExt};

#[tauri::command]
pub async fn bios_serial(window: tauri::Window) -> Result<String, String> {
    println!("bios_serial command called");
    match get_bios_serial() {
        Ok(serial) => {
            println!("Successfully got BIOS serial: {}", serial);
            Ok(serial)
        }
        Err(e) => {
            println!("Error getting BIOS serial: {}", e);
            Err(e.to_string())
        }
    }
}

#[cfg(target_os = "windows")]
fn get_bios_serial() -> Result<String, Box<dyn std::error::Error>> {
    println!("Attempting to run wmic command");
    let output = Command::new("wmic")
        .args(&["bios", "get", "serialnumber"])
        .output()
        .map_err(|e| {
            println!("Command execution error: {}", e);
            e
        })?;

    println!("Command output: {:?}", output);

    if !output.status.success() {
        let error = String::from_utf8_lossy(&output.stderr);
        println!("Command failed: {}", error);
        return Err(error.into());
    }

    let stdout = String::from_utf8(output.stdout).map_err(|e| {
        println!("UTF-8 conversion error: {}", e);
        e
    })?;

    println!("Raw output: {}", stdout);

    let serial = stdout.lines().nth(1).unwrap_or("").trim().to_string();

    if serial.is_empty() {
        println!("No serial number found");
        return Err("No serial number found".into());
    }

    println!("Found serial number: {}", serial);
    Ok(serial)
}

#[cfg(target_os = "linux")]
fn get_bios_serial() -> Result<String, Box<dyn std::error::Error>> {
    println!("Attempting to run dmidecode command");
    let output = Command::new("dmidecode") // Removed sudo
        .args(&["-s", "system-serial-number"])
        .output()
        .map_err(|e| {
            println!("Command execution error: {}", e);
            e
        })?;

    println!("Command output: {:?}", output);

    if !output.status.success() {
        let error = String::from_utf8_lossy(&output.stderr);
        println!("Command failed: {}", error);
        return Err(error.into());
    }

    let serial = String::from_utf8(output.stdout)
        .map_err(|e| {
            println!("UTF-8 conversion error: {}", e);
            e
        })?
        .trim()
        .to_string();

    if serial.is_empty() {
        println!("No serial number found");
        return Err("No serial number found".into());
    }

    println!("Found serial number: {}", serial);
    Ok(serial)
}

#[cfg(target_os = "macos")]
fn get_bios_serial() -> Result<String, Box<dyn std::error::Error>> {
    println!("Attempting to run system_profiler command");
    let output = Command::new("system_profiler")
        .arg("SPHardwareDataType")
        .output()
        .map_err(|e| {
            println!("Command execution error: {}", e);
            e
        })?;

    println!("Command output: {:?}", output);

    if !output.status.success() {
        let error = String::from_utf8_lossy(&output.stderr);
        println!("Command failed: {}", error);
        return Err(error.into());
    }

    let output_str = String::from_utf8(output.stdout).map_err(|e| {
        println!("UTF-8 conversion error: {}", e);
        e
    })?;

    println!("Raw output: {}", output_str);

    let serial = output_str
        .lines()
        .find(|line| line.contains("Serial Number"))
        .and_then(|line| line.split(":").nth(1))
        .unwrap_or("")
        .trim()
        .to_string();

    if serial.is_empty() {
        println!("No serial number found");
        return Err("No serial number found".into());
    }

    println!("Found serial number: {}", serial);
    Ok(serial)
}

#[cfg(not(any(target_os = "windows", target_os = "linux", target_os = "macos")))]
fn get_bios_serial() -> Result<String, Box<dyn std::error::Error>> {
    println!("Unsupported operating system");
    Err("Unsupported operating system".into())
}

//-----------

#[tauri::command]
pub async fn system_info(window: tauri::Window) -> Result<String, String> {
    println!("system_info command called"); // Debug log
    let info = get_system_info();
    println!("System info: {}", info); // Debug log
    Ok(info)
}

fn get_system_info() -> String {
    let mut sys = System::new_all();
    sys.refresh_all();

    // This will get various system information
    // Note: sysinfo might not provide BIOS serial directly
    format!("System info: {:?}", sys)
}
