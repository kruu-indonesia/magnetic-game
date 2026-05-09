# Magnetic Puzzle Game - Core Mechanisms

## 🎯 Quick Summary for AI

**Game Type:** Grid-based puzzle with magnetic polarity mechanics  
**Difficulty:** Medium (65% RED / 35% BLUE imbalance + visual lock penalty)  
**Win Condition:** None (endless, score-based)  
**Loss Condition:** No pieces can fit on grid  

**Core Mechanics:**
1. **Opposite colors attract** → RED + BLUE = POP (both disappear)
2. **Same colors repel** → RED + RED = LOCK (both become darker, stay until cleared)
3. **Locked magnets** → Clear with 1 opposite neighbor (same as normal), but stay locked until cleared
4. **Polarity imbalance** → 65% RED, 35% BLUE generation creates scarcity
5. **Chain reactions** → Pops can trigger more pops (multiplier bonus)

**Key Balance Point:** Main difficulty is color scarcity (imbalance), not lock penalty. Locks are visual feedback for bad placement.

---

## 1. Game Overview
A grid-based, endless puzzle game where players place magnetic pieces on an 8×8 grid. Pieces have RED (positive) and BLUE (negative) polarities. Opposite colors attract and "pop" (disappear), while same colors repel and **LOCK** together.

**Difficulty Mechanics:**
- **Polarity Imbalance:** 65% RED, 35% BLUE generation (creates scarcity)
- **Lock Penalty:** Same colors touching become LOCKED (visual penalty, clears with 1 opposite neighbor)

---

## 1. Grid System

### Grid Structure
```
Grid: 8×8 matrix
Cell States: 
  0 = EMPTY
  1 = RED
  2 = BLUE
  3 = LOCKED_RED (darker red, needs 2+ BLUE neighbors)
  4 = LOCKED_BLUE (darker cyan, needs 2+ RED neighbors)
```

### Grid Representation
```javascript
grid[y][x] = cellState

Example:
grid[0][0] = 0  // Top-left cell is empty
grid[3][4] = 1  // Cell at row 3, col 4 is RED
grid[7][7] = 2  // Bottom-right cell is BLUE
```

---

## 2. Piece Generation (Pre-Game)

### Piece Structure
```javascript
piece = {
  shape: [[x1, y1], [x2, y2], ...],  // Relative coordinates
  colors: [color1, color2, ...],      // Color for each cell
  id: uniqueId                        // Piece identifier
}
```

### Shape Templates
```
1×1 (Single):   [[0,0]]
1×2 (Double):   [[0,0], [1,0]]
1×3 (Triple):   [[0,0], [1,0], [2,0]]
L-Shape:        [[0,0], [1,0], [0,1]]
```

### Generation Formula
```
For i = 0 to 2:
  1. shapeType = random(SINGLE, DOUBLE, TRIPLE, L_SHAPE)
  2. shape = SHAPE_TEMPLATES[shapeType]
  3. colors = []
  4. For each cell in shape:
       // POLARITY IMBALANCE: 65% RED, 35% BLUE
       if random() < 0.65:
         colors.push(RED)
       else:
         colors.push(BLUE)
  5. pieceTray[i] = {shape, colors, id: i}
```

**Result:** 3 random pieces with **imbalanced** color distribution (more RED than BLUE)

**Why Imbalance?** Creates difficulty by making one color scarce, forcing strategic management of resources.

---

## 3. Placement Mechanics (In-Game)

### Drag and Drop System
```
onDragStart(piece):
  piece.alpha = 0.7
  piece.depth = 10  // Bring to front
  
onDrag(piece, pointer):
  piece.x = pointer.x
  piece.y = pointer.y
  
  // Calculate grid position from piece container position
  gridX = floor((piece.x - GRID_OFFSET_X) / CELL_SIZE)
  gridY = floor((piece.y - GRID_OFFSET_Y) / CELL_SIZE)
  
  // Show preview on grid
  showPreview(piece, gridX, gridY)
  
onDragEnd(piece):
  if isValidPlacement:
    placePiece(piece, gridX, gridY)
    resolvePops()
  else:
    returnToTray(piece)
```

### Visual Preview System
```
showPreview(piece, gridX, gridY):
  clearPreviousPreview()
  
  isValid = canPlace(piece, gridX, gridY)
  
  For each cell in piece.shape:
    targetX = gridX + cell.x
    targetY = gridY + cell.y
    
    if within bounds:
      if isValid:
        // Show piece colors with transparency
        drawCell(targetX, targetY, piece.color, alpha=0.4)
      else:
        // Show red overlay for invalid
        drawCell(targetX, targetY, RED, alpha=0.3)
```

