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
  let mut setup = false;
  tauri::AppBuilder::new()
    .setup(move |webview, _| {
      if !setup {
        setup = true;
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
          let node_version_compare = tauri::api::version::compare(&node_version, &server_package_json.custom.min_node_version);
          
          if node_version_compare.is_ok() && node_version_compare.expect("failed to compare node versions") <= 0 {
            let guijs_server_output = Command::new("guijs-server")
              .args(vec!("--version"))
              .stdout(Stdio::piped())
              .output();

            let handle2 = webview.handle();
            std::thread::spawn(move || {
              if guijs_server_output.is_ok() {
                notify_state(&handle, String::from("splashscreen"));
                let guijs_server_stdout = guijs_server_output.expect("failed to get guijs-server version output").stdout;
                let guijs_server_version = String::from_utf8_lossy(&guijs_server_stdout);
                let guijs_server_version_compare = tauri::api::version::compare(&guijs_server_version, &server_package_json.version);
                if guijs_server_version_compare.is_ok() && guijs_server_version_compare.expect("failed to compare guijs server versions") == 1 {
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

fn spawn_guijs_server<T: 'static>(handle: &Handle<T>) {
  let guijs_server_spawn = Command::new("guijs-server")
    .stdout(Stdio::piped())
    .spawn()
    .expect("Failed to start guijs server");

  tauri::api::command::spawn_relative_command(
    tauri::api::command::binary_command("guijs-orchestrator".to_string()).expect("failed to get binary command"),
    vec!(format!("{}", std::process::id()), format!("{}", guijs_server_spawn.id())),
    std::process::Stdio::piped()
  ).expect("failed to spawn orchestrator");

  let stdout = guijs_server_spawn.stdout.expect("Failed to get guijs server stdout");
  let reader = BufReader::new(stdout);

  let mut webview_started = false;
  reader
    .lines()
    .filter_map(|line| line.ok())
    .for_each(|line| {
      if !webview_started {
        webview_started = true;
        handle.dispatch(move |webview| {
          webview.eval(&format!("window.location.replace('http://localhost:{}')", line))
        }).expect("failed to initialize app");
        // wait for location to be replaced
        let ten_millis = std::time::Duration::from_millis(300);
        std::thread::sleep(ten_millis);
        handle.dispatch(|webview| {
           webview.eval(include_str!(concat!(env!("TAURI_DIR"), "/tauri.js")))
        }).expect("failed to eval tauri entry point");
      }
    });
}
