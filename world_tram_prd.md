# World Tram
## Product Requirements Document

---

## 1. Game Overview

**World Tram** is a turn-based railway adventure game where players command a steam locomotive on an epic journey around the world. Set in a vibrant pixel art world inspired by classic 80s and 90s games, players must manage their crew, resources, and make strategic decisions to complete their globe-spanning voyage from France to the USA.

### Theme & Setting

The game evokes the golden age of rail travel with a retro-futuristic twist. Think *Oregon Trail* meets European railway romance—pixel art landscapes scroll by as your train chugs through picturesque countrysides, bustling stations, and dramatic mountain passes.

### Visual Style

- **Pixel Art Aesthetic**: 16-bit inspired graphics with chunky pixels, limited color palettes, and expressive character sprites
- **Color Palette**: Rich, saturated colors reminiscent of SNES/Genesis era—deep blues, warm oranges, forest greens
- **Character Portraits**: Detailed pixel portraits for each captain showing personality and origin
- **Train Sprites**: Lovingly crafted locomotive designs, each with distinct silhouettes
- **Backgrounds**: Scrolling parallax landscapes for each country—French vineyards, Japanese cherry blossoms, Australian outback, Canadian mountains
- **UI Elements**: Retro-styled panels with beveled edges, pixel fonts, and chunky buttons

---

## 2. Game Objective

### Primary Goal
Successfully navigate your train around the world, starting in **France** and traveling through **Germany**, **Russia**, **China**, **Japan**, **Singapore**, **Australia**, **Brazil**, and **Canada**, finally arriving in the **USA**. Manage your resources and crew along the way!

### The World Route
```
Europe → Asia → Oceania → South America → North America

🇫🇷 France → 🇩🇪 Germany → 🇷🇺 Russia → 🇨🇳 China → 🇯🇵 Japan →
🇸🇬 Singapore → 🇦🇺 Australia → 🇧🇷 Brazil → 🇨🇦 Canada → 🇺🇸 USA
```

> **World-Building Note:** In the World Tram universe, a network of magical "Sky Bridges" connects continents, allowing trains to cross oceans! These ancient engineering marvels shimmer with rainbow light as your train chugs across. Kids don't need to worry about the geography—it's an adventure!

### Victory Condition
Reach the **USA** and complete the final stretch of track. Your performance is measured by the number of turns taken—fewer turns means a more skilled conductor!

### Fail States
- **Starvation**: Run out of food (food = 0)
- **Empty Tank**: Run out of fuel (fuel = 0)
- **Dehydration**: Run out of water (water = 0)
- **Bankruptcy**: Cannot pay crew wages (money goes negative)

---

## 3. User Journey

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   INTRO     │────▶│ CAPTAIN SELECTION│────▶│ TRAIN SELECTION │
│   SCREEN    │     │                  │     │                 │
└─────────────┘     └──────────────────┘     └─────────────────┘
                            ▲                         │
                            │                         │
                            │                         ▼
                    ┌───────────────┐         ┌─────────────────┐
                    │   GAME OVER   │◀────────│    GAMEPLAY     │
                    │    SCREEN     │         │   (DASHBOARD)   │
                    └───────┬───────┘         └────────┬────────┘
                            │                          │
                            │    "Start New Game"      │ Victory!
                            │          │               │
                            └──────────┼───────────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │    VICTORY      │
                              │    SCREEN       │──┐
                              └─────────────────┘  │
                                       ▲           │
                                       └───────────┘
                                    "Start New Game"
                                    (goes to Captain Selection)
```

**Flow Notes:**
- **Intro → Captain Selection**: First-time players start here
- **Victory/Game Over → Captain Selection**: "Start New Game" skips intro and goes directly to captain selection
- **Back buttons**: Each selection screen has a back button to previous screen

---

## 4. Screens

### 4.1 Intro Screen

**Purpose**: Welcome players and set the atmosphere

**Elements**:
- Game title: "WORLD TRAM" in large pixel font
- Subtitle: "A Turn-Based Railway Adventure"
- Atmospheric pixel art background showing a world map with railway routes
- Single prominent button: **"START GAME"**

**Mood**: Adventurous, inviting, nostalgic

---

### 4.2 Captain Selection Screen

**Purpose**: Choose your train captain, each with unique abilities

**Layout**:
- Header: "CHOOSE YOUR CAPTAIN"
- Three captain cards displayed in a row
- Back button to return to intro

**Captain Cards Display**:
```
┌─────────────────────────────────┐
│  ┌────────┐                     │
│  │ PIXEL  │  CAPTAIN NAME       │
│  │PORTRAIT│  Origin: Country    │
│  └────────┘                     │
│                                 │
│  "Captain's description and     │
│   personality flavor text"      │
│                                 │
│  ▸ Engineering: ████░░ (4/6)    │
│  ▸ Food:        ██░░░░ (2/6)    │
│  ▸ Security:    ███░░░ (3/6)    │
└─────────────────────────────────┘
```

**Available Captains**:

| Captain | Origin | Specialty | Description |
|---------|--------|-----------|-------------|
| **Renji** | Japan | Engineering | Disciplined engineer from Kyoto. Keeps machines running at peak efficiency. |
| **Luca** | Italy | Food | Charismatic chef from Naples. Ensures the crew never goes hungry. |
| **Cooper** | USA | Security | Veteran conductor from Texas. Protects cargo and maximizes profits. |

**Captain Stats** (scale of 1-6):

| Captain | Engineering | Food | Security |
|---------|-------------|------|----------|
| **Renji** | 5 | 2 | 3 |
| **Luca** | 2 | 5 | 3 |
| **Cooper** | 3 | 2 | 5 |

**Stats Explained**:
- **Engineering**: Reduces fuel consumption by `stat - 2` per turn (Renji saves 3 fuel/turn)
- **Food**: Adds `stat` bonus food per turn from cooks (Luca adds +5 food/turn)
- **Security**: Increases money earned at stations by `stat × $5` (Cooper earns +$25/station)

---

### 4.3 Train Selection Screen

**Purpose**: Choose your locomotive, each with different performance characteristics

**Layout**:
- Header: "CHOOSE YOUR TRAIN"
- Three train cards displayed in a row
- Back button to return to captain selection

**Train Cards Display**:
```
┌─────────────────────────────────┐
│     ═══╦╦══════════╗            │
│    ═══╬╬╬══════════╣ ●●●        │
│   ════╩╩═══════════╝            │
│        TRAIN NAME               │
│        Origin: Country          │
│                                 │
│  ▸ Speed:       █████░ (5/6)   │
│  ▸ Reliability: ███░░░ (3/6)   │
│  ▸ Power:       ███░░░ (3/6)   │
└─────────────────────────────────┘
```

**Available Trains**:

| Train | Origin | Specialty | Character |
|-------|--------|-----------|-----------|
| **Blitzzug** | Germany | Reliability | Dependable workhorse. Steady and consistent. |
| **Kitsune** | Japan | Speed | Swift as the wind. Covers ground quickly. |
| **Ironhorse** | USA | Power | Raw strength. Excellent fuel efficiency. |

**Train Stats** (scale of 1-6):

| Train | Speed | Reliability | Power |
|-------|-------|-------------|-------|
| **Blitzzug** | 3 | 5 | 3 |
| **Kitsune** | 5 | 3 | 3 |
| **Ironhorse** | 3 | 3 | 5 |

**Stats Explained**:
- **Speed**: Added to dice roll for total distance per turn (Kitsune adds +5)
- **Reliability**: Reduces negative event chance by `stat × 5%` (Blitzzug: -25% event chance) *[Future feature]*
- **Power**: Reduces fuel consumption by `stat - 3` per turn (Ironhorse saves 2 fuel/turn)

---

### 4.4 Gameplay Screen (Dashboard)

**Purpose**: Main game interface where turn-based gameplay occurs

**Design**: "Horizontal Journey View" — A kid-friendly, visual side-scrolling adventure with minimal text.

**Layout**:
```
┌─────────────────────────────────────────────────────────────────────────┐
│  🍞 ████████░░    ⛽ ██████░░░░    💧 ████░░░░    💰 ████░░   Turn: 12 │
│    [food]          [fuel]          [water]       [money]               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ☁️          ☁️                    ☁️                       🌤️         │
│                                                                         │
│      🗼              🏰              🏛️             🏯                  │
│    FRANCE ✓       GERMANY ✓        RUSSIA         CHINA     ...        │
│  ════════════════════════════════════════════════════════════════════  │
│                              🚂═🚃═🚃═🚃                                 │
│  ════════════════════════════════════════════════════════════════════  │
│     ✓               ✓               ●                                   │
│   [done]          [done]         [here]                                │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   👨‍🔧 Tom      👩‍🍳 Maria    🔫 Jack     👤 Sam     ┌──────────────────┐ │
│   ENGINEER    COOK       SECURITY   FREE       │    🎲  GO!  🎲    │ │
│   [tap to reassign role]                       │ (big bouncy button)│ │
│                                                └──────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

