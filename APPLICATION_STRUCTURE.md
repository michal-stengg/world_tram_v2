# World Tram Application Structure

## Overview

**World Tram** is a turn-based railway adventure game built with React, TypeScript, and Zustand for state management. Players select a captain and train, navigate through countries, manage resources, and reach the USA as the final destination.

**Tech Stack:**
- React 19 (functional components with hooks)
- TypeScript 5.9
- Zustand (state management)
- Vite (build tool)
- Vitest (testing framework)
- Framer Motion (animations)
- ESLint & Prettier (code quality)

---

## Application Architecture

### Entry Point

**`src/main.tsx`** - React DOM root initialization
- Renders `App` component into `#root` element with React.StrictMode

**`src/App.tsx`** - Main application router
- Uses Zustand store to get `currentScreen`
- Maps screen names to screen components
- Supports screens: `intro`, `captainSelect`, `trainSelect`, `dashboard`, `victory`, `gameOver`

### State Management

**`src/stores/gameStore.ts`** - Zustand store (single source of truth)
- **Game State**: captain selection, train selection, resources, crew, progress
- **Turn State**: turn count, turn results, game over conditions
- **Card State**: hand management, event handling, card selection
- **Cart State**: purchased carts and their bonuses
- **Mini-game State**: current game, results
- **Cargo State**: discovered cargo items, pending cargo to open
- **Quiz State**: current quiz, answers, question index, results
- **Shop State**: resource shopping cart
- **Activity Tracking**: which mini-games/quizzes played at each country

**Key Actions:**
- Navigation: `setScreen()`, `goBack()`
- Character selection: `selectCaptain()`, `selectTrain()`
- Game execution: `executeTurn()`, `initializeGame()`
- Card management: `selectCard()`, `resolveCurrentEvent()`
- Resource operations: `purchaseResources()`, `addCargo()`, `openCargoAtStation()`

---

## Directory Structure

