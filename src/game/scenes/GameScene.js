import Phaser from 'phaser'
import { 
  GRID_SIZE, 
  CELL_SIZE, 
  GRID_OFFSET_X, 
  GRID_OFFSET_Y,
  COLORS,
  COLOR_HEX,
  PIECE_SHAPES,
  RED_PROBABILITY
} from '../config'

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
    
    // Game state
    this.grid = []
    this.score = 0
    this.pieceTray = []
    this.gridGraphics = []
    this.pieceGraphics = []
    this.draggedPiece = null
    this.previewGraphics = null
    this.currentGridPos = { x: -1, y: -1 }
    this.isValidPlacement = false
  }

  create() {
    // Initialize grid (8x8 array of 0s)
    this.initializeGrid()
    
    // Draw the grid
    this.drawGrid()
    
    // Create UI
    this.createUI()
    
    // Generate initial pieces
    this.generatePieces()
    
    // Draw pieces in tray
    this.drawPieceTray()
  }

  initializeGrid() {
    this.grid = []
    for (let y = 0; y < GRID_SIZE; y++) {
      this.grid[y] = []
      for (let x = 0; x < GRID_SIZE; x++) {
        this.grid[y][x] = COLORS.EMPTY
      }
    }
  }

  drawGrid() {
    const graphics = this.add.graphics()
    graphics.lineStyle(2, COLOR_HEX.GRID_LINE, 1)

    // Draw grid lines
    for (let y = 0; y <= GRID_SIZE; y++) {
      graphics.lineBetween(
        GRID_OFFSET_X,
        GRID_OFFSET_Y + y * CELL_SIZE,
        GRID_OFFSET_X + GRID_SIZE * CELL_SIZE,
        GRID_OFFSET_Y + y * CELL_SIZE
      )
    }

    for (let x = 0; x <= GRID_SIZE; x++) {
      graphics.lineBetween(
        GRID_OFFSET_X + x * CELL_SIZE,
        GRID_OFFSET_Y,
        GRID_OFFSET_X + x * CELL_SIZE,
        GRID_OFFSET_Y + GRID_SIZE * CELL_SIZE
      )
    }

    // Store grid graphics container
    this.gridContainer = this.add.container(0, 0)
    
    // Create preview graphics for drag feedback
    this.previewGraphics = this.add.graphics()
    this.previewGraphics.setDepth(5)
    
    this.updateGridDisplay()
  }

  updateGridDisplay() {
    // Clear existing cell graphics
    this.gridContainer.removeAll(true)

    // Draw filled cells
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const cellValue = this.grid[y][x]
        
        if (cellValue !== COLORS.EMPTY) {
          const color = COLOR_HEX[cellValue]
          const rect = this.add.rectangle(
            GRID_OFFSET_X + x * CELL_SIZE + CELL_SIZE / 2,
            GRID_OFFSET_Y + y * CELL_SIZE + CELL_SIZE / 2,
            CELL_SIZE - 4,
            CELL_SIZE - 4,
            color
          )
          
          // Add border for locked magnets
          if (cellValue === COLORS.LOCKED_RED || cellValue === COLORS.LOCKED_BLUE) {
            const border = this.add.rectangle(
              GRID_OFFSET_X + x * CELL_SIZE + CELL_SIZE / 2,
              GRID_OFFSET_Y + y * CELL_SIZE + CELL_SIZE / 2,
              CELL_SIZE - 4,
              CELL_SIZE - 4
            )
            border.setStrokeStyle(3, 0xFFFFFF, 0.6)
            this.gridContainer.add(border)
          }
          
          this.gridContainer.add(rect)
        }
      }
    }
  }

  createUI() {
    // Score text
    this.scoreText = this.add.text(20, 20, 'Score: 0', {
      fontSize: '28px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    })

    // Title
    this.add.text(300, 20, 'Magnetic Puzzle', {
      fontSize: '24px',
      fill: '#00FFFF',
      fontFamily: 'Arial'
    }).setOrigin(0.5, 0)

    // Help button (? icon) - top right corner
    const helpButton = this.add.text(560, 20, '?', {
      fontSize: '32px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      backgroundColor: '#FF0066',
      padding: { x: 12, y: 4 }
    }).setOrigin(0.5, 0).setInteractive()

    helpButton.on('pointerover', () => {
      helpButton.setScale(1.1)
    })

    helpButton.on('pointerout', () => {
      helpButton.setScale(1)
    })

    helpButton.on('pointerdown', () => {
      this.showHelpModal()
    })
  }

  showHelpModal() {
    // Dim background
    const overlay = this.add.rectangle(300, 400, 600, 800, 0x000000, 0.85)
    overlay.setDepth(100)

    // Modal background
    const modalBg = this.add.rectangle(300, 400, 520, 680, 0x1a1a2e, 1)
    modalBg.setDepth(101)
    modalBg.setStrokeStyle(3, 0x00FFFF)

    // Title
    const title = this.add.text(300, 80, 'How to Play', {
      fontSize: '32px',
      fill: '#00FFFF',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(102)

    // Instructions text
    const instructions = [
      'GOAL: Score points by clearing magnets',
      '',
      'RULES:',
      '• Drag pieces from tray to grid',
      '• RED + BLUE = POP (both disappear)',
      '• RED + RED = LOCK (darker color)',
      '• BLUE + BLUE = LOCK (darker color)',
      '• Locked magnets clear normally',
      '  (1 opposite neighbor)',
      '',
      'DIFFICULTY:',
      '• 65% RED, 35% BLUE pieces',
      '• BLUE is scarce - use wisely!',
      '• Avoid same-color adjacency',
      '',
      'SCORING:',
      '• 10 points per pop',
      '• Chain reactions = bonus multiplier',
      '• 1st wave: 1.0x',
      '• 2nd wave: 1.5x',
      '• 3rd wave: 2.0x',
      '',
      'GAME OVER:',
      '• When no pieces can fit on grid'
    ]

    const instructionText = this.add.text(60, 130, instructions.join('\n'), {
      fontSize: '16px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      lineSpacing: 4
    }).setDepth(102)

    // Color legend
    const legendY = 600
    
    // Normal RED
    const redBox = this.add.rectangle(100, legendY, 30, 30, 0xFF0066)
    redBox.setDepth(102)
    const redLabel = this.add.text(120, legendY, 'Normal RED', {
      fontSize: '14px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0, 0.5).setDepth(102)

    // Locked RED
    const lockedRedBox = this.add.rectangle(100, legendY + 40, 30, 30, 0x990033)
    lockedRedBox.setDepth(102)
    lockedRedBox.setStrokeStyle(2, 0xFFFFFF, 0.6)
    const lockedRedLabel = this.add.text(120, legendY + 40, 'Locked RED', {
      fontSize: '14px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0, 0.5).setDepth(102)

    // Normal BLUE
    const blueBox = this.add.rectangle(320, legendY, 30, 30, 0x00FFFF)
    blueBox.setDepth(102)
    const blueLabel = this.add.text(340, legendY, 'Normal BLUE', {
      fontSize: '14px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0, 0.5).setDepth(102)

    // Locked BLUE
    const lockedBlueBox = this.add.rectangle(320, legendY + 40, 30, 30, 0x006666)
    lockedBlueBox.setDepth(102)
    lockedBlueBox.setStrokeStyle(2, 0xFFFFFF, 0.6)
    const lockedBlueLabel = this.add.text(340, legendY + 40, 'Locked BLUE', {
      fontSize: '14px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0, 0.5).setDepth(102)

    // Close button
    const closeButton = this.add.text(300, 720, 'Close', {
      fontSize: '24px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      backgroundColor: '#FF0066',
      padding: { x: 30, y: 10 }
    }).setOrigin(0.5).setDepth(102).setInteractive()

    closeButton.on('pointerover', () => {
      closeButton.setScale(1.05)
    })

    closeButton.on('pointerout', () => {
      closeButton.setScale(1)
    })

    // Store all modal elements for cleanup
    const modalElements = [
      overlay, modalBg, title, instructionText,
      redBox, redLabel, lockedRedBox, lockedRedLabel,
      blueBox, blueLabel, lockedBlueBox, lockedBlueLabel,
      closeButton
    ]

    closeButton.on('pointerdown', () => {
      modalElements.forEach(element => element.destroy())
    })

    // Click overlay to close
    overlay.setInteractive()
    overlay.on('pointerdown', () => {
      modalElements.forEach(element => element.destroy())
    })
  }

  generatePieces() {
    this.pieceTray = []
    const shapeKeys = Object.keys(PIECE_SHAPES)

    for (let i = 0; i < 3; i++) {
      // Pick random shape
      const randomShapeKey = shapeKeys[Math.floor(Math.random() * shapeKeys.length)]
      const shape = PIECE_SHAPES[randomShapeKey]

      // Assign random colors with POLARITY IMBALANCE
      // 65% RED, 35% BLUE
      const colors = shape.map(() => {
        return Math.random() < RED_PROBABILITY ? COLORS.RED : COLORS.BLUE
      })

      this.pieceTray.push({
        shape: shape,
        colors: colors,
        id: i
      })
    }
  }

  drawPieceTray() {
    // Clear existing piece graphics
    this.pieceGraphics.forEach(g => g.destroy())
    this.pieceGraphics = []

    const trayY = 650
    const spacing = 180

    this.pieceTray.forEach((piece, index) => {
      const container = this.add.container(100 + index * spacing, trayY)
      container.setSize(CELL_SIZE * 3, CELL_SIZE * 3)
      
      // Draw piece cells
      piece.shape.forEach((cell, cellIndex) => {
        const [cellX, cellY] = cell
        const color = piece.colors[cellIndex] === COLORS.RED ? COLOR_HEX[COLORS.RED] : COLOR_HEX[COLORS.BLUE]
        
        const rect = this.add.rectangle(
          cellX * CELL_SIZE,
          cellY * CELL_SIZE,
          CELL_SIZE - 4,
          CELL_SIZE - 4,
          color
        )
        container.add(rect)
      })

      // Make piece interactive
      container.setInteractive(
        new Phaser.Geom.Rectangle(-CELL_SIZE, -CELL_SIZE, CELL_SIZE * 3, CELL_SIZE * 3),
        Phaser.Geom.Rectangle.Contains
      )

      // Store piece data
      container.setData('piece', piece)
      container.setData('originalX', container.x)
      container.setData('originalY', container.y)

      // Drag events
      this.input.setDraggable(container)

      this.pieceGraphics.push(container)
    })

    // Setup drag handlers
    this.setupDragHandlers()
  }

  setupDragHandlers() {
    this.input.on('dragstart', (pointer, gameObject) => {
      this.draggedPiece = gameObject
      gameObject.setAlpha(0.7)
      gameObject.setDepth(10)
    })

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX
      gameObject.y = dragY
      
      // Update preview while dragging
      this.updateDragPreview(gameObject, pointer)
    })

    this.input.on('dragend', (pointer, gameObject) => {
      const piece = gameObject.getData('piece')
      
      // Clear preview
      this.previewGraphics.clear()
      
      // Use the calculated grid position from drag preview
      const gridX = this.currentGridPos.x
      const gridY = this.currentGridPos.y

      // Check if placement is valid
      if (this.isValidPlacement && this.canPlacePiece(piece, gridX, gridY)) {
        // Place the piece
        this.placePiece(piece, gridX, gridY)
        
        // Remove from tray
        const pieceIndex = this.pieceTray.findIndex(p => p.id === piece.id)
        if (pieceIndex !== -1) {
          this.pieceTray.splice(pieceIndex, 1)
        }
        
        // Destroy the dragged graphic
        gameObject.destroy()
        
        // Check for pops
        this.checkAndResolvePops()
        
        // Redraw tray
        if (this.pieceTray.length === 0) {
          this.generatePieces()
        }
        this.drawPieceTray()
        
        // Check game over
        this.checkGameOver()
      } else {
        // Return to original position
        gameObject.setAlpha(1)
        gameObject.setDepth(0)
        gameObject.x = gameObject.getData('originalX')
        gameObject.y = gameObject.getData('originalY')
      }
      
      this.draggedPiece = null
      this.currentGridPos = { x: -1, y: -1 }
      this.isValidPlacement = false
    })
  }

  updateDragPreview(gameObject, pointer) {
    const piece = gameObject.getData('piece')
    
    // Calculate which grid cell the first cell of the piece would land on
    // Use the container position (which is at the piece's origin)
    const gridX = Math.floor((gameObject.x - GRID_OFFSET_X) / CELL_SIZE)
    const gridY = Math.floor((gameObject.y - GRID_OFFSET_Y) / CELL_SIZE)
    
    this.currentGridPos = { x: gridX, y: gridY }
    
    // Check if placement is valid
    this.isValidPlacement = this.canPlacePiece(piece, gridX, gridY)
    
    // Clear previous preview
    this.previewGraphics.clear()
    
    // Draw preview on grid
    if (gridX >= 0 && gridY >= 0 && gridX < GRID_SIZE && gridY < GRID_SIZE) {
      piece.shape.forEach((cell, cellIndex) => {
        const [cellX, cellY] = cell
        const targetX = gridX + cellX
        const targetY = gridY + cellY
        
        // Only draw if within bounds
        if (targetX >= 0 && targetX < GRID_SIZE && targetY >= 0 && targetY < GRID_SIZE) {
          const screenX = GRID_OFFSET_X + targetX * CELL_SIZE
          const screenY = GRID_OFFSET_Y + targetY * CELL_SIZE
          
          // Choose color based on validity
          if (this.isValidPlacement) {
            // Show piece colors with transparency for valid placement
            const color = piece.colors[cellIndex] === COLORS.RED ? COLOR_HEX[COLORS.RED] : COLOR_HEX[COLORS.BLUE]
            this.previewGraphics.fillStyle(color, 0.4)
          } else {
            // Show red for invalid placement
            this.previewGraphics.fillStyle(0xFF0000, 0.3)
          }
          
          this.previewGraphics.fillRect(
            screenX + 2,
            screenY + 2,
            CELL_SIZE - 4,
            CELL_SIZE - 4
          )
        }
      })
    }
  }

  canPlacePiece(piece, gridX, gridY) {
    for (let i = 0; i < piece.shape.length; i++) {
      const [cellX, cellY] = piece.shape[i]
      const targetX = gridX + cellX
      const targetY = gridY + cellY

      // Check bounds
      if (targetX < 0 || targetX >= GRID_SIZE || targetY < 0 || targetY >= GRID_SIZE) {
        return false
      }

      // Check if cell is empty
      if (this.grid[targetY][targetX] !== COLORS.EMPTY) {
        return false
      }
    }

    return true
  }

  placePiece(piece, gridX, gridY) {
    for (let i = 0; i < piece.shape.length; i++) {
      const [cellX, cellY] = piece.shape[i]
      const targetX = gridX + cellX
      const targetY = gridY + cellY
      
      this.grid[targetY][targetX] = piece.colors[i]
    }

    this.updateGridDisplay()
  }

  checkAndApplyLocks() {
    const locksToApply = []

    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const currentColor = this.grid[y][x]
        
        // Skip empty cells and already locked cells
        if (currentColor === COLORS.EMPTY || 
            currentColor === COLORS.LOCKED_RED || 
            currentColor === COLORS.LOCKED_BLUE) {
          continue
        }

        // Check 4 neighbors
        const neighbors = [
          { x: x, y: y - 1 },  // up
          { x: x, y: y + 1 },  // down
          { x: x - 1, y: y },  // left
          { x: x + 1, y: y }   // right
        ]

        neighbors.forEach(neighbor => {
          if (neighbor.x < 0 || neighbor.x >= GRID_SIZE || 
              neighbor.y < 0 || neighbor.y >= GRID_SIZE) {
            return
          }

          const neighborColor = this.grid[neighbor.y][neighbor.x]

          // Check for SAME colors (REPULSION = LOCK)
          if (currentColor === COLORS.RED && neighborColor === COLORS.RED) {
            locksToApply.push({ x: x, y: y, newColor: COLORS.LOCKED_RED })
            locksToApply.push({ x: neighbor.x, y: neighbor.y, newColor: COLORS.LOCKED_RED })
          } else if (currentColor === COLORS.BLUE && neighborColor === COLORS.BLUE) {
            locksToApply.push({ x: x, y: y, newColor: COLORS.LOCKED_BLUE })
            locksToApply.push({ x: neighbor.x, y: neighbor.y, newColor: COLORS.LOCKED_BLUE })
          }
        })
      }
    }

    // Apply all locks
    locksToApply.forEach(lock => {
      this.grid[lock.y][lock.x] = lock.newColor
    })

    return locksToApply.length > 0
  }

  checkAndResolvePops() {
    // First, apply lock penalty for same-color neighbors
    const hadLocks = this.checkAndApplyLocks()
    if (hadLocks) {
      this.updateGridDisplay()
    }

    // Then, resolve pops
    let totalPops = 0
    let chainLevel = 0

    while (true) {
      const pops = this.findPops()
      
      if (pops.length === 0) {
        break
      }

      // Clear popped cells
      pops.forEach(pop => {
        this.grid[pop.y][pop.x] = COLORS.EMPTY
      })

      totalPops += pops.length
      chainLevel += 1

      this.updateGridDisplay()
    }

    if (totalPops > 0) {
      // Calculate chain multiplier: 1.0 for first chain, +0.5 for each additional
      const chainMultiplier = 1 + (chainLevel - 1) * 0.5
      const points = Math.floor((totalPops * 10) * chainMultiplier)
      this.score += points
      this.scoreText.setText('Score: ' + this.score)
      
      // Debug info
      if (chainLevel > 1) {
        console.log(`Chain x${chainLevel}! ${totalPops} pops, ${points} points (${chainMultiplier}x multiplier)`)
      }
    }
  }

  findPops() {
    const popsSet = new Set()

    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const currentColor = this.grid[y][x]
        
        if (currentColor === COLORS.EMPTY) {
          continue
        }

        // Check 4 neighbors
        const neighbors = [
          { x: x, y: y - 1 },  // up
          { x: x, y: y + 1 },  // down
          { x: x - 1, y: y },  // left
          { x: x + 1, y: y }   // right
        ]

        neighbors.forEach(neighbor => {
          if (neighbor.x < 0 || neighbor.x >= GRID_SIZE || 
              neighbor.y < 0 || neighbor.y >= GRID_SIZE) {
            return
          }

          const neighborColor = this.grid[neighbor.y][neighbor.x]

          // Check for opposite colors (attraction)
          // Normal RED + BLUE
          if ((currentColor === COLORS.RED && neighborColor === COLORS.BLUE) ||
              (currentColor === COLORS.BLUE && neighborColor === COLORS.RED)) {
            popsSet.add(`${x},${y}`)
            popsSet.add(`${neighbor.x},${neighbor.y}`)
          }
          // Locked RED + BLUE (only needs 1 neighbor now!)
          else if (currentColor === COLORS.LOCKED_RED && neighborColor === COLORS.BLUE) {
            popsSet.add(`${x},${y}`)
            popsSet.add(`${neighbor.x},${neighbor.y}`)
          }
          // Locked BLUE + RED (only needs 1 neighbor now!)
          else if (currentColor === COLORS.LOCKED_BLUE && neighborColor === COLORS.RED) {
            popsSet.add(`${x},${y}`)
            popsSet.add(`${neighbor.x},${neighbor.y}`)
          }
          // Locked RED + Normal RED (no pop, stays locked)
          // Locked BLUE + Normal BLUE (no pop, stays locked)
        })
      }
    }

    // Convert set to array of coordinates
    return Array.from(popsSet).map(coord => {
      const [x, y] = coord.split(',').map(Number)
      return { x, y }
    })
  }

  checkGameOver() {
    // Check if any piece can fit anywhere
    for (let piece of this.pieceTray) {
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          if (this.canPlacePiece(piece, x, y)) {
            return false // Found valid placement
          }
        }
      }
    }

    // No valid placements found
    if (this.pieceTray.length > 0) {
      this.gameOver()
    }
  }

  gameOver() {
    // Display game over message
    const bg = this.add.rectangle(300, 400, 400, 200, 0x000000, 0.8)
    const text = this.add.text(300, 380, 'Game Over!', {
      fontSize: '48px',
      fill: '#FF0066',
      fontFamily: 'Arial'
    }).setOrigin(0.5)

    const scoreText = this.add.text(300, 440, `Final Score: ${this.score}`, {
      fontSize: '24px',
      fill: '#00FFFF',
      fontFamily: 'Arial'
    }).setOrigin(0.5)

    // Restart button
    const restartBtn = this.add.text(300, 500, 'Restart', {
      fontSize: '28px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      backgroundColor: '#FF0066',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive()

    restartBtn.on('pointerdown', () => {
      this.scene.restart()
    })
  }
}

export default GameScene
