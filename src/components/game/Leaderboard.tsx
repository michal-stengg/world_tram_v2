import { formatLeaderboardDate } from '../../logic/leaderboard'
import type { LeaderboardEntry } from '../../types/leaderboard'

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  currentEntryId?: string
}

export function Leaderboard({ entries, currentEntryId }: LeaderboardProps) {
  const isEmpty = entries.length === 0

  return (
    <div
      data-testid="leaderboard-container"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: '2px solid rgba(247, 181, 56, 0.3)',
        borderRadius: '12px',
        padding: '1.5rem',
        width: '100%',
        maxWidth: '750px',
      }}
    >
      <h2
        style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#F7B538',
          margin: '0 0 1rem 0',
          textAlign: 'center',
          textShadow: '0 0 10px rgba(247, 181, 56, 0.3)',
        }}
      >
        TOP 10 SCORES
      </h2>

      {isEmpty ? (
        <div
          style={{
            textAlign: 'center',
            color: '#a0a0a0',
            fontStyle: 'italic',
            padding: '2rem 0',
          }}
        >
          No scores yet - be the first!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {/* Header row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '40px 1fr 80px 120px',
              gap: '0.5rem',
              padding: '0.5rem',
              color: '#a0a0a0',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div>#</div>
            <div>Name</div>
            <div style={{ textAlign: 'right' }}>Score</div>
            <div style={{ textAlign: 'right' }}>Date</div>
          </div>

          {/* Entry rows */}
          {entries.map((entry, index) => {
            const isHighlighted = currentEntryId === entry.id
            const rank = index + 1

            return (
              <div
                key={entry.id}
                data-testid="leaderboard-row"
                data-highlighted={isHighlighted ? 'true' : 'false'}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 1fr 80px 120px',
                  gap: '0.5rem',
                  padding: '0.75rem 0.5rem',
                  backgroundColor: isHighlighted
                    ? 'rgba(247, 181, 56, 0.2)'
                    : 'transparent',
                  borderRadius: '6px',
                  color: isHighlighted ? '#F7B538' : '#ffffff',
                  fontWeight: isHighlighted ? 'bold' : 'normal',
                  transition: 'background-color 0.2s ease',
                }}
              >
                <div
                  style={{
                    fontWeight: 'bold',
                    color: rank <= 3 ? '#F7B538' : 'inherit',
                  }}
                >
                  {rank}
                </div>
                <div
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {entry.name}
                </div>
                <div style={{ textAlign: 'right' }}>{entry.score}</div>
                <div
                  style={{
                    textAlign: 'right',
                    fontSize: '0.9rem',
                    color: isHighlighted ? '#F7B538' : '#a0a0a0',
                  }}
                >
                  {formatLeaderboardDate(entry.date)}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
