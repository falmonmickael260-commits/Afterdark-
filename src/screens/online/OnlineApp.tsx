import { useOnlineRoom } from '../../online/useOnlineRoom'
import { OnlineLanding } from './OnlineLanding'
import { OnlineLobby } from './OnlineLobby'
import { OnlineGame } from './OnlineGame'

interface Props {
  onExit: () => void
}

export function OnlineApp({ onExit }: Props) {
  const engine = useOnlineRoom()

  if (!engine.room) {
    return <OnlineLanding engine={engine} onBack={onExit} />
  }

  if (engine.room.status === 'lobby') {
    return <OnlineLobby engine={engine} onLeave={onExit} />
  }

  return (
    <OnlineGame
      engine={engine}
      onEnded={() => {
        engine.leaveRoom()
        onExit()
      }}
    />
  )
}
