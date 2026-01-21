# World Tram - Project Tasks

> **Status Legend:**
> - `[ ]` Available - Ready to be picked up
> - `[o]` In Progress - Agent currently working
> - `[x]` Done - Complete with passing tests
> - `[!]` Blocked - Has issues needing resolution

> **CRITICAL:** Before spawning a subagent, mark task `[o]`. After completion, mark `[x]` only if all tests pass.

---

# Phase 1: Clickable Prototype

> **Goal:** Navigate through all screens with placeholder content.
> **Testable Outcome:** Click START → see captain cards → click one → see train cards → click one → see dashboard → click GO → reach victory/game over screens.
> **No game logic yet - just navigation and UI shells.**

---

## 1.1 Project Setup (ALL PARALLEL - no dependencies between tasks)

### 1.1.1 Testing Infrastructure
- [x] Configure Vitest with React Testing Library
  - Files to create:
    - `vitest.config.ts`
    - `src/setupTests.ts`
  - Acceptance: `npm test` runs successfully
  - Depends: none
  - **Parallel: yes**

### 1.1.2 TypeScript Types
- [x] Create core type definitions
  - File: `src/types/index.ts`
  - Types:
    - `GameScreen` enum: intro, captainSelect, trainSelect, dashboard, victory, gameOver
    - `Captain` (id, name, origin, description, stats)
    - `Train` (id, name, origin, character, stats)
    - `CrewRole` enum: engineer, cook, security, free
    - `CrewMember` (id, name, role)
    - `Resources` (food, fuel, water, money)
  - Depends: none
  - **Parallel: yes**

### 1.1.3 Global Styles
- [x] Set up CSS variables and pixel art theme
  - File: `src/index.css`
  - Include:
    - Color palette from PRD
    - `.pixel-art { image-rendering: pixelated; }`
    - Base reset and typography
  - Depends: none
  - **Parallel: yes**

---

## 1.2 Navigation State

### 1.2.1 Game Store with Navigation
- [x] Create Zustand store with navigation state (skipping separate navigationStore)
  - File: `src/stores/gameStore.ts`
  - Tests: `src/__tests__/stores/gameStore.test.ts`
  - State: `currentScreen: GameScreen`
  - Actions: `setScreen(screen)`, `goBack()`
  - Note: This store will be extended in later phases to add game state
  - Depends: 1.1.2

### 1.2.2 App Router
- [x] Wire App.tsx to render screens based on game store navigation state
  - File: `src/App.tsx`
  - Tests: `src/__tests__/App.test.tsx`
  - Renders correct screen component based on currentScreen
  - Depends: 1.2.1

---

## 1.3 Screen Shells (Placeholder Content)

### 1.3.1 PixelButton Component
- [x] Create reusable button component
  - File: `src/components/common/PixelButton.tsx`
  - Tests: `src/__tests__/components/PixelButton.test.tsx`
  - Props: children, onClick, variant, disabled
  - Depends: 1.1.3

### 1.3.2-1.3.7 Screen Components (ALL PARALLEL after PixelButton + Store)

### 1.3.2 IntroScreen
- [x] Create intro screen with navigation
  - File: `src/components/screens/IntroScreen.tsx`
  - Tests: `src/__tests__/components/IntroScreen.test.tsx`
  - Elements: Title "WORLD TRAM", subtitle, START button
  - START → navigates to captainSelect
  - Depends: 1.3.1, 1.2.1
  - **Parallel: yes (with 1.3.3-1.3.7)**

### 1.3.3 CaptainSelection Shell
- [x] Create captain selection with placeholder cards
  - File: `src/components/screens/CaptainSelection.tsx`
  - Tests: `src/__tests__/components/CaptainSelection.test.tsx`
  - Elements: Header, 3 placeholder cards (just names), back button
  - Click card → navigates to trainSelect
  - Back → navigates to intro
  - Depends: 1.3.1, 1.2.1
  - **Parallel: yes (with 1.3.2, 1.3.4-1.3.7)**

### 1.3.4 TrainSelection Shell
- [x] Create train selection with placeholder cards
  - File: `src/components/screens/TrainSelection.tsx`
  - Tests: `src/__tests__/components/TrainSelection.test.tsx`
  - Elements: Header, 3 placeholder cards (just names), back button
  - Click card → navigates to dashboard
  - Back → navigates to captainSelect
  - Depends: 1.3.1, 1.2.1
  - **Parallel: yes (with 1.3.2-1.3.3, 1.3.5-1.3.7)**

### 1.3.5 Dashboard Shell
- [x] Create dashboard layout with placeholder zones
  - File: `src/components/screens/Dashboard.tsx`
  - Tests: `src/__tests__/components/Dashboard.test.tsx`
  - Layout: Top (resource placeholder), Center (journey placeholder), Bottom (GO button)
  - GO button → navigates to victory (for now)
  - Depends: 1.3.1, 1.2.1
  - **Parallel: yes (with 1.3.2-1.3.4, 1.3.6-1.3.7)**

