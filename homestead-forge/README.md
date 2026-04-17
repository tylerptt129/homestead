# Homestead Forge

A cross-platform mountain homestead planning app. Plan your land. Build your life. Track every step.

## Quick Start (Web)

Prerequisites: Node.js 18+ and npm.

```bash
# Clone and enter
git clone <your-repo-url>
cd homestead/homestead-forge

# Install (React 19 needs legacy-peer-deps)
npm install --legacy-peer-deps

# Start the web dev server
npx expo start --web
```

The app will open at `http://localhost:8081` in your browser.

## What's Included (Phase 1 MVP)

- **12 Planning Modules** with 115 steps of real homesteading content
  - Land Assessment, Water Systems, Shelter, Power, Garden, Orchard
  - Livestock, Preservation, Tools, Security, Financial, Community
- **Onboarding flow** — 5 steps to set up your homestead profile
- **Dashboard** — overall progress, seasonal wisdom, continue where you left off
- **Module & Step Detail** — autosaved notes, cost tracking, status workflow, pro tips
- **Journal** — mood picker, module linking, tags
- **Budget** — category breakdowns, charts
- **Profile** — homestead info, dark/light theme toggle
- **Offline-first** — all data persists to localStorage

## Architecture

```
app/              # Expo Router file-based routes
  (tabs)/         # Bottom tab navigation
  modules/        # Module and step detail routes
  journal/        # Journal screens
  budget/         # Budget screens
  onboarding/     # First-run onboarding
components/
  atoms/          # Button, Card, Input, Icon, ProgressRing, etc.
  molecules/      # ModuleCard, StepItem, JournalCard, etc.
theme/            # Mountain Homestead design tokens
stores/           # Zustand stores (modules, progress, journal, budget, auth)
hooks/            # useAutosave, useModuleProgress
data/
  seed/           # 12 modules with all step content
  queries/        # Supabase query functions
  supabase/       # Supabase client
supabase/
  migrations/     # SQL schema with RLS policies
types/            # TypeScript interfaces
```

## Tech Stack

- **Expo SDK 54** with **Expo Router** (file-based routing)
- **React 19** + **React Native 0.81** + **React Native Web 0.20**
- **TypeScript** strict mode
- **Zustand** state management with localStorage persistence
- **Supabase** (schema ready; client wired but MVP uses localStorage)

## Design System

The "Mountain Homestead" aesthetic:
- **Colors**: Charred timber, worn leather, wheat gold, mountain pine green
- **Typography**: Playfair Display (headings), Source Sans 3 (body), JetBrains Mono (data), Caveat (accents)
- **Components**: Warm shadows, 12px radius, topographic line textures

## Notes

- Data is currently persisted to **localStorage only** (offline-first MVP). Supabase wiring is ready for Phase 2.
- Icons use Unicode fallback symbols in the web MVP. Lucide icons will be wired in Phase 2 (mobile).
- No sign-up or auth yet — the app uses a local-only profile for the MVP.

## Roadmap

**Phase 2:**
- Supabase auth and cloud sync
- Photo upload and galleries
- Proper Lucide icon set
- Mobile (iOS/Android) via EAS Build
- Push notifications for seasonal tasks
- Data export (CSV/PDF)

**Phase 3:**
- Property map annotations
- Daily quick-log (eggs, milk, harvest)
- Family/helper sharing
- App Store + Google Play launch
