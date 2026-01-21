import { CrewMember } from './CrewMember'
import { useGameStore } from '../../stores/gameStore'

export function CrewPanel() {
  const crew = useGameStore((state) => state.crew)

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    padding: '0.5rem',
  }

  const headerStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: 'bold',
    color: 'var(--color-gold, #F7B538)',
    marginBottom: '0.25rem',
  }

  const membersContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  }

  return (
    <div style={containerStyle} data-testid="crew-panel">
      <span style={headerStyle}>Crew</span>
      <div style={membersContainerStyle}>
        {crew.map((member) => (
          <CrewMember key={member.id} member={member} />
        ))}
      </div>
    </div>
  )
}