### 1.3.6 VictoryScreen
- [x] Create victory screen
  - File: `src/components/screens/VictoryScreen.tsx`
  - Tests: `src/__tests__/components/VictoryScreen.test.tsx`
  - Elements: "VICTORY!" header, placeholder turn count, NEW GAME button
  - NEW GAME → navigates to captainSelect
  - Depends: 1.3.1, 1.2.1
  - **Parallel: yes (with 1.3.2-1.3.5, 1.3.7)**

### 1.3.7 GameOverScreen
- [x] Create game over screen
  - File: `src/components/screens/GameOverScreen.tsx`
  - Tests: `src/__tests__/components/GameOverScreen.test.tsx`
  - Elements: "GAME OVER" header, placeholder reason, TRY AGAIN button
  - TRY AGAIN → navigates to captainSelect
  - Depends: 1.3.1, 1.2.1
  - **Parallel: yes (with 1.3.2-1.3.6)**

---

## 1.4 Phase 1 Verification

### 1.4.1 Integration Test
- [x] Test complete navigation flow
  - File: `src/__tests__/integration/phase1-navigation.test.tsx`
  - Test: intro → captainSelect → trainSelect → dashboard → victory
  - Test: back buttons work correctly
  - Depends: all 1.3.x tasks

### 1.4.2 Manual Smoke Test
- [x] Verify clickable prototype works
  - Run: `npm run dev`
  - Test: Click through entire flow
  - Test: Back buttons navigate correctly
  - Depends: 1.4.1

---

# Phase 2: Real Selection Screens

> **Goal:** Captain and train selection with real data and stats display.
> **Testable Outcome:** See 3 captains with portraits, names, origins, descriptions, and stat bars. Select one. See 3 trains with same detail. Selection is stored and persists to dashboard.
> **Builds on Phase 1:** Replaces placeholder cards with real data.

---

## 2.1 Static Data (ALL PARALLEL - only depend on types)

### 2.1.1 Captain Data
- [x] Create captain definitions
  - File: `src/data/captains.ts`
  - Tests: `src/__tests__/data/captains.test.ts`
  - Data:
    - Renji (Japan): Engineering 5, Food 2, Security 3
    - Luca (Italy): Engineering 2, Food 5, Security 3
    - Cooper (USA): Engineering 3, Food 2, Security 5
  - Export: `captains: Captain[]`, `getCaptainById(id): Captain`
  - Depends: 1.1.2
  - **Parallel: yes (with 2.1.2, 2.1.3)**

### 2.1.2 Train Data
- [x] Create train definitions
  - File: `src/data/trains.ts`
  - Tests: `src/__tests__/data/trains.test.ts`
  - Data:
    - Blitzzug (Germany): Speed 3, Reliability 5, Power 3
    - Kitsune (Japan): Speed 5, Reliability 3, Power 3
    - Ironhorse (USA): Speed 3, Reliability 3, Power 5
  - Export: `trains: Train[]`, `getTrainById(id): Train`
  - Depends: 1.1.2
  - **Parallel: yes (with 2.1.1, 2.1.3)**

### 2.1.3 Country Data
- [x] Create country route definitions
  - File: `src/data/countries.ts`
  - Tests: `src/__tests__/data/countries.test.ts`
  - Data (10 countries):
    - France 🗼, Germany 🏰, Russia 🏛️, China 🏯, Japan 🗻
    - Singapore 🌴, Australia 🦘, Brazil 🎭, Canada 🍁, USA 🗽
  - Each: id, name, icon, landmark, distanceRequired (10)
  - Depends: 1.1.2
  - **Parallel: yes (with 2.1.1, 2.1.2)**

---

## 2.2 Selection State

### 2.2.1 Selection Store
- [x] Extend gameStore with selection state
  - File: `src/stores/gameStore.ts` (extend existing)
  - Tests: `src/__tests__/stores/gameStore.test.ts` (extend)
  - Add state: selectedCaptain, selectedTrain
  - Add actions: selectCaptain(captain), selectTrain(train), resetSelection()
  - Depends: 1.2.1, 2.1.1, 2.1.2

---

## 2.3 Selection UI Components

### 2.3.1 StatBar Component
- [x] Create stat display bar
  - File: `src/components/common/StatBar.tsx`
  - Tests: `src/__tests__/components/StatBar.test.tsx`
  - Props: label, value (1-6), maxValue (6), color
  - Display: ████░░ style blocks
  - Depends: 1.1.3

### 2.3.2 CaptainCard Component
- [x] Create captain card with full details
  - File: `src/components/game/CaptainCard.tsx`
  - Tests: `src/__tests__/components/CaptainCard.test.tsx`
  - Props: captain, selected, onSelect
  - Shows: Portrait placeholder, name, origin, description, 3 StatBars
  - Depends: 2.3.1, 2.1.1

