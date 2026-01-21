import { PixelButton } from '../common/PixelButton'

interface GoButtonProps {
  onGo: () => void
  disabled?: boolean
}

export function GoButton({ onGo, disabled = false }: GoButtonProps) {
  return (
    <div data-testid="go-button">
      <PixelButton
        onClick={onGo}
        disabled={disabled}
        variant="gold"
        size="large"
        glow
      >
        <span role="img" aria-label="Dice">🎲</span>
        {' GO! '}
        <span role="img" aria-label="Dice">🎲</span>
      </PixelButton>
    </div>
  )
}
