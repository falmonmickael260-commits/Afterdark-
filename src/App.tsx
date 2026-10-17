import { useState } from 'react'
import { useAfterDark } from './hooks/useAfterDark'
import { AppLoader } from './components/AppLoader'
import { AgeGate } from './screens/AgeGate'
import { Home } from './screens/Home'
import { PlayerSetup } from './screens/PlayerSetup'
import { ModeSelect } from './screens/ModeSelect'
import { Customize } from './screens/Customize'
import { Rules } from './screens/Rules'
import { GameScreen } from './screens/GameScreen'
import { EndScreen } from './screens/EndScreen'

function App() {
  const engine = useAfterDark()
  const { phase, goTo } = engine
  const [customizeReturnTo, setCustomizeReturnTo] = useState<'home' | 'mode-select'>('home')

  if (phase === 'boot') {
    return <AppLoader />
  }

  if (phase === 'age-gate') {
    return (
      <AgeGate
        onConfirm={engine.confirmMajority}
        onDecline={engine.declineMajority}
      />
    )
  }

  if (phase === 'home') {
    return (
      <Home
        onStart={() => goTo('setup')}
        onCustomize={() => {
          setCustomizeReturnTo('home')
          goTo('customize')
        }}
        onRules={() => goTo('rules')}
        onResetMajority={engine.resetMajority}
      />
    )
  }

  if (phase === 'setup') {
    return (
      <PlayerSetup
        players={engine.players}
        onUpdate={engine.updatePlayer}
        onDone={() => goTo('mode-select')}
        onBack={() => goTo('home')}
      />
    )
  }

  if (phase === 'mode-select') {
    return (
      <ModeSelect
        settings={engine.settings}
        onPickMode={(patch) => {
          engine.updateSettings(patch)
          engine.startGame()
        }}
        onBack={() => goTo('setup')}
        onAdjust={() => {
          setCustomizeReturnTo('mode-select')
          goTo('customize')
        }}
      />
    )
  }

  if (phase === 'customize') {
    return <Customize engine={engine} onBack={() => goTo(customizeReturnTo)} />
  }

  if (phase === 'rules') {
    return <Rules onBack={() => goTo('home')} />
  }

  if (phase === 'playing') {
    return <GameScreen engine={engine} />
  }

  if (phase === 'ended') {
    return (
      <EndScreen
        players={engine.players}
        history={engine.history}
        onReplay={() => {
          engine.startGame()
        }}
        onHome={() => goTo('home')}
      />
    )
  }

  return null
}

export default App
