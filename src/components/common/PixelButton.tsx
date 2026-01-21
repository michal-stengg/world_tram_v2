import { motion, type Transition } from 'framer-motion'
import type { ReactNode } from 'react'

export interface PixelButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'gold'
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
  className?: string
  glow?: boolean
}

const variantStyles: Record<
  NonNullable<PixelButtonProps['variant']>,
  React.CSSProperties
> = {
  primary: {
    backgroundColor: '#2D1B69',
    color: '#ffffff',
    border: 'none',
  },
  secondary: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    border: '2px solid #ffffff',
  },
  danger: {
    backgroundColor: '#DB3A34',
    color: '#ffffff',
    border: 'none',
  },
  gold: {
    backgroundColor: '#F7B538',
    color: '#1a1a2e',
    border: 'none',
  },
}

const sizeStyles: Record<
  NonNullable<PixelButtonProps['size']>,
  React.CSSProperties
> = {
  small: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
  },
  medium: {
    padding: '0.75rem 1.5rem',
    fontSize: '1.25rem',
  },
  large: {
    padding: '1rem 2rem',
    fontSize: '1.5rem',
  },
}

const baseStyles: React.CSSProperties = {
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontFamily: 'inherit',
  outline: 'none',
}

const disabledStyles: React.CSSProperties = {
  opacity: 0.5,
  cursor: 'not-allowed',
}

const springTransition: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 17,
}

const glowKeyframes = {
  boxShadow: [
    '0 0 5px rgba(247, 181, 56, 0.5)',
    '0 0 20px rgba(247, 181, 56, 0.8)',
    '0 0 5px rgba(247, 181, 56, 0.5)',
  ],
}

const glowTransition: Transition = {
  boxShadow: {
    duration: 1.5,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },
}

export function PixelButton({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  size = 'medium',
  className = '',
  glow = false,
}: PixelButtonProps) {
  const combinedStyles: React.CSSProperties = {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...(disabled ? disabledStyles : {}),
  }

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick()
    }
  }

  const shouldGlow = glow && !disabled

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={className}
      style={combinedStyles}
      data-variant={variant}
      data-size={size}
      data-glow={glow ? 'true' : undefined}
      whileHover={disabled ? undefined : { scale: 1.1 }}
      whileTap={disabled ? undefined : { scale: 0.85 }}
      animate={shouldGlow ? glowKeyframes : undefined}
      transition={shouldGlow ? { ...springTransition, ...glowTransition } : springTransition}
    >
      {children}
    </motion.button>
  )
}
