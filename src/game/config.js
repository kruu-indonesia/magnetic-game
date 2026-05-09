// Phaser game configuration for Magnetic Puzzle
export const GAME_CONFIG = {
  type: Phaser.AUTO,
  width: 600,
  height: 800,
  backgroundColor: '#1a1a2e',
  parent: 'game-container',
  scene: null, // Will be set when importing scene
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  }
}

// Game constants
export const GRID_SIZE = 8
export const CELL_SIZE = 60
export const GRID_OFFSET_X = 60
export const GRID_OFFSET_Y = 80

export const COLORS = {
  EMPTY: 0,
  RED: 1,
  BLUE: 2,
  LOCKED_RED: 3,
  LOCKED_BLUE: 4
}

export const COLOR_HEX = {
  [COLORS.RED]: 0xFF0066,        // Neon Magenta
  [COLORS.BLUE]: 0x00FFFF,       // Neon Cyan
  [COLORS.LOCKED_RED]: 0x990033, // Dark Magenta (locked)
  [COLORS.LOCKED_BLUE]: 0x006666, // Dark Cyan (locked)
  GRID_LINE: 0x444444,
  BACKGROUND: 0x1a1a2e
}

// Polarity Imbalance: 65% RED, 35% BLUE
export const RED_PROBABILITY = 0.65

// Piece shape templates (relative coordinates)
export const PIECE_SHAPES = {
  SINGLE: [[0, 0]],
  DOUBLE: [[0, 0], [1, 0]],
  TRIPLE: [[0, 0], [1, 0], [2, 0]],
  L_SHAPE: [[0, 0], [1, 0], [0, 1]]
}
