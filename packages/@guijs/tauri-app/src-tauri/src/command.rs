use std::process::{Child, Command, Output, Stdio};
use std::ffi::OsStr;

#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;

#[cfg(target_os = "windows")]
const CREATE_NO_WINDOW: u32 = 0x08000000;

#[cfg(target_os = "windows")]
pub fn command_output<S: AsRef<OsStr>>(command: S, args: Vec<&str>) -> std::io::Result<Output> {
  Command::new(command)
    .args(args)
    .stdout(Stdio::piped())
    .creation_flags(CREATE_NO_WINDOW)
    .output()
}

#[cfg(not(target_os = "windows"))]
pub fn command_output<S: AsRef<OsStr>>(command: S, args: Vec<&str>) -> std::io::Result<Output> {
  Command::new(command)
    .args(args)
    .stdout(Stdio::piped())
    .output()
}

#[cfg(target_os = "windows")]
pub fn spawn_command<S: AsRef<OsStr>>(command: S, args: Vec<&str>) -> std::io::Result<Child> {
  Command::new(command)
    .args(args)
    .stdout(Stdio::piped())
    .creation_flags(CREATE_NO_WINDOW)
    .spawn()
}

#[cfg(not(target_os = "windows"))]
pub fn spawn_command<S: AsRef<OsStr>>(command: S, args: Vec<&str>) -> std::io::Result<Child> {
  Command::new(command)
    .args(args)
    .stdout(Stdio::piped())
    .spawn()
}