**Visual Zones**:

1. **Resource Bar (Top)**
   - Large colorful meters with icons (no text labels)
   - 🍞 Food | ⛽ Fuel | 💧 Water | 💰 Money
   - Turn counter in corner

2. **Journey View (Center)**
   - Side-scrolling train track with parallax sky and clouds
   - Landmark icons mark each country (Eiffel Tower, Castle, etc.)
   - ✓ Checkmarks on visited countries
   - ● Dot shows current location
   - **Train + Carts** animate along the track

3. **Crew & Actions (Bottom)**
   - Crew shown as pixel sprites with role icons above
   - Tap any crew member to cycle their role
   - Giant bouncy "GO!" button for turns

**Train + Carts Display**:
```
  🚂════🚃════🚃════🚃════🚃
  [engine] [fuel] [food] [water] [parts]

  Train Types (unique silhouettes):
  Blitzzug:   ═╦═══╬══╦═
  Kitsune:    ═══▶═══▶══
  Ironhorse:  ═╬═╬═╬═╬══
```

**Crew Role Icons**:
| Icon | Role | Visual |
|------|------|--------|
| 👨‍🔧 | Engineer | Wrench/gear sprite |
| 👩‍🍳 | Cook | Chef hat sprite |
| 🔫 | Security | Shield/weapon sprite |
| 👤 | Free | Question mark sprite |

**Animations**:
- Train wheels spin as it moves
- Smoke puffs drift from engine
- Clouds scroll in parallax background
- "GO!" button bounces and glows
- Confetti bursts when arriving at new country
- Crew sprites wave and react

**Warning States**:
- Low resource: Meter flashes red, icon shakes
- Critical: Warning sound + screen edge pulse
- Game over: Sad train animation + "TRY AGAIN?" button

---

### 4.5 Victory Screen

**Purpose**: Celebrate successful completion of the journey

**Elements**:
- Large celebratory header: "VICTORY!"
- Congratulations message
- Turn count display: "You completed the journey in X turns"
- Pixel art celebration (train at final station, confetti)
- **"START NEW GAME"** button (returns to Captain Selection)

**Mood**: Triumphant, rewarding, encouraging replay

---

## 5. Gameplay Mechanics

### 5.1 Turn Structure

Each turn represents a day of travel. When the player clicks **GO!**:

1. **Roll Phase**: A random dice roll (1-10) determines base movement
2. **Movement Phase**: Train speed + dice roll = total distance traveled
3. **Progress Update**: If progress exceeds 10 (country distance), advance to next country
4. **Station Phase**: If arrived at new country, process station rewards
5. **Resource Phase**: Consume and produce resources, pay wages
6. **Status Check**: Evaluate win/lose conditions

**Example Turn:**
- Roll: 6, Train Speed: 3 → Move 9 distance
- Was at progress 4 in Germany → Now at 13, exceeds 10 → Arrive in Russia!
- Station rewards: +$45 (base $30 + Security 3 × $5), water refills to max
- Consume: 8 fuel (9 moved - 1 Power bonus), 6 food (2 base + 4 crew), 4 water
- Produce: 8 food (1 cook × 3 + captain Food 5)
- Pay wages: $17 (3 assigned × $5 + 1 free × $2)
- Check: All resources > 0, not at USA yet → Continue

### 5.2 Resource Management

| Resource | Icon | Starting | Maximum | Per-Turn Change |
|----------|------|----------|---------|-----------------|
| **Food** | 🍞 | 50 | 100 | -(2 + crew count) + production |
| **Fuel** | ⛽ | 100 | 200 | -distance + bonuses |
| **Water** | 💧 | 50 | 100 | -crew count, refills at stations |
| **Money** | 💰 | 200 | 1000 | -wages + station earnings |

#### Fuel Consumption Formula
```
Fuel used = Distance moved - Engineer bonus - Power bonus - Captain bonus
         = Distance - (Engineers × 2) - (Power - 3) - (Engineering - 2)

Minimum fuel consumption = 1 per turn (can't go below 1)
```

**Example:** Move 8 distance with 1 Engineer, Ironhorse (Power 5), Renji (Engineering 5):
- Base: 8
- Engineer bonus: -2
- Power bonus: -(5-3) = -2
- Captain bonus: -(5-2) = -3
- Total: 8 - 2 - 2 - 3 = 1 fuel (minimum)

#### Food Consumption & Production Formula
```
Food consumed = 2 (base) + crew count
Food produced = (Cooks × 3) + Captain Food stat

Net food = produced - consumed
```

**Example:** 4 crew with 1 Cook, Luca (Food 5):
- Consumed: 2 + 4 = 6
- Produced: (1 × 3) + 5 = 8
- Net: +2 food per turn (sustainable!)

#### Water Consumption Formula
```
Water consumed = 1 per crew member per turn
Water refill = Refill to MAX upon arriving at any station
```