### 2.3.3 TrainCard Component
- [x] Create train card with full details
  - File: `src/components/game/TrainCard.tsx`
  - Tests: `src/__tests__/components/TrainCard.test.tsx`
  - Props: train, selected, onSelect
  - Shows: Sprite placeholder, name, origin, character text, 3 StatBars
  - Depends: 2.3.1, 2.1.2

---

## 2.4 Upgrade Selection Screens

### 2.4.1 CaptainSelection with Real Data
- [x] Update CaptainSelection to use real captains
  - File: `src/components/screens/CaptainSelection.tsx` (update)
  - Tests: `src/__tests__/components/CaptainSelection.test.tsx` (update)
  - Shows: 3 CaptainCards from data
  - On select: stores captain in gameStore, navigates to trainSelect
  - Depends: 2.3.2, 2.2.1

### 2.4.2 TrainSelection with Real Data
- [x] Update TrainSelection to use real trains
  - File: `src/components/screens/TrainSelection.tsx` (update)
  - Tests: `src/__tests__/components/TrainSelection.test.tsx` (update)
  - Shows: 3 TrainCards from data
  - On select: stores train in gameStore, navigates to dashboard
  - Depends: 2.3.3, 2.2.1

### 2.4.3 Dashboard Shows Selection
- [x] Update Dashboard to display selected captain/train names
  - File: `src/components/screens/Dashboard.tsx` (update)
  - Tests: `src/__tests__/components/Dashboard.test.tsx` (update)
  - Shows: "Captain: [name]" and "Train: [name]" in header area
  - Depends: 2.2.1

---

## 2.5 Phase 2 Verification

### 2.5.1 Integration Test
- [x] Test selection flow with real data
  - File: `src/__tests__/integration/phase2-selection.test.tsx`
  - Test: Select captain → verify stored → select train → verify stored
  - Test: Dashboard displays selected captain and train
  - Depends: all 2.4.x tasks

### 2.5.2 Manual Smoke Test
- [x] Verify selection screens work
  - Run: `npm run dev`
  - Test: See all 3 captains with stats
  - Test: Select captain, see all 3 trains with stats
  - Test: Select train, see names on dashboard
  - Depends: 2.5.1

---

# Phase 3: Dashboard Display

> **Goal:** Full dashboard UI showing resources, journey track, and crew.
> **Testable Outcome:** See resource meters (food, fuel, water, money), journey track with all 10 countries, crew panel with 4 members. All display static initial values.
> **Builds on Phase 2:** Dashboard now has real content instead of placeholders.

---

## 3.1 Game Constants & Initial State

### 3.1.1 Game Constants
- [x] Create game balance constants
  - File: `src/data/constants.ts`
  - Tests: `src/__tests__/data/constants.test.ts`
  - Starting resources: food=50, fuel=100, water=50, money=200
  - Max resources: food=100, fuel=200, water=100, money=1000
  - Depends: none

### 3.1.2 Crew Data
- [x] Create starting crew definitions
  - File: `src/data/crew.ts`
  - Tests: `src/__tests__/data/crew.test.ts`
  - Starting crew: Tom (Engineer), Maria (Cook), Jack (Security), Sam (Free)
  - Depends: 1.1.2

### 3.1.3 Game State Extension
- [x] Extend gameStore with game state
  - File: `src/stores/gameStore.ts` (extend)
  - Tests: `src/__tests__/stores/gameStore.test.ts` (extend)
  - Add state: resources, crew, currentCountryIndex, progressInCountry, turnCount
  - Add action: initializeGame() - sets initial values when train selected
  - Depends: 3.1.1, 3.1.2, 2.2.1

---

## 3.2 Resource Display Components

### 3.2.1 ResourceMeter Component
- [x] Create resource meter display
  - File: `src/components/common/ResourceMeter.tsx`
  - Tests: `src/__tests__/components/ResourceMeter.test.tsx`
  - Props: icon, label, current, max, color
  - Shows: Icon, progress bar, "current/max" text
  - Depends: 1.1.3

### 3.2.2 ResourceBar Component
- [x] Create top resource bar with all meters
  - File: `src/components/game/ResourceBar.tsx`
  - Tests: `src/__tests__/components/ResourceBar.test.tsx`
  - Shows: 4 ResourceMeters + Turn counter
  - Icons: 🍞 Food, ⛽ Fuel, 💧 Water, 💰 Money
  - Depends: 3.2.1

---

## 3.3 Journey Display Components

### 3.3.1 CountryMarker Component
- [x] Create individual country marker
  - File: `src/components/game/CountryMarker.tsx`
  - Tests: `src/__tests__/components/CountryMarker.test.tsx`
  - Props: country, status (visited/current/upcoming)
  - Shows: Icon, name, checkmark if visited, highlight if current
  - Depends: 2.1.3

