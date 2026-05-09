# Help Modal - Implementation Guide

## Overview
A help button (?) in the top-right corner opens a modal explaining game mechanics.

---

## Visual Design

### Help Button
- **Location:** Top-right corner (560, 20)
- **Style:** White "?" on magenta background (#FF0066)
- **Size:** 32px font, 12px horizontal padding
- **Interaction:** Hover scales to 1.1x, click opens modal

### Modal Layout
- **Overlay:** 85% black overlay (dims game)
- **Modal:** 520×680px centered box
- **Border:** 3px cyan (#00FFFF) stroke
- **Background:** Dark navy (#1a1a2e)

---

## Content Structure

### 1. Title
```
"How to Play"
- 32px, cyan, bold
- Centered at top
```

### 2. Instructions (Main Content)
```
GOAL: Score points by clearing magnets

RULES:
• Drag pieces from tray to grid
• RED + BLUE = POP (both disappear)
• RED + RED = LOCK (darker color)
• BLUE + BLUE = LOCK (darker color)
• Locked magnets clear normally (1 opposite neighbor)

DIFFICULTY:
• 65% RED, 35% BLUE pieces
• BLUE is scarce - use wisely!
• Avoid same-color adjacency

SCORING:
• 10 points per pop
• Chain reactions = bonus multiplier
• 1st wave: 1.0x
• 2nd wave: 1.5x
• 3rd wave: 2.0x

GAME OVER:
• When no pieces can fit on grid
```

### 3. Color Legend (Bottom)
Visual examples of all magnet types:

| Color | Appearance | Label |
|-------|------------|-------|
| Normal RED | Bright magenta square | "Normal RED" |
| Locked RED | Dark magenta + white border | "Locked RED" |
| Normal BLUE | Bright cyan square | "Normal BLUE" |
| Locked BLUE | Dark cyan + white border | "Locked BLUE" |

### 4. Close Button
```
"Close"
- 24px, white text on magenta background
- Centered at bottom
- Hover scales to 1.05x
```

---

## Interaction Behavior

### Opening Modal
1. Click "?" button
2. Game continues in background (not paused)
3. Modal appears with overlay
4. All modal elements have depth 100+

### Closing Modal
**Three ways to close:**
1. Click "Close" button
2. Click anywhere on dark overlay
3. (Future: ESC key)

**On close:**
- All modal elements destroyed
- Game remains playable
- No state changes

---

## Technical Implementation

### Method: `showHelpModal()`
```javascript
showHelpModal() {
  // 1. Create overlay (depth 100)
  // 2. Create modal background (depth 101)
  // 3. Add title (depth 102)
  // 4. Add instructions text (depth 102)
  // 5. Add color legend (depth 102)
  // 6. Add close button (depth 102)
  // 7. Store all elements in array
  // 8. Setup close handlers (button + overlay click)
}
```

### Depth Layers
```
Game elements:     0-10
Preview graphics:  5
Modal overlay:     100
Modal background:  101
Modal content:     102
```

### Cleanup
All modal elements stored in `modalElements` array and destroyed together when closed.

---

## Accessibility Considerations

### Current Implementation
- ✅ Large, clear text (16px body, 32px title)
- ✅ High contrast (white on dark)
- ✅ Visual color examples (not just text)
- ✅ Multiple close methods
- ✅ Hover feedback on interactive elements

### Future Improvements
- [ ] Keyboard navigation (ESC to close, Tab through elements)
- [ ] Screen reader support (ARIA labels)
- [ ] Adjustable text size
- [ ] Color-blind friendly indicators (shapes + colors)

---

## Content Guidelines

### What to Include
✅ Core mechanics (attraction/repulsion)  
✅ Lock penalty explanation  
✅ Difficulty mechanics (imbalance)  
✅ Scoring system  
✅ Win/loss conditions  
✅ Visual examples (color legend)  

### What to Avoid
❌ Technical jargon  
❌ Implementation details  
❌ Advanced strategies (let players discover)  
❌ Too much text (keep concise)  

---

## Localization Ready

### Text Strings (for future translation)
```javascript
const HELP_TEXT = {
  title: 'How to Play',
  goal: 'GOAL: Score points by clearing magnets',
  rules: 'RULES:',
  rule1: 'Drag pieces from tray to grid',
  rule2: 'RED + BLUE = POP (both disappear)',
  rule3: 'RED + RED = LOCK (darker color)',
  rule4: 'BLUE + BLUE = LOCK (darker color)',
  rule5: 'Locked magnets clear normally',
  difficulty: 'DIFFICULTY:',
  diff1: '65% RED, 35% BLUE pieces',
  diff2: 'BLUE is scarce - use wisely!',
  diff3: 'Avoid same-color adjacency',
  scoring: 'SCORING:',
  score1: '10 points per pop',
  score2: 'Chain reactions = bonus multiplier',
  gameOver: 'GAME OVER:',
  gameOver1: 'When no pieces can fit on grid',
  close: 'Close'
}
```

---

## Testing Checklist

- [x] Help button visible in top-right
- [x] Help button hover effect works
- [x] Modal opens on click
- [x] Modal content is readable
- [x] Color legend matches actual game colors
- [x] Close button works
- [x] Overlay click closes modal
- [x] Modal doesn't interfere with gameplay
- [x] All elements properly destroyed on close
- [x] No memory leaks (elements cleaned up)

---

## Future Enhancements

### Phase 1 (Current)
- [x] Basic modal with text instructions
- [x] Color legend
- [x] Close button

### Phase 2 (Future)
- [ ] Animated examples (show piece placement)
- [ ] Interactive tutorial (step-by-step)
- [ ] Tips section (strategy hints)
- [ ] Keyboard shortcuts reference

### Phase 3 (Future)
- [ ] Video tutorial
- [ ] Difficulty selector in modal
- [ ] Statistics display
- [ ] Achievement hints

---

## Design Rationale

### Why Top-Right Corner?
- Standard location for help/info buttons
- Doesn't interfere with score (top-left)
- Doesn't interfere with title (top-center)
- Easy to find

### Why "?" Symbol?
- Universal symbol for help
- Single character (easy to localize)
- Recognizable at small sizes

### Why Modal Instead of Sidebar?
- Doesn't permanently take screen space
- Can show more information
- Focuses attention on instructions
- Easy to dismiss

### Why Not Pause Game?
- Game is turn-based (no time pressure)
- Players can read at their own pace
- Simpler implementation
- Can reference game state while reading

---

**Version:** MVP 2.1  
**Status:** Implemented  
**Last Updated:** Help modal added with full instructions
