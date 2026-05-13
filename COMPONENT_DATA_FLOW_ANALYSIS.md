# World Tram Component Data Flow Analysis

## Overview

The World Tram application uses a centralized state management approach with **Zustand store** (`useGameStore`) as the single source of truth. All components are functional components using React hooks for local state when needed, with props for passing data and callbacks to child components.

---

## Architecture Patterns

### State Management
- **Primary**: Zustand store (`useGameStore`) - centralized game state
- **Local State**: Minimal use of `useState` for UI-only concerns (animations, modal phases, form inputs)
- **Pattern**: Subscribe to store selectors → render with store data → dispatch actions on interaction

### Component Structure
```
App (Router/Screen Selector)
└── Single Screen at a time
    ├── UI Components (non-interactive display)
    ├── Modal Components (interactive overlays)
    └── Game Logic Components (card hand, crew management)
```

---

## Top-Level Navigation

### App.tsx - Screen Router
**Responsibility**: Routes between 6 game screens based on `currentScreen` state

```
App
├── Input: currentScreen from store
├── Output: Renders appropriate screen component
└── Actions: None (screen changes triggered by children)

Screen Map:
- 'intro' → IntroScreen
- 'captainSelect' → CaptainSelectionScreen
- 'trainSelect' → TrainSelectionScreen
- 'dashboard' → DashboardScreen (main game)
- 'victory' → VictoryScreen
- 'gameOver' → GameOverScreen
```

**Data Flow**:
1. Screen selectors dispatch `setScreen()` action
2. App re-renders with new ScreenComponent
3. New screen component receives no props (reads from store directly)

---

## Screen Hierarchy

### IntroScreen (File: `src/components/screens/IntroScreen.tsx`)

**Props**: None
**Store Access**: `setScreen` action only

**Component Tree**:
```
IntroScreen
└── PixelButton (onClick → setScreen('captainSelect'))
    └── Triggers: selectCaptain screen
```

**Data Flow**:
- `onGo` click → `handleStartGame()` → `setScreen('captainSelect')`
- Transitions to captain selection

---

### CaptainSelectionScreen (File: `src/components/screens/CaptainSelectionScreen.tsx`)

**Props**: None
**Store Access**: `goBack()`, `selectCaptain(captain)` actions
**Data Source**: Static `captains` data array

**Component Tree**:
```
CaptainSelectionScreen
├── PixelButton (Back) → goBack()
│   └── Returns to IntroScreen
└── CaptainCard[] × 5
    └── Props:
        - captain: Captain
        - onSelect: () => selectCaptain(captain)
```

**Data Flow**:
- Static captain data mapped to cards
- Card click → `selectCaptain(captain)`
- Action updates store + navigates to trainSelect
- No child state management

---

### TrainSelectionScreen

**Props**: None
**Store Access**: `goBack()`, `selectTrain(train)` actions
**Data Source**: Static `trains` data array

**Component Tree** (Mirror of captain selection):
```
TrainSelectionScreen
├── PixelButton (Back) → goBack()
└── TrainCard[] × 5
    └── onSelect → selectTrain(train)
```

**Data Flow**:
- Train selection triggers `selectTrain()` which:
  1. Updates `selectedTrain` in store
  2. Calls `initializeGame()` to setup game state
  3. Navigates to 'dashboard' screen

---

### DashboardScreen (File: `src/components/screens/DashboardScreen.tsx`) - COMPLEX

**The main game screen** - handles all game mechanics, modal orchestration, and state coordination.

**Store Access** (30+ selectors):
- Game state: resources, crew, currentCountryIndex, turnCount
- Screen state: selectedCaptain, selectedTrain
- Turn mechanics: executeTurn, lastTurnResult, clearTurnResult
- Events: currentEvent, cardHand, selectedCards, selectCard, resolveCurrentEvent
- Modals: currentMiniGame, currentQuiz, currentCargoDiscovery, etc.
- Shop: shopCart, ownedCarts, purchaseCart, purchaseResources
- Cargo: carriedCargo, pendingCargoOpen, openCargoAtStation
- Activity tracking: playedMiniGames, takenQuizzes

**Local State** (8 useState hooks):
```typescript
showStationModal: boolean           // Station arrival UI
showCartShop: boolean               // Shop overlay
eventResult: EventResult            // Event roll result
isRolling: boolean                  // Dice animation
diceValue: number                   // Final dice roll
isTurnRolling: boolean              // Turn dice animation
showCargoDiscovery: boolean         // Cargo modal
discoveredCargo: CargoItem          // Current cargo item
currentCargoReward: CargoReward     // Cargo reward state
showQuizModal: boolean              // Quiz overlay
isTurnRolling: boolean              // Turn rolling overlay
turnDiceDisplayed: number           // Animated dice value
showFinalRoll: boolean              // Show final roll state
```