### 3.3.2 JourneyTrack Component
- [x] Create journey visualization
  - File: `src/components/game/JourneyTrack.tsx`
  - Tests: `src/__tests__/components/JourneyTrack.test.tsx`
  - Shows: Horizontal track with 10 CountryMarkers
  - Shows: Train position indicator at current country
  - Props: countries, currentIndex, progress
  - Depends: 3.3.1

---

## 3.4 Crew Display Components

### 3.4.1 CrewMember Component
- [x] Create individual crew member display
  - File: `src/components/game/CrewMember.tsx`
  - Tests: `src/__tests__/components/CrewMember.test.tsx`
  - Props: member, onRoleClick (disabled for now)
  - Shows: Avatar placeholder, name, role icon (👨‍🔧👩‍🍳🔫👤)
  - Depends: 1.1.3

### 3.4.2 CrewPanel Component
- [x] Create crew display panel
  - File: `src/components/game/CrewPanel.tsx`
  - Tests: `src/__tests__/components/CrewPanel.test.tsx`
  - Shows: Row of 4 CrewMember components
  - Depends: 3.4.1

---

## 3.5 Assemble Dashboard

### 3.5.1 Dashboard with Real Components
- [x] Update Dashboard to use all real components
  - File: `src/components/screens/Dashboard.tsx` (update)
  - Tests: `src/__tests__/components/Dashboard.test.tsx` (update)
  - Layout:
    - Top: ResourceBar
    - Center: JourneyTrack
    - Bottom: CrewPanel + GO button
  - Connects to gameStore for all data
  - Depends: 3.2.2, 3.3.2, 3.4.2, 3.1.3

---

## 3.6 Phase 3 Verification

### 3.6.1 Integration Test
- [x] Test dashboard displays all data correctly
  - File: `src/__tests__/integration/phase3-dashboard.test.tsx`
  - Test: Resources show correct initial values
  - Test: All 10 countries displayed, France marked current
  - Test: All 4 crew members displayed with correct roles
  - Depends: 3.5.1

### 3.6.2 Manual Smoke Test
- [x] Verify dashboard displays correctly
  - Run: `npm run dev`
  - Test: Complete selection flow
  - Test: See all resources with correct starting values
  - Test: See journey track with France highlighted
  - Test: See all 4 crew members with role icons
  - Depends: 3.6.1

---

# Phase 4: Working Game Loop

> **Goal:** Clicking GO executes a real turn with resource changes and movement.
> **Testable Outcome:** Click GO → see dice result → resources decrease → train moves on track. After multiple turns, either reach USA (victory) or run out of resources (game over).
> **Builds on Phase 3:** GO button now does something real.

---

## 4.1 Core Game Logic

### 4.1.1 Dice Rolling
- [x] Implement dice roll logic
  - File: `src/logic/dice.ts`
  - Tests: `src/__tests__/logic/dice.test.ts`
  - Functions:
    - `rollDice(min, max): number`
    - `rollMovement(): number` (0-10)
  - Tests: Range boundaries, multiple calls return different values
  - Depends: none

### 4.1.2 Movement Logic
- [x] Implement movement calculation
  - File: `src/logic/movement.ts`
  - Tests: `src/__tests__/logic/movement.test.ts`
  - Functions:
    - `calculateMovement(diceRoll, trainSpeed): number`
    - `advanceProgress(progress, movement, countryDistance): { newProgress, arrivedAtNextCountry, newCountryIndex }`
  - Depends: 4.1.1

### 4.1.3 Resource Consumption Logic
- [x] Implement resource consumption per turn
  - File: `src/logic/resources.ts`
  - Tests: `src/__tests__/logic/resources.test.ts`
  - Functions:
    - `calculateFuelConsumption(distance, trainPower): number`
    - `calculateFoodConsumption(crewCount): number`
    - `calculateWaterConsumption(crewCount): number`
    - `calculateWages(crew): number`
  - Rules from PRD: base consumption + modifiers
  - Depends: 1.1.2

### 4.1.4 Resource Production Logic
- [x] Implement resource production per turn
  - File: `src/logic/resources.ts` (extend)
  - Tests: `src/__tests__/logic/resources.test.ts` (extend)
  - Functions:
    - `calculateFoodProduction(crew, captainFoodStat): number`
    - `getCrewCountByRole(crew, role): number`
  - Cook production = base + captain bonus
  - Depends: 4.1.3

### 4.1.5 Win/Lose Conditions
- [x] Implement game end checks
  - File: `src/logic/conditions.ts`
  - Tests: `src/__tests__/logic/conditions.test.ts`
  - Functions:
    - `checkVictory(countryIndex, totalCountries): boolean`
    - `checkGameOver(resources): { isGameOver, reason }`
  - Reasons: "starvation", "out_of_fuel", "dehydration", "broke"
  - Depends: 1.1.2

### 4.1.6 Turn Processor
- [x] Implement complete turn execution
  - File: `src/logic/turn.ts`
  - Tests: `src/__tests__/logic/turn.test.ts`
  - Function: `processTurn(state): TurnResult`
  - TurnResult: { diceRoll, movement, resourceChanges, newResources, newCountryIndex, newProgress, gameStatus }
  - Steps: roll → calculate movement → consume → produce → check end
  - Depends: 4.1.1, 4.1.2, 4.1.3, 4.1.4, 4.1.5

