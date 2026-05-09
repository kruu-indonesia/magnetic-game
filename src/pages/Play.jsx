import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import GameScene from '../game/scenes/GameScene'
import { GAME_CONFIG } from '../game/config'

function Play() {
  const gameRef = useRef(null)
  const phaserGameRef = useRef(null)

  useEffect(() => {
    if (phaserGameRef.current) return

    // Set the scene in config
    const config = {
      ...GAME_CONFIG,
      parent: gameRef.current,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center p-8">
      <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 shadow-2xl">
        <div ref={gameRef} className="rounded-lg overflow-hidden" />
      </div>
    </div>
  )
}

export default Play
