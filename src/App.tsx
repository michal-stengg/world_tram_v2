import { useGameStore } from './stores/gameStore'
import type { GameScreen } from './types'
import { IntroScreen } from './components/screens/IntroScreen'
import { CaptainSelectionScreen } from './components/screens/CaptainSelectionScreen'
import { TrainSelectionScreen } from './components/screens/TrainSelectionScreen'
import { DashboardScreen } from './components/screens/DashboardScreen'
import { VictoryScreen } from './components/screens/VictoryScreen'
import { GameOverScreen } from './components/screens/GameOverScreen'

// Screen component mapping
const screens: Record<GameScreen, React.ComponentType> = {
  intro: IntroScreen,
  captainSelect: CaptainSelectionScreen,
  trainSelect: TrainSelectionScreen,
  dashboard: DashboardScreen,
  victory: VictoryScreen,
  gameOver: GameOverScreen,
}

function App() {
  const currentScreen = useGameStore((state) => state.currentScreen)

  const ScreenComponent = screens[currentScreen]

  return <ScreenComponent />
}

export default App
