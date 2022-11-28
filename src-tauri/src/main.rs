#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::{io::Cursor, fmt::Debug};

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![download_file])
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