use std::process::Command;
use std::string::String;

fn get_bios_serial() -> Result<String, Box<dyn std::error::Error>> {
    #[cfg(target_os = "windows")]
    {
        // For Windows using wmic
        let output = Command::new("wmic")
            .args(&["bios", "get", "serialnumber"])
            .output()?;

        let serial = String::from_utf8(output.stdout)?
            .lines()
            .nth(1) // Skip the header line
            .unwrap_or("")
            .trim()
            .to_string();

        Ok(serial)
    }

    #[cfg(target_os = "linux")]
    {
        // For Linux using dmidecode
        let output = Command::new("sudo")
            .args(&["dmidecode", "-s", "system-serial-number"])
            .output()?;

        let serial = String::from_utf8(output.stdout)?.trim().to_string();

        Ok(serial)
    }

    #[cfg(target_os = "macos")]
    {
        // For macOS using system_profiler
        let output = Command::new("system_profiler")
            .arg("SPHardwareDataType")
            .output()?;

        let output_str = String::from_utf8(output.stdout)?;

        // Extract Serial Number from the output
        let serial = output_str
            .lines()
            .find(|line| line.contains("Serial Number"))
            .and_then(|line| line.split(":").nth(1))
            .unwrap_or("")
            .trim()
            .to_string();

        Ok(serial)
    }
}

fn main() {
    match get_bios_serial() {
        Ok(serial) => println!("BIOS Serial Number: {}", serial),
        Err(e) => eprintln!("Error getting BIOS serial number: {}", e),
    }
}
