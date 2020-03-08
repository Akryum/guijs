use std::io::{BufRead, BufReader};
use serde::Deserialize;
use std::collections::HashMap;

#[derive(PartialEq, Deserialize, Clone, Debug)]
#[serde(tag = "engines", rename_all = "camelCase")]
pub struct PackageJsonCustom {
  pub min_node_version: String,
}

#[derive(PartialEq, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct PackageJson {
  pub custom: PackageJsonCustom,
  pub dev_dependencies: HashMap<String, String>,
}

fn run_npm_install(dependency: String, exists: bool) {
  let command = if exists { "update" } else { "install" };
  println!("{} {}", command, dependency);
  let npm_path = which::which("npm").expect("failed to get npm path");
  let guijs_stdout = super::command::spawn_command(npm_path, vec!["install", "-g", dependency.as_str()])
    .expect(&format!("failed to {} guijs server package", command))
    .stdout
    .expect(&format!("failed to get guijs {} stdout", command));
  let guijs_reader = BufReader::new(guijs_stdout);
  guijs_reader
    .lines()
    .filter_map(|line| line.ok())
    .for_each(|line| {
      println!("{}", line);
    });
}

pub fn install_dependency(dependency: String) {
  run_npm_install(dependency, false);
}

pub fn update_dependency(dependency: String) {
  run_npm_install(dependency, true);
}

pub fn get_current_version(dependency: String) -> Option<String> {
  let binary = dependency.replace("@guijs/", "guijs-").replace("-core", "");
  println!("getting {} version, binary {}", dependency, binary);
  if let Ok(dependency_binary_path) = which::which(binary.clone()) {
    println!("{:?}", which::which(binary.clone()).unwrap());
    if let Ok(output) = super::command::command_output(dependency_binary_path, vec!["--version"]) {
      let stdout = &output.stdout;
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
