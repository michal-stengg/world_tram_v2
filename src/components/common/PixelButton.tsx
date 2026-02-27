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
    border: '2px solid #4a2d9e',
    boxShadow: '0 4px 0 #1a0f3d, 0 6px 12px rgba(0,0,0,0.3)',
  },
  secondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#ffffff',
    border: '2px solid rgba(255, 255, 255, 0.4)',
    boxShadow: '0 4px 0 rgba(255,255,255,0.08), 0 6px 12px rgba(0,0,0,0.2)',
  },
  danger: {
    backgroundColor: '#DB3A34',
    color: '#ffffff',
    border: '2px solid #f04e48',
    boxShadow: '0 4px 0 #9e1f1a, 0 6px 12px rgba(0,0,0,0.3)',
  },
  gold: {
    backgroundColor: '#F7B538',
    color: '#1a1a2e',
    border: '2px solid #ffd06b',
    boxShadow: '0 4px 0 #c4841d, 0 6px 12px rgba(0,0,0,0.3)',
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
    '0 4px 0 #c4841d, 0 0 8px rgba(247, 181, 56, 0.4)',
    '0 4px 0 #c4841d, 0 0 25px rgba(247, 181, 56, 0.7), 0 0 50px rgba(247, 181, 56, 0.2)',
    '0 4px 0 #c4841d, 0 0 8px rgba(247, 181, 56, 0.4)',
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
      whileHover={disabled ? undefined : { scale: 1.05, y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.97, y: 3 }}
      animate={shouldGlow ? glowKeyframes : undefined}
      transition={shouldGlow ? { ...springTransition, ...glowTransition } : springTransition}
    >
      {children}
    </motion.button>
  )
}
