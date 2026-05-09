import { useEffect, useRef } from 'react'
import Phaser from 'phaser'

function PhaserGame() {
  const gameRef = useRef(null)
  const phaserGameRef = useRef(null)

  useEffect(() => {
    if (phaserGameRef.current) return

    // Game scene
    class GameScene extends Phaser.Scene {
      constructor() {
        super({ key: 'GameScene' })
        this.score = 0
      }

      preload() {
        // Create simple graphics for demo
        this.load.image('sky', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==')
      }

      create() {
        // Background
        this.add.rectangle(400, 300, 800, 600, 0x87ceeb)

        // Title
        this.add.text(400, 50, 'Phaser 3 Demo Game', {
          fontSize: '32px',
          fill: '#fff',
          fontStyle: 'bold'
        }).setOrigin(0.5)

        // Score text
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
          fontSize: '24px',
          fill: '#fff'
        })

        // Create a simple player sprite
        this.player = this.add.circle(400, 500, 20, 0xff0000)
        this.physics.add.existing(this.player)
        this.player.body.setCollideWorldBounds(true)

        // Create some collectible items
        this.items = this.physics.add.group()
        this.time.addEvent({
          delay: 1000,
          callback: this.spawnItem,
          callbackScope: this,
          loop: true
        })

        // Controls
        this.cursors = this.input.keyboard.createCursorKeys()

        // Instructions
        this.add.text(400, 550, 'Use Arrow Keys to Move', {
          fontSize: '18px',
          fill: '#fff'
        }).setOrigin(0.5)

        // Collision detection
        this.physics.add.overlap(this.player, this.items, this.collectItem, null, this)
      }

      spawnItem() {
        const x = Phaser.Math.Between(50, 750)
        const item = this.add.circle(x, 0, 15, 0xffff00)
        this.physics.add.existing(item)
        this.items.add(item)
        item.body.setVelocityY(100)
      }

      collectItem(player, item) {
        item.destroy()
        this.score += 10
        this.scoreText.setText('Score: ' + this.score)
      }

      update() {
        // Player movement
        if (this.cursors.left.isDown) {
          this.player.body.setVelocityX(-200)
        } else if (this.cursors.right.isDown) {
          this.player.body.setVelocityX(200)
        } else {
          this.player.body.setVelocityX(0)
        }

        // Remove items that fall off screen
        this.items.children.entries.forEach(item => {
          if (item.y > 600) {
            item.destroy()
          }
        })
      }
    }

    // Phaser game configuration
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
      backgroundColor: '#282c34',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: [GameScene]
    }

    phaserGameRef.current = new Phaser.Game(config)

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true)
        phaserGameRef.current = null
      }
    }
  }, [])

  return (
    <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 shadow-2xl">
      <div ref={gameRef} className="rounded-lg overflow-hidden" />
    </div>
  )
}

export default PhaserGame