#### DashboardScreen Component Tree

```
DashboardScreen
├── Selection Header
│   ├── CaptainStats (from selectedCaptain)
│   └── TrainStats (from selectedTrain)
│
├── Resource Zone
│   └── ResourceBar
│       ├── ResourceMeter (4×)
│       └── Turn Counter
│
├── Journey Zone
│   ├── LocationIndicator (current country)
│   ├── JourneyTrack (route visualization)
│
├── Bottom Zone
│   ├── CrewPanel
│   │   └── CrewMember[] (with click to cycle role)
│   ├── CargoInventory (visual only)
│   └── GoButton (main interaction)
│
├── Turn Dice Animation (overlay when rolling)
│   └── Animated dice display (1-6)
│
├── Event Modal (if currentEvent)
│   ├── CardHand
│   │   └── CardDisplay[]
│   ├── Dice Roll display
│   └── Event result display
│
├── Cargo Discovery Modal (if cargoDiscovered)
│   └── Cargo item info
│
├── Cargo Open Modal (if pendingCargoOpen)
│   └── Cargo reward display
│
├── Station Modal (if at station)
│   ├── Station rewards display
│   ├── Buttons:
│   │   ├── Continue
│   │   ├── Visit Shop (unless final destination)
│   │   ├── Play Mini-game
│   │   ├── Take Quiz
│   │   └── Finish (at final destination)
│
├── Mini-Game Modal (if currentMiniGame)
│   ├── Game component (Catcher/Timing/Memory)
│   └── Results screen
│
├── Quiz Modal (if currentQuiz)
│   ├── QuizQuestion
│   ├── Answer buttons
│   └── Results screen
│
├── Station Shop Modal (if showCartShop)
│   ├── Cart purchase section
│   └── Resource purchase section
│
└── Turn Result Display (if lastTurnResult exists)
    └── Turn summary
```

#### DashboardScreen Data Flow

**Turn Execution Flow**:
1. User clicks `GoButton` → `handleGoClick()`
2. Sets `isTurnRolling = true` + starts dice animation
3. After 800ms delay: `executeTurn()` action
   - Calls `processTurn()` logic function
   - Updates: resources, currentCountryIndex, progressInCountry, turnCount, lastTurnResult
4. After 1000ms show final roll: `isTurnRolling = false`

**Event Handling Flow** (if event triggered):
```
lastTurnResult.eventTriggered → useEffect detects
  ↓
setCurrentEvent(lastTurnResult.event)
  ↓
EventModal renders with:
  - cardHand from store
  - selectedCards from store
  - selectCard handler
  - onRoll → handleEventRoll()

handleEventRoll():
  - setIsRolling(true)
  - rollDice(1,6)
  - resolveEvent() with captain/crew/cards
  - setEventResult(result)
  - setIsRolling(false)

EventModal shows result
  ↓
User clicks Continue → handleEventContinue()
  - resolveCurrentEvent(eventResult)
  - Clears event + removes played cards + replenishes hand
  - setCurrentEvent(null)
  - Shows station modal if applicable
```

**Station Arrival Flow**:
```
lastTurnResult.stationReward + !currentEvent + !showCargoDiscovery
  ↓
setShowStationModal(true)
  ↓
StationModal renders with onVisitShop/onPlayMiniGame/onTakeQuiz handlers
```

**Mini-Game Flow**:
```
handlePlayMiniGame()
  ↓
startMiniGame(countryId) [store action]
  ↓
MiniGameModal renders currentMiniGame
  ↓
Game completion → handleMiniGameComplete(score, maxScore)
  ↓
completeMiniGame() [store action]
  - Calculates reward
  - Applies to resources
  - Tracks played game
  - setShowStationModal(true)
```

**Quiz Flow**:
```
handleTakeQuiz()
  ↓
startQuiz(countryId) [store action]
  ↓
QuizModal renders with questions
  ↓
User answers → handleQuizComplete()
  ↓
completeQuiz() [store action]
  - Applies reward
  - Tracks taken quiz
  - setShowQuizModal(false)
  - setShowStationModal(true)
```

