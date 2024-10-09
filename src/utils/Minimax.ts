/* eslint-disable prefer-const */
import { CalculateWinner } from "./Winner";

export function Minimax(board: (string | null)[], depth: number, isMaximizing: boolean) {
    const winner = CalculateWinner(board);
    if (winner === "X") return -10;
    if (winner === "O") return 10;
    //if (isBoardFull(board)) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = "O";
                let score = Minimax(board, depth + 1, false);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = "X";
                let score = Minimax(board, depth + 1, true);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
};