```
src/
├── main.tsx                 # React DOM entry point
├── App.tsx                  # Screen router
├── index.css                # Global styles & CSS variables
├── setupTests.ts            # Test configuration
│
├── types/                   # TypeScript type definitions
│   ├── index.ts             # Core game types (Captain, Train, Resources, etc.)
│   └── leaderboard.ts       # Leaderboard-specific types
│
├── stores/                  # State management
│   └── gameStore.ts         # Zustand game state (533 lines)
│
├── data/                    # Static game data & constants
│   ├── constants.ts         # Game balance settings (starting resources, consumption rates)
│   ├── captains.ts          # Captain definitions & stats
│   ├── trains.ts            # Train definitions & stats
│   ├── crew.ts              # Starting crew members
│   ├── countries.ts         # Route stops (France, Spain, USA, etc.)
│   ├── cards.ts             # Bonus card definitions
│   ├── events.ts            # Random events system
│   ├── cargo.ts             # Cargo items (common, rare, legendary)
│   ├── carts.ts             # Train carts (upgrades)
│   ├── minigames.ts         # Mini-game definitions & questions
│   ├── quizzes.ts           # Country quizzes (58KB - large!)
│   └── shopPrices.ts        # Country-specific resource pricing
│
├── logic/                   # Game mechanics & calculations
│   ├── turn.ts              # Turn execution orchestration (150 lines)
│   ├── movement.ts          # Dice roll → movement calculation
│   ├── resources.ts         # Resource consumption/production
│   ├── crew.ts              # Crew role cycling, bonuses
│   ├── conditions.ts        # Game over condition checks
│   ├── dice.ts              # Dice rolling mechanics
│   ├── cards.ts             # Card hand drawing & playing
│   ├── events.ts            # Event triggering & resolution
│   ├── cargo.ts             # Cargo discovery & opening
│   ├── station.ts           # Station arrival rewards
│   ├── minigames.ts         # Mini-game reward calculation
│   ├── quizzes.ts           # Quiz scoring & rating
│   ├── carts.ts             # Cart purchase validation
│   ├── shop.ts              # Resource shop cart logic
│   ├── leaderboard.ts       # Score calculations
│   ├── rating.ts            # Performance rating system
│   └── resourcePreview.ts    # Resource state preview
│
├── components/              # React components
│   ├── screens/             # Full-screen views
│   │   ├── IntroScreen.tsx           # Game title & start button
│   │   ├── CaptainSelectionScreen.tsx # Pick captain (4 choices)
│   │   ├── TrainSelectionScreen.tsx   # Pick train (4 choices)
│   │   ├── DashboardScreen.tsx        # Main game UI (120 lines)
│   │   ├── VictoryScreen.tsx          # Victory message & score
│   │   └── GameOverScreen.tsx         # Game over message & restart
│   │
│   ├── game/                # Game play UI components
│   │   ├── ResourceBar.tsx           # Food, fuel, water, money display
│   │   ├── JourneyTrack.tsx          # Visual progress bar
│   │   ├── LocationIndicator.tsx     # Current country display
│   │   ├── CrewPanel.tsx             # Crew member list with role cycling
│   │   ├── CrewMember.tsx            # Single crew card
│   │   ├── CaptainStats.tsx          # Captain stats display
│   │   ├── TrainStats.tsx            # Train stats display
│   │   ├── TurnResultDisplay.tsx     # Turn outcome details
│   │   ├── GoButton.tsx              # Execute turn button
│   │   ├── CardDisplay.tsx           # Single card in hand
│   │   ├── CardHand.tsx              # All cards with selection
│   │   ├── StationModal.tsx          # Station arrival modal
│   │   ├── StationShop.tsx           # Buy resources (food, fuel, water)
│   │   ├── CartShop.tsx              # Buy train carts (upgrades)
│   │   ├── EventModal.tsx            # Random event popup
│   │   ├── MiniGameModal.tsx         # Mini-game container
│   │   ├── QuizModal.tsx             # Quiz UI
│   │   ├── QuizQuestion.tsx          # Single quiz question
│   │   ├── QuizResult.tsx            # Quiz score display
│   │   ├── CargoDiscoveryModal.tsx   # New cargo found popup
│   │   ├── CargoOpenModal.tsx        # Opening cargo at station
│   │   ├── CargoInventory.tsx        # Cargo list display
│   │   ├── Leaderboard.tsx           # Final score & leaderboard
│   │   ├── LeaderboardNameInput.tsx  # Enter name for leaderboard
│   │   ├── CountryMarker.tsx         # Country visual on map
│   │   └── ResourceMeter.tsx         # Individual resource bar
│   │
│   ├── minigames/           # Mini-game implementations
│   │   ├── CatcherGame.tsx   # Click-to-catch game
│   │   ├── MemoryGame.tsx    # Memory card matching
│   │   └── TimingGame.tsx    # Timing-based game
│   │
│   └── common/              # Reusable UI primitives
│       ├── PixelButton.tsx   # Pixel-art styled button
│       ├── StatBar.tsx       # Stat display bar (1-6)
│       └── ResourceMeter.tsx # Resource progress bar
│
├── assets/                  # Static images & media
│   └── (fonts, images, etc.)
│
└── __tests__/               # Test files (mirror src structure)
    ├── App.test.tsx
    ├── setup.test.ts
    ├── components/          # Component tests
    ├── logic/               # Logic tests
    ├── data/                # Data validation tests
    ├── stores/              # Store tests
    ├── integration/         # Phase-based integration tests
    │   ├── phase1-navigation.test.tsx
    │   ├── phase5-crew.test.tsx
    │   ├── phase6-stations.test.tsx
    │   ├── phase7-events.test.tsx
    │   ├── phase8-carts.test.tsx
    │   ├── phase9-minigames.test.tsx
    │   ├── phase10-cargo.test.tsx
    │   └── phase11-quiz.test.tsx
    └── ...more test files
```

