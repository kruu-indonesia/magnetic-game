import { useState } from 'react'
import PhaserGame from './components/PhaserGame'

function App() {
  const [showGame, setShowGame] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            Web Game Project
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Built with React + Vite + Phaser.js + Tailwind CSS
          </p>
          <button
            onClick={() => setShowGame(!showGame)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg"
          >
            {showGame ? 'Hide Game' : 'Start Game'}
          </button>
        </header>

        {showGame && (
          <div className="flex justify-center">
            <PhaserGame />
          </div>
        )}

        <footer className="mt-12 text-center text-gray-400">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">React 18</h3>
              <p className="text-sm">Modern UI framework</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Phaser 3</h3>
              <p className="text-sm">2D game engine</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Tailwind CSS</h3>
              <p className="text-sm">Utility-first CSS</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
