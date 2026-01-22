import { describe, test, expect, beforeEach } from 'vitest'
import { act } from '@testing-library/react'
import { useGameStore } from '../../stores/gameStore'
import { minigames, getMiniGameByCountryId } from '../../data/minigames'
import { countries } from '../../data/countries'
import { STARTING_RESOURCES } from '../../data/constants'

describe('Phase 9: Mini-Games Integration', () => {
  beforeEach(() => {
    // Reset store to initial state
    act(() => {
      useGameStore.setState({
        currentMiniGame: null,
        lastMiniGameResult: null,
        resources: { ...STARTING_RESOURCES },
      })
    })
  })

  describe('Mini-game data', () => {
    test('all 10 countries have a mini-game', () => {
      countries.forEach(country => {
        const miniGame = getMiniGameByCountryId(country.id)
        expect(miniGame).toBeDefined()
        expect(miniGame!.countryId).toBe(country.id)
      })
    })

    test('mini-games have valid types', () => {
      minigames.forEach(game => {
        expect(['catcher', 'timing', 'memory']).toContain(game.type)
      })
    })

    test('mini-games have valid reward types', () => {
      minigames.forEach(game => {
        expect(['food', 'money']).toContain(game.rewardType)
      })
    })

    test('each country has exactly one mini-game', () => {
      const countryIds = countries.map(c => c.id)
      const miniGameCountryIds = minigames.map(m => m.countryId)

      // Every country ID should appear exactly once in mini-games
      countryIds.forEach(countryId => {
        const occurrences = miniGameCountryIds.filter(id => id === countryId).length
        expect(occurrences).toBe(1)
      })
    })

    test('all mini-games have positive maxReward values', () => {
      minigames.forEach(game => {
        expect(game.maxReward).toBeGreaterThan(0)
      })
    })

    test('all mini-games have required properties', () => {
      minigames.forEach(game => {
        expect(game.id).toBeDefined()
        expect(game.name).toBeDefined()
        expect(game.countryId).toBeDefined()
        expect(game.type).toBeDefined()
        expect(game.icon).toBeDefined()
        expect(game.description).toBeDefined()
        expect(game.rewardType).toBeDefined()
        expect(game.maxReward).toBeDefined()
      })
    })
  })

  describe('Store mini-game actions', () => {
    test('startMiniGame sets currentMiniGame for valid country', () => {
      const { startMiniGame } = useGameStore.getState()

      act(() => {
        startMiniGame('france')
      })

      const { currentMiniGame } = useGameStore.getState()
      expect(currentMiniGame).not.toBeNull()
      expect(currentMiniGame!.countryId).toBe('france')
      expect(currentMiniGame!.name).toBe('Croissant Catcher')
    })

    test('startMiniGame works for all countries', () => {
      countries.forEach(country => {
        act(() => {
          useGameStore.setState({ currentMiniGame: null })
        })

        const { startMiniGame } = useGameStore.getState()

        act(() => {
          startMiniGame(country.id)
        })

        const { currentMiniGame } = useGameStore.getState()
        expect(currentMiniGame).not.toBeNull()
        expect(currentMiniGame!.countryId).toBe(country.id)
      })
    })

    test('startMiniGame does not set currentMiniGame for invalid country', () => {
      const { startMiniGame } = useGameStore.getState()

      act(() => {
        startMiniGame('invalid-country')
      })

      const { currentMiniGame } = useGameStore.getState()
      expect(currentMiniGame).toBeNull()
    })

    test('completeMiniGame applies food reward correctly', () => {
      const { startMiniGame, completeMiniGame } = useGameStore.getState()
      const initialResources = { ...useGameStore.getState().resources }

      // Start a food-rewarding mini-game (France - Croissant Catcher)
      act(() => {
        startMiniGame('france')
      })

      // Complete with half score (7/15) - should give ~12 money (47% of 25 max)
      act(() => {
        completeMiniGame(7, 15)
      })

      const { resources, currentMiniGame, lastMiniGameResult } = useGameStore.getState()

      expect(currentMiniGame).toBeNull()
      expect(lastMiniGameResult).not.toBeNull()
      expect(lastMiniGameResult!.score).toBe(7)
      expect(resources.money).toBeGreaterThan(initialResources.money)
    })

    test('completeMiniGame applies money reward correctly', () => {
      const { startMiniGame, completeMiniGame } = useGameStore.getState()
      const initialResources = { ...useGameStore.getState().resources }

      // Start a money-rewarding mini-game (Germany - Beer Stein Balance)
      act(() => {
        startMiniGame('germany')
      })

      // Complete with full score (15/15) - should give 50 money (max)
      act(() => {
        completeMiniGame(15, 15)
      })

      const { resources } = useGameStore.getState()

      expect(resources.money).toBe(initialResources.money + 50)
    })

    test('skipMiniGame clears mini-game state', () => {
      const { startMiniGame, skipMiniGame } = useGameStore.getState()

      act(() => {
        startMiniGame('france')
      })
      expect(useGameStore.getState().currentMiniGame).not.toBeNull()

      act(() => {
        skipMiniGame()
      })

      const { currentMiniGame, lastMiniGameResult } = useGameStore.getState()
      expect(currentMiniGame).toBeNull()
      expect(lastMiniGameResult).toBeNull()
    })

    test('completeMiniGame does nothing when no mini-game is active', () => {
      const initialResources = { ...useGameStore.getState().resources }
      const { completeMiniGame } = useGameStore.getState()

      act(() => {
        completeMiniGame(10, 15)
      })

      const { resources, lastMiniGameResult } = useGameStore.getState()
      expect(resources).toEqual(initialResources)
      // lastMiniGameResult remains null when no mini-game was active
      expect(lastMiniGameResult).toBeNull()
    })

    test('skipMiniGame can be called when no mini-game is active', () => {
      const { skipMiniGame } = useGameStore.getState()

      // Should not throw
      act(() => {
        skipMiniGame()
      })

      const { currentMiniGame, lastMiniGameResult } = useGameStore.getState()
      expect(currentMiniGame).toBeNull()
      expect(lastMiniGameResult).toBeNull()
    })
  })

  describe('Mini-game reward calculation', () => {
    test('zero score gives zero reward', () => {
      act(() => {
        useGameStore.setState({
          resources: { ...STARTING_RESOURCES },
        })
      })

      const { startMiniGame, completeMiniGame } = useGameStore.getState()
      const initialMoney = useGameStore.getState().resources.money

      act(() => {
        startMiniGame('germany') // money reward
      })
      act(() => {
        completeMiniGame(0, 15)
      })

      const { resources, lastMiniGameResult } = useGameStore.getState()
      expect(resources.money).toBe(initialMoney)
      expect(lastMiniGameResult!.reward).toBe(0)
    })

    test('full score gives max reward', () => {
      act(() => {
        useGameStore.setState({
          resources: { ...STARTING_RESOURCES },
        })
      })

      const { startMiniGame, completeMiniGame } = useGameStore.getState()
      const initialMoney = useGameStore.getState().resources.money

      act(() => {
        startMiniGame('france') // money reward, max 25
      })
      act(() => {
        completeMiniGame(15, 15)
      })

      const { resources, lastMiniGameResult } = useGameStore.getState()
      expect(resources.money).toBe(initialMoney + 25)
      expect(lastMiniGameResult!.reward).toBe(25)
    })

    test('partial score gives proportional reward', () => {
      act(() => {
        useGameStore.setState({
          resources: { ...STARTING_RESOURCES },
        })
      })

      const { startMiniGame, completeMiniGame } = useGameStore.getState()
      const initialMoney = useGameStore.getState().resources.money

      act(() => {
        startMiniGame('germany') // money reward, max 50
      })
      act(() => {
        completeMiniGame(10, 15) // 66.7% score
      })

      const { resources, lastMiniGameResult } = useGameStore.getState()
      // Should be ~33 money (67% of 50, rounded)
      expect(resources.money).toBeGreaterThan(initialMoney + 30)
      expect(resources.money).toBeLessThanOrEqual(initialMoney + 35)
      expect(lastMiniGameResult!.reward).toBeGreaterThan(30)
      expect(lastMiniGameResult!.reward).toBeLessThanOrEqual(35)
    })

    test('score exceeding maxScore caps at maxReward', () => {
      act(() => {
        useGameStore.setState({
          resources: { ...STARTING_RESOURCES },
        })
      })

      const { startMiniGame, completeMiniGame } = useGameStore.getState()
      const initialMoney = useGameStore.getState().resources.money

      act(() => {
        startMiniGame('france') // money reward, max 25
      })
      act(() => {
        completeMiniGame(20, 15) // exceeds max score
      })

      const { resources, lastMiniGameResult } = useGameStore.getState()
      expect(resources.money).toBe(initialMoney + 25)
      expect(lastMiniGameResult!.reward).toBe(25)
    })

    test('negative score gives zero reward', () => {
      act(() => {
        useGameStore.setState({
          resources: { ...STARTING_RESOURCES },
        })
      })

      const { startMiniGame, completeMiniGame } = useGameStore.getState()
      const initialMoney = useGameStore.getState().resources.money

      act(() => {
        startMiniGame('germany') // money reward
      })
      act(() => {
        completeMiniGame(-5, 15)
      })

      const { resources, lastMiniGameResult } = useGameStore.getState()
      expect(resources.money).toBe(initialMoney)
      expect(lastMiniGameResult!.reward).toBe(0)
    })
  })

  describe('Mini-game result tracking', () => {
    test('lastMiniGameResult is set after completeMiniGame', () => {
      const { startMiniGame, completeMiniGame } = useGameStore.getState()

      act(() => {
        startMiniGame('france')
      })
      act(() => {
        completeMiniGame(10, 15)
      })

      const { lastMiniGameResult } = useGameStore.getState()
      expect(lastMiniGameResult).not.toBeNull()
      expect(lastMiniGameResult!.score).toBe(10)
      expect(lastMiniGameResult!.maxScore).toBe(15)
      expect(lastMiniGameResult!.reward).toBeGreaterThan(0)
    })

    test('lastMiniGameResult is cleared after skipMiniGame', () => {
      // First complete a game to set lastMiniGameResult
      const { startMiniGame, completeMiniGame, skipMiniGame } = useGameStore.getState()

      act(() => {
        startMiniGame('france')
      })
      act(() => {
        completeMiniGame(10, 15)
      })

      expect(useGameStore.getState().lastMiniGameResult).not.toBeNull()

      // Start a new game and skip it
      act(() => {
        startMiniGame('germany')
      })
      act(() => {
        skipMiniGame()
      })

      const { lastMiniGameResult } = useGameStore.getState()
      expect(lastMiniGameResult).toBeNull()
    })

    test('lastMiniGameResult persists until new game or skip', () => {
      const { startMiniGame, completeMiniGame } = useGameStore.getState()

      act(() => {
        startMiniGame('france')
      })
      act(() => {
        completeMiniGame(10, 15)
      })

      const resultAfterFirst = useGameStore.getState().lastMiniGameResult

      // Start but don't complete another game
      act(() => {
        startMiniGame('germany')
      })

      // Result should persist (not cleared by starting new game)
      // Actually, starting a new game should keep the previous result until completion
      const currentResult = useGameStore.getState().lastMiniGameResult
      expect(currentResult).toEqual(resultAfterFirst)
    })
  })

  describe('Mini-game data consistency', () => {
    test('France mini-game is Croissant Catcher', () => {
      const game = getMiniGameByCountryId('france')
      expect(game!.name).toBe('Croissant Catcher')
      expect(game!.type).toBe('catcher')
      expect(game!.rewardType).toBe('money')
      expect(game!.maxReward).toBe(25)
    })

    test('Germany mini-game is Beer Stein Balance', () => {
      const game = getMiniGameByCountryId('germany')
      expect(game!.name).toBe('Beer Stein Balance')
      expect(game!.type).toBe('timing')
      expect(game!.rewardType).toBe('money')
      expect(game!.maxReward).toBe(50)
    })

    test('Russia mini-game is Matryoshka Match', () => {
      const game = getMiniGameByCountryId('russia')
      expect(game!.name).toBe('Matryoshka Match')
      expect(game!.type).toBe('memory')
      expect(game!.rewardType).toBe('money')
      expect(game!.maxReward).toBe(40)
    })

    test('China mini-game is Dumpling Catch', () => {
      const game = getMiniGameByCountryId('china')
      expect(game!.name).toBe('Dumpling Catch')
      expect(game!.type).toBe('catcher')
      expect(game!.rewardType).toBe('money')
      expect(game!.maxReward).toBe(25)
    })

    test('Japan mini-game is Sushi Sort', () => {
      const game = getMiniGameByCountryId('japan')
      expect(game!.name).toBe('Sushi Sort')
      expect(game!.type).toBe('timing')
      expect(game!.rewardType).toBe('money')
      expect(game!.maxReward).toBe(25)
    })

    test('Singapore mini-game is Night Market Grab', () => {
      const game = getMiniGameByCountryId('singapore')
      expect(game!.name).toBe('Night Market Grab')
      expect(game!.type).toBe('catcher')
      expect(game!.rewardType).toBe('money')
      expect(game!.maxReward).toBe(50)
    })

    test('Australia mini-game is Boomerang Catch', () => {
      const game = getMiniGameByCountryId('australia')
      expect(game!.name).toBe('Boomerang Catch')
      expect(game!.type).toBe('timing')
      expect(game!.rewardType).toBe('money')
      expect(game!.maxReward).toBe(40)
    })

    test('Brazil mini-game is Carnival Rhythm', () => {
      const game = getMiniGameByCountryId('brazil')
      expect(game!.name).toBe('Carnival Rhythm')
      expect(game!.type).toBe('timing')
      expect(game!.rewardType).toBe('money')
      expect(game!.maxReward).toBe(50)
    })

    test('Canada mini-game is Maple Syrup Pour', () => {
      const game = getMiniGameByCountryId('canada')
      expect(game!.name).toBe('Maple Syrup Pour')
      expect(game!.type).toBe('timing')
      expect(game!.rewardType).toBe('money')
      expect(game!.maxReward).toBe(25)
    })

    test('USA mini-game is Hot Dog Stack', () => {
      const game = getMiniGameByCountryId('usa')
      expect(game!.name).toBe('Hot Dog Stack')
      expect(game!.type).toBe('catcher')
      expect(game!.rewardType).toBe('money')
      expect(game!.maxReward).toBe(25)
    })
  })

  describe('Mini-game type distribution', () => {
    test('there are mini-games of type catcher', () => {
      const catcherGames = minigames.filter(g => g.type === 'catcher')
      expect(catcherGames.length).toBeGreaterThan(0)
    })

    test('there are mini-games of type timing', () => {
      const timingGames = minigames.filter(g => g.type === 'timing')
      expect(timingGames.length).toBeGreaterThan(0)
    })

    test('there are mini-games of type memory', () => {
      const memoryGames = minigames.filter(g => g.type === 'memory')
      expect(memoryGames.length).toBeGreaterThan(0)
    })

    test('all mini-games have money reward type', () => {
      const moneyGames = minigames.filter(g => g.rewardType === 'money')
      expect(moneyGames.length).toBe(minigames.length)
    })
  })

  describe('Store initialization', () => {
    test('initializeGame resets mini-game state', () => {
      // First, set up some mini-game state
      const { startMiniGame, completeMiniGame, initializeGame } = useGameStore.getState()

      act(() => {
        useGameStore.setState({
          selectedCaptain: { id: 'test', name: 'Test', origin: 'Test', description: 'Test', portrait: '1', stats: { engineering: 1, food: 1, security: 1 } },
          selectedTrain: { id: 'test', name: 'Test', origin: 'Test', character: 'Test', sprite: '1', stats: { speed: 1, reliability: 1, power: 1 } },
        })
      })

      act(() => {
        startMiniGame('france')
      })
      act(() => {
        completeMiniGame(10, 15)
      })

      expect(useGameStore.getState().lastMiniGameResult).not.toBeNull()

      // Initialize game should reset mini-game state
      act(() => {
        initializeGame()
      })

      const state = useGameStore.getState()
      expect(state.currentMiniGame).toBeNull()
      expect(state.lastMiniGameResult).toBeNull()
    })
  })
})
