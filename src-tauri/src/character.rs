#[derive(Debug)]
pub struct CharacterOffset {
    pub x: i32,
    pub y: i32,
}

impl CharacterPosition {
    pub fn new(x: i32, y: i32) -> Self {
        CharacterPosition { x, y }
    }
}

#[derive(Debug)]
pub struct CharacterSize {
    pub width: i32,
    pub height: i32,
}

impl CharacterSize {
    pub fn new(width: i32, height: i32) -> Self {
        CharacterSize { width, height }
    }
}

#[derive(Debug)]
pub struct CharacterPosition {
    pub x: i32,
    pub y: i32,
}

impl CharacterOffset {
    pub fn new(x: i32, y: i32) -> Self {
        CharacterOffset { x, y }
    }
}

#[derive(Debug)]
pub struct Character {
    pub size: CharacterSize,
    pub position: CharacterPosition,
    pub offset: CharacterOffset,
    pub advance: i32,
}

impl Character {
    pub fn new(
        size: CharacterSize,
        position: CharacterPosition,
        offset: CharacterOffset,
        advance: i32,
    ) -> Self {
        Character {
            size,
            position,
            offset,
            advance,
        }
    }
}
