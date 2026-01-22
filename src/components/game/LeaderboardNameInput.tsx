import { useState } from 'react'
import { PixelButton } from '../common/PixelButton'

export interface LeaderboardNameInputProps {
  onSubmit: (name: string) => void
  onSkip: () => void
}

const MAX_NAME_LENGTH = 20

export function LeaderboardNameInput({ onSubmit, onSkip }: LeaderboardNameInputProps) {
  const [name, setName] = useState('')

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, MAX_NAME_LENGTH)
    setName(value)
  }

  const handleSubmit = () => {
    const trimmedName = name.trim()
    if (trimmedName) {
      onSubmit(trimmedName)
    }
  }

  const isSubmitDisabled = name.trim().length === 0

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem',
  }

  const inputContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    width: '100%',
  }

  const inputStyle: React.CSSProperties = {
    backgroundColor: '#1a1a2e',
    color: '#ffffff',
    border: '2px solid #F7B538',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    fontSize: '1.25rem',
    fontFamily: 'inherit',
    width: '100%',
    maxWidth: '300px',
    outline: 'none',
    textAlign: 'center',
  }

  const counterStyle: React.CSSProperties = {
    color: '#F7B538',
    fontSize: '0.875rem',
  }

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '1rem',
    marginTop: '0.5rem',
  }

  return (
    <div style={containerStyle}>
      <div style={inputContainerStyle}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={handleNameChange}
          maxLength={MAX_NAME_LENGTH}
          style={inputStyle}
        />
        <span style={counterStyle}>{name.length}/{MAX_NAME_LENGTH}</span>
      </div>
      <div style={buttonContainerStyle}>
        <PixelButton
          onClick={handleSubmit}
          variant="gold"
          disabled={isSubmitDisabled}
        >
          SUBMIT
        </PixelButton>
        <PixelButton
          onClick={onSkip}
          variant="secondary"
        >
          SKIP
        </PixelButton>
      </div>
    </div>
  )
}
