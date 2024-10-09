import { Minimax } from "./Minimax";

export function aiMove(board: (string | null)[], setBoard: (board: (string | null)[]) => void, setXIsNext: (xIsNext: boolean) => void,) {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
            board[i] = "O"; // Turno de la IA
            const score = Minimax(board, 0, false);
            board[i] = null;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    const newBoard = [...board];
    newBoard[move!] = "O";
    setBoard(newBoard);
    setXIsNext(true);
};
