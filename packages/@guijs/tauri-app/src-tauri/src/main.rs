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

use serde::Deserialize;

#[derive(PartialEq, Deserialize, Clone, Debug)]
#[serde(tag = "engines", rename_all = "camelCase")]
pub struct PackageJsonCustom {
  min_node_version: String
}

#[derive(PartialEq, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct PackageJson {
  custom: PackageJsonCustom,
  version: String
}

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
          let server_package_json: PackageJson = reqwest::blocking::get("https://registry.npmjs.org/guijs-version-marker/latest")
            .expect("failed to read server package.json")
            .json::<PackageJson>()
            .expect("failed to parse server package.json");
          let version_compare = tauri::api::version::compare(&node_version, &server_package_json.custom.min_node_version);
          
          if version_compare.is_ok() && version_compare.expect("failed to compare node versions") <= 0 {
             let guijs_server_exists = Command::new("guijs-server")
              .args(vec!("--version"))
              .stdout(Stdio::piped())
              .spawn()
              .is_ok();

            let handle2 = webview.handle();
            std::thread::spawn(move || {
              if guijs_server_exists {
                notify_state(&handle, String::from("splashscreen"));
                if guijs_outdated() {
                  notify_state(&handle, String::from("update-available"));
                  tauri::event::listen(String::from("skip-update"), move |_| {
                    spawn_guijs_server(&handle);
                  });
                  tauri::event::listen(String::from("update"), move |_| {
                    notify_state(&handle2, String::from("downloading-update"));
                    update_guijs_server();
                    spawn_guijs_server(&handle2);
                  });
                } else {
                  spawn_guijs_server(&handle);
                }
              } else {
                notify_state(&handle, String::from("first-download"));
                install_guijs_server();
                notify_state(&handle, String::from("splashscreen"));
                spawn_guijs_server(&handle);
              }
            });
          } else {
            notify_state_with_payload(&handle, String::from("node-wrong-version"), format!("{}|{}", node_version, server_package_json.custom.min_node_version));
          }
        } else {
          notify_state(&handle, String::from("node-not-found"));
        }
      }
    })
    .build()
    .run();
}

fn run_npm_install_guijs_server(exists: bool) {
  let command = if exists { "update" } else { "install" };
  let guijs_stdout = Command::new("npm")
    .args(vec!("i", "-g", "@guijs/server-core"))
    .stdout(Stdio::piped())
    .spawn().expect(&format!("failed to {} guijs server package", command))
    .stdout.expect(&format!("failed to get guijs {} stdout", command));
  let guijs_reader = BufReader::new(guijs_stdout);
  guijs_reader
    .lines()
    .filter_map(|line| line.ok())
    .for_each(|line| {
      // TODO parse progress
      println!("{}", line);
    });
}

fn install_guijs_server() {
  run_npm_install_guijs_server(false);
}

fn update_guijs_server() {
  run_npm_install_guijs_server(true);
}

fn notify_state<T: 'static>(handle: &Handle<T>, name: String) {
  notify_state_with_payload(handle, name, String::from(""))
}

fn notify_state_with_payload<T: 'static>(handle:  &Handle<T>, name: String, payload: String) {
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

fn guijs_outdated() -> bool {
  let stdout = Command::new("npm")
    .args(vec!("outdated", "-g"))
    .stdout(Stdio::piped())
    .spawn()
    .expect("Failed to check if guijs server is outdated")
    .stdout.expect("Failed to get guijs server stdout");
  let reader = BufReader::new(stdout);

  let mut guijs_outdated = false;
  reader
    .lines()
    .filter_map(|line| line.ok())
    .for_each(|line| {
      if line.contains("guijs-server") {
        guijs_outdated = true;
      }
    });

  guijs_outdated
}

fn spawn_guijs_server<T: 'static>(handle: &Handle<T>) {
  let stdout = Command::new("guijs-server")
    .env("PORT", "4000")
    .stdout(Stdio::piped())
    .spawn()
    .expect("Failed to start guijs server")
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