---

## 4.2 Game Store Turn Integration

### 4.2.1 Execute Turn Action
- [x] Add executeTurn action to store
  - File: `src/stores/gameStore.ts` (extend)
  - Tests: `src/__tests__/stores/gameStore.test.ts` (extend)
  - Action: `executeTurn()` - calls processTurn, updates state
  - Stores: lastTurnResult for display
  - Depends: 4.1.6, 3.1.3

### 4.2.2 Game End Navigation
- [x] Add automatic navigation on game end
  - File: `src/stores/gameStore.ts` (extend)
  - Tests: `src/__tests__/stores/gameStore.test.ts` (extend)
  - After executeTurn: if victory → go to victory screen, if gameOver → go to gameOver screen
  - Store: gameOverReason for display
  - Depends: 4.2.1

---

## 4.3 Turn UI Components

### 4.3.1 GoButton Component
- [x] Create GO button that triggers turn
  - File: `src/components/game/GoButton.tsx`
  - Tests: `src/__tests__/components/GoButton.test.tsx`
  - Props: onGo, disabled
  - Large bouncy button with dice icons
  - Depends: 1.3.1

### 4.3.2 TurnResultDisplay Component
- [x] Create turn result feedback
  - File: `src/components/game/TurnResultDisplay.tsx`
  - Tests: `src/__tests__/components/TurnResultDisplay.test.tsx`
  - Shows: "Rolled [X]! Moved [Y] distance."
  - Shows: Resource changes (+/- for each)
  - Auto-dismisses or click to dismiss
  - Depends: 1.1.3

---

## 4.4 Wire Turn Execution

### 4.4.1 Dashboard Turn Integration
- [x] Wire Dashboard to execute turns
  - File: `src/components/screens/Dashboard.tsx` (update)
  - Tests: `src/__tests__/components/Dashboard.test.tsx` (update)
  - GO button calls executeTurn from store
  - Shows TurnResultDisplay after each turn
  - Depends: 4.3.1, 4.3.2, 4.2.1

### 4.4.2 VictoryScreen with Turn Count
- [x] Update VictoryScreen to show actual turn count
  - File: `src/components/screens/VictoryScreen.tsx` (update)
  - Tests: `src/__tests__/components/VictoryScreen.test.tsx` (update)
  - Shows: "You completed the journey in X turns!"
  - Depends: 4.2.2

### 4.4.3 GameOverScreen with Reason
- [x] Update GameOverScreen to show actual reason
  - File: `src/components/screens/GameOverScreen.tsx` (update)
  - Tests: `src/__tests__/components/GameOverScreen.test.tsx` (update)
  - Shows: "You ran out of [food/fuel/water/money]!"
  - Depends: 4.2.2

---

## 4.5 Phase 4 Verification

### 4.5.1 Turn Logic Tests
- [x] Test complete turn processing
  - File: `src/__tests__/integration/phase4-turnloop.test.tsx`
  - Test: Turn updates resources correctly
  - Test: Multiple turns advance through countries
  - Test: Victory triggered when reaching USA
  - Test: Game over triggered when resource hits 0
  - Depends: all 4.4.x tasks

### 4.5.2 Manual Playthrough
- [x] Play complete game to victory
  - Run: `npm run dev`
  - Test: Click GO multiple times
  - Test: Watch resources change, train advance
  - Test: Reach victory screen OR game over screen
  - Test: Restart works correctly
  - Depends: 4.5.1

---

# Phase 5: Crew Management

> **Goal:** Players can change crew roles, affecting resource production.
> **Testable Outcome:** Click crew member → role cycles → more cooks = more food production, more engineers = less fuel consumption.
> **Builds on Phase 4:** Adds strategic depth to working game.

---

## 5.1 Crew Role Logic

### 5.1.1 Role Cycling Logic
- [x] Implement role cycling
  - File: `src/logic/crew.ts`
  - Tests: `src/__tests__/logic/crew.test.ts`
  - Function: `cycleRole(role): CrewRole`
  - Cycle: Engineer → Cook → Security → Free → Engineer
  - Depends: 1.1.2

### 5.1.2 Engineer Bonus Logic
- [x] Implement engineer fuel reduction
  - File: `src/logic/crew.ts` (extend)
  - Tests: `src/__tests__/logic/crew.test.ts` (extend)
  - Function: `calculateEngineerBonus(engineerCount): number`
  - Each engineer reduces fuel consumption
  - Depends: 5.1.1

### 5.1.3 Update Resource Logic
- [x] Integrate crew bonuses into resource calculations
  - File: `src/logic/resources.ts` (update)
  - Tests: `src/__tests__/logic/resources.test.ts` (update)
  - Fuel consumption uses engineer bonus
  - Food production uses cook count + captain stat
  - Depends: 5.1.2, 4.1.3, 4.1.4

