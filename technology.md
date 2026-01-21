# World Tram - Technology Stack

## Overview

World Tram is a turn-based railway adventure game with pixel art aesthetics targeting web browsers. This document outlines the technology choices and architectural decisions.

---

## Core Technologies

### Frontend Framework
**React 18 with TypeScript**
- Component-based architecture ideal for modular game screens
- Strong typing with TypeScript prevents runtime errors
- Large ecosystem and community support
- Hooks for clean state management

### Build Tool
**Vite**
- Fast development server with hot module replacement
- Optimized production builds
- Native TypeScript support
- Simple configuration

### State Management
**Zustand**
- Lightweight (1KB) alternative to Redux
- Simple API with hooks
- Built-in TypeScript support
- Persist middleware for local storage saves
- No boilerplate - perfect for game state

### Styling
**CSS Modules + CSS Variables**
- Scoped styles prevent conflicts
- CSS variables for theming (color palette from PRD)
- `image-rendering: pixelated` for crisp pixel art
- No runtime CSS-in-JS overhead

### Animation
**Framer Motion**
- Declarative animations for React
- Gesture support (tap, drag for mini-games)
- Layout animations for smooth transitions
- Exit animations for screen transitions

### Audio
**Howler.js**
- Cross-browser audio support
- Sprite sheets for multiple sound effects
- Volume control and fading
- Preloading and caching

---

## Project Structure

```
src/
├── assets/                    # Static assets
│   ├── images/               # Pixel art sprites, backgrounds
│   ├── audio/                # Sound effects, music
│   └── fonts/                # Pixel fonts
├── components/               # Reusable UI components
│   ├── common/              # Buttons, modals, progress bars
│   ├── game/                # Game-specific (Train, Crew, ResourceBar)
│   └── screens/             # Full-page screen components
├── data/                     # Static game data (JSON)
│   ├── captains.json
│   ├── trains.json
│   ├── countries.json
│   ├── events.json
│   ├── cards.json
│   ├── minigames.json
│   └── quizzes.json
├── hooks/                    # Custom React hooks
│   ├── useGameState.ts
│   ├── useAudio.ts
│   └── useSaveGame.ts
├── stores/                   # Zustand stores
│   ├── gameStore.ts         # Main game state
│   ├── settingsStore.ts     # User preferences
│   └── collectionStore.ts   # Unlockables, achievements
├── logic/                    # Pure game logic (no React)
│   ├── turnLoop.ts          # Turn processing
│   ├── resources.ts         # Resource calculations
│   ├── events.ts            # Event resolution
│   └── dice.ts              # Dice rolling
├── types/                    # TypeScript interfaces
│   └── index.ts
├── utils/                    # Utility functions
├── App.tsx                   # Root component
├── main.tsx                  # Entry point
└── index.css                 # Global styles, CSS variables
```

---

## Key Architectural Decisions

### 1. Separation of Game Logic and UI
- `/logic/` contains pure TypeScript functions with no React dependencies
- Easy to test in isolation
- Can be reused if porting to other platforms

### 2. Data-Driven Design
- All game content (captains, trains, events, quizzes) stored in JSON
- Easy to modify without code changes
- Enables future content expansion

### 3. Screen-Based Navigation
- Each game screen is a self-contained component
- Simple state machine for navigation
- Clean entry/exit animations

### 4. Local Storage for Persistence
- Zustand persist middleware auto-saves game state
- No backend required
- Works offline

---

## Pixel Art Rendering Strategy

### CSS-Based Approach
For most game elements, CSS provides sufficient rendering:

```css
.pixel-art {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
```

### HTML5 Canvas (If Needed)
For complex animations (train movement, parallax backgrounds):
- Use `<canvas>` element with `getContext('2d')`
- Set `imageSmoothingEnabled = false` for pixel-perfect rendering
- React wrapper component for canvas management

### Animation Strategy
| Element | Technology |
|---------|------------|
| Screen transitions | Framer Motion |
| Button interactions | Framer Motion |
| Train movement | CSS animation / Canvas |
| Dice rolling | Framer Motion |
| Parallax backgrounds | CSS transforms |
| Confetti/particles | Canvas or CSS |
| Mini-game interactions | Framer Motion gestures |

---

## Testing Strategy

### Unit Tests
**Vitest**
- Fast, Vite-native test runner
- Jest-compatible API
- Focus on `/logic/` functions

### Component Tests
**React Testing Library**
- Test component behavior, not implementation
- Accessibility-focused queries

### E2E Tests (Optional)
**Playwright**
- Full game flow testing
- Visual regression testing

---

## Performance Considerations

1. **Asset Optimization**
   - Sprite sheets for related images
   - WebP format with PNG fallback
   - Lazy load non-critical assets

2. **State Updates**
   - Zustand's selective subscriptions prevent unnecessary re-renders
   - Memoize expensive calculations

3. **Audio**
   - Preload essential sounds during intro screen
   - Use audio sprites for multiple effects in one file

---

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | Last 2 versions |
| Firefox | Last 2 versions |
| Safari | Last 2 versions |
| Edge | Last 2 versions |

Mobile browsers (Chrome Mobile, Safari iOS) are supported for touch interactions.

---

## Dependencies Summary

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^4.5.0",
    "framer-motion": "^11.0.0",
    "howler": "^2.2.4"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "vite": "^5.2.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/howler": "^2.2.0",
    "vitest": "^1.4.0",
    "@testing-library/react": "^14.2.0"
  }
}
```

---

## Future Considerations

If the game expands beyond initial scope:

1. **Mobile Apps**: Use Capacitor to wrap React app for iOS/Android
2. **Backend**: Add Supabase for cloud saves and leaderboards
3. **Complex Animations**: Consider PixiJS for heavy sprite manipulation
4. **Localization**: Add i18next for multi-language support
