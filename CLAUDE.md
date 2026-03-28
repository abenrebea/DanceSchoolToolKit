# DanceSchoolToolKit

Revenue simulator for solo teachers (dance, yoga, pilates, etc.) starting their own business.

## Tech Stack

- React 19 + TypeScript
- Vite 6 (dev port 3011)
- Tailwind CSS via CDN (loaded in index.html, NOT via PostCSS)
- Lucide React for icons
- No backend, no database — fully client-side

## Commands

- `npm run dev` — start dev server on port 3011
- `npm run build` — type-check then build for production
- `npx tsc -b` — type-check only

## Architecture

Single-page 5-step wizard app. All state lives in a single `useReducer` exposed via React Context.

```
src/
  types.ts                          # All TypeScript interfaces (source of truth)
  context/SimulatorContext.tsx       # useReducer + Context provider, all actions
  hooks/useSimulator.ts             # Memoized derived calculations from state
  utils/calculations.ts             # Pure functions: season weeks, costs, revenue, equilibrium
  utils/defaults.ts                 # Default state with example data
  components/
    Layout.tsx                      # Step routing + navigation buttons
    Stepper.tsx                     # Horizontal step indicator
    WeeklySchedule.tsx              # Step 1: class slots
    SeasonCalendar.tsx              # Step 2: season dates + holidays
    PaymentOffers.tsx               # Step 3: pricing configuration
    Charges.tsx                     # Step 4: rent + fixed costs
    Simulation.tsx                  # Step 5: equilibrium + sliders + profit/loss
```

## Data Flow

- State mutations go through `dispatch(action)` from `SimulatorContext`
- Derived values (seasonWeeks, annualCost, equilibrium, etc.) are computed in `useSimulator` hook via `useMemo`
- `calculations.ts` contains only pure functions — no React, no side effects

## Code Style

- Use ES modules (import/export), never CommonJS
- Use `type` imports for TypeScript types: `import type { Foo } from './types'`
- Tailwind classes directly in JSX — no CSS files, no styled-components
- French labels in the UI, English in code (variable names, comments)
- Components are default exports, hooks and utilities are named exports

## Key Design Decisions

- **Tailwind via CDN**: custom `brand` color palette is configured in `index.html` `<script>` block, not in a tailwind config file
- **No date library**: native `Date` is sufficient for week iteration and holiday overlap checks
- **Slider model**: for trial/dropin/package, the slider count means "units sold across the season"; for annual/unlimited, it means "number of subscribers"
- **Equilibrium algorithm**: distributes annual cost across offer types using weighted percentages (trial 3%, dropin 12%, package 20%, annual 35%, unlimited 30%), normalized to offers actually present

## Testing Checklist

Before committing, verify:
1. `npx tsc -b` passes with no errors
2. `npm run build` succeeds
3. Default data computes ~41 season weeks (Sept 2025 – June 2026 minus 4 holiday periods)
4. Annual cost with defaults: 45 EUR/h × 8h × season weeks
