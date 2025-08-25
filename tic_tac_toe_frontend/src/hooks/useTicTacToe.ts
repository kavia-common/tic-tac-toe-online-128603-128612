import { useCallback, useMemo, useState } from "react";

export type Player = "X" | "O";
export type Cell = Player | null;
export type Board = Cell[];
export type Mode = "pvp" | "pvc";

export interface Scores {
  X: number;
  O: number;
  draws: number;
}

export interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: Player | "draw" | null;
  gameOver: boolean;
  mode: Mode;
  scores: Scores;
}

// PUBLIC_INTERFACE
export function useTicTacToe(initialMode: Mode = "pvc") {
  /** Hook managing Tic Tac Toe state, moves, mode, restart and reset. */
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | "draw" | null>(null);
  const [mode, setMode] = useState<Mode>(initialMode);
  const [scores, setScores] = useState<Scores>({ X: 0, O: 0, draws: 0 });

  const gameOver = winner !== null;

  const winningLines = useMemo(
    () => [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ],
    []
  );

  const evaluateWinner = useCallback(
    (brd: Board): Player | "draw" | null => {
      for (const [a, b, c] of winningLines) {
        if (brd[a] && brd[a] === brd[b] && brd[a] === brd[c]) {
          return brd[a];
        }
      }
      if (brd.every((c) => c !== null)) return "draw";
      return null;
    },
    [winningLines]
  );

  const computeBestMove = useCallback(
    (brd: Board, ai: Player): number => {
      // Simple minimax with immediate win/block check, then center/corners/edges heuristic.
      const human: Player = ai === "X" ? "O" : "X";

      const tryWinOrBlock = (p: Player): number | null => {
        for (let i = 0; i < 9; i++) {
          if (brd[i] === null) {
            const tmp = brd.slice();
            tmp[i] = p;
            if (evaluateWinner(tmp) === p) return i;
          }
        }
        return null;
      };

      // 1) Win
      const w = tryWinOrBlock(ai);
      if (w !== null) return w;
      // 2) Block
      const b = tryWinOrBlock(human);
      if (b !== null) return b;

      // 3) Center
      if (brd[4] === null) return 4;

      // 4) Corners
      const corners = [0, 2, 6, 8].filter((i) => brd[i] === null);
      if (corners.length) return corners[Math.floor(Math.random() * corners.length)];

      // 5) Edges
      const edges = [1, 3, 5, 7].filter((i) => brd[i] === null);
      if (edges.length) return edges[Math.floor(Math.random() * edges.length)];

      return -1;
    },
    [evaluateWinner]
  );

  const applyWinnerAndScores = useCallback(
    (maybeWinner: Player | "draw" | null) => {
      if (maybeWinner) {
        setWinner(maybeWinner);
        setScores((prev) => {
          if (maybeWinner === "draw") {
            return { ...prev, draws: prev.draws + 1 };
          }
          return { ...prev, [maybeWinner]: prev[maybeWinner] + 1 };
        });
      }
    },
    []
  );

  // PUBLIC_INTERFACE
  const makeMove = useCallback(
    (index: number) => {
      /** Applies a move on the given index if legal, then triggers AI if in pvc mode. */
      if (gameOver || board[index] !== null) return;

      const newBoard = board.slice();
      newBoard[index] = currentPlayer;
      setBoard(newBoard);

      const w = evaluateWinner(newBoard);
      if (w) {
        applyWinnerAndScores(w);
        return;
      }

      const next = currentPlayer === "X" ? "O" : "X";
      setCurrentPlayer(next);

      // If playing vs computer and it's AI's turn:
      if (mode === "pvc" && next === "O") {
        // Delay AI move slightly for UX
        setTimeout(() => {
          setBoard((prevBoard) => {
            const aiIndex = computeBestMove(prevBoard, "O");
            if (aiIndex < 0 || prevBoard[aiIndex] !== null || winner) return prevBoard;

            const afterAI = prevBoard.slice();
            afterAI[aiIndex] = "O";

            const w2 = evaluateWinner(afterAI);
            if (w2) {
              setBoard(afterAI);
              applyWinnerAndScores(w2);
              return afterAI;
            }

            setCurrentPlayer("X");
            return afterAI;
          });
        }, 350);
      }
    },
    [
      gameOver,
      board,
      currentPlayer,
      mode,
      evaluateWinner,
      computeBestMove,
      winner,
      applyWinnerAndScores,
    ]
  );

  // PUBLIC_INTERFACE
  const restartGame = useCallback(() => {
    /** Clears the board and randomizes starting player to keep it fair. */
    setBoard(Array(9).fill(null));
    setWinner(null);
    // Alternate starting player for fairness
    setCurrentPlayer((prev) => (prev === "X" ? "O" : "X"));
  }, []);

  // PUBLIC_INTERFACE
  const resetAll = useCallback(() => {
    /** Resets the board and all scores to initial state. */
    setBoard(Array(9).fill(null));
    setWinner(null);
    setCurrentPlayer("X");
    setScores({ X: 0, O: 0, draws: 0 });
  }, []);

  // PUBLIC_INTERFACE
  const setModeSafe = useCallback(
    (m: Mode) => {
      /** Switches mode and restarts the current game to avoid mixed states. */
      setMode(m);
      setBoard(Array(9).fill(null));
      setWinner(null);
      setCurrentPlayer("X");
    },
    []
  );

  const state: GameState = {
    board,
    currentPlayer,
    winner,
    gameOver,
    mode,
    scores,
  };

  return { state, makeMove, restartGame, resetAll, setMode: setModeSafe };
}
