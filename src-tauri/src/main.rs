#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::{io::Cursor, sync::Arc};
use tauri::Manager;

mod server;

fn main() {
    let rt = Arc::new(tokio::runtime::Runtime::new().unwrap());
    let rt2 = Arc::clone(&rt);
    tauri::Builder::default()
        .setup(|app| {
            server::setup_async_server( rt2, app.handle()).unwrap();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![download_file, close_splashscreen])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn download_file(url: String, path: String) -> Result<(), String> {
    println!("downloading {} to {}", url, path);

    let response = reqwest::get(url).await.map_err(|e| format!("{:?}", e))?;
    let mut file = std::fs::File::create(path).map_err(|e| format!("{:?}", e))?;
    let mut content = Cursor::new(response.bytes().await.map_err(|e| format!("{:?}", e))?);
    std::io::copy(&mut content, &mut file).map_err(|e| format!("{:?}", e))?;

    Ok(())
}

// Create the command:
// This command must be async so that it doesn't run on the main thread.
#[tauri::command]
async fn close_splashscreen(window: tauri::Window) {
    // Close splashscreen
    if let Some(splashscreen) = window.get_window("splashscreen") {
        splashscreen.close().unwrap();
    }
    // Show main window
    window.get_window("main").unwrap().show().unwrap();
}
