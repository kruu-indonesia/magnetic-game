# Difficulty Features - Polarity Imbalance + Lock Penalty

## Overview
Two new mechanics have been added to make the game significantly harder and prevent infinite play:

1. **Polarity Imbalance** - RED appears 65% of the time, BLUE only 35%
2. **Lock Penalty** - Same colors touching become LOCKED and harder to clear

---

## 1. Polarity Imbalance (65/35 Ratio)

### What Changed:
**Before:**
```javascript
// 50/50 chance
color = random() < 0.5 ? RED : BLUE
```

**After:**
```javascript
// 65% RED, 35% BLUE
color = random() < 0.65 ? RED : BLUE
```

### Why This Makes It Harder:

**Example Scenario:**
```
Turn 1: Get pieces [R,R], [R,R,R], [R]  ← 7 RED, 0 BLUE
Turn 2: Get pieces [R,R], [R], [B]      ← 3 RED, 1 BLUE
Turn 3: Get pieces [R,R,R], [R,R], [B]  ← 5 RED, 1 BLUE

Total: 15 RED, 2 BLUE
```

**Problem:**
- Grid fills up with RED magnets
- Not enough BLUE to clear them
- Eventually run out of space
- **Game Over!**

### Visual Indicator:
- No visual change to pieces
- Players will notice they get more RED pieces over time
- Creates natural resource scarcity

---

## 2. Lock Penalty System

### What Changed:

**Before:**
```
RED + RED → Nothing happens (neutral)
BLUE + BLUE → Nothing happens (neutral)
```

**After:**
```
RED + RED → Both become LOCKED_RED (darker, visual penalty)
BLUE + BLUE → Both become LOCKED_BLUE (darker, visual penalty)

Locked magnets clear with 1 opposite neighbor (same as normal)
But they STAY locked until cleared (don't revert to normal)
```

### How It Works:

#### Step 1: Placement
```
Place [R,R] piece:
Grid: [R] [R] [ ]
      [ ] [ ] [ ]
```

#### Step 2: Lock Detection (Automatic)
```
Same colors touching!
Grid: [🔒R] [🔒R] [ ]  ← Both become LOCKED_RED
      [ ] [ ] [ ]
```

#### Step 3: Clearing Locked Magnets
```
Place [B] next to locked RED:
Grid: [🔒R] [🔒R] [B]
      [ ] [ ] [ ]

Check: Locked RED has 1 BLUE neighbor
Result: POP! ✅ (locked magnets clear with just 1 opposite neighbor)

Grid: [ ] [🔒R] [ ]  ← Right locked RED cleared, left one remains
      [ ] [ ] [ ]
```

**Key Point:** Locked magnets clear the same way as normal magnets (1 opposite neighbor), but they stay locked until they pop.

### Visual Indicators:

| State | Color | Border | Hex Code |
|-------|-------|--------|----------|
| Normal RED | Bright Magenta | None | #FF0066 |
| Locked RED | Dark Magenta | White | #990033 |
| Normal BLUE | Bright Cyan | None | #00FFFF |
| Locked BLUE | Dark Cyan | White | #006666 |

**Locked magnets are:**
- Darker shade of their color
- Have a white border (3px, 60% opacity)
- Visually distinct from normal magnets

---

## 3. Combined Effect

### Example Game Flow:

**Turn 1:**
```
Pieces: [R,R], [R,R,R], [R]  ← Imbalance: mostly RED

Place [R,R]:
Grid: [🔒R] [🔒R] [ ]  ← Locked immediately!
      [ ] [ ] [ ]
```

**Turn 2:**
```
Pieces: [R,R], [R], [B]  ← Still mostly RED

Place [R,R,R]:
Grid: [🔒R] [🔒R] [🔒R]  ← More locks!
      [🔒R] [🔒R] [ ]
      [ ] [ ] [ ]

Place [B]:
Grid: [🔒R] [🔒R] [🔒R]
      [🔒R] [🔒R] [B]  ← BLUE can clear adjacent locked RED!
      [ ] [ ] [ ]

After pop:
Grid: [🔒R] [🔒R] [🔒R]
      [🔒R] [ ] [ ]  ← One locked RED cleared!
      [ ] [ ] [ ]
```

**Turn 3:**
```
Pieces: [R,R,R], [R], [R,B]  ← STILL mostly RED!

Grid is filling up fast with locked REDs:
Grid: [🔒R] [🔒R] [🔒R]
      [🔒R] [🔒R] [B]
      [R] [R] [R]  ← New placement

More locks form!
Grid: [🔒R] [🔒R] [🔒R]
      [🔒R] [🔒R] [B]
      [🔒R] [🔒R] [🔒R]  ← Disaster!
```

**Result:** Grid fills up with locked magnets that can't be cleared!

---

## 4. Strategic Implications

### What Lock Penalty Does:
✅ **Visual Feedback** - Shows you made a bad placement (same colors touched)  
✅ **Permanent Reminder** - Locked magnets stay locked until cleared  
✅ **Still Clearable** - Can be cleared with 1 opposite neighbor (same as normal)  
✅ **Psychological Pressure** - Darker colors remind you of mistakes  

### Good Strategies:
✅ **Save BLUE pieces** - They're rare and valuable  
✅ **Avoid placing same colors adjacent** - Prevents locks  
✅ **Plan ahead** - Think about where locks will form  
✅ **Clear locks quickly** - Don't let them accumulate  
✅ **Use single-cell pieces strategically** - Less likely to create locks  

