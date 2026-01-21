# CLAUDE.md - Project Guidelines

## Core Principles

### Simplicity First
- Write the simplest code that solves the problem
- Avoid premature abstraction - duplicate code is better than wrong abstraction
- Delete unused code rather than commenting it out
- Prefer standard library solutions over external dependencies

### Test-Driven Development
All code changes must follow TDD. See [TDD section](#test-driven-development-tdd) for full workflow.

## Subagent Architecture

**CRITICAL:** This project uses subagents for all development work. The orchestrator agent coordinates work but does NOT write code directly.

### Subagent Types

| Agent Type | Purpose | Tools Available |
|------------|---------|-----------------|
| **Development Agent** | Implements features AND writes tests (TDD) | Read, Write, Edit, Glob, Grep, Bash |
| **Verification Agent** | Validates phase completion, runs full checks | Read, Glob, Grep, Bash |

### Orchestrator Responsibilities

1. **Task Assignment**: Read `issues.md`, identify available tasks `[ ]`
2. **Spawn Subagents**: Use Task tool to spawn appropriate agent type
3. **Track Progress**: Update `issues.md` status as agents complete work
4. **Coordinate**: Ensure dependencies are respected between tasks

### Subagent Workflow

```
┌─────────────────────────────────────────────────────────────┐
│  ORCHESTRATOR                                               │
│  1. Read issues.md                                          │
│  2. Find task with [ ] status                               │
│  3. Mark task as [o] BEFORE spawning agent                  │
│  4. Spawn Development Agent with task details               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  DEVELOPMENT AGENT (implements + tests)                     │
│  1. Read requirements from task                             │
│  2. Write failing test first (TDD)                          │
│  3. Implement minimum code to pass test                     │
│  4. Run tests, ensure passing                               │
│  5. Return result to orchestrator                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  ORCHESTRATOR                                               │
│  - If tests pass: Mark task [x]                             │
│  - If issues found: Mark task [!] with notes                │
│  - At end of phase: Spawn Verification Agent                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ (only at phase completion)
┌─────────────────────────────────────────────────────────────┐
│  VERIFICATION AGENT (phase validation)                      │
│  1. Run full test suite                                     │
│  2. Check for regressions                                   │
│  3. Run production build                                    │
│  4. Report final phase status                               │
└─────────────────────────────────────────────────────────────┘
```

### Spawning Subagents

When spawning a Development Agent, provide:
1. **Clear task description** from issues.md
2. **File paths** the agent needs to work with
3. **Test file path** for TDD
4. **Acceptance criteria** for completion

Example prompt for Development Agent:
```
Implement the IntroScreen component with tests.

Task: Create src/components/screens/IntroScreen.tsx
Test: src/__tests__/components/IntroScreen.test.tsx

Requirements:
- Display game title "WORLD TRAM"
- Display subtitle "A Turn-Based Railway Adventure"
- Include "START GAME" button that calls onStart prop
- Use pixel art styling from design system

TDD Approach:
1. First write test that renders component and checks for title
2. Then implement component to pass test
3. Add test for button click behavior
4. Implement button functionality

Acceptance criteria:
- All tests passing
- Component renders without errors
- Button triggers onStart callback when clicked
```

## Development Workflow

### Before Writing Code
1. Understand the requirements fully
2. Write failing tests that define expected behavior
3. Plan the minimal implementation needed

### While Writing Code
- Make small, incremental changes
- Commit frequently with clear messages
- Run tests after each change

### Code Style

**JavaScript/TypeScript:**
- Use ESLint configuration
- Prefer functional components (React)
- Use meaningful variable and function names
- Keep functions small and focused

## Project Commands

```bash
npm run dev            # Start development server
npm run build          # Build for production
npm test               # Run all tests
npm test -- --watch    # Run tests in watch mode
npm test -- --coverage # Run with coverage report
npm run lint           # Run ESLint
```

## Architecture Guidelines

- Keep modules loosely coupled
- Validate input at system boundaries, trust internal code
- Handle errors at appropriate levels - don't over-catch
- Prefer explicit over implicit behavior

## Issue Tracking

### Location
All project tasks are tracked in: **`issues.md`**

### Tracking Symbols

| Symbol | Status | Meaning |
|--------|--------|---------|
| `[ ]` | Available | Task not started, ready to be picked up |
| `[o]` | In Progress | An agent is currently working on this |
| `[x]` | Done | Implementation complete AND tests passing |
| `[!]` | Blocked/Issue | Task has problems that need resolution |

### CRITICAL: Task Pickup Protocol

**BEFORE an agent starts work on ANY task, the orchestrator MUST:**

1. **Mark the task `[o]`** in issues.md FIRST
2. **Then spawn** the subagent to work on it
3. **Never** spawn an agent without marking the task in progress
4. **Never** pick a task that is `[o]` or `[x]`
5. **Never** take over a task marked `[o]` and DO NOT spawn subagents if you did not mark the task `[o]`  in issues.md
6. **Only** agent that marked the task `[o]` can spawn subagents to work on it

This prevents multiple agents from working on the same task.

### Task Structure in issues.md

Tasks are organized by feature area. Each task should be:
- **Atomic**: Completable by a single agent in one session
- **Independent**: Minimal dependencies on other incomplete tasks
- **Testable**: Has clear acceptance criteria

```markdown
## Feature Area

### Task Group Name
- [ ] Task 1 description
  - File: path/to/file.ts
  - Tests: path/to/test.ts
  - Depends: none
- [ ] Task 2 description
  - File: path/to/file.ts
  - Tests: path/to/test.ts
  - Depends: Task 1
```

### Workflow for Completing Tasks

1. **Pick a task:**
   - Find a task with `[ ]` status
   - Verify dependencies are `[x]` (completed)
   - **Mark `[ ]` → `[o]` IMMEDIATELY**

2. **Execute task:**
   - Spawn **single Development Agent** to implement code AND tests
   - Agent follows TDD: test first, then implementation

3. **Mark completion:**
   - All tests pass → Mark `[o]` → `[x]`
   - Issues found → Mark `[o]` → `[!]` with notes
   - Never mark `[x]` without passing tests

4. **Phase completion:**
   - After all tasks in a phase are `[x]`
   - Spawn **Verification Agent** to run full test suite and build

## Test-Driven Development (TDD)

**CRITICAL:** This project follows TDD. All code changes MUST have tests.

### TDD Workflow

1. **Write the test first** (it should fail)
2. **Implement the minimum code** to make the test pass
3. **Refactor** if needed while keeping tests green
4. **Run all tests** before marking task complete

### Test File Structure
```
src/
├── __tests__/
│   ├── logic/
│   │   ├── gameState.test.ts
│   │   ├── turnLoop.test.ts
│   │   └── resources.test.ts
│   └── components/
│       ├── IntroScreen.test.tsx
│       ├── CaptainSelection.test.tsx
│       ├── TrainSelection.test.tsx
│       └── Dashboard.test.tsx
├── components/
├── logic/
└── data/
```

### Marking Tasks Complete
A task can ONLY be marked `[x]` when:
1. The implementation is complete
2. Tests are written and passing
3. No regressions in existing tests

## System Verification

**Spawn a Verification Agent at the end of each phase** to:

1. **Run the full test suite** - `npm test`
2. **Run the build** - `npm run build`
3. **Check for regressions** - ensure existing functionality works
4. **Manual smoke test** - run `npm run dev` and check core flows

This reduces verification overhead - only verify once per phase instead of per task.
