# Tic Tac Toe Frontend (Next.js)

A modern, responsive Tic Tac Toe game built with Next.js.

Features:
- Interactive 3x3 game board
- Player vs Player and Player vs Computer modes
- Game state display (turn, win, loss, draw)
- Scoreboard (X, O, Draws)
- Restart round (alternates starter) and Reset all
- Light, modern styling with theme colors:
  - Primary: `#1976d2`
  - Secondary: `#424242`
  - Accent: `#ffb300`

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser to play.

## Scripts

- `npm run dev` - Start the Next.js development server
- `npm run build` - Build the app
- `npm start` - Start the production server (after build)
- `npm run lint` - Lint the project

## Build and Run (Production)

```bash
npm run build
npm start
```

This project is configured for static export (see `next.config.ts`).

## Gameplay Notes

- In Player vs Computer mode, the AI uses a lightweight strategy:
  - Try to win → Block opponent → Take center → Take a corner → Take an edge.
- Restart alternates the starting player for fairness across rounds.
- Reset clears both the board and the cumulative scores.

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS (v4) for base utilities
- Custom CSS variables for theme

## Project Structure

- `src/app/page.tsx` - Main game UI
- `src/hooks/useTicTacToe.ts` - Game logic and state management hook
- `src/app/globals.css` - Global styles and theme variables
- `public/favicon.ico` - Favicon (placeholder, replace as needed)

## Theming

This UI uses a light, modern theme:
- Primary: `#1976d2`
- Secondary: `#424242`
- Accent: `#ffb300`

You can adjust theme colors in `src/app/globals.css`.

## License

This project is provided as-is for demonstration and learning purposes.