#### Money Formula
```
Wages paid = (Assigned crew × $5) + (Free crew × $2) + (Security crew × $3)*
Station earnings = $30 base + (Captain Security × $5) + (Security crew × $2 each)

*Security crew wage is $5, but they also contribute +$2 to next station earnings
```

**Example:** 3 assigned (Engineer, Cook, Security) + 1 Free, Cooper (Security 5):
- Wages: (3 × $5) + (1 × $2) = $17/turn
- Station: $30 + (5 × $5) + (1 × $2) = $57 per station arrival

#### Fuel Purchase (at stations)
```
Cost: $5 per 10 fuel
Can only purchase when at a station
```

**Resource Fail Conditions**:
- Food = 0 → **Game Over** (Starvation)
- Fuel = 0 → **Game Over** (Empty Tank)
- Water = 0 → **Game Over** (Dehydration)
- Money < 0 after wages → **Game Over** (Bankruptcy)

### 5.3 Crew System

Players start with a crew of 4. Each crew member can be **assigned to any role** by tapping their sprite.

**Starting Crew**:
| Name | Default Role |
|------|--------------|
| **Tom** | Engineer |
| **Maria** | Cook |
| **Jack** | Security |
| **Sam** | Free |

**Assignable Roles**:
| Role | Icon | Effect | Wage |
|------|------|--------|------|
| 👨‍🔧 Engineer | Wrench | -2 fuel consumption per turn | $5/turn |
| 👩‍🍳 Cook | Chef hat | +3 food production per turn | $5/turn |
| 🔫 Security | Shield | +$2 station earnings, +3 event defense *(future)* | $5/turn |
| 👤 Free | Question mark | No effect (resting) | $2/turn |

**Role Effects Summary:**
- **1 Engineer** saves 2 fuel/turn → ~30 fuel saved over 15 turns = $15 worth
- **1 Cook** produces 3 food/turn → prevents starvation
- **1 Security** earns $2/station → ~$18 extra over 9 stations, plus event defense
- **1 Free** saves $3/turn in wages → $45 saved over 15 turns

**Role Assignment**:
- Tap any crew member to cycle through roles: Engineer → Cook → Security → Free → Engineer
- Players decide how to balance their crew based on needs
- More engineers = better fuel efficiency
- More cooks = more food production
- More security = better defense against bandits
- Free crew = lower wage costs but no contribution

**Crew Expansion**:
- Additional crew can be hired at stations
- Maximum crew size depends on train + Passenger Carts owned
- New crew start as "Free" and must be assigned a role

### 5.4 The Route

```
EUROPE:
   FRANCE          GERMANY          RUSSIA
  ┌───────┐       ┌───────┐       ┌───────┐
  │  🗼   │ ───▶  │  🏰   │ ───▶  │  🏛️   │
  │ START │       │       │       │       │
  └───────┘       └───────┘       └───────┘

ASIA:
   CHINA           JAPAN           SINGAPORE
  ┌───────┐       ┌───────┐       ┌───────┐
  │  🏯   │ ───▶  │  🗻   │ ───▶  │  🌴   │
  │       │       │       │       │       │
  └───────┘       └───────┘       └───────┘

OCEANIA:
  AUSTRALIA
  ┌───────┐
  │  🦘   │ ───▶
  │       │
  └───────┘

SOUTH AMERICA:
   BRAZIL
  ┌───────┐
  │  🎭   │ ───▶
  │       │
  └───────┘

NORTH AMERICA:
   CANADA           USA
  ┌───────┐       ┌───────┐
  │  🍁   │ ───▶  │  🗽   │
  │       │       │ FINISH│
  └───────┘       └───────┘
```

**10 Countries Total**: France → Germany → Russia → China → Japan → Singapore → Australia → Brazil → Canada → USA

Each country requires traveling **10 distance units** before advancing to the next.

| # | Country | Icon | Landmark | Distance | Cumulative |
|---|---------|------|----------|----------|------------|
| 1 | France | 🇫🇷 | 🗼 Eiffel Tower | START | 0 |
| 2 | Germany | 🇩🇪 | 🏰 Neuschwanstein | 10 | 10 |
| 3 | Russia | 🇷🇺 | 🏛️ St. Basil's | 10 | 20 |
| 4 | China | 🇨🇳 | 🏯 Great Wall | 10 | 30 |
| 5 | Japan | 🇯🇵 | 🗻 Mt. Fuji | 10 | 40 |
| 6 | Singapore | 🇸🇬 | 🌴 Merlion | 10 | 50 |
| 7 | Australia | 🇦🇺 | 🦘 Opera House | 10 | 60 |
| 8 | Brazil | 🇧🇷 | 🎭 Christ Statue | 10 | 70 |
| 9 | Canada | 🇨🇦 | 🍁 CN Tower | 10 | 80 |
| 10 | USA | 🇺🇸 | 🗽 Statue of Liberty | 10 | 90 |

