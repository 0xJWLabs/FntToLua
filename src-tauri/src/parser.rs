use std::collections::BTreeMap;

use quick_xml::Reader;

use crate::character::{Character, CharacterOffset, CharacterPosition, CharacterSize};

pub struct Parser {
    pub content: String,
}

pub struct ParserSuccess {
    pub font_size: i32,
    pub characters: BTreeMap<u32, Character>,
}

pub struct ParserError {
    pub code: String,
    pub message: String,
}

pub enum ParserResult {
    Success(ParserSuccess),
    Error(ParserError),
}

impl Parser {
    pub fn new(content: String) -> Self {
        Self { content }
    }

    pub fn parse(&self) -> ParserResult {
        self.parse_contents(&self.content)
    }

    fn parse_contents(&self, contents: &str) -> ParserResult {
        let mut reader = Reader::from_str(contents);
        let mut characters = BTreeMap::new();
        let mut buf = Vec::new();
        let mut font_size = 0;

        loop {
            match reader.read_event_into(&mut buf) {
                Ok(quick_xml::events::Event::Eof) => break,
                Ok(quick_xml::events::Event::Empty(ref e)) => match e.name().as_ref() {
                    b"char" => {
                        if let Some(character) = self.parse_character(e) {
                            characters.insert(character.0, character.1);
                        }
                    }
                    b"info" => {
                        font_size = self.parse_font_size(e);
                    }
                    _ => {}
                },
                Err(e) => {
                    return ParserResult::Error(ParserError {
                        code: "XML_PARSE_ERROR".to_string(),
                        message: format!("Error parsing XML: {:?}", e),
                    });
                }
                _ => {}
            }
            buf.clear();
        }

        ParserResult::Success(ParserSuccess {
            font_size,
            characters,
        })
    }

    fn parse_character(&self, e: &quick_xml::events::BytesStart) -> Option<(u32, Character)> {
        let mut id = 0;
        let mut width = 0;
        let mut height = 0;
        let mut x = 0;
        let mut y = 0;
        let mut xoffset = 0;
        let mut yoffset = 0;
        let mut xadvance = 0;

        for attr in e.attributes() {
            if let Ok(attr) = attr {
                match attr.key.as_ref() {
                    b"id" => id = Self::parse_attr(&attr.value).unwrap_or(0),
                    b"x" => x = Self::parse_attr(&attr.value).unwrap_or(0),
                    b"y" => y = Self::parse_attr(&attr.value).unwrap_or(0),
                    b"width" => width = Self::parse_attr(&attr.value).unwrap_or(0),
                    b"height" => height = Self::parse_attr(&attr.value).unwrap_or(0),
                    b"xoffset" => xoffset = Self::parse_attr(&attr.value).unwrap_or(0),
                    b"yoffset" => yoffset = Self::parse_attr(&attr.value).unwrap_or(0),
                    b"xadvance" => xadvance = Self::parse_attr(&attr.value).unwrap_or(0),
                    _ => {}
                }
            }
        }

        if id > 0 {
            Some((
                id,
                Character::new(
                    CharacterSize::new(width, height),
                    CharacterPosition::new(x, y),
                    CharacterOffset::new(xoffset, yoffset),
                    xadvance,
                ),
            ))
        } else {
            None
        }
    }

    fn parse_font_size(&self, e: &quick_xml::events::BytesStart) -> i32 {
        for attr in e.attributes() {
            if let Ok(attr) = attr {
                if attr.key.as_ref() == b"size" {
                    return Self::parse_attr(&attr.value).unwrap_or(0);
                }
            }
        }
        0
    }

    fn parse_attr<T: std::str::FromStr>(value: &[u8]) -> Option<T> {
        std::str::from_utf8(value).ok()?.parse().ok()
    }

    pub fn format_output(font_size: i32, font_data: &BTreeMap<u32, Character>) -> String {
        let indentation = 4;
        let spaces = " ".repeat(indentation);
        let mut output =
            format!("return {{\n{spaces}Size = {font_size},\n{spaces}Characters = {{\n");

        for (id, data) in font_data {
            let char_repr = match *id {
                0 | 13 => "".to_string(),
                _ => match std::char::from_u32(*id) {
                    Some(c) if c == '"' => "\\\"".to_string(), // Escape double quotes
                    Some(c) if c == '\\' => "\\\\".to_string(), // Escape backslashes
                    Some(c) if c.is_control() => format!("\\u{{{:X}}}", id),
                    Some(c) => c.to_string(),
                    None => format!("\\u{{{:X}}}", id),
                },
            };

            output.push_str(&format!(
                "{spaces}{spaces}[\"{}\"] = {{ Vector2.new({}, {}), Vector2.new({}, {}), Vector2.new({}, {}), {} }},\n",
                char_repr, data.size.width, data.size.height, data.position.x, data.position.y, data.offset.x, data.offset.y, data.advance
            ));
        }

        output.push_str(&format!("{spaces}}}\n}}\n"));
        output
    }
}