---

## 5.2 Crew Store Actions

### 5.2.1 Cycle Crew Role Action
- [x] Add role cycling to store
  - File: `src/stores/gameStore.ts` (extend)
  - Tests: `src/__tests__/stores/gameStore.test.ts` (extend)
  - Action: `cycleCrewRole(crewMemberId)`
  - Depends: 5.1.1, 3.1.3

---

## 5.3 Crew UI Updates

### 5.3.1 Clickable CrewMember
- [x] Make CrewMember clickable to cycle role
  - File: `src/components/game/CrewMember.tsx` (update)
  - Tests: `src/__tests__/components/CrewMember.test.tsx` (update)
  - On click: calls cycleCrewRole from store
  - Visual feedback on hover/click
  - Depends: 5.2.1, 3.4.1

### 5.3.2 Role Effect Tooltips
- [x] Add tooltips explaining role effects
  - File: `src/components/game/CrewMember.tsx` (update)
  - Tests: `src/__tests__/components/CrewMember.test.tsx` (update)
  - On hover: shows "Engineers reduce fuel consumption"
  - Depends: 5.3.1

---

## 5.4 Phase 5 Verification

### 5.4.1 Crew Integration Test
- [x] Test crew role changes affect gameplay
  - File: `src/__tests__/integration/phase5-crew.test.tsx`
  - Test: Changing to more cooks increases food production
  - Test: Changing to more engineers decreases fuel consumption
  - Test: Roles persist between turns
  - Depends: all 5.3.x tasks

### 5.4.2 Manual Strategy Test
- [x] Test strategic crew management
  - Run: `npm run dev`
  - Test: Start game, assign all to cooks, verify high food production
  - Test: Assign all to engineers, verify low fuel consumption
  - Test: Find optimal balance to reach victory
  - Depends: 5.4.1

---

# Phase 6: Station Arrivals (MVP Complete)

> **Goal:** Arriving at a new country triggers station rewards.
> **Testable Outcome:** When train reaches new country, see "Welcome to [Country]!" modal with water refill and money earned. Then continue playing.
> **Builds on Phase 5:** Adds resource management depth.
> **This completes the MVP - full playable game.**

---

## 6.1 Station Logic

### 6.1.1 Station Arrival Logic
- [x] Implement station arrival processing
  - File: `src/logic/station.ts`
  - Tests: `src/__tests__/logic/station.test.ts`
  - Function: `processStationArrival(country, captainSecurityStat): StationReward`
  - StationReward: { waterRefill, moneyEarned }
  - Water refills to max, money based on captain security stat
  - Depends: 2.1.3

### 6.1.2 Integrate Station into Turn
- [x] Add station arrival to turn processing
  - File: `src/logic/turn.ts` (update)
  - Tests: `src/__tests__/logic/turn.test.ts` (update)
  - If arrivedAtNextCountry: call processStationArrival
  - Include stationReward in TurnResult
  - Depends: 6.1.1, 4.1.6

---

## 6.2 Station UI

### 6.2.1 StationModal Component
- [x] Create station arrival modal
  - File: `src/components/game/StationModal.tsx`
  - Tests: `src/__tests__/components/StationModal.test.tsx`
  - Props: country, reward, onContinue
  - Shows: "Welcome to [Country]! [icon]"
  - Shows: "+[X] Water, +$[Y] Money"
  - Continue button to dismiss
  - Depends: 1.1.3

### 6.2.2 Dashboard Station Integration
- [x] Show station modal on arrival
  - File: `src/components/screens/Dashboard.tsx` (update)
  - Tests: `src/__tests__/components/Dashboard.test.tsx` (update)
  - After turn: if arrived at station, show StationModal
  - Modal dismisses, then shows normal turn result
  - Depends: 6.2.1, 6.1.2

---

## 6.3 Phase 6 Verification (MVP Complete)

### 6.3.1 Station Integration Test
- [x] Test station arrivals work correctly
  - File: `src/__tests__/integration/phase6-stations.test.tsx`
  - Test: Arriving at new country triggers modal
  - Test: Resources updated with station rewards
  - Test: Game continues normally after dismissing
  - Depends: 6.2.2

### 6.3.2 Full MVP Test Suite
- [x] Run complete test suite
  - Command: `npm test`
  - All tests pass
  - Depends: all previous phases

### 6.3.3 Production Build
- [x] Verify production build
  - Command: `npm run build`
  - No errors or warnings
  - Depends: 6.3.2
  - Note: Phase 6 builds clean; build errors from Phase 7 WIP code

### 6.3.4 Complete Playthrough
- [x] Manual playthrough of complete MVP
  - Run: `npm run dev`
  - Test: Full game from intro to victory
  - Test: Full game to game over (intentionally lose)
  - Test: Station arrivals with rewards
  - Test: Crew management strategy
  - Test: Restart and play again
  - Depends: 6.3.3