### Placement Validation
```
canPlace(piece, gridX, gridY):
  For each cell in piece.shape:
    targetX = gridX + cell.x
    targetY = gridY + cell.y
    
    // Boundary check
    if (targetX < 0 OR targetX ≥ 8 OR 
        targetY < 0 OR targetY ≥ 8):
      return FALSE
    
    // Occupancy check
    if (grid[targetY][targetX] ≠ EMPTY):
      return FALSE
  
  return TRUE
```

**Rules:**
- All cells of the piece must be within grid bounds (0-7)
- All target cells must be empty (value = 0)
- Pieces cannot overlap existing magnets
- Preview shows real-time feedback (green tint = valid, red tint = invalid)

### Placement Execution
```
placePiece(piece, gridX, gridY):
  For i = 0 to piece.shape.length - 1:
    cellX = piece.shape[i].x
    cellY = piece.shape[i].y
    targetX = gridX + cellX
    targetY = gridY + cellY
    
    grid[targetY][targetX] = piece.colors[i]
```

---

## 4. Pop Detection (Core Mechanic)

### Attraction Rule (Opposite Colors)
```
If adjacent cells have opposite polarities → POP (both disappear)

RED (1) + BLUE (2) → POP ✅
BLUE (2) + RED (1) → POP ✅
```

### Repulsion Rule (Same Colors) - **LOCK PENALTY**
```
If adjacent cells have same polarity → LOCK (both become harder to clear)

RED (1) + RED (1) → LOCKED_RED (3) ⚠️
BLUE (2) + BLUE (2) → LOCKED_BLUE (4) ⚠️
```

### Lock Clearing Rule
```
Locked magnets need only 1 opposite neighbor to pop (same as normal):

LOCKED_RED (3) + 1 BLUE → POP ✅
LOCKED_BLUE (4) + 1 RED → POP ✅

But they STAY LOCKED until cleared:
LOCKED_RED + LOCKED_RED → Both stay LOCKED (no change)
LOCKED_RED alone → Stays LOCKED (doesn't revert to normal)
```

**Key Difference from Normal Magnets:**
- Normal magnets: Can become locked if same color touches
- Locked magnets: Stay locked forever until they pop
- Both clear the same way: 1 opposite neighbor

### Pop Detection Algorithm
```
findPops(grid):
  popsSet = empty set
  
  For y = 0 to 7:
    For x = 0 to 7:
      currentColor = grid[y][x]
      
      if currentColor = EMPTY:
        continue
      
      // Check 4 neighbors (up, down, left, right)
      neighbors = [
        {x: x, y: y-1},   // up
        {x: x, y: y+1},   // down
        {x: x-1, y: y},   // left
        {x: x+1, y: y}    // right
      ]
      
      For each neighbor in neighbors:
        if neighbor out of bounds:
          continue
        
        neighborColor = grid[neighbor.y][neighbor.x]
        
        // NORMAL POPS: Opposite colors
        if (currentColor = RED AND neighborColor = BLUE) OR
           (currentColor = BLUE AND neighborColor = RED):
          popsSet.add({x: x, y: y})
          popsSet.add({x: neighbor.x, y: neighbor.y})
        
        // LOCKED POPS: Also need just 1 opposite neighbor
        if currentColor = LOCKED_RED AND neighborColor = BLUE:
          popsSet.add({x: x, y: y})
          popsSet.add({x: neighbor.x, y: neighbor.y})
        
        if currentColor = LOCKED_BLUE AND neighborColor = RED:
          popsSet.add({x: x, y: y})
          popsSet.add({x: neighbor.x, y: neighbor.y})
  
  return popsSet as array
```

