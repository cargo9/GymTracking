# Gym Tracking

A workout tracker for the gym, written in plain TypeScript: no framework, just the DOM.

**Live:** https://gym-tracking-three.vercel.app

## Features

- **Strength sets:** exercise, weight and reps, with an automatic rest timer after each set.
- **Cardio** with its own timer.
- **Stats:** week streak, total volume and session time.
- **Calendar** of past workouts, split into strength and cardio days.
- **Personal records:** a new best is highlighted when you hit it.
- **Settings:** kg / lb, default rest time, sound signal, English / Russian.
- **Saved in the browser** (`localStorage`), so nothing needs to be signed in or synced.

## Run

```sh
npm install
npm run build      # tsc → compiles src/*.ts
# open index.html (or serve the folder with any static server)
```

Deployed on Vercel. See `vercel.json` for the configuration.

## Structure

```
index.html
src/
├── main.ts     UI, timers, calendar, records, i18n
├── types.ts    WorkoutSet, Exercise, Workout
└── main.css
```
