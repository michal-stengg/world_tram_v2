import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CountryMarker } from '../../components/game/CountryMarker'
import type { Country } from '../../types'

const mockCountry: Country = {
  id: 'france',
  name: 'France',
  icon: '🗼',
  landmark: 'Eiffel Tower in Paris',
  distanceRequired: 10,
}

describe('CountryMarker', () => {
  describe('rendering', () => {
    it('renders country icon', () => {
      render(<CountryMarker country={mockCountry} status="upcoming" />)
      expect(screen.getByRole('img', { name: 'France' })).toHaveTextContent('🗼')
    })

    it('renders country name', () => {
      render(<CountryMarker country={mockCountry} status="upcoming" />)
      expect(screen.getByText('France')).toBeInTheDocument()
    })

    it('renders with correct testid', () => {
      render(<CountryMarker country={mockCountry} status="upcoming" />)
      expect(screen.getByTestId('country-marker-france')).toBeInTheDocument()
    })

    it('has status data attribute', () => {
      render(<CountryMarker country={mockCountry} status="upcoming" />)
      expect(screen.getByTestId('country-marker-france')).toHaveAttribute('data-status', 'upcoming')
    })
  })

  describe('visited status', () => {
    it('shows checkmark when visited', () => {
      render(<CountryMarker country={mockCountry} status="visited" />)
      expect(screen.getByTestId('checkmark')).toBeInTheDocument()
      expect(screen.getByTestId('checkmark')).toHaveTextContent('✓')
    })

    it('does not show checkmark when not visited', () => {
      render(<CountryMarker country={mockCountry} status="upcoming" />)
      expect(screen.queryByTestId('checkmark')).not.toBeInTheDocument()
    })

    it('has visited status attribute', () => {
      render(<CountryMarker country={mockCountry} status="visited" />)
      expect(screen.getByTestId('country-marker-france')).toHaveAttribute('data-status', 'visited')
    })
  })

  describe('current status', () => {
    it('shows current indicator when current', () => {
      render(<CountryMarker country={mockCountry} status="current" />)
      expect(screen.getByTestId('current-indicator')).toBeInTheDocument()
    })

    it('does not show current indicator when not current', () => {
      render(<CountryMarker country={mockCountry} status="upcoming" />)
      expect(screen.queryByTestId('current-indicator')).not.toBeInTheDocument()
    })

    it('has current status attribute', () => {
      render(<CountryMarker country={mockCountry} status="current" />)
      expect(screen.getByTestId('country-marker-france')).toHaveAttribute('data-status', 'current')
    })

    it('does not show checkmark when current', () => {
      render(<CountryMarker country={mockCountry} status="current" />)
      expect(screen.queryByTestId('checkmark')).not.toBeInTheDocument()
    })
  })

  describe('upcoming status', () => {
    it('does not show checkmark when upcoming', () => {
      render(<CountryMarker country={mockCountry} status="upcoming" />)
      expect(screen.queryByTestId('checkmark')).not.toBeInTheDocument()
    })

    it('does not show current indicator when upcoming', () => {
      render(<CountryMarker country={mockCountry} status="upcoming" />)
      expect(screen.queryByTestId('current-indicator')).not.toBeInTheDocument()
    })

    it('has upcoming status attribute', () => {
      render(<CountryMarker country={mockCountry} status="upcoming" />)
      expect(screen.getByTestId('country-marker-france')).toHaveAttribute('data-status', 'upcoming')
    })
  })

  describe('different countries', () => {
    it('renders Germany correctly', () => {
      const germany: Country = {
        id: 'germany',
        name: 'Germany',
        icon: '🏰',
        landmark: 'Neuschwanstein Castle',
        distanceRequired: 10,
      }
      render(<CountryMarker country={germany} status="upcoming" />)
      expect(screen.getByRole('img', { name: 'Germany' })).toHaveTextContent('🏰')
      expect(screen.getByText('Germany')).toBeInTheDocument()
    })

    it('renders USA correctly', () => {
      const usa: Country = {
        id: 'usa',
        name: 'USA',
        icon: '🗽',
        landmark: 'Statue of Liberty',
        distanceRequired: 10,
      }
      render(<CountryMarker country={usa} status="upcoming" />)
      expect(screen.getByRole('img', { name: 'USA' })).toHaveTextContent('🗽')
      expect(screen.getByText('USA')).toBeInTheDocument()
    })
  })
})
