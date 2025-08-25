"use client";

import { useMemo } from "react";
import { useTicTacToe, Mode } from "@/hooks/useTicTacToe";

function StatusBadge({ label, color }: { label: string; color: "primary" | "accent" | "neutral" }) {
  const colorClass =
    color === "primary"
      ? "bg-[color:var(--color-primary)]"
      : color === "accent"
      ? "bg-[color:var(--color-accent)]"
      : "bg-gray-400";
  return (
    <span className={`inline-flex items-center px-3 py-1 text-white text-xs font-semibold rounded-full ${colorClass}`}>
      {label}
    </span>
  );
}

export default function Home() {
  const { state, makeMove, restartGame, resetAll, setMode } = useTicTacToe("pvc");
  const { board, currentPlayer, winner, gameOver, mode, scores } = state;

  const statusLabel = useMemo(() => {
    if (winner === "draw") return { text: "It's a draw!", color: "neutral" as const };
    if (winner === "X") return { text: "X wins! 🎉", color: "primary" as const };
    if (winner === "O") return { text: mode === "pvc" ? "Computer wins! 🤖" : "O wins! 🎉", color: "accent" as const };
    return { text: `${currentPlayer}'s turn`, color: currentPlayer === "X" ? ("primary" as const) : ("accent" as const) };
  }, [winner, currentPlayer, mode]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* App header */}
        <header className="flex flex-col items-center gap-2 mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ color: "var(--color-secondary)" }}>
            Tic Tac Toe
          </h1>
          <p className="text-sm text-gray-600 text-center">
            Play against a friend or a computer. Clean, responsive, modern UI.
          </p>
        </header>

        <section className="card p-4 md:p-6">
          {/* Scoreboard */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <StatusBadge label={`Mode: ${mode === "pvc" ? "Player vs Computer" : "Player vs Player"}`} color="neutral" />
              <StatusBadge label={statusLabel.text} color={statusLabel.color} />
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-2 rounded-lg bg-blue-50 border border-blue-100">
                <span className="text-xs text-blue-700 font-semibold">X</span>
                <span className="mx-2 text-sm text-blue-900 font-bold">{scores.X}</span>
              </div>
              <div className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-100">
                <span className="text-xs text-amber-700 font-semibold">O</span>
                <span className="mx-2 text-sm text-amber-900 font-bold">{scores.O}</span>
              </div>
              <div className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
                <span className="text-xs text-gray-700 font-semibold">Draws</span>
                <span className="mx-2 text-sm text-gray-900 font-bold">{scores.draws}</span>
              </div>
            </div>
          </div>

          {/* Board centered */}
          <div className="grid md:grid-cols-[1fr_minmax(260px,360px)_1fr] items-center gap-4">
            <div className="hidden md:block" />
            <div className="w-full">
              <div className="board">
                {board.map((cell, idx) => {
                  const disabled = gameOver || cell !== null || (mode === "pvc" && currentPlayer === "O");
                  return (
                    <button
                      key={idx}
                      aria-label={`Cell ${idx + 1}`}
                      disabled={disabled}
                      onClick={() => makeMove(idx)}
                      className={`cell ${cell ?? ""} ${disabled ? "disabled" : ""}`}
                    >
                      {cell}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="hidden md:block" />
          </div>

          {/* Controls */}
          <div className="mt-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="mode" className="text-sm font-medium text-gray-700">
                Mode
              </label>
              <select
                id="mode"
                value={mode}
                onChange={(e) => setMode(e.target.value as Mode)}
                className="select"
              >
                <option value="pvc">Player vs Computer</option>
                <option value="pvp">Player vs Player</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn btn-primary" onClick={restartGame}>
                Restart Round
              </button>
              <button className="btn btn-outline" onClick={resetAll}>
                Reset All
              </button>
            </div>
          </div>

          {/* Helper text */}
          <p className="mt-4 text-xs text-gray-500">
            Tip: X always goes first on a new match. Restart alternates the starting player for fairness.
          </p>
        </section>

        <footer className="mt-6 text-center text-xs text-gray-500">
          Primary: #1976d2 • Secondary: #424242 • Accent: #ffb300
        </footer>
      </div>
    </main>
  );
}
