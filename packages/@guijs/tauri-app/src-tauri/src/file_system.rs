use std::fs::{read_to_string, File};
use std::io::Write;

const APP_NAME: &'static str = "guijs";

pub fn write_to_cache(file_path: &str, contents: String) {
  if let Some(mut cache_dir) = dirs_next::cache_dir() {
    cache_dir.push(APP_NAME);
    cache_dir.push(file_path);
    if let Ok(mut file) = File::create(cache_dir) {
      file
        .write_all(contents.as_bytes())
        .expect("failed to write file");
    }
  }
}

pub fn read_cache(file_path: &str) -> Option<String> {
  if let Some(mut cache_dir) = dirs_next::cache_dir() {
    cache_dir.push(APP_NAME);
    cache_dir.push(file_path);
    read_to_string(cache_dir).ok()
  } else {
    None
  }
}
