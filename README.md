# Magnetic Game

A grid-based puzzle game where players place magnetic pieces on an 8×8 grid. Opposite polarities attract and disappear, while same polarities repel and lock together!

![Game Preview](https://img.shields.io/badge/Status-Playable-brightgreen) ![Version](https://img.shields.io/badge/Version-2.1-blue)

## 🎮 Game Mechanics

### Core Rules
- **RED + BLUE = POP** ✨ Opposite colors attract and disappear
- **RED + RED = LOCK** 🔒 Same colors repel and become locked (darker)
- **BLUE + BLUE = LOCK** 🔒 Same colors repel and become locked (darker)
- **Locked magnets** clear with 1 opposite neighbor (visual penalty for bad placement)

### Difficulty
- **Polarity Imbalance:** 65% RED, 35% BLUE pieces (BLUE is scarce!)
- **Strategic Depth:** Plan ahead to avoid creating locks
- **Chain Reactions:** Clearing magnets can trigger cascading pops for bonus points

### Scoring
- **10 points** per magnet cleared
- **Chain multipliers:** 1.0x → 1.5x → 2.0x → 2.5x...
- **Game Over:** When no pieces can fit on the grid

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/magnetic-game.git
cd magnetic-game

# Install dependencies
npm install

# Run development server
npm run dev
```

Open your browser to `http://localhost:5173` and start playing!

### Build for Production
```bash
npm run build
npm run preview
```

## 🎯 How to Play

1. **Drag pieces** from the tray at the bottom to the grid
2. **Place strategically** to create pops (opposite colors touching)
3. **Avoid locks** by not placing same colors adjacent
4. **Create chains** for bonus multipliers
5. **Manage scarcity** - BLUE pieces are rare, use them wisely!

Click the **"?"** button in-game for detailed instructions.

## 🛠️ Tech Stack

- **Framework:** React 18
- **Game Engine:** Phaser 3.80
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS 3
- **Routing:** React Router 7

## 📁 Project Structure

```
magnetic-game/
├── src/
│   ├── game/
│   │   ├── config.js          # Game constants and configuration
│   │   └── scenes/
│   │       └── GameScene.js   # Main game logic
│   ├── components/
│   │   └── PhaserGame.jsx     # Phaser wrapper component
│   ├── pages/
│   │   └── Play.jsx           # Game page
│   ├── App.jsx                # Main app component
│   └── main.jsx               # Entry point
├── MECHANISM.md               # Complete game mechanics documentation
├── DIFFICULTY_FEATURES.md     # Difficulty system explanation
├── HELP_MODAL.md             # Help system documentation
└── FIXES.md                  # Bug fixes log
```

## 📚 Documentation

- **[MECHANISM.md](MECHANISM.md)** - Complete game mechanics, formulas, and algorithms
- **[DIFFICULTY_FEATURES.md](DIFFICULTY_FEATURES.md)** - Polarity imbalance and lock penalty system
- **[HELP_MODAL.md](HELP_MODAL.md)** - In-game help system implementation
- **[FIXES.md](FIXES.md)** - Development log and bug fixes

## 🎨 Features

- ✅ 8×8 grid-based gameplay
- ✅ Drag-and-drop piece placement
- ✅ Real-time preview with validity feedback
- ✅ Magnetic attraction/repulsion mechanics
- ✅ Lock penalty system (visual feedback)
- ✅ Chain reaction system with multipliers
- ✅ Polarity imbalance (65% RED, 35% BLUE)
- ✅ In-game help modal
- ✅ Score tracking
- ✅ Game over detection
- ✅ Restart functionality

## 🔮 Future Enhancements

- [ ] Piece rotation
- [ ] Animations (snap, pop, jiggle effects)
- [ ] Sound effects
- [ ] Difficulty selector (Easy/Medium/Hard)
- [ ] High score persistence
- [ ] Mobile touch support
- [ ] Power-ups (unlock, color swap, clear row)
- [ ] Statistics tracking
- [ ] Achievements system

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📝 License

MIT License - feel free to use this project for learning or building your own games!

## 🎮 Play Online

[Live Demo](#) _(Coming soon)_

## 👨‍💻 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Game Balance

The game difficulty can be adjusted in `src/game/config.js`:

```javascript
// Adjust polarity imbalance (default: 0.65)
export const RED_PROBABILITY = 0.65  // 65% RED, 35% BLUE

// Easy:   0.55 (55% RED, 45% BLUE)
// Medium: 0.65 (65% RED, 35% BLUE) - Current
// Hard:   0.75 (75% RED, 25% BLUE)
```

## 🙏 Acknowledgments

- Inspired by Block Blast puzzle mechanics
- Built with Phaser 3 game engine
- Developed with assistance from Kiro AI

---

**Enjoy the game!** 🧲✨
