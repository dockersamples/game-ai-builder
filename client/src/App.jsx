import { useState } from 'react'
import './App.scss'
import { Scoreboard } from './components/Scoreboard'
import { CurrentScore } from './components/CurrentScore'
import { GameStateProvider } from './GameState'
import { ScreenContents } from './components/ScreenContents'

function App() {
  const [count, setCount] = useState(0)

  return (
    <GameStateProvider>
      <header>
        <CurrentScore />
      </header>
      <main className="stage-wrap">
        <section id="whiskerStage" className="fullscreen stage">
          <ScreenContents />
          <Scoreboard />
        </section>
      </main>
    </GameStateProvider>
  )
}

export default App
