#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod command;
mod file_system;
mod npm;

#[macro_use]
extern crate serde_derive;
extern crate serde_json;

use std::{thread, time::Duration};
use tauri::{
  api::command::{Command, CommandEvent},
  Manager, Params, Window,
};

use std::sync::{Arc, Mutex};

#[derive(Serialize)]
pub struct State {
  pub name: String,
  pub payload: String,
}

fn main() {
  tauri::Builder::default()
    .setup(move |app| {
      let window = app.get_window("main").unwrap();

      let window_ = window.clone();
      window.listen("reload", move |_| {
        let window_ = window_.clone();
        thread::spawn(move || {
          let ten_millis = Duration::from_millis(100);
          thread::sleep(ten_millis);
          startup_eval(&window_);
        });
      });

      let update_deps: Arc<Mutex<Vec<String>>> = Arc::new(Mutex::new(Vec::new()));
      let update_deps_ = update_deps.clone();

      let window_ = window.clone();
      window.listen("skip-update", move |_| {
        let window_ = window_.clone();
        notify_state(&window_, "splashscreen");
        thread::spawn(move || {
          spawn_guijs_server(&window_);
        });
      });

      let window_ = window.clone();
      window.listen("update", move |_| {
        notify_state(&window_, "downloading-update");
        let window_ = window_.clone();
        let deps_do_update = update_deps_.clone();
        thread::spawn(move || {
          for dep in deps_do_update
            .lock()
            .expect("Failed to lock update_deps")
            .iter()
          {
            npm::update_dependency(dep.to_string());
          }
          spawn_guijs_server(&window_);
        });
      });

      thread::spawn(move || {
        if let Ok(node_path) = which::which("node") {
          // check if node exists
          if let Ok(node_version_output) = command::get_output(node_path, vec!["--version"]) {
            // check if node version matches the minimum version
            let node_version =
              String::from_utf8_lossy(&node_version_output.stdout).replace("v", "");

            let server_package_json: npm::PackageJson = serde_json::from_str(&cached_request(
              "https://registry.npmjs.org/guijs-version-marker/latest",
              "marker-package.json",
            ))
            .expect("failed to get marker package.json");
            if let Ok(node_version_compare) = tauri::api::version::compare(
              &node_version,
              &server_package_json.custom.min_node_version,
            ) {
              if node_version_compare <= 0 {
                notify_state(&window, "splashscreen");
                thread::spawn(move || {
                  let mut install_deps = Vec::new();
                  for (dependency, latest_version) in server_package_json.dev_dependencies.iter() {
                    let current_version = npm::get_current_version(dependency.to_string());
                    if current_version.is_some() {
                      let current_version_value =
                        current_version.unwrap().replace(">", "").replace("=", "");
                      if let Ok(version_compare) = tauri::api::version::compare(
                        &current_version_value,
                        &latest_version.replace("^", ""),
                      ) {
                        if version_compare == 1 {
                          println!(
                            "found update from {} to {}",
                            current_version_value, latest_version
                          );
                          let mut deps = update_deps.lock().expect("Failed to lock update_deps");
                          deps.push(dependency.clone());
                        }
                      }
                    } else {
                      install_deps.push(dependency.clone());
                    }
                  }

                  if install_deps.len() > 0 {
                    notify_state(&window, "first-download");
                    for dep in install_deps {
                      npm::install_dependency(dep.to_string());
                    }
                  }
                  if update_deps
                    .lock()
                    .expect("Failed to lock update_deps")
                    .len()
                    > 0
                  {
                    notify_state(&window, "update-available");
                  } else {
                    spawn_guijs_server(&window);
                  }
                });
              } else {
                notify_state_with_payload(
                  &window,
                  "node-wrong-version",
                  format!(
                    "{}|{}",
                    node_version, server_package_json.custom.min_node_version
                  ),
                );
              }
            }
          }
        } else {
          notify_state(&window, "node-not-found");
        }
      });
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

fn cached_request(url: &str, file_name: &str) -> String {
  if let Ok(response) = reqwest::blocking::get(url) {
    let response_text = response.text().expect("failed to read response text");
    file_system::write_to_cache(file_name, response_text.clone());
    return response_text;
  }
  return file_system::read_cache(file_name).expect("failed to read from cache");
}

fn notify_state<P: Params>(window: &Window<P>, name: &str) {
  notify_state_with_payload(window, name, String::from(""))
}

fn notify_state_with_payload<P: Params>(window: &Window<P>, name: &str, payload: String) {
  let reply = State {
    name: name.to_string(),
    payload,
  };
  window
    .emit(
      &"state"
        .parse()
        .unwrap_or_else(|_| panic!("failed to emit state event: parse error")),
      Some(reply),
    )
    .expect("failed to emit event");
}

fn spawn_guijs_server<P: Params>(window: &Window<P>) {
  let guijs_server_path = which::which("guijs-server").unwrap();

  let (mut rx, _child) = Command::new_sidecar("guijs-orchestrator")
    .unwrap()
    .args(vec![
      "run",
      guijs_server_path
        .to_str()
        .expect("guijs server path is not utf-8"),
    ])
    .spawn()
    .expect("Failed to start guijs server");

  let mut guijs_started = false;

  tauri::async_runtime::block_on(async move {
    while let Some(event) = rx.recv().await {
      if let CommandEvent::Stdout(line) = event {
        if !guijs_started {
          guijs_started = true;
          window
            .eval(&format!(
              "window.location.replace('http://localhost:{}')",
              line
            ))
            .expect("failed to change URL");
          // wait for location to be replaced
          let ten_millis = std::time::Duration::from_millis(300);
          thread::sleep(ten_millis);
          startup_eval(window);
        }
      }
    }
  });
}

fn startup_eval<P: Params>(window: &Window<P>) {
  window
    .eval(
      "
      window.__GUIJS_RELOAD = function () {
        window.tauri.emit('reload')
        window.location.reload()
      }
    ",
    )
    .expect("failed to eval location.replace rewrite");
}