---

## Core Game Types

**`src/types/index.ts`** - All TypeScript interfaces:

### Character Types
```typescript
interface Captain {
  id, name, origin, description, portrait (emoji),
  stats: { engineering: 1-6, food: 1-6, security: 1-6 }
}

interface Train {
  id, name, origin, character, sprite (emoji),
  stats: { speed: 1-6, reliability: 1-6, power: 1-6 }
}

type CrewRole = 'engineer' | 'cook' | 'security' | 'free'

interface CrewMember {
  id, name, role, avatar (emoji)
}
```

### Resource & Economy Types
```typescript
interface Resources {
  food: number, fuel: number, water: number, money: number
}

interface MaxResources { /* same structure */ }

interface Cart {
  id, name, icon, price, effectType, effectValue, description
  effectType: 'maxFuel' | 'maxFood' | 'maxWater' | 'fuelEfficiency' | 'security' | 'income'
}
```

### Journey Types
```typescript
interface Country {
  id, name, icon (emoji), landmark, distanceRequired
}
```

### Activity Types
```typescript
type MiniGameType = 'catcher' | 'memory' | 'timing'
type MiniGameRewardType = 'food' | 'money'

interface MiniGame {
  id, name, countryId, type, icon, description, rewardType, maxReward
}

interface CargoItem {
  id, name, icon, rarity ('common' | 'rare' | 'legendary'),
  rewardType ('money' | 'fuel' | 'food' | 'water'),
  rewardAmount, description
}

interface QuizQuestion {
  id, questionText, options [], correctAnswer, funFact, imageUrl?
}

interface CountryQuiz {
  id, countryId, name, questions [] (3 questions)
}
```

---

## Game Constants & Balance

**`src/data/constants.ts`** - Game settings:

```typescript
// Resources
STARTING_RESOURCES: { food: 50, fuel: 100, water: 50, money: 200 }
MAX_RESOURCES: { food: 100, fuel: 200, water: 100, money: 1000 }

// Consumption (per turn)
BASE_FUEL_CONSUMPTION: 5
BASE_FOOD_CONSUMPTION: 3
BASE_WATER_CONSUMPTION: 2
BASE_MONEY_WAGES: 10
COOK_FOOD_PRODUCTION: 5 (with cook crew)

// Movement
DISTANCE_PER_COUNTRY: 20 units
DICE: 0-10 + train speed

// Game Length
MAX_TURNS: 100 (safety limit)
```

---

## Game Flow & Screen Navigation

```
IntroScreen
  ↓
CaptainSelectionScreen (pick from 4 captains)
  ↓
TrainSelectionScreen (pick from 4 trains)
  ↓
DashboardScreen (main gameplay loop)
  ├─→ Roll dice → execute turn
  ├─→ Arrive at station → shop modal
  ├─→ Event triggered → event modal
  ├─→ Cargo discovered → cargo discovery modal
  ├─→ Mini-game available → mini-game modal
  ├─→ Quiz available → quiz modal
  └─→ Game over? → GameOverScreen

  OR

  └─→ Reach USA → VictoryScreen

VictoryScreen (show score, leaderboard, restart)
GameOverScreen (show reason, restart)
```

---

## Key Game Mechanics

### Turn Execution (`src/logic/turn.ts`)

Each turn:
1. Roll dice (0-10)
2. Add train speed
3. Calculate movement
4. Consume resources (fuel, food, water, wages)
5. Calculate crew bonuses (engineer saves fuel, cook produces food, security reduces penalties)
6. Check for game over conditions
7. Check if arrived at new country (trigger station rewards)
8. Check if random event triggers
9. Check if cargo discovered
10. Return `TurnResult` with all changes

### Resource System (`src/logic/resources.ts`)

