#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod cmd;

#[macro_use]
extern crate serde_derive;
extern crate serde_json;

use std::io::{BufRead, BufReader};

fn main() {
  let resource_dir = tauri::api::platform::resource_dir().expect("failed to get resource dir");
  let server_path = resource_dir.join("server/app.js");
  let stdout = std::process::Command::new("node")
    .env("PORT", "4000")
    .args(vec!(server_path))
    .stdout(std::process::Stdio::piped())
    .spawn()
    .expect("Failed to guijs server")
    .stdout.expect("Failed to get guijs server stdout");
  let reader = BufReader::new(stdout);
  let mut webview_started = false;

  reader
    .lines()
    .filter_map(|line| line.ok())
    .for_each(|line| {
      println!("SERVER: {}", line);
      if !webview_started {
        webview_started = true;
        tauri::AppBuilder::new()
          .invoke_handler(|_webview, arg| {
            use cmd::Cmd::*;
            match serde_json::from_str(arg) {
              Err(_) => {}
              Ok(command) => {
                match command {
                  // definitions for your custom commands from Cmd here
                  MyCustomCommand { argument } => {
                    //  your command code
                    println!("{}", argument);
                  }
                }
              }
            }
          })
          .build()
          .run();
      }
    });
}