**Shop Flow**:
```
handleVisitShop()
  ↓
clearShopCart() [store action]
setShowStationModal(false)
setShowCartShop(true)
  ↓
StationShop renders with:
  - onPurchaseCart → handlePurchaseCart()
  - onPurchaseResources → handlePurchaseResources()
  - onClose → handleCloseCartShop()

handleCloseCartShop():
  - clearShopCart()
  - setShowCartShop(false)
  - setShowStationModal(true) [return to station]
```

**Cargo Discovery Flow**:
```
lastTurnResult.cargoDiscovered
  ↓
useEffect detects + setDiscoveredCargo() + setShowCargoDiscovery(true)
  ↓
CargoDiscoveryModal renders
  ↓
handleCargoDiscoveryContinue()
  - addCargo() [store action]
  - setShowCargoDiscovery(false)
  ↓
useEffect checks for station/cargo open next
```

---

## Non-Dashboard Screens

### VictoryScreen
**Props**: None
**Store Access**: None (display only)
**Behavior**: Shows final score and leaderboard
**Modal**: LeaderboardNameInput for name entry

### GameOverScreen
**Props**: None
**Store Access**: gameOverReason (for failure message)
**Behavior**: Shows game over reason
**Buttons**: None (end screen)

---

## Child Component Types

### Display Components (No Interactivity)

| Component | Props | Parent | Data Source |
|-----------|-------|--------|-------------|
| ResourceMeter | icon, label, current, max, color, previewDelta | ResourceBar | Props |
| CaptainStats | stats, compact | CaptainSelectionScreen, DashboardScreen | Props |
| TrainStats | stats, compact | TrainSelectionScreen, DashboardScreen | Props |
| LocationIndicator | (none) | DashboardScreen | useGameStore |
| JourneyTrack | (none) | DashboardScreen | useGameStore |
| CargoInventory | carriedCargo | DashboardScreen | Props |
| CountryMarker | country, isActive, progress | JourneyTrack | Props |
| TurnResultDisplay | result, onDismiss | DashboardScreen | Props |
| Leaderboard | (none) | VictoryScreen | Internal state |

### Interactive Components (With Callbacks)

| Component | Props | Callbacks | Parent |
|-----------|-------|-----------|--------|
| CardDisplay | card, selected, onSelect | onSelect | CardHand |
| CardHand | cards, selectedCardIds, onSelectCard | onSelectCard | EventModal |
| CrewMember | member | onRoleClick (optional) | CrewPanel |
| PixelButton | onClick, variant, size, glow, disabled | onClick | Various |
| CaptainCard | captain, onSelect | onSelect | CaptainSelectionScreen |
| TrainCard | train, onSelect | onSelect | TrainSelectionScreen |

### Modal Components (Complex State Orchestration)

| Component | Props | Store Usage | Local State | Parent |
|-----------|-------|------------|-------------|--------|
| EventModal | event, cardHand, selectedCardIds, onSelectCard, onRoll, result, onContinue, isRolling, diceValue, captainStats, crew | None | displayedDice | DashboardScreen |
| StationModal | country, reward, onContinue, onVisitShop, onPlayMiniGame, onTakeQuiz, miniGamePlayed, quizTaken, isAtFinalDestination, onFinish | None | None | DashboardScreen |
| MiniGameModal | miniGame, onComplete, onSkip | None | modalState, finalScore, finalMaxScore | DashboardScreen |
| QuizModal | quiz, onComplete, onSkip | None | phase, currentQuestionIndex, answers, currentSelectedAnswer | DashboardScreen |
| StationShop | money, ownedCarts, prices, shopCart, maxResources, currentResources, countryTheme, onPurchaseCart, onUpdateShopCart, onPurchaseResources, onClose | None | None | DashboardScreen |
| CargoDiscoveryModal | cargoItem, onContinue | None | None | DashboardScreen |
| CargoOpenModal | cargoItem, reward, onContinue | None | None | DashboardScreen |

### Mini-Game Components

| Component | Props | Local State | Parent |
|-----------|-------|------------|--------|
| CatcherGame | miniGame, onComplete, onSkip | gameState, score, isActive | MiniGameModal |
| TimingGame | miniGame, onComplete, onSkip | gameState, score, isActive | MiniGameModal |
| MemoryGame | miniGame, onComplete, onSkip | gameState, score, revealed | MiniGameModal |

---

## Data Flow Patterns

### Pattern 1: Store Selector → Component Prop

Used for **read-only display data**:
```typescript
// In parent component
const crew = useGameStore((state) => state.crew)
// Pass to child
<CrewPanel crew={crew} />
// Or inline (preferred for simple cases)
<CargoInventory carriedCargo={carriedCargo} />
```

### Pattern 2: Direct Store Action in Handler