---

# Post-MVP Phases

---

# Phase 7: Event System (P2)

> **Goal:** Random negative events challenge the player with card-based resolution.
> **Testable Outcome:** ~40% chance per turn to see event modal. Select cards, roll dice, see success/failure and consequences.
> **Builds on Phase 6:** Adds risk/reward to gameplay.

---

## 7.1 Event & Card Data

### 7.1.1 Event Definitions
- [x] Create event data
  - File: `src/data/events.ts`
  - Tests: `src/__tests__/data/events.test.ts`
  - Events from PRD: Bandit Attack, Engine Failure, Storm, etc.
  - Each: id, name, description, statTested, difficulty, penalty
  - Depends: 1.1.2

### 7.1.2 Card Definitions
- [x] Create bonus card data
  - File: `src/data/cards.ts`
  - Tests: `src/__tests__/data/cards.test.ts`
  - Cards from PRD: Security Patrol, Quick Repairs, etc.
  - Each: id, name, stat, bonus, description
  - Depends: 1.1.2

---

## 7.2 Event & Card Logic

### 7.2.1 Event Trigger Logic
- [x] Implement event trigger check
  - File: `src/logic/events.ts`
  - Tests: `src/__tests__/logic/events.test.ts`
  - Function: `shouldTriggerEvent(): boolean` (~40% chance)
  - Function: `selectRandomEvent(): GameEvent`
  - Depends: 7.1.1

### 7.2.2 Card Hand Logic
- [x] Implement card hand management
  - File: `src/logic/cards.ts`
  - Tests: `src/__tests__/logic/cards.test.ts`
  - Functions: `drawInitialHand()`, `playCards(cardIds)`, `replenishHand()`
  - Hand always has 3 cards
  - Depends: 7.1.2

### 7.2.3 Event Resolution Logic
- [o] Implement event resolution
  - File: `src/logic/events.ts` (extend)
  - Tests: `src/__tests__/logic/events.test.ts` (extend)
  - Function: `resolveEvent(event, playedCards, captainStats, diceRoll): EventResult`
  - Total = dice + card bonuses + captain stat
  - Success if total >= difficulty
  - Depends: 7.2.1, 7.2.2

### 7.2.4 Integrate Events into Turn
- [ ] Add event check to turn processing
  - File: `src/logic/turn.ts` (update)
  - Tests: `src/__tests__/logic/turn.test.ts` (update)
  - After movement: check for event trigger
  - TurnResult includes: eventTriggered, event
  - Depends: 7.2.3, 4.1.6

---

## 7.3 Event Store

### 7.3.1 Card Hand State
- [o] Add card hand to game store
  - File: `src/stores/gameStore.ts` (extend)
  - Tests: `src/__tests__/stores/gameStore.test.ts` (extend)
  - State: cardHand, currentEvent, selectedCards
  - Actions: initializeCards(), selectCard(id), resolveCurrentEvent()
  - Depends: 7.2.2, 3.1.3

---

## 7.4 Event UI

### 7.4.1 CardDisplay Component
- [x] Create card display component
  - File: `src/components/game/CardDisplay.tsx`
  - Tests: `src/__tests__/components/CardDisplay.test.tsx`
  - Props: card, selected, onSelect
  - Shows: Name, stat type, bonus value
  - Depends: 7.1.2

### 7.4.2 CardHand Component
- [o] Create card hand display
  - File: `src/components/game/CardHand.tsx`
  - Tests: `src/__tests__/components/CardHand.test.tsx`
  - Shows: 3 CardDisplay components
  - Allows selecting multiple cards
  - Depends: 7.4.1

### 7.4.3 EventModal Component
- [ ] Create event resolution modal
  - File: `src/components/game/EventModal.tsx`
  - Tests: `src/__tests__/components/EventModal.test.tsx`
  - Shows: Event description, difficulty, potential penalty
  - Shows: CardHand for selection
  - Shows: Roll button, result, outcome
  - Depends: 7.4.2, 7.2.3

### 7.4.4 Dashboard Event Integration
- [ ] Integrate events into dashboard
  - File: `src/components/screens/Dashboard.tsx` (update)
  - Tests: `src/__tests__/components/Dashboard.test.tsx` (update)
  - After turn: if event triggered, show EventModal
  - Event resolved, then continue
  - Depends: 7.4.3, 7.3.1

---

## 7.5 Phase 7 Verification

### 7.5.1 Event Integration Test
- [ ] Test complete event flow
  - File: `src/__tests__/integration/phase7-events.test.tsx`
  - Test: Events trigger randomly
  - Test: Card selection affects resolution
  - Test: Success avoids penalty, failure applies penalty
  - Test: Cards replenish after event
  - Depends: 7.4.4

### 7.5.2 Manual Event Test
- [ ] Test events in gameplay
  - Run: `npm run dev`
  - Test: Play until event triggers
  - Test: Select cards, roll, see outcome
  - Test: Verify penalty applied on failure
  - Depends: 7.5.1