- **Consumption** is calculated based on crew count and train stats
- **Production** happens via cook crew member
- **Bonuses** from engineer (fuel) and security (event penalties)
- Resources capped at MAX_RESOURCES

### Crew Roles (`src/logic/crew.ts`)

Rotate roles to optimize bonuses:
- **Engineer**: reduces fuel consumption by 2
- **Cook**: produces 5 food per turn
- **Security**: reduces event penalties by 15% per member
- **Free**: no bonus

### Event System (`src/logic/events.ts`)

Random events have:
- **Trigger chance**: calculated per turn
- **Penalty** if failed: resource loss or progress delay
- **Card defense**: play bonus cards to prevent penalty
- **Security bonus**: security crew reduces penalty amount

### Station Rewards (`src/logic/station.ts`)

Arriving at a country gives:
- **Station shop**: buy resources (food, fuel, water)
- **Cart shop**: buy train upgrades
- **Mini-game**: optional, earn food or money
- **Quiz**: optional, earn money
- **Cargo opening**: open any cargo items in inventory

### Mini-games (`src/logic/minigames.ts`)

Three game types:
- **Catcher**: click flying objects
- **Memory**: match cards
- **Timing**: click at right moment

Reward = `Math.round((score / maxScore) * maxReward)`

### Cargo System (`src/logic/cargo.ts`)

- Discover during turns (random chance)
- Store in inventory (no limit)
- Open at stations to claim rewards
- Rarity: common, rare, legendary
- Reward types: money, fuel, food, water

### Quiz System (`src/logic/quizzes.ts`)

- 3 questions per country
- Multiple choice answers
- Scoring: 0-3 correct
- Rewards: 100 money + bonus based on score
- Rating: "Quiz Master!" (3/3), "Great Job!" (2/3), etc.

### Card System (`src/logic/cards.ts`)

- Start with 3 bonus cards in hand
- Play cards when events occur to defend against penalties
- After playing, hand replenishes to 3 cards
- Cards in deck: different bonus types

---

## Component Hierarchy

### Main Game Screen (DashboardScreen)

```
DashboardScreen
├── Header (captain/train selection display)
├── Main Content
│   ├── ResourceBar (current resources)
│   ├── JourneyTrack (visual progress)
│   ├── LocationIndicator (current country)
│   ├── CrewPanel (crew with role controls)
│   ├── CardHand (3 bonus cards)
│   └── TurnResultDisplay (last turn's results)
├── GoButton (execute turn)
└── Modals (overlays)
    ├── StationModal (on country arrival)
    │   ├── StationShop (buy resources)
    │   └── CartShop (buy upgrades)
    ├── EventModal (event triggered)
    ├── CargoDiscoveryModal (cargo found)
    ├── CargoOpenModal (open cargo)
    ├── MiniGameModal
    │   ├── CatcherGame
    │   ├── MemoryGame
    │   └── TimingGame
    └── QuizModal
        ├── QuizQuestion
        └── QuizResult
```

---

## Data Files

### Game Data (`src/data/`)

