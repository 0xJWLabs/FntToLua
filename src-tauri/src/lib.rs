mod character;
mod parser;

use parser::Parser;
use parser::ParserResult;

#[tauri::command]
fn parse_fnt(content: String) -> Result<String, String> {
    let parser = Parser::new(content);
    match parser.parse() {
        ParserResult::Success(data) => Ok(Parser::format_output(data.font_size, &data.characters)),
        ParserResult::Error(err) => Err(format!("Error: {} - {}", err.code, err.message)),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![parse_fnt])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
