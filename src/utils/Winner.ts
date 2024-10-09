export function CalculateWinner(squares: (string | null)[]) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
        [0, 4, 8], [2, 4, 6],            // Diagonales
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return squares.includes(null) ? null : 'Tie';
}