Used for **state mutations**:
```typescript
// In component handler
const selectCard = useGameStore((state) => state.selectCard)
const handleCardClick = (cardId) => {
  selectCard(cardId)  // Directly calls store action
}
```

### Pattern 3: Callback Prop to Parent Action

Used for **event bubbling from child**:
```typescript
// In child
interface CardDisplayProps {
  card: BonusCard
  selected: boolean
  onSelect: (cardId: string) => void  // Callback prop
}

export function CardDisplay({ card, selected, onSelect }: CardDisplayProps) {
  return <button onClick={() => onSelect(card.id)} />
}

// In parent
<CardDisplay
  card={card}
  onSelect={(cardId) => selectCard(cardId)}  // Pass action as callback
/>
```

### Pattern 4: Local State for UI Animation

Used for **transient UI state**:
```typescript
// In component
const [isRolling, setIsRolling] = useState(false)
const [diceValue, setDiceValue] = useState<number | undefined>()

const handleGoClick = () => {
  setIsRolling(true)              // Start animation
  setTimeout(() => {
    executeTurn()                 // Dispatch action
    setIsRolling(false)           // End animation
  }, 800)
}
```

---

## Store Structure

### State Categories

**Identification**:
- `currentScreen: GameScreen` - Current UI screen
- `selectedCaptain: Captain | null` - Selected captain
- `selectedTrain: Train | null` - Selected train

**Game Progress**:
- `resources: Resources` - Food, fuel, water, money
- `crew: CrewMember[]` - Crew members with roles
- `currentCountryIndex: number` - Location (0-9)
- `progressInCountry: number` - Progress toward next country
- `turnCount: number` - Current turn

**Turn Results**:
- `lastTurnResult: TurnResult | null` - Result of last executed turn
- `gameOverReason: GameOverReason | null` - Failure reason if game ended

**Events**:
- `currentEvent: GameEvent | null` - Active event during turn
- `cardHand: BonusCard[]` - Cards player can use
- `selectedCards: string[]` - Selected card IDs for event

**Shopping**:
- `ownedCarts: Cart[]` - Purchased carts
- `shopCart: ResourceCart` - Items in purchase cart

**Activities**:
- `currentMiniGame: MiniGame | null` - Active mini-game
- `lastMiniGameResult: MiniGameResult | null` - Last game result
- `currentQuiz: CountryQuiz | null` - Active quiz
- `quizAnswers: Map<string, string>` - Quiz responses
- `currentQuestionIndex: number` - Current question
- `lastQuizResult: QuizResult | null` - Quiz result

**Cargo**:
- `carriedCargo: CargoDiscovery[]` - Cargo in inventory
- `pendingCargoOpen: CargoItem | null` - Cargo being opened

**Tracking**:
- `playedMiniGames: Set<string>` - Country IDs where mini-game played
- `takenQuizzes: Set<string>` - Country IDs where quiz taken

### Key Actions

**Navigation**:
- `setScreen(screen: GameScreen)` - Change screen
- `goBack()` - Go to previous screen in history

**Setup**:
- `selectCaptain(captain: Captain)` - Select captain
- `selectTrain(train: Train)` - Select train + initialize game
- `initializeGame()` - Reset game state

**Turn Loop**:
- `executeTurn()` - Run turn logic, update resources/position
- `triggerVictory()` - Trigger victory condition
- `clearTurnResult()` - Clear last turn result

**Events**:
- `setCurrentEvent(event: GameEvent | null)` - Set active event
- `selectCard(cardId: string)` - Toggle card selection
- `resolveCurrentEvent(eventResult?: EventResult)` - End event, update hand

**Crew**:
- `cycleCrewRole(crewMemberId: string)` - Cycle crew member role

**Carts**:
- `purchaseCart(cartId: string)` - Buy cart

**Mini-Games**:
- `startMiniGame(countryId: string)` - Load mini-game
- `completeMiniGame(score: number, maxScore: number)` - Apply reward
- `skipMiniGame()` - Skip mini-game

**Quizzes**:
- `startQuiz(countryId: string)` - Load quiz
- `answerQuestion(questionId: string, answer: string)` - Answer question
- `nextQuestion()` - Go to next question
- `completeQuiz()` - Apply reward
- `skipQuiz()` - Skip quiz

**Cargo**:
- `addCargo(item: CargoItem, countryId: string, turn: number)` - Add cargo
- `openCargoAtStation()` - Open next cargo
- `clearPendingCargo()` - Clear pending cargo

**Shop**:
- `updateShopCart(resource: string, amount: number)` - Modify cart
- `purchaseResources(prices: ResourcePrices)` - Buy resources
- `clearShopCart()` - Empty cart

