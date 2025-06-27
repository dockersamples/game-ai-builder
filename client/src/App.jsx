import './App.scss'
import { CurrentScore } from './components/CurrentScore'
import { GameStateProvider } from './GameState'
import { Stage } from './components/Stage'

function App() {
  return (
    <GameStateProvider>
      <header>
        <CurrentScore />
      </header>
      <main className="stage-wrap">
        <Stage />
      </main>
    </GameStateProvider>
  )
}

export default App