**Key Points:**
- Only checks orthogonal neighbors (not diagonals)
- Uses a set to avoid duplicate coordinates
- Locked magnets clear the same way as normal (1 opposite neighbor)
- Locked magnets stay locked until they pop (don't revert to normal)
- Returns all cells that should pop simultaneously

---

## 5. Lock Penalty System (NEW!)

### Lock Detection
```
checkAndApplyLocks(grid):
  locksToApply = []
  
  For y = 0 to 7:
    For x = 0 to 7:
      currentColor = grid[y][x]
      
      // Skip empty and already locked cells
      if currentColor = EMPTY OR 
         currentColor = LOCKED_RED OR 
         currentColor = LOCKED_BLUE:
        continue
      
      // Check 4 neighbors
      For each neighbor in [up, down, left, right]:
        if neighbor out of bounds:
          continue
        
        neighborColor = grid[neighbor.y][neighbor.x]
        
        // SAME COLOR = LOCK
        if currentColor = RED AND neighborColor = RED:
          locksToApply.push({x: x, y: y, newColor: LOCKED_RED})
          locksToApply.push({x: neighbor.x, y: neighbor.y, newColor: LOCKED_RED})
        
        if currentColor = BLUE AND neighborColor = BLUE:
          locksToApply.push({x: x, y: y, newColor: LOCKED_BLUE})
          locksToApply.push({x: neighbor.x, y: neighbor.y, newColor: LOCKED_BLUE})
  
  // Apply all locks
  For each lock in locksToApply:
    grid[lock.y][lock.x] = lock.newColor
  
  return locksToApply.length > 0
```

### Lock Clearing Requirements
```
// Locked magnets clear with just 1 opposite neighbor (same as normal)
if grid[y][x] = LOCKED_RED AND neighbor = BLUE:
  → POP (both clear)

if grid[y][x] = LOCKED_BLUE AND neighbor = RED:
  → POP (both clear)

// But locked magnets stay locked until cleared
LOCKED_RED + LOCKED_RED → Both stay LOCKED (no change)
LOCKED_RED alone → Stays LOCKED (doesn't revert)
```

### Visual Indicators
```
Normal RED:    #FF0066 (bright magenta)
Locked RED:    #990033 (dark magenta) + white border

Normal BLUE:   #00FFFF (bright cyan)
Locked BLUE:   #006666 (dark cyan) + white border

Purpose: Visual reminder that these magnets were placed badly (same colors touched)
```

---

## 6. Chain Reaction System

### Chain Resolution
```
resolvePops(grid):
  // Step 1: Apply lock penalty first
  hadLocks = checkAndApplyLocks(grid)
  if hadLocks:
    updateDisplay()
  
  // Step 2: Resolve pops
  totalPops = 0
  chainLevel = 0
  
  while TRUE:
    pops = findPops(grid)
    
    if pops.length = 0:
      break
    
    // Clear popped cells
    For each pop in pops:
      grid[pop.y][pop.x] = EMPTY
    
    totalPops += pops.length
    chainLevel += 1
  
  return {totalPops, chainLevel}
```

### Chain Multiplier Formula
```
chainMultiplier = 1 + (chainLevel - 1) × 0.5

Examples:
- No chain (chainLevel = 1): multiplier = 1.0
- 1 chain (chainLevel = 2):  multiplier = 1.5
- 2 chains (chainLevel = 3): multiplier = 2.0
- 3 chains (chainLevel = 4): multiplier = 2.5
```

**Chain Example:**
```
Initial placement creates 2 pops
→ Locks are applied first (same colors become locked)
→ Pops resolve
→ Those pops expose new opposite colors
→ New pops create more space
→ Process repeats until no more pops found
```

---

## 7. Scoring System (Post-Game)

### Base Score Formula
```
pointsPerPop = 10
score += (totalPops × pointsPerPop) × chainMultiplier
```

### Scoring Examples
```
Example 1: Simple Pop
- 2 magnets pop, no chain
- totalPops = 2
- chainMultiplier = 1.0
- score = (2 × 10) × 1.0 = 20 points

Example 2: Single Chain
- 4 magnets pop initially
- Chain reaction pops 2 more
- totalPops = 6
- chainMultiplier = 1.5
- score = (6 × 10) × 1.5 = 90 points

Example 3: Double Chain
- 8 magnets pop across 3 waves
- totalPops = 8
- chainMultiplier = 2.0
- score = (8 × 10) × 2.0 = 160 points
```

### Score Accumulation
```
totalScore = Σ(placement scores)

Each placement:
1. Place piece
2. Resolve all pops and chains
3. Calculate points
4. Add to totalScore
```

---

## 8. Game Over Condition

### Game Over Check
```
isGameOver(grid, pieceTray):
  For each piece in pieceTray:
    For y = 0 to 7:
      For x = 0 to 7:
        if canPlace(piece, x, y):
          return FALSE  // Found valid placement
  
  return TRUE  // No piece can fit anywhere
```

**Trigger:** When no piece in the tray can be placed anywhere on the grid

**Check Timing:** After each piece placement and tray refresh

---

## 9. Game Loop

### Turn Sequence
```
1. Player has 3 pieces in tray (65% RED, 35% BLUE)
2. Player drags and places 1 piece
3. System validates placement
4. If valid:
   a. Update grid
   b. Apply lock penalty (same colors → locked)
   c. Find and resolve pops
   d. Calculate score
   e. Remove piece from tray
5. If tray is empty:
   a. Generate 3 new pieces (with imbalance)
6. Check game over condition
7. Repeat from step 2
```

### Piece Tray Refresh
```
if pieceTray.length = 0:
  generatePieces()  // Create 3 new random pieces
```

---

## 10. Visual Feedback (MVP)

### Color Scheme
```
Normal RED:    #FF0066 (Neon Magenta)
Normal BLUE:   #00FFFF (Neon Cyan)
Locked RED:    #990033 (Dark Magenta) + white border
Locked BLUE:   #006666 (Dark Cyan) + white border
Grid lines:    #444444 (Dark Gray)
Background:    #1a1a2e (Dark Navy)
```

### Cell Dimensions
```
Cell size:    60×60 pixels
Grid total:   480×480 pixels (8×8 cells)
Grid offset:  (60, 80) from top-left
```

### Interaction States
```
Piece in tray:        opacity = 1.0, depth = 0
Piece dragging:       opacity = 0.7, depth = 10
Preview (valid):      piece colors, alpha = 0.4
Preview (invalid):    red overlay, alpha = 0.3
Invalid placement:    return to tray
Valid placement:      attach to grid, trigger pops
```

### Grid Alignment Detection
```
// Convert piece container position to grid coordinates
gridX = floor((pieceX - GRID_OFFSET_X) / CELL_SIZE)
gridY = floor((pieceY - GRID_OFFSET_Y) / CELL_SIZE)

// Piece "snaps" visually via preview overlay
// Actual placement happens on dragEnd if valid
```

---

## 11. Mathematical Summary

### Key Formulas

**Placement Validation:**
```
valid = ∀ cell ∈ piece: 
  (0 ≤ gridX + cell.x < 8) ∧ 
  (0 ≤ gridY + cell.y < 8) ∧ 
  (grid[gridY + cell.y][gridX + cell.x] = 0)
```

**Pop Condition:**
```
// Normal magnets
pop(cell₁, cell₂) = (color₁ + color₂ = 3) ∧ adjacent(cell₁, cell₂)

Where:
- RED = 1, BLUE = 2
- RED + BLUE = 3 (triggers pop)
- RED + RED = 2 (triggers lock)
- BLUE + BLUE = 4 (triggers lock)

// Locked magnets
popLocked(cell) = (color = LOCKED_RED ∧ hasNeighbor(BLUE)) ∨
                  (color = LOCKED_BLUE ∧ hasNeighbor(RED))

Note: Locked magnets clear with just 1 opposite neighbor (same as normal)
```

**Lock Condition:**
```
lock(cell₁, cell₂) = (color₁ = color₂) ∧ adjacent(cell₁, cell₂) ∧ 
                     (color₁ ∈ {RED, BLUE})

Result:
- RED + RED → LOCKED_RED (stays locked until cleared)
- BLUE + BLUE → LOCKED_BLUE (stays locked until cleared)

Clearing:
- LOCKED_RED + BLUE → POP (same as normal)
- LOCKED_BLUE + RED → POP (same as normal)
```

**Polarity Imbalance:**
```
P(RED) = 0.65
P(BLUE) = 0.35

Expected ratio in 100 cells: 65 RED, 35 BLUE
```

**Score Calculation:**
```
S = Σ(Pᵢ × 10 × Mᵢ)

Where:
- S = total score
- Pᵢ = pops in placement i
- Mᵢ = chain multiplier for placement i
- Mᵢ = 1 + (chainLevel - 1) × 0.5
```

**Game Over:**
```
gameOver = ∀ piece ∈ tray: ∀ (x,y) ∈ grid: ¬canPlace(piece, x, y)
```

---

## 12. Edge Cases & Rules

### Simultaneous Pops
- All pops in a wave happen simultaneously
- No priority or order between pops
- Use set data structure to avoid duplicates

### Chain Detection
- Locks are applied BEFORE pops are checked
- After clearing pops, immediately re-check entire grid
- Continue until no new pops are found
- Each wave increments chain level
- **Chain multiplier starts at 1.0 for first pop wave**

### Lock Mechanics
- Same-color neighbors trigger lock immediately after placement
- Locked magnets cannot be locked again (already locked)
- Locked magnets clear with 1 opposite neighbor (same as normal)
- Locked magnets STAY locked until they pop (don't revert to normal)
- Lock is a visual penalty/reminder of bad placement
- Lock check happens before pop check in resolution order

### Polarity Imbalance
- Every piece generation uses 65/35 ratio
- Ratio is per-cell, not per-piece (pieces can be all RED or all BLUE)
- Creates natural scarcity of BLUE magnets
- Forces strategic resource management

### Piece Tray Management
- Tray holds exactly 3 pieces
- Pieces are removed individually as placed
- New batch of 3 generated only when tray is empty
- Game over checked after each placement, not after tray refresh

### Boundary Handling
- Pieces cannot extend beyond grid (0-7 range)
- Neighbor checks skip out-of-bounds cells
- No wrapping or toroidal grid

### Drag and Drop Behavior
- Piece container position (not pointer) determines grid alignment
- Preview updates in real-time during drag
- Valid placements show colored preview (40% opacity)
- Invalid placements show red overlay (30% opacity)
- Pieces return to tray if dropped in invalid position
- Preview does NOT show lock predictions (only placement validity)

---

## 13. Known Issues & Fixes (MVP Development Log)

### Fixed Issues:
1. **Pieces not attaching to grid** ✅
   - Problem: Used pointer position instead of piece container position
   - Fix: Calculate grid coordinates from `gameObject.x/y` instead of `pointer.x/y`

2. **No visual feedback during drag** ✅
   - Problem: No preview showing where piece would land
   - Fix: Added `updateDragPreview()` with real-time grid overlay

3. **Chain multiplier calculation wrong** ✅
   - Problem: Multiplier started incrementing immediately (1.5x for first chain)
   - Fix: Changed to `chainMultiplier = 1 + (chainLevel - 1) × 0.5`
   - Now: First pop = 1.0x, second wave = 1.5x, third wave = 2.0x

4. **No alignment detection** ✅
   - Problem: Couldn't tell if piece was aligned to grid
   - Fix: Preview shows colored overlay when aligned, red when invalid

5. **Game too easy - infinite play** ✅
   - Problem: 50/50 color ratio meant always having matches
   - Fix: Implemented 65/35 polarity imbalance (RED dominant)

6. **No penalty for bad placement** ✅
   - Problem: Same colors had no consequence
   - Fix: Implemented lock penalty (same colors → locked, needs 2+ opposite to clear)

### Current Behavior:
- Drag piece from tray → see preview on grid
- Green/colored preview = valid placement
- Red preview = invalid (occupied or out of bounds)
- Release on valid spot → piece attaches, locks apply, then pops resolve
- Release on invalid spot → piece returns to tray
- Same colors touching → become locked (darker + border)
- Locked magnets need 2+ opposite neighbors to clear
- 65% RED, 35% BLUE generation creates scarcity

---

## 14. Future Enhancements (Not in MVP)

### Potential Additions
- Piece rotation (4 orientations per piece)
- Special pieces (neutral magnets, wildcards)
- Combo bonuses (consecutive placements without misses)
- Animations (snap, pop, jiggle effects, lock animation)
- Sound effects (placement, pop, chain, lock)
- Power-ups (clear row/column, color swap, unlock magnet)
- Difficulty levels (adjustable imbalance ratio: 55/45, 65/35, 75/25)
- Lock preview during drag (show which cells would lock)
- Statistics (longest chain, most pops, locked magnets cleared)

---

## Implementation Checklist

- [x] Grid initialization (8×8 array)
- [x] Piece generation (3 random pieces)
- [x] Drag-and-drop system
- [x] Real-time preview during drag
- [x] Grid alignment detection
- [x] Visual feedback (valid/invalid placement)
- [x] Placement validation
- [x] Grid state update
- [x] Pop detection algorithm
- [x] Lock penalty system (same colors → locked)
- [x] Locked magnet clearing (2+ opposite neighbors)
- [x] Polarity imbalance (65% RED, 35% BLUE)
- [x] Chain reaction system
- [x] Correct chain multiplier calculation
- [x] Score calculation
- [x] Game over detection
- [x] UI display (score, grid, tray)
- [x] Visual distinction for locked magnets (darker + border)
- [ ] Lock preview during drag
- [ ] Visual polish (animations)
- [ ] Sound effects
- [ ] Mobile touch support
- [ ] Difficulty selector

---

**Version:** MVP 2.1  
**Last Updated:** Phase 2 Complete - Polarity Imbalance + Visual Lock Penalty (Balanced)

**Key Changes in v2.1:**
- Locked magnets now clear with 1 neighbor (same as normal)
- Lock penalty is visual feedback, not mechanical difficulty
- Main challenge is 65/35 color imbalance
