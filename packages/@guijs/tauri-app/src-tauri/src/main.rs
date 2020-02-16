#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod cmd;

#[macro_use]
extern crate serde_derive;
extern crate serde_json;

use std::io::{BufRead, BufReader};
use std::process::{Command, Stdio};
use tauri::Handle;

 #[derive(Serialize)]
pub struct State {
  pub name: String,
  pub payload: String,
}

fn main() {
  tauri::AppBuilder::new()
    .splashscreen_html(include_str!("../../../frontend-tauri/dist/index.tauri.html"))
    .setup(|webview, source| {
      if source == "splashscreen" {
        let handle = webview.handle();

        // check if node exists & matches the minimum version
        let node_output = Command::new("node")
          .args(vec!("--version"))
          .stdout(Stdio::piped())
          .output();
        if node_output.is_ok() {
          let node_version = String::from_utf8_lossy(&node_output.expect("failed to get node output").stdout).replace("v", "");
          let version_compare = tauri::api::version::compare(&node_version, "12.0.0");
          
          if version_compare.is_ok() && version_compare.expect("failed to compare node versions") <= 0 {
             let guijs_server_exists = Command::new("guijs-server")
              .args(vec!("--version"))
              .stdout(Stdio::piped())
              .spawn()
              .is_ok();
            std::thread::spawn(move || {
              if guijs_server_exists {
                notify_state(&handle, String::from("state"), String::from("splashscreen"));
                spawn_guijs_server(&handle);
              } else {
                notify_state(&handle, String::from("state"), String::from("first-download"));
                let guijs_install_stdout = Command::new("npm")
                  .args(vec!("i", "-g", "--path", "../server-core")) // TODO change this to be the published guijs server
                  .stdout(Stdio::piped())
                  .spawn().expect("failed to install guijs server package")
                  .stdout.expect("failed to get guijs install stdout");
                let guijs_install_reader = BufReader::new(guijs_install_stdout);
                guijs_install_reader
                  .lines()
                  .filter_map(|line| line.ok())
                  .for_each(|line| {
                    println!("{}", line);
                  });
                notify_state(&handle, String::from("state"), String::from("splashscreen"));
                spawn_guijs_server(&handle);
              }
            });
          } else {
            notify_state(&handle, String::from("node-wrong-version"), node_version);
          }
        } else {
          notify_state(&handle, String::from("state"), String::from("node-not-found"));
        }
      }
    })
    .build()
    .run();
}

fn notify_state<T: 'static>(handle:  &Handle<T>, name: String, payload: String) {
  let reply = State {
    name: name,
    payload: payload,
  };

  tauri::event::emit(
    handle,
    String::from("state"),
    serde_json::to_string(&reply).unwrap(),
  );
}

fn spawn_guijs_server<T: 'static>(handle: &Handle<T>) {
  let stdout = Command::new("guijs-server")
    .env("PORT", "4000")
    .stdout(Stdio::piped())
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
        tauri::close_splashscreen(&handle).expect("failed to close splashscreen");
      }
    });
}