| File | Size | Purpose |
|------|------|---------|
| `captains.ts` | ~1.2KB | 4 captains with unique stats |
| `trains.ts` | ~1.2KB | 4 trains with unique stats |
| `crew.ts` | ~850B | 4 starting crew members |
| `countries.ts` | ~2.2KB | 7 countries (France→USA) |
| `cards.ts` | ~1.8KB | Bonus card definitions |
| `events.ts` | ~2.4KB | Random event definitions |
| `cargo.ts` | ~2.8KB | Cargo items (common/rare/legendary) |
| `carts.ts` | ~1.8KB | Train cart upgrades |
| `minigames.ts` | ~2.8KB | Mini-game definitions |
| `quizzes.ts` | **58KB** | Country quizzes (3 q's × 7 countries) |
| `shopPrices.ts` | ~1.6KB | Country-specific resource prices |

---

## Testing Strategy

### Test Organization

Tests follow the same structure as source code:
- `__tests__/components/` - Component tests
- `__tests__/logic/` - Game logic tests
- `__tests__/data/` - Data validation tests
- `__tests__/stores/` - State management tests
- `__tests__/integration/` - End-to-end flow tests (phase-based)

### Integration Tests (Phase-based)

```
phase1-navigation.test.tsx    # Screen navigation flow
phase5-crew.test.tsx          # Crew role system
phase6-stations.test.tsx      # Station mechanics
phase7-events.test.tsx        # Event system
phase8-carts.test.tsx         # Cart upgrades
phase9-minigames.test.tsx     # Mini-games
phase10-cargo.test.tsx        # Cargo system
phase11-quiz.test.tsx         # Quiz system
```

### Test Commands

```bash
npm test              # Run all tests once
npm test -- --watch   # Run tests in watch mode
npm test -- --coverage # Show coverage report
```

---

## Key Architectural Patterns

### 1. **Single Zustand Store**
All game state in one store with 100+ actions. No Redux, Context, or other state libraries.

### 2. **Type Safety**
Strong TypeScript with interfaces for all game entities. No `any` types.

### 3. **Pure Functions for Logic**
Game mechanics are pure functions in `src/logic/` that don't mutate state.

### 4. **Emoji-Based Graphics**
Uses emoji characters for all visual representation (captains 🧑, trains 🚂, countries 🇫🇷, etc.)

### 5. **CSS Variables for Theming**
Color system defined in `index.css`:
- `--color-bg-dark`: #1a1a2e
- `--color-gold`: #F7B538
- `--color-text`: #ffffff
- etc.

### 6. **Framer Motion Animations**
Smooth animations for modals, transitions, and game feedback.

### 7. **Activity Tracking**
Sets track which mini-games/quizzes played per country to prevent repeated plays.

---

## Code Quality

### Linting
- ESLint with React rules
- TypeScript strict mode
- Rules configured in `.eslintrc.cjs`

### Build Process
- Vite for fast development and bundling
- TypeScript compilation with `tsc -b`
- Source maps for debugging

### Testing Framework
- Vitest (Jest-compatible)
- React Testing Library for component tests
- Happy DOM for lighter test environment

---

## Performance Considerations

1. **Large Quiz Data**: `quizzes.ts` is 58KB - consider lazy loading if slow
2. **Resource-Heavy Animations**: Framer Motion is used sparingly
3. **Component Memoization**: Could optimize with React.memo for stable props
4. **State Selectors**: Zustand selectors prevent unnecessary re-renders

---

## Known Limitations & Future Improvements

1. **Quiz Data Size**: Should be split by country or lazy-loaded
2. **Event Randomness**: Could add difficulty levels
3. **Leaderboard**: Currently in-memory; could add persistence
4. **Sound**: Howler library imported but not actively used
5. **Mobile Responsive**: CSS is desktop-first

---

## Development Workflow

### Adding a New Feature
1. Add type in `src/types/index.ts`
2. Add data in `src/data/newFeature.ts`
3. Add logic in `src/logic/newFeature.ts`
4. Add store actions in `src/stores/gameStore.ts`
5. Add UI component in `src/components/game/NewFeature.tsx`
6. Add tests in `src/__tests__/*/newFeature.test.ts`

### Running Locally
```bash
npm install         # Install dependencies
npm run dev         # Start dev server (http://localhost:5173)
npm test -- --watch # Run tests in watch mode
npm run build       # Production build
```

---

## Summary

World Tram is a well-structured, type-safe React game with:
- **Single source of truth** (Zustand store)
- **Clear separation of concerns** (data, logic, components)
- **Comprehensive test coverage** (unit + integration tests)
- **Pixel-art styling** with emoji graphics
- **Rich gameplay** with dice rolls, crew roles, events, cargo, quizzes, and mini-games

The codebase is organized for scalability and maintainability, making it easy to add new features or modify game balance.
