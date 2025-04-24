use crate::datastore::app_settings::{add_public_key_db, get_public_key_db};
use mac_address::get_mac_address;
use sha2::{Digest, Sha256};

#[tauri::command]
pub fn get_device_mac() -> Option<String> {
    get_mac_address().ok()?.map(|ma| ma.to_string())
}

#[tauri::command]
pub fn serial_hash() -> Option<String> {
    let mac = get_device_mac()?;
    let mut hasher = Sha256::new();
    hasher.update(mac);
    Some(format!("{:x}", hasher.finalize()))
}

#[tauri::command]
pub fn privet_key() -> Option<String> {
    let serial = serial_hash()?;
    let salt = "your-app-salt-here";

    let mut hasher = Sha256::new();
    hasher.update(serial);
    hasher.update(salt);

    Some(format!("{:x}", hasher.finalize()))
}

#[tauri::command]
pub async fn set_public_key(public_key: String, window: tauri::Window) -> Result<String, String> {
    // Get the private key
    let private_key = match privet_key() {
        Some(key) => key,
        None => return Err("Failed to generate private key".to_string()),
    };
    println!("{:?}", private_key);
    // Verify the provided public key matches the private key
    if public_key != private_key {
        return Ok("Invalid public key".to_string());
    }

    // If the key is valid, store it in the database
    add_public_key_db(public_key, window)
}

#[tauri::command]
pub async fn has_public_key(window: tauri::Window) -> Result<bool, String> {
    match get_public_key_db(window) {
        Ok(Some(_)) => Ok(true), // Public key exists
        Ok(None) => Ok(false),   // No public key found
        Err(e) => Err(format!("Error checking for public key: {}", e)),
    }
}

// #[tauri::command]
// pub async fn verify_activation(window: tauri::Window) -> Result<bool, String> {
//     // Get the private key
//     let private_key = match privet_key() {
//         Some(key) => key,
//         None => return Err("Failed to generate private key".to_string()),
//     };
//     println!("{:?}", private_key);
//     // Check if there's a public key in the database
//     match get_public_key_db(window) {
//         Ok(Some(stored_key)) => {
//             // Verify the stored key matches the current private key
//             Ok(stored_key == private_key)
//         }
//         Ok(None) => Ok(false), // No activation found
//         Err(e) => Err(format!("Error verifying activation: {}", e)),
//     }
// }

#[tauri::command]
pub async fn verify_activation(window: tauri::Window) -> Result<bool, String> {
    // Get the private key
    let private_key = match privet_key() {
        Some(key) => key,
        None => return Err("Failed to generate private key".to_string()),
    };
    println!("Generated private key: {:?}", private_key);

    // Check if there's a public key in the database
    let public_key_result = get_public_key_db(window.clone());
    println!("Database public key result: {:?}", public_key_result);

    match public_key_result {
        Ok(Some(stored_key)) => {
            println!("Stored key found: {:?}", stored_key);
            println!("Keys match: {}", stored_key == private_key);
            Ok(stored_key == private_key)
        }
        Ok(None) => {
            println!("No public key found in database");
            Ok(false)
        }
        Err(e) => Err(format!("Error verifying activation: {}", e)),
    }
}