---

## Key Architectural Insights

### 1. Modal Orchestration in DashboardScreen
DashboardScreen uses multiple `useEffect` hooks to orchestrate modal display order:
```
Event Modal (highest priority)
  ↓ (if event resolves)
Cargo Discovery Modal
  ↓ (if cargo found)
Cargo Open Modal
  ↓ (if cargo to open)
Station Modal (lowest priority)
  ↓
Turn Result Display
```

This is managed through boolean flags and conditional rendering with proper dependency tracking.

### 2. Local vs Store State
- **Store**: All game-consequential state (resources, position, events)
- **Local**: UI-only state (animations, modal phases, form inputs)

This keeps the save/load logic simple (only store matters) while allowing rich animations.

### 3. Callback Props Pattern
Components receive store actions as callback props rather than calling store directly. This enables:
- Easier testing (can mock callbacks)
- Better separation of concerns
- Clearer data flow (unidirectional)

### 4. Zustand Selectors
DashboardScreen uses 30+ selectors to subscribe to specific parts of state. This ensures:
- Components only re-render when their data changes
- Performance optimization through granular subscriptions
- Clear dependencies for `useEffect` hooks

### 5. Event Result Resolution
When events are resolved:
1. Failed events deduct resources (with security crew discount)
2. Played cards are removed from hand
3. Hand is replenished back to 3 cards
4. Progress can be delayed by event penalties

---

## Testing Considerations

### What's Tested by Integration Tests
- Component rendering with store data
- Event handlers dispatching actions
- Modal orchestration sequences
- Store state mutations
- Navigation between screens

### What's Hard to Test
- Animation timing (often mocked or skipped)
- Complex modal ordering logic (prone to bugs)
- Race conditions between async actions

### Potential Issues Found
1. **Modal Orchestration Complexity**: DashboardScreen has 9+ boolean flags for modal state. Easy to reach unreachable states.
2. **useEffect Dependencies**: Multiple effects coordinate modal show/hide. Missing dependencies could cause stale closures.
3. **Animation State Leakage**: Local animation state can get out of sync with actual game state.

---

## Component Connection Summary Table

| Parent Component | Child Components | Data Passed | Callbacks Received |
|------------------|------------------|-------------|-------------------|
| App | IntroScreen, CaptainSelectionScreen, TrainSelectionScreen, DashboardScreen, VictoryScreen, GameOverScreen | None | None |
| IntroScreen | PixelButton | onClick | setScreen('captainSelect') |
| CaptainSelectionScreen | CaptainCard[] | captain, onSelect | selectCaptain(captain) |
| TrainSelectionScreen | TrainCard[] | train, onSelect | selectTrain(train) |
| DashboardScreen | ResourceBar, CrewPanel, CargoInventory, GoButton, LocationIndicator, JourneyTrack, EventModal, StationModal, MiniGameModal, QuizModal, StationShop, CargoDiscoveryModal, CargoOpenModal, TurnResultDisplay | Multiple store props | Multiple handlers |
| ResourceBar | ResourceMeter × 4 | icon, label, current, max, color, previewDelta | None |
| CrewPanel | CrewMember[] | member | (internal action) |
| CrewMember | (none) | member | (internal action) |
| CardHand | CardDisplay[] | card, selected, onSelect | selectCard(cardId) |
| EventModal | CardHand | cards, selectedCardIds, onSelectCard | onRoll, onContinue |
| StationModal | (none) | country, reward, onContinue, onVisitShop, onPlayMiniGame, onTakeQuiz, etc. | Multiple event handlers |
| MiniGameModal | CatcherGame/TimingGame/MemoryGame | miniGame, onComplete, onSkip | onComplete(score), onSkip() |
| QuizModal | QuizQuestion | quiz, onComplete, onSkip | onComplete(), onSkip() |
| StationShop | (custom list components) | prices, ownedCarts, shopCart, etc. | onPurchaseCart, onUpdateShopCart, onPurchaseResources, onClose |
| JourneyTrack | CountryMarker[] | country, isActive, progress | None |

---

## Summary

The World Tram architecture is well-structured with:
- **Single source of truth**: Zustand store
- **Clear data flow**: Props down, actions up
- **Proper separation**: Display vs interactive vs modal components
- **Organized modals**: Sequential orchestration in DashboardScreen

Main complexity is in **DashboardScreen's modal coordination** which uses multiple local state flags and useEffect hooks to manage a complex state machine. This is the highest-risk area for bugs related to modal visibility and sequencing.