---

# Phase 8: Cart System (P2)

> **Goal:** Purchase carts at stations to expand train capabilities.
> **Testable Outcome:** At station, see cart shop. Buy Fuel Cart → max fuel increases. Buy Food Cart → max food increases.
> **Builds on Phase 7:** Adds strategic purchasing decisions.

---

## 8.1 Cart Data & Logic

### 8.1.1 Cart Definitions
- [ ] Create cart data
  - File: `src/data/carts.ts`
  - Tests: `src/__tests__/data/carts.test.ts`
  - Carts from PRD: Fuel Cart, Food Cart, Water Cart, Spare Parts, Security, Passenger
  - Each: id, name, icon, price, effect
  - Depends: 1.1.2

### 8.1.2 Cart Purchase Logic
- [ ] Implement cart purchase and effects
  - File: `src/logic/carts.ts`
  - Tests: `src/__tests__/logic/carts.test.ts`
  - Functions: `canPurchaseCart(cart, money)`, `applyCartEffect(cart, gameState)`
  - Depends: 8.1.1

---

## 8.2 Cart Store & UI

### 8.2.1 Cart State
- [ ] Add cart state to store
  - File: `src/stores/gameStore.ts` (extend)
  - Tests: `src/__tests__/stores/gameStore.test.ts` (extend)
  - State: ownedCarts
  - Actions: purchaseCart(cartId)
  - Depends: 8.1.2

### 8.2.2 CartShop Component
- [ ] Create cart shop modal
  - File: `src/components/game/CartShop.tsx`
  - Tests: `src/__tests__/components/CartShop.test.tsx`
  - Shows: Available carts, prices, effects
  - Buy button (disabled if can't afford)
  - Depends: 8.1.1, 8.2.1

### 8.2.3 Station Shop Integration
- [ ] Add cart shop to station arrival
  - File: `src/components/game/StationModal.tsx` (update)
  - Tests: `src/__tests__/components/StationModal.test.tsx` (update)
  - After rewards: show "Visit Shop?" button
  - Opens CartShop modal
  - Depends: 8.2.2, 6.2.1

---

## 8.3 Phase 8 Verification

### 8.3.1 Cart Integration Test
- [ ] Test cart purchasing flow
  - File: `src/__tests__/integration/phase8-carts.test.tsx`
  - Test: Can purchase cart at station
  - Test: Cart effects apply correctly
  - Test: Money deducted on purchase
  - Depends: 8.2.3

---

# Phase 9: Mini-Games (P3)

> **Goal:** Play fun mini-games at stations for bonus resources.
> **Testable Outcome:** Arrive at France, play Croissant Catcher, earn bonus food based on score.
> **Builds on Phase 8:** Adds engagement and skill-based rewards.

(Tasks would follow similar pattern - data, logic, UI, verification)

---

# Phase 10: Mystery Cargo (P3)

> **Goal:** Discover mystery crates during travel with collectible rewards.
> **Testable Outcome:** Random chance to find crate, opens at next station, reveals reward.

(Tasks would follow similar pattern)

---

# Phase 11: Country Quiz (P3)

> **Goal:** Educational quizzes at stations for bonus rewards.
> **Testable Outcome:** Quiz modal with 3 questions, correct answers earn bonus money.

(Tasks would follow similar pattern)

---

# Phase 12: Audio & Polish (P3)

> **Goal:** Sound effects, music, and animations.
> **Testable Outcome:** Hear dice roll sound, train chug, button clicks, victory fanfare.

(Tasks would follow similar pattern)

---

# Summary

| Phase | Tasks | Testable Outcome |
|-------|-------|------------------|
| **1. Clickable Prototype** | 13 | Navigate through all screens |
| **2. Real Selection** | 12 | See captains/trains with stats, selection persists |
| **3. Dashboard Display** | 12 | See resources, journey track, crew |
| **4. Working Game Loop** | 16 | Click GO, play turns, reach victory/game over |
| **5. Crew Management** | 8 | Change crew roles, affects gameplay |
| **6. Station Arrivals** | 7 | Station rewards on arrival - **MVP COMPLETE** |
| **MVP Total** | **68** | **Full playable game** |
| 7. Event System | ~15 | Random events with card resolution |
| 8. Cart System | ~8 | Buy carts at stations |
| 9. Mini-Games | ~15 | Country-specific mini-games |
| 10. Mystery Cargo | ~8 | Collectible crate system |
| 11. Country Quiz | ~8 | Educational quizzes |
| 12. Audio & Polish | ~10 | Sound and animations |

### Execution Order

Each phase must be completed and verified before starting the next. Within a phase, tasks can often be parallelized where dependencies allow.

**Critical path for MVP:**
```
Phase 1 (navigation) → Phase 2 (selection) → Phase 3 (display) → Phase 4 (gameplay) → Phase 5 (crew) → Phase 6 (stations)
```
