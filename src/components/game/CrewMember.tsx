import { motion } from 'framer-motion'
import type { CrewMember as CrewMemberType, CrewRole } from '../../types'
import { useGameStore } from '../../stores/gameStore'

export interface CrewMemberProps {
  member: CrewMemberType
  onRoleClick?: () => void
}

const roleIcons: Record<CrewRole, string> = {
  engineer: '🔧',
  cook: '🍳',
  security: '🛡️',
  free: '💤',
}

const roleLabels: Record<CrewRole, string> = {
  engineer: 'Engineer',
  cook: 'Cook',
  security: 'Security',
  free: 'Free',
}

const roleTooltips: Record<CrewRole, string> = {
  engineer: 'Engineers reduce fuel consumption',
  cook: 'Cooks produce food each turn',
  security: 'Security reduces event penalties and earns more money at stations',
  free: 'Free crew have no special bonus',
}

const roleOrder: CrewRole[] = ['engineer', 'cook', 'security', 'free']

export function CrewMember({ member, onRoleClick }: CrewMemberProps) {
  const cycleCrewRole = useGameStore((state) => state.cycleCrewRole)
  const setCrewRole = useGameStore((state) => state.setCrewRole)

  const handleClick = () => {
    cycleCrewRole(member.id)
    onRoleClick?.()
  }

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0.5rem',
    gap: '0.25rem',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    minWidth: '70px',
    cursor: 'pointer',
  }

  const avatarStyle: React.CSSProperties = {
    fontSize: '1.75rem',
  }

  const nameStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    fontWeight: 'bold',
    color: 'var(--color-text, #ffffff)',
  }

  const roleContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.625rem',
    color: 'var(--color-text-secondary, #b8b8d0)',
  }

  const roleIconStyle: React.CSSProperties = {
    fontSize: '0.875rem',
  }

  const rolePickerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '0.125rem',
    width: '100%',
    marginTop: '0.25rem',
  }

  const roleButtonStyle = (role: CrewRole): React.CSSProperties => ({
    border: role === member.role ? '1px solid var(--color-gold, #F7B538)' : '1px solid rgba(255, 255, 255, 0.25)',
    backgroundColor: role === member.role ? 'rgba(247, 181, 56, 0.25)' : 'rgba(255, 255, 255, 0.08)',
    color: '#fff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.75rem',
    lineHeight: 1,
    padding: '0.2rem',
  })

  return (
    <motion.div
      style={containerStyle}
      data-testid={`crew-member-${member.id}`}
      title={roleTooltips[member.role]}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      <span style={avatarStyle} role="img" aria-label={member.name}>
        {member.avatar}
      </span>
      <span style={nameStyle}>{member.name}</span>
      <div style={roleContainerStyle}>
        <span style={roleIconStyle} role="img" aria-label={roleLabels[member.role]}>
          {roleIcons[member.role]}
        </span>
        <span data-testid={`role-${member.id}`}>{roleLabels[member.role]}</span>
      </div>
      <div style={rolePickerStyle} aria-label={`Assign ${member.name} role`}>
        {roleOrder.map((role) => (
          <button
            key={role}
            type="button"
            style={roleButtonStyle(role)}
            title={`Assign ${roleLabels[role]}`}
            aria-label={`Assign ${member.name} as ${roleLabels[role]}`}
            data-testid={`assign-${member.id}-${role}`}
            onClick={(event) => {
              event.stopPropagation()
              setCrewRole(member.id, role)
              onRoleClick?.()
            }}
          >
            {roleIcons[role]}
          </button>
        ))}
      </div>
    </motion.div>
  )
}