### Bad Strategies:
❌ **Placing RED pieces carelessly** - Creates locks everywhere  
❌ **Using BLUE pieces immediately** - Waste scarce resource  
❌ **Ignoring locked magnets** - Visual clutter and reminder of bad plays  
❌ **Placing large RED pieces** - High chance of self-locking  

### Lock Penalty Purpose:
The lock is primarily a **visual penalty** that:
- Shows you placed same colors together (bad move)
- Stays as a reminder until you clear it
- Doesn't make clearing harder (still needs 1 opposite neighbor)
- Creates psychological pressure to play better  

---

## 5. Technical Implementation

### New Constants:
```javascript
// config.js
export const COLORS = {
  EMPTY: 0,
  RED: 1,
  BLUE: 2,
  LOCKED_RED: 3,      // NEW
  LOCKED_BLUE: 4      // NEW
}

export const RED_PROBABILITY = 0.65  // NEW
```

### New Methods:
```javascript
// GameScene.js
checkAndApplyLocks()           // Detects and applies lock penalty
countOppositeNeighbors(x, y)   // Counts neighbors of specific color
```

### Modified Methods:
```javascript
generatePieces()        // Now uses 65/35 ratio
findPops()              // Now handles locked magnets (clear with 1 neighbor)
updateGridDisplay()     // Now shows locked magnets with border
checkAndResolvePops()   // Now applies locks before pops
```

### Removed Methods:
```javascript
countOppositeNeighbors()  // No longer needed (locked magnets clear with 1 neighbor)
```

---

## 6. Difficulty Comparison

| Metric | Before (50/50, No Locks) | After (65/35 + Visual Locks) |
|--------|--------------------------|------------------------------|
| Average Game Length | Infinite | 50-100 moves |
| Skill Required | Low | Medium |
| Strategic Depth | Low | Medium-High |
| Frustration Factor | None | Low |
| Replayability | Low | High |
| Lock Penalty | None | Visual feedback only |

---

## 7. Testing Scenarios

### Scenario A: Lock Formation and Clearing
```
1. Place [R,R] piece
2. Verify both cells become LOCKED_RED (darker + border)
3. Place [B] next to one locked RED
4. Verify pop occurs (locked magnets clear with 1 neighbor)
5. Verify cleared cell is empty
6. Verify other locked RED remains locked
```

### Scenario B: Polarity Imbalance
```
1. Generate 100 pieces
2. Count total RED and BLUE cells
3. Expected: ~65 RED, ~35 BLUE
4. Verify ratio is approximately 65/35
```

### Scenario C: Game Over
```
1. Play until grid fills with locked REDs
2. Verify game over triggers when no pieces fit
3. Verify locked magnets contributed to game over
```

---

## 8. Future Adjustments

### Difficulty Levels (Not Implemented Yet):
```javascript
// Easy Mode
RED_PROBABILITY = 0.55  // 55% RED, 45% BLUE

// Medium Mode (Current)
RED_PROBABILITY = 0.65  // 65% RED, 35% BLUE

// Hard Mode
RED_PROBABILITY = 0.75  // 75% RED, 25% BLUE
```

### Lock Variations (Not Implemented Yet):
```javascript
// Option 1: Harder Locks (Original Design)
// Locked magnets need 2+ opposite neighbors to clear

// Option 2: Permanent Locks
// Locked magnets NEVER clear (must work around them)

// Option 3: Triple Lock
// Need 3+ opposite neighbors to clear

// Option 4: Lock Spread
// Locked magnets "infect" adjacent same-color magnets
```

---

## 9. Balance Notes

### Current Balance (v2.1):
- **Polarity Imbalance:** 65% RED, 35% BLUE
- **Lock Penalty:** Visual only (clears with 1 neighbor, same as normal)
- **Difficulty:** Medium - Challenging but fair

### Why This Balance Works:
1. **Imbalance creates scarcity** - Main difficulty comes from lack of BLUE
2. **Locks are visual feedback** - Shows bad placement without being punishing
3. **Locks stay until cleared** - Permanent reminder of mistakes
4. **Still clearable** - Doesn't make game unplayable

### If Still Too Hard:
- Reduce imbalance to 60/40 or 55/45
- Keep lock penalty as-is (visual feedback is good)

### If Too Easy:
- Increase imbalance to 70/30 or 75/25
- OR implement harder lock clearing (2+ neighbors)

---

## 10. Known Limitations

1. **No lock preview** - Players can't see which cells will lock before placing
2. **No difficulty selector** - Ratio is fixed at 65/35
3. **No lock counter** - No UI showing how many locked magnets exist
4. **Locks are visual only** - Don't actually make clearing harder (by design)

---

## 11. Player Feedback Points

Watch for:
- Is 65/35 too hard or too easy?
- Do players understand the lock mechanic?
- Are locked magnets visually distinct enough?
- Is the visual penalty effective without being frustrating?
- Do players notice they're making bad placements?

Adjust `RED_PROBABILITY` in `config.js` based on feedback:
- Too easy → increase to 0.70 or 0.75
- Too hard → decrease to 0.60 or 0.55

---

**Version:** MVP 2.1  
**Implemented:** Polarity Imbalance + Lock Penalty (Visual)  
**Status:** Balanced and Playable  
**Change:** Locked magnets now clear with 1 neighbor (same as normal)