**Total distance to victory: 90 units** (reach USA = win, don't need to traverse USA)

**Expected turns to complete:**
- Kitsune (Speed 5) + avg roll 5.5 = 10.5/turn → ~9 turns (speed run!)
- Blitzzug (Speed 3) + avg roll 5.5 = 8.5/turn → ~11 turns
- Bad luck (Speed 3 + roll 3) = 6/turn → ~15 turns

### 5.5 Cart System

Players can purchase carts at stations to expand their train's capabilities. Carts attach behind the engine and provide various bonuses.

**Cart Display**:
```
  🚂════🚃════🚃════🚃════🚃════🚃
  [engine] [fuel] [food] [water] [parts] [security]
```

**Available Carts**:
| Cart | Icon | Price | Effect |
|------|------|-------|--------|
| ⛽ Fuel Cart | 🚃⛽ | $100 | +50 max fuel capacity |
| 🍞 Food Cart | 🚃🍞 | $100 | +25 max food capacity |
| 💧 Water Cart | 🚃💧 | $80 | +50 max water capacity |
| ⚙️ Spare Parts Cart | 🚃⚙️ | $150 | Prevents breakdowns, auto-repairs |
| 🔫 Security Cart | 🚃🔫 | $120 | +3 bonus to defense rolls |
| 👥 Passenger Cart | 🚃👥 | $200 | +2 max crew capacity |

**Cart Mechanics**:
- Carts can only be purchased when stopped at a station
- Each cart adds visual length to your train
- Train power stat affects how many carts can be pulled efficiently
- More carts = slightly more fuel consumption per turn

**Cart Strategy**:
- Early game: Fuel Cart (fuel security)
- Mid game: Food/Water Carts (sustain longer journeys)
- Late game: Spare Parts (prevent costly breakdowns)
- Event-focused: Security Cart (survive bandit attacks)

---

## 6. Strategic Choices

### 6.1 Captain Selection Strategy

| If you want... | Choose... | Stat | Benefit |
|----------------|-----------|------|---------|
| Fuel efficiency | Renji | Engineering 5 | Saves 3 fuel/turn (~45 fuel over game) |
| Food security | Luca | Food 5 | +5 food/turn (makes 1 cook sustainable) |
| Maximum profit | Cooper | Security 5 | +$25 per station (~$225 total) |

### 6.2 Train Selection Strategy

| If you want... | Choose... | Key Stat | Benefit |
|----------------|-----------|----------|---------|
| Fastest completion | Kitsune | Speed 5 | +5 distance/turn (finish in ~12 turns) |
| Lowest fuel use | Ironhorse | Power 5 | Saves 2 fuel/turn (~30 fuel over game) |
| Event resistance | Blitzzug | Reliability 5 | -25% event chance *(future feature)* |

### 6.3 Optimal Pairings

| Strategy | Captain | Train | Why It Works |
|----------|---------|-------|--------------|
| **Speed Run** | Any | Kitsune | Finish fast before resources deplete |
| **Ultra Efficient** | Renji | Ironhorse | Save 5 fuel/turn combined (barely use fuel!) |
| **Sustainable** | Luca | Any | +8 food/turn with 1 cook = never starve |
| **Profit Max** | Cooper | Blitzzug | $57/station + low event risk for safe earnings |

### 6.4 Balance Analysis

**Typical 15-turn game with default crew (1 each role):**

| Starting | Consumption | Production | Station Gains | Net |
|----------|-------------|------------|---------------|-----|
| Food: 50 | -6/turn = -90 | +3/turn = +45 | — | Need captain Food bonus! |
| Fuel: 100 | -6/turn = -90 | — | Buy ~40 = -$20 | Tight but manageable |
| Water: 50 | -4/turn = -60 | — | +50×9 refills | Always fine |
| Money: 200 | -$17/turn = -$255 | — | +$30×9 = $270 | Depends on captain |

**Key Insight:** Without Luca's +5 food bonus, you MUST have at least 2 Cooks to survive!

---

## 7. Future Expansion Ideas

### Potential New Features
- **Alternative Routes**: Choose different paths around the world
- **Random Events**: Bandits, weather, mechanical failures (see Section 10 for event system)
- **Crew Hiring**: Recruit new crew members at stations
- **Upgrades**: Improve train components with earned money
- **Cargo System**: Transport goods for bonus rewards
- **Difficulty Modes**: Easy/Normal/Hard resource settings

### Potential New Content
- Additional captains from other countries
- New train types with unique abilities
- Special locations with unique challenges
- Achievement system for skilled conductors

---

## 8. Pixel Art Style Guide

### Color Palette
```
Primary:    #2D1B69 (Deep Purple)   - UI backgrounds
Secondary:  #F7B538 (Golden Yellow) - Highlights, buttons
Accent:     #DB3A34 (Warm Red)      - Warnings, important text
Success:    #3E8914 (Forest Green)  - Positive states
Sky:        #87CEEB (Light Blue)    - Background gradients
Earth:      #8B4513 (Saddle Brown)  - Ground, wood elements
```

### Character Design
- 32x32 pixel portraits for captains
- Expressive faces with 3-4 animation frames
- Distinct silhouettes for each character
- National costume elements reflecting origin

### Train Design
- 64x32 pixel sprites for trains
- Animated smoke puffs (2-3 frames)
- Distinct profiles for each model
- Glowing windows at night scenes

### UI Elements
- Beveled button edges (3D pixel effect)
- Scanline overlay option for CRT feel
- Chunky pixel fonts (8x8 or 16x16)
- Animated progress bars with sparkle effects

---

## 9. Kid-Friendly Enhancements (Ages 5-8)

To make World Tram engaging for younger players, the following visual and gameplay features are recommended.

### 9.1 Visual Enhancements

#### Animated Characters & Reactions
- **Captain expressions**: Happy face when rolling high, worried when resources are low, excited at stations
- **Crew idle animations**: Waving, eating lunch, shoveling coal—brings the crew to life
- **Bouncy UI**: Buttons squish when clicked, numbers pop and bounce when changing

#### Fun Train Animations
- **Chugging motion**: Train wobbles side-to-side while moving
- **Smoke puffs**: Animated clouds that drift upward and fade away
- **Spinning wheels**: Visible wheel rotation during movement phase
- **Horn blast**: "TOOT TOOT!" with visual steam burst when arriving at stations

#### Living World
- **Animals along the route**: Sheep in France, pandas in China, kangaroos in Australia, moose in Canada
- **Weather effects**: Sunny days with lens flares, gentle rain with puddles, snow flurries in mountains
- **Day/night cycle**: Sky transitions from blue to orange to starry night, train windows glow warmly
- **Parallax clouds**: Fluffy clouds drift across the background

#### Celebration Effects
- **Confetti burst**: Colorful confetti explodes when arriving at a new country
- **Star particles**: Golden stars fly out when rolling a high number (8+)
- **Trophy spin**: Gleaming golden trophy rotates on victory screen
- **Fireworks**: Victory celebration with colorful pixel fireworks

#### Mascot Helper
- **Conductor Owl** (or mouse): A friendly mascot character that provides tips
- **Speech bubbles**: "Great job!", "Almost there!", "Don't forget to feed the crew!"
- **Pointing wing/paw**: Highlights where to click for first-time players

### 9.2 Playability Enhancements

#### Easy Mode (Kid Mode)
- **Auto-resource management**: Game handles food and fuel refills automatically
- **No fail state**: Resources refill at each station (impossible to lose)
- **Simpler UI**: Hides complex stats, shows only progress and fun elements

#### Big Dice Animation
- **Tumbling 3D dice**: Large animated dice that bounces and rolls across screen
- **Anticipation pause**: Brief dramatic pause before revealing the number
- **Number celebration**: High rolls trigger cheers, sparkles, and happy captain face

#### Visual Map Progress
- **Scrolling map**: Train actually moves across a beautiful illustrated map
- **Country landmarks**: Eiffel Tower, Big Ben, etc. visible as you approach
- **"You are here" marker**: Cute train icon shows current position

#### Collectibles & Rewards
- **Passport stamps**: Earn a colorful stamp for each country visited
- **Sticker book**: Unlock stickers for achievements (First Win, Speed Demon, etc.)
- **Train decorations**: Unlock flags, paint colors, or decorations for your train
- **Captain accessories**: Unlock silly hats, glasses, and scarves for your captain

#### Story Mode
- **Journey purpose**: "Grandma lives in [final destination] and her birthday is tomorrow!"
- **Country greetings**: A friendly local character waves hello at each station
- **Victory story**: "Grandma is SO happy to see you! Best birthday surprise ever!"
- **Postcards**: Send pixel art postcards from each country to Grandma

#### Sound & Music
- **Cheerful soundtrack**: Upbeat, bouncy train-themed music
- **Fun sound effects**:
  - Dice rolling: wooden clatter
  - Movement: rhythmic "chugga-chugga"
  - Station arrival: triumphant fanfare + "TOOT TOOT!"
  - Eating food: happy "nom nom" sounds
  - Collecting stamps: satisfying "ka-chunk!"
- **Voice clips**: "All aboard!", "Next stop: Germany!", "Excellent driving!"

### 9.3 Helper Features

- **Tutorial owl**: First playthrough includes gentle guidance from mascot
- **Hint button**: Tap the owl anytime for a helpful suggestion
- **Read-aloud mode**: All text can be spoken aloud for non-readers
- **Big buttons**: Larger tap targets for small fingers

### 9.4 Personalization

- **Name your train**: Kids can type a custom name (e.g., "SUPER CHOO CHOO")
- **Choose train color**: Pick from red, blue, green, yellow, pink, or rainbow
- **Captain dress-up**: Mix and match hats, glasses, and scarves
- **Crew nicknames**: Rename crew members to friends' or family names

### 9.5 Implementation Priority

| Feature | Effort | Kid Appeal | Priority |
|---------|--------|------------|----------|
| Animated dice roll | Low | ⭐⭐⭐⭐⭐ | P1 |
| Confetti on arrival | Low | ⭐⭐⭐⭐⭐ | P1 |
| Sound effects | Low | ⭐⭐⭐⭐ | P1 |
| Easy/No-fail mode | Low | ⭐⭐⭐⭐ | P1 |
| Passport stamps | Medium | ⭐⭐⭐⭐⭐ | P2 |
| Captain expressions | Medium | ⭐⭐⭐⭐ | P2 |
| Moving train on map | Medium | ⭐⭐⭐⭐⭐ | P2 |
| Mascot helper (Owl) | Medium | ⭐⭐⭐⭐ | P2 |
| Story mode | High | ⭐⭐⭐⭐ | P3 |
| Train customization | Medium | ⭐⭐⭐ | P3 |

---

## 10. Card-Based Event System

A strategic card system that adds depth and excitement to the journey. Players hold bonus cards to mitigate random negative events.

### 10.1 Overview

Each turn, random events may occur—bandits attacking, engine failures, storms, etc. Players use their hand of bonus cards combined with dice rolls and captain/train stats to overcome these challenges.

### 10.2 Player Cards (Bonus Cards)

Players always hold **3 cards** in their hand. Cards provide bonuses to help overcome events.

#### Card Types

| Card | Stat | Bonus | Description |
|------|------|-------|-------------|
| Security Patrol | Security | +3 | Extra guards keep watch |
| Armed Guards | Security | +5 | Well-equipped protection |
| Elite Protection | Security | +8 | The best security money can buy |
| Quick Repairs | Engineering | +3 | Basic repair tools |
| Spare Parts | Engineering | +5 | Essential replacement components |
| Master Mechanic | Engineering | +8 | Expert engineering knowledge |
| Extra Rations | Food | +3 | Additional food supplies |
| Preserved Supplies | Food | +5 | Long-lasting provisions |
| Feast Reserves | Food | +8 | Abundant food stores |
| Lucky Charm | Any | +2 | A bit of good fortune |
| Veteran Crew | Any | +4 | Experienced hands on deck |
| Emergency Kit | Any | +6 | Prepared for anything |

#### Card Display (UI)
```
┌─────────────────────────────────────────────────────┐
│  YOUR CARDS                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Security │  │ Engineer │  │   Food   │          │
│  │ Patrol   │  │ Spare    │  │ Extra    │          │
│  │   +3     │  │ Parts +5 │  │ Rations  │          │
│  │          │  │          │  │   +3     │          │
│  └──────────┘  └──────────┘  └──────────┘          │
└─────────────────────────────────────────────────────┘
```

### 10.3 Event Cards (Negative Events)

Events trigger randomly (~40% chance per turn). Each event tests a specific stat.

#### Event Types

| Event | Stat Tested | Difficulty | Penalty if Failed |
|-------|-------------|------------|-------------------|
| Bandit Attack! | Security | 8 | Lose $50 and 1 crew member |
| Pickpockets | Security | 5 | Lose $30 |
| Engine Failure | Engineering | 7 | Lose 20 fuel |
| Broken Axle | Engineering | 9 | Lose 30 fuel, -2 progress |
| Food Spoilage | Food | 6 | Lose 15 food |
| Crew Illness | Food | 5 | Lose 10 food, morale drops |
| Storm | Engineering | 8 | Lose 25 fuel |
| Supply Theft | Security | 6 | Lose $40 and 10 food |

### 10.4 Event Resolution Flow

```
┌─────────────────────────────────────────────────────┐
│  1. EVENT TRIGGERS                                  │
│     "⚠️ Bandit Attack!"                            │
│     Random chance (40%) each turn                   │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  2. PLAYER SELECTS CARDS                           │
│     Choose 0, 1, 2, or 3 cards to play             │
│     Cards matching the event stat are most useful   │
│     "Any" stat cards work for all events           │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  3. DICE ROLL                                       │
│     Roll 0-10                                       │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  4. CALCULATE TOTAL                                 │
│     Total = Dice + Card Bonuses + Captain Stat      │
│                                                     │
│     Example: 4 (dice) + 5 (card) + 3 (captain) = 12│
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  5. COMPARE TO DIFFICULTY                           │
│     Total >= Difficulty → SUCCESS! No penalty       │
│     Total < Difficulty → FAILURE! Penalty applied   │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  6. REPLENISH CARDS                                 │
│     Draw new cards to refill hand back to 3         │
│     Used cards are discarded                        │
└─────────────────────────────────────────────────────┘
```

### 10.5 Event Modal (UI)

#### When Event Triggers
```
┌─────────────────────────────────────────────────────┐
│  ⚠️ EVENT: Bandit Attack!                          │
│                                                     │
│  "A group of bandits is attacking your train!      │
│   Defend your crew and cargo!"                      │
│                                                     │
│  Difficulty: 8 (Security)                          │
│  Penalty: Lose $50 and 1 crew member               │
│                                                     │
│  ─────────────────────────────────────────────────  │
│  Select cards to play:                             │
│                                                     │
│  [✓] Security +3   [ ] Engineer +5   [ ] Food +3   │
│                                                     │
│  Your bonus: +3 (cards) + 3 (captain) = +6         │
│  You need to roll: 2 or higher                     │
│                                                     │
│              [ 🎲 ROLL DICE ]                       │
└─────────────────────────────────────────────────────┘
```

#### After Success
```
┌─────────────────────────────────────────────────────┐
│  🎲 You rolled: 6                                   │
│                                                     │
│  Total: 6 + 6 = 12                                 │
│  Difficulty: 8                                      │
│                                                     │
│  ✅ SUCCESS!                                        │
│  You fought off the bandits!                        │
│  No resources lost.                                 │
│                                                     │
│              [ CONTINUE ]                          │
└─────────────────────────────────────────────────────┘
```

#### After Failure
```
┌─────────────────────────────────────────────────────┐
│  🎲 You rolled: 1                                   │
│                                                     │
│  Total: 1 + 6 = 7                                  │
│  Difficulty: 8                                      │
│                                                     │
│  ❌ FAILURE!                                        │
│  The bandits overwhelmed your defenses!             │
│                                                     │
│  Lost: $50                                         │
│  Lost: 1 crew member (Jack)                        │
│                                                     │
│              [ CONTINUE ]                          │
└─────────────────────────────────────────────────────┘
```

### 10.6 Strategic Depth

#### Card Management
- **Matching cards**: Using a Security card against a Security event gives the full bonus
- **Mismatched cards**: A Food card won't help against Bandits—save it for later!
- **Wild cards**: "Any" stat cards (Lucky Charm, Veteran Crew, Emergency Kit) work for all events
- **Risk vs Reward**: Use multiple cards for tough events, but you'll need to replenish

#### Captain Synergies
| Captain | Stat | Best Against | Effective Difficulty |
|---------|------|--------------|---------------------|
| Renji | Engineering 5 | Engine Failure (7), Broken Axle (9), Storm (8) | 2, 4, 3 |
| Luca | Food 5 | Food Spoilage (6), Crew Illness (5) | 1, 0 |
| Cooper | Security 5 | Bandit Attack (8), Pickpockets (5), Supply Theft (6) | 3, 0, 1 |

*Effective Difficulty = Event Difficulty - Captain Stat (what you need to roll with no cards)*

#### Strategic Decisions
- Do you use your strong cards now or save them?
- Should you play multiple cards on a hard event?
- Can you afford to fail this event and take the penalty?

### 10.7 Card Acquisition

#### Initial Deal
- Players start with 3 random cards from the deck

#### Replenishment
- After each event, draw cards to refill hand to 3
- If deck is empty, shuffle discards back into deck

#### Future Expansion: Card Shops
- Buy specific cards at stations using money
- Trade cards with NPCs
- Find rare cards as rewards

---

## 11. Station Mini-Games

When arriving at each station, players can play a quick 30-second mini-game to earn bonus resources. This breaks up resource management with active play and makes each station feel unique and exciting.

### 11.1 Overview

- **Trigger**: Mini-game modal appears upon arriving at a new country
- **Duration**: ~30 seconds per game
- **Reward**: Bonus resources based on performance (food, fuel, money, or special items)
- **Skip Option**: Players can skip if they prefer (still receive base station rewards)

### 11.2 Mini-Games by Country

| Country | Mini-Game | Mechanic | Reward |
|---------|-----------|----------|--------|
| **France** | Croissant Catcher | Catch falling croissants in a basket, avoid burnt ones | +5-15 Food |
| **Germany** | Train Part Match | Memory matching game with train components | +10-25 Fuel |
| **Russia** | Matryoshka Sequence | Tap dancing dolls in the correct sequence | +$20-50 |
| **China** | Lantern Pop | Pop glowing lanterns in pattern (like Whack-a-Mole) | +5-15 Food |
| **Japan** | Cherry Blossom Rhythm | Tap when cherry blossoms fall on the beat | +$20-50 |
| **Singapore** | Spice Sorter | Drag colorful spices into matching bins | +5-15 Food |
| **Australia** | Kangaroo Jump | Help kangaroo jump over obstacles (endless runner style) | +10-25 Fuel |
| **Brazil** | Carnival Drums | Rhythm matching with carnival drum beats | +$20-50 |
| **Canada** | Ice Fishing | Tap quickly when fish appears in ice hole | +5-15 Food |
| **USA** | Firework Launcher | Tap to launch fireworks at the right moment | +$30-60 |

### 11.3 Scoring System

Performance determines reward tier:

| Performance | Rating | Reward Multiplier |
|-------------|--------|-------------------|
| 90-100% | ⭐⭐⭐ Perfect! | 3x base reward |
| 70-89% | ⭐⭐ Great! | 2x base reward |
| 50-69% | ⭐ Good! | 1x base reward |
| Below 50% | Try Again! | 0.5x base reward |

### 11.4 Mini-Game UI

```
┌─────────────────────────────────────────────────────────────┐
│  🇫🇷 WELCOME TO FRANCE!                                     │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │     🥐    🥐         🥐                             │   │
│  │        🥐      🥯          🥐                       │   │
│  │   🥐         🥐    🥐           🥐                  │   │
│  │                                                     │   │
│  │              🧺                                     │   │
│  │         [drag basket]                               │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Score: 12/15 🥐    Time: 0:18                              │
│                                                             │
│  [ SKIP GAME ]                                              │
└─────────────────────────────────────────────────────────────┘
```

### 11.5 Results Screen

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              ⭐⭐⭐ PERFECT! ⭐⭐⭐                          │
│                                                             │
│         You caught 14 out of 15 croissants!                │
│                                                             │
│              🥐 → +15 Food                                  │
│                                                             │
│         Conductor Owl: "Magnifique! The crew                │
│                        will eat well tonight!"              │
│                                                             │
│                    [ CONTINUE ]                             │
└─────────────────────────────────────────────────────────────┘
```

### 11.6 Implementation Notes

- Mini-games use simple tap/drag mechanics suitable for ages 5-8
- Visual feedback: items sparkle when caught, shake when missed
- Sound effects: positive chimes for catches, gentle "whoops" for misses
- No penalty for poor performance—just smaller bonus
- First visit to each country shows brief tutorial for that mini-game

---

## 12. Mystery Cargo System

Players occasionally discover mystery crates during travel that reveal surprises at the next station. This adds anticipation and collectible rewards to the journey.

### 12.1 Overview

- **Discovery**: ~25% chance per turn to find a mystery crate
- **Storage**: Crates sit visibly on the train until opened
- **Opening**: Crates open automatically upon arriving at next station
- **Maximum**: Can hold up to 3 crates at once

### 12.2 Discovery Animation

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│         ✨ MYSTERY CRATE FOUND! ✨                          │
│                                                             │
│                    ┌─────────┐                              │
│                    │  ❓❓❓  │                              │
│                    │  📦     │                              │
│                    └─────────┘                              │
│                                                             │
│         "A mysterious crate was spotted by                  │
│          the tracks! Let's see what's inside                │
│          at the next station..."                            │
│                                                             │
│                    [ EXCITING! ]                            │
└─────────────────────────────────────────────────────────────┘
```

### 12.3 Crate Tiers & Rewards

| Tier | Appearance | Chance | Possible Contents |
|------|------------|--------|-------------------|
| **Common** | Brown box 📦 | 60% | +10 Food, +15 Fuel, +$25 |
| **Uncommon** | Silver box 🎁 | 30% | Train sticker, crew accessory, +$50 |
| **Rare** | Golden box ✨ | 10% | Special decoration, golden whistle, rare costume |

### 12.4 Collectible Rewards

#### Train Decorations
| Item | Description | Visual Effect |
|------|-------------|---------------|
| Country Flag | Flag of discovered country | Waves from train roof |
| Flower Garland | Colorful flowers | Drapes along train cars |
| String Lights | Twinkling lights | Glows at night |
| Golden Bell | Shiny bell | Rings during movement |
| Rainbow Smoke | Special smoke effect | Colorful puffs from engine |

#### Crew Accessories
| Item | Description | Who Can Wear |
|------|-------------|--------------|
| Top Hat | Fancy formal hat | Any crew member |
| Chef's Toque | Tall chef hat | Cook role |
| Safety Goggles | Protective eyewear | Engineer role |
| Sheriff Badge | Shiny star badge | Security role |
| Party Hat | Colorful cone | Any crew member |
| Sunglasses | Cool shades | Captain |

### 12.5 Opening Animation

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              🎉 OPENING MYSTERY CRATE! 🎉                   │
│                                                             │
│                       ✨✨✨                                 │
│                    ┌─────────┐                              │
│                    │ OPENING │                              │
│                    │   ...   │                              │
│                    └─────────┘                              │
│                       ✨✨✨                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘

                          ↓

┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              🌟 YOU GOT A RARE ITEM! 🌟                     │
│                                                             │
│                    ┌─────────┐                              │
│                    │  🎩     │                              │
│                    │ Top Hat │                              │
│                    └─────────┘                              │
│                                                             │
│         "A fancy Top Hat! Your crew will                    │
│          look very distinguished!"                          │
│                                                             │
│           [ EQUIP NOW ]    [ SAVE FOR LATER ]               │
└─────────────────────────────────────────────────────────────┘
```

### 12.6 Train Display with Crates

```
  Crates waiting to open:

  🚂════🚃════🚃════🚃════📦════🎁
  [engine][fuel][food][water][crate][crate]
```

### 12.7 Collection Gallery

Players can view all discovered items in a collection screen:

```
┌─────────────────────────────────────────────────────────────┐
│  📦 MY COLLECTION                           Found: 12/30    │
├─────────────────────────────────────────────────────────────┤
│  TRAIN DECORATIONS                                          │
│  [🇫🇷] [🇩🇪] [🇷🇺] [??] [??] [??] [??] [??] [??] [??]       │
│  [🌸] [💡] [??] [??] [??]                                   │
│                                                             │
│  CREW ACCESSORIES                                           │
│  [🎩] [👓] [??] [??] [??] [??] [??] [??]                    │
│                                                             │
│  SPECIAL ITEMS                                              │
│  [🔔] [??] [??] [??] [??]                                   │
│                                                             │
│                         [ BACK ]                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 13. Interactive Country Quiz

When arriving at each country, players can take a fun quiz to learn facts about that country and earn bonus resources. This adds educational value while rewarding curious players.

### 13.1 Overview

- **Trigger**: Quiz option appears after station arrival (after mini-game if enabled)
- **Format**: 3 multiple-choice questions per country
- **Reward**: Bonus resources for correct answers
- **Age-appropriate**: Questions designed for 5-8 year olds with visual hints

### 13.2 Quiz Flow

```
┌─────────────────────────────────────────────────────────────┐
│  🇯🇵 JAPAN QUIZ!                              Question 1/3  │
│                                                             │
│  🦉 Conductor Owl asks:                                     │
│                                                             │
│     "What is the tallest mountain in Japan?"                │
│                                                             │
│              🗻                                              │
│         (shows mountain image)                              │
│                                                             │
│     ┌─────────────────┐   ┌─────────────────┐              │
│     │ A) Mount Fuji   │   │ B) Mount Everest│              │
│     └─────────────────┘   └─────────────────┘              │
│     ┌─────────────────┐   ┌─────────────────┐              │
│     │ C) Rocky Mountain│   │ D) Mount Doom   │              │
│     └─────────────────┘   └─────────────────┘              │
│                                                             │
│                      [ SKIP QUIZ ]                          │
└─────────────────────────────────────────────────────────────┘
```

### 13.3 Quiz Questions by Country

#### France 🇫🇷
| Question | Answer | Fun Fact |
|----------|--------|----------|
| What famous tower is in Paris? | Eiffel Tower | It was built in 1889 and is 330 meters tall! |
| What food is France famous for? | Croissants | French bakers wake up at 4am to make fresh ones! |
| What language do people speak in France? | French | "Bonjour" means "Hello"! |

#### Germany 🇩🇪
| Question | Answer | Fun Fact |
|----------|--------|----------|
| What is Germany famous for making? | Cars (BMW, Mercedes) | Germany invented the first car! |
| What sweet treat comes from Germany? | Gummy bears | Invented in 1922 by Hans Riegel! |
| What big forest is in Germany? | Black Forest | It inspired the fairy tale Hansel and Gretel! |

#### Russia 🇷🇺
| Question | Answer | Fun Fact |
|----------|--------|----------|
| What are the stacking dolls called? | Matryoshka | Each doll has a smaller doll inside! |
| What is the biggest country in the world? | Russia | It spans 11 time zones! |
| What colorful building is in Moscow? | St. Basil's Cathedral | It looks like a candy castle! |

#### China 🇨🇳
| Question | Answer | Fun Fact |
|----------|--------|----------|
| What long wall is in China? | Great Wall | It's so long you could walk it for 18 months! |
| What cuddly animal lives in China? | Panda | They eat bamboo for 12 hours every day! |
| What did China invent for celebrations? | Fireworks | Over 1000 years ago! |

#### Japan 🇯🇵
| Question | Answer | Fun Fact |
|----------|--------|----------|
| What is the tallest mountain in Japan? | Mount Fuji | People climb it to see the sunrise! |
| What pretty pink tree blooms in spring? | Cherry blossom | Japanese people have picnics under them! |
| What fast trains does Japan have? | Bullet trains | They go 320 km/h - faster than a cheetah! |

#### Singapore 🇸🇬
| Question | Answer | Fun Fact |
|----------|--------|----------|
| What mythical creature is Singapore's symbol? | Merlion | Half lion, half fish! |
| Singapore is famous for keeping what? | Clean streets | Chewing gum is not allowed! |
| What grows on top of buildings in Singapore? | Gardens/Trees | The airport has a waterfall inside! |

#### Australia 🇦🇺
| Question | Answer | Fun Fact |
|----------|--------|----------|
| What animal hops and has a pouch? | Kangaroo | Baby kangaroos are called joeys! |
| What famous opera house is in Sydney? | Sydney Opera House | It looks like giant white seashells! |
| What big rock is in the Australian desert? | Uluru | It changes color at sunset! |

#### Brazil 🇧🇷
| Question | Answer | Fun Fact |
|----------|--------|----------|
| What big rainforest is in Brazil? | Amazon | It has 10% of all animals on Earth! |
| What famous carnival happens in Brazil? | Rio Carnival | People dance for 5 days straight! |
| What sport is Brazil most famous for? | Soccer/Football | They've won the World Cup 5 times! |

#### Canada 🇨🇦
| Question | Answer | Fun Fact |
|----------|--------|----------|
| What leaf is on Canada's flag? | Maple leaf | Maple syrup comes from these trees! |
| What big waterfall is between Canada and USA? | Niagara Falls | 3,000 tons of water fall every second! |
| What animal builds dams? | Beaver | They're Canada's national animal! |

#### USA 🇺🇸
| Question | Answer | Fun Fact |
|----------|--------|----------|
| What green statue welcomes visitors to New York? | Statue of Liberty | It was a gift from France! |
| What giant carved mountain has 4 presidents? | Mount Rushmore | Each face is 18 meters tall! |
| What did America invent that you eat at movies? | Popcorn | Americans eat 17 billion quarts per year! |

### 13.4 Answer Feedback

#### Correct Answer
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              ✅ CORRECT! ✅                                  │
│                                                             │
│  🦉 "That's right! Mount Fuji is Japan's                    │
│      tallest mountain at 3,776 meters!"                     │
│                                                             │
│              🗻 ← (mountain does happy wiggle)               │
│                                                             │
│              +$10 bonus!                                    │
│                                                             │
│                   [ NEXT QUESTION ]                         │
└─────────────────────────────────────────────────────────────┘
```

#### Wrong Answer
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              🤔 NOT QUITE!                                   │
│                                                             │
│  🦉 "Good try! The answer is Mount Fuji.                    │
│      It's a beautiful volcano in Japan!"                    │
│                                                             │
│              🗻 ← (shows correct answer)                     │
│                                                             │
│         "Now you know for next time!"                       │
│                                                             │
│                   [ NEXT QUESTION ]                         │
└─────────────────────────────────────────────────────────────┘
```

### 13.5 Quiz Results & Rewards

| Score | Rating | Reward |
|-------|--------|--------|
| 3/3 Correct | 🌟 Quiz Master! | +$30 + Rare passport stamp |
| 2/3 Correct | ⭐ Great Job! | +$20 |
| 1/3 Correct | 👍 Good Try! | +$10 |
| 0/3 Correct | 📚 Keep Learning! | +$5 (participation) |

### 13.6 Quiz Complete Screen

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│           🌟 QUIZ MASTER! 🌟                                │
│                                                             │
│         You got 3 out of 3 correct!                        │
│                                                             │
│  🦉 "Amazing! You really know Japan!"                       │
│                                                             │
│         Rewards:                                            │
│         💰 +$30                                             │
│         🎫 Special Japan Stamp!                             │
│                                                             │
│         Fun Facts Unlocked: 3                               │
│         (View in your Travel Journal!)                      │
│                                                             │
│                    [ CONTINUE ]                             │
└─────────────────────────────────────────────────────────────┘
```

### 13.7 Quiz Settings

Parents/guardians can configure quiz behavior:

| Setting | Options | Default |
|---------|---------|---------|
| Quiz Enabled | On / Off | On |
| Difficulty | Easy (2 choices) / Normal (4 choices) | Normal |
| Read Aloud | On / Off | On (for ages 5-6) |
| Show Hints | On / Off | On |

---

---

## 14. Game Balance Reference

Quick reference for all numerical values used in game calculations.

### 14.1 Core Numbers

| Category | Value |
|----------|-------|
| Dice range | 1-10 |
| Countries | 10 |
| Distance per country | 10 units |
| Total distance to win | 90 units |
| Expected game length | 10-18 turns |

### 14.2 Starting Resources

| Resource | Starting | Maximum |
|----------|----------|---------|
| Food | 50 | 100 |
| Fuel | 100 | 200 |
| Water | 50 | 100 |
| Money | $200 | $1000 |

### 14.3 Captain Stats

| Captain | Engineering | Food | Security |
|---------|-------------|------|----------|
| Renji | **5** | 2 | 3 |
| Luca | 2 | **5** | 3 |
| Cooper | 3 | 2 | **5** |

**Stat Effects:**
- Engineering: Reduces fuel by `stat - 2` per turn
- Food: Adds `stat` to food production per turn
- Security: Adds `stat × $5` to station earnings

### 14.4 Train Stats

| Train | Speed | Reliability | Power |
|-------|-------|-------------|-------|
| Blitzzug | 3 | **5** | 3 |
| Kitsune | **5** | 3 | 3 |
| Ironhorse | 3 | 3 | **5** |

**Stat Effects:**
- Speed: Added to dice roll for movement
- Reliability: Reduces event chance by `stat × 5%` *(future)*
- Power: Reduces fuel by `stat - 3` per turn

### 14.5 Consumption Formulas

```
Fuel consumed = Distance - (Engineers × 2) - (Power - 3) - (Engineering - 2)
               Minimum: 1

Food consumed = 2 + Crew count
               Example: 2 + 4 = 6/turn

Water consumed = Crew count
                Example: 4/turn

Wages = (Assigned × $5) + (Free × $2)
        Example: 3 assigned + 1 free = $17/turn
```

### 14.6 Production Formulas

```
Food produced = (Cooks × 3) + Captain Food stat
               Example with Luca: (1 × 3) + 5 = 8/turn

Station earnings = $30 + (Captain Security × $5) + (Security crew × $2)
                  Example with Cooper + 1 Security: $30 + $25 + $2 = $57

Water refill = Refill to MAX at each station

Fuel purchase = $5 per 10 fuel (at stations only)
```

### 14.7 Crew Role Effects

| Role | Wage | Effect |
|------|------|--------|
| Engineer | $5 | -2 fuel/turn |
| Cook | $5 | +3 food/turn |
| Security | $5 | +$2/station, +3 event defense |
| Free | $2 | None |

### 14.8 Win/Lose Conditions

| Condition | Trigger | Screen |
|-----------|---------|--------|
| **Victory** | Reach USA (country index 9) | Victory Screen |
| **Starvation** | Food = 0 | Game Over |
| **Empty Tank** | Fuel = 0 | Game Over |
| **Dehydration** | Water = 0 | Game Over |
| **Bankruptcy** | Money < 0 after wages | Game Over |

### 14.9 Event System (Future)

| Event | Stat | Difficulty | Penalty |
|-------|------|------------|---------|
| Bandit Attack | Security | 8 | -$50, -1 crew |
| Pickpockets | Security | 5 | -$30 |
| Engine Failure | Engineering | 7 | -20 fuel |
| Broken Axle | Engineering | 9 | -30 fuel, -2 progress |
| Food Spoilage | Food | 6 | -15 food |
| Crew Illness | Food | 5 | -10 food |
| Storm | Engineering | 8 | -25 fuel |
| Supply Theft | Security | 6 | -$40, -10 food |

**Event chance per turn:** 40% (reduced by train Reliability)

**Resolution:** `Dice (1-10) + Cards + Captain Stat >= Difficulty`

---

*World Tram - All aboard for adventure!* 🚂
