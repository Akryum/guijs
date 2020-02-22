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
use std::collections::HashMap;
use std::sync::{Arc, Mutex};

#[derive(PartialEq, Deserialize, Clone, Debug)]
#[serde(tag = "engines", rename_all = "camelCase")]
pub struct PackageJsonCustom {
  min_node_version: String
}

#[derive(PartialEq, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct PackageJson {
  custom: PackageJsonCustom,
  dev_dependencies: HashMap<String, String>
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

        let reload_handle = webview.handle();
        tauri::event::listen("reload".to_string(), move |_| {
          let reload_handle_clone = reload_handle.clone();
          std::thread::spawn(move || {
            let ten_millis = std::time::Duration::from_millis(1000);
            std::thread::sleep(ten_millis);
            startup_eval(&reload_handle_clone);
          });
        });

        let update_deps: Arc<Mutex<Vec<String>>> = Arc::new(Mutex::new(Vec::new()));
        let update_deps_clone = update_deps.clone();

        let handle2 = webview.handle();
        let handle3 = webview.handle();
        tauri::event::listen(String::from("skip-update"), move |_| {
          let handle_clone = handle2.clone();
          notify_state(&handle_clone, String::from("splashscreen"));
          std::thread::spawn(move || {
            spawn_guijs_server(&handle_clone);
          });
        });

        tauri::event::listen(String::from("update"), move |_| {
          notify_state(&handle3, String::from("downloading-update"));
          let handle_clone = handle3.clone();
          let deps_do_update = update_deps_clone.clone();
          std::thread::spawn(move || {
            for dep in deps_do_update.lock().expect("Failed to lock update_deps").iter() {
              update_dependency(dep.to_string());
            }
            spawn_guijs_server(&handle_clone);
          });
        });

        let node_path = which::which("node");
        if node_path.is_ok() {
          // check if node exists & matches the minimum version
          let node_version_output = Command::new(node_path.unwrap())
            .args(vec!("--version"))
            .stdout(Stdio::piped())
            .output();
          if node_version_output.is_ok() {
            let node_version = String::from_utf8_lossy(&node_version_output.expect("failed to get node output").stdout).replace("v", "");
            let server_package_json: PackageJson = reqwest::blocking::get("https://registry.npmjs.org/guijs-version-marker/latest")
              .expect("failed to read server package.json")
              .json::<PackageJson>()
              .expect("failed to parse server package.json");
            let node_version_compare = tauri::api::version::compare(&node_version, &server_package_json.custom.min_node_version);
            
            if node_version_compare.is_ok() && node_version_compare.expect("failed to compare node versions") <= 0 {
              notify_state(&handle, String::from("splashscreen"));
              std::thread::spawn(move || {
                let mut install_deps = Vec::new();
                for (dependency, latest_version) in server_package_json.dev_dependencies.iter() {
                  let current_version = get_current_version(dependency.to_string());
                  if current_version.is_some() {
                    let current_version_value = current_version.unwrap().replace(">", "").replace("=", "");
                    let version_compare = tauri::api::version::compare(&current_version_value, &latest_version.replace("^", ""));
                    if version_compare.is_ok() && version_compare.expect("failed to compare versions") == 1 {
                      println!("found update from {} to {}", current_version_value, latest_version);
                      let mut deps = update_deps
                        .lock()
                        .expect("Failed to lock update_deps");
                      deps.push(dependency.clone());
                    }
                  } else {
                    install_deps.push(dependency.clone());
                  }
                }

                if install_deps.len() > 0 {
                  notify_state(&handle, String::from("first-download"));
                  for dep in install_deps {
                    install_dependency(dep.to_string());
                  }
                }
                if update_deps.lock().expect("Failed to lock update_deps").len() > 0 {
                  notify_state(&handle, String::from("update-available"));
                } else {
                  spawn_guijs_server(&handle);
                }
              });
            } else {
              notify_state_with_payload(&handle, String::from("node-wrong-version"), format!("{}|{}", node_version, server_package_json.custom.min_node_version));
            }
          }
        } else {
          notify_state(&handle, String::from("node-not-found"));
        }
      }
    })
    .build()
    .run();
}

fn orchestrator_command() -> String {
  tauri::api::command::relative_command(
    tauri::api::command::binary_command("guijs-orchestrator".to_string()).expect("failed to get binary command")
  ).expect("failed to get relative command")
}

fn get_current_version(dependency: String) -> Option<String> {
  let binary = dependency.replace("@guijs/", "guijs-").replace("-core", "");
  println!("getting {} version, binary {}", dependency, binary);
  let dependency_binary_path = which::which(binary.clone());
  if dependency_binary_path.is_ok() {
    println!("{:?}", which::which(binary.clone()).unwrap());
    let output = Command::new(dependency_binary_path.unwrap())
      .args(vec!("--version"))
      .stdout(Stdio::piped())
      .output();
    if output.is_ok() {
      let stdout = &output.unwrap().stdout;
      let version = String::from_utf8_lossy(stdout);
      println!("{} v{}", dependency, version);
      Some(version.to_string())
    } else {
      println!("{} not installed", dependency);
      None
    }
  } else {
    println!("not found");
    None
  }
}

fn run_npm_install(dependency: String, exists: bool) {
  let command = if exists { "update" } else { "install" };
  println!("{} {}", command, dependency);
  let npm_path = which::which("npm").expect("failed to get npm path");
  let guijs_stdout = Command::new(npm_path)
    .args(vec!("install", "-g", dependency.as_str()))
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

fn install_dependency(dependency: String) {
  run_npm_install(dependency, false);
}

fn update_dependency(dependency: String) {
  run_npm_install(dependency, true);
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
  let guijs_server_path = which::which("guijs-server").unwrap();
  let stdout = Command::new(orchestrator_command())
    .args(vec!("run", guijs_server_path.to_str().expect("guijs server path is not utf-8")))
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
      println!("{}", line);
      if !webview_started {
        webview_started = true;
        handle.dispatch(move |webview| {
          webview.eval(&format!("window.location.replace('http://localhost:{}')", line))
        }).expect("failed to initialize app");
        // wait for location to be replaced
        let ten_millis = std::time::Duration::from_millis(300);
        std::thread::sleep(ten_millis);
        startup_eval(handle);
      }
    });
}

fn startup_eval<T: 'static>(handle: &Handle<T>) {
  handle.dispatch(|webview| {
    webview.eval("
      window.__GUIJS_RELOAD = function () {
        window.tauri.emit('reload')
        window.location.reload()
      }
    ").expect("failed to eval location.replace rewrite");
    webview.eval(include_str!(concat!(env!("TAURI_DIR"), "/tauri.js")))
  }).expect("failed to eval tauri entry point");
}