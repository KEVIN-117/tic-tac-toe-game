"use client"
import { useEffect, useState } from 'react'
import { Square } from '../components/Square'
import { CalculateWinner } from '@/utils/Winner'
import { handleConfetti } from '@/utils/Congratulations'
import { aiMove } from '@/utils/AiMove'
import { User, Cpu } from 'lucide-react'
export function Board() {
    const [xIsNext, setXisNext] = useState(true)
    const [tableValue, setTableValue] = useState(Array(9).fill(null))
    const [winner, setWinner] = useState<string | null>(null);
    const [winnerCounter, setWinnerCounter] = useState({ X: 0, O: 0, Tie: 0 });

    useEffect(() => {
        const result = CalculateWinner(tableValue);
        setWinnerCounter((prev) => {
            if (result === 'X') return { ...prev, X: prev.X + 1 };
            if (result === 'O') return { ...prev, O: prev.O + 1 };
            if (result === 'Tie') return { ...prev, Tie: prev.Tie + 1 };
            return prev;
        })
        if (result) setWinner(result);
        if (result !== 'Tie' && result) {
            handleConfetti();
        }
    }, [tableValue]);

    function handleClick(index: number) {
        if (CalculateWinner(tableValue) || tableValue[index]) {
            return;
        }
        const nextSquare = [...tableValue];
        nextSquare[index] = 'X';
        setTableValue(nextSquare);
        setXisNext(false);
    }

    const resetGame = () => {
        setTableValue(Array(9).fill(null))
        setXisNext(true);
        setWinner(null);
    }

    useEffect(() => {
        if (!xIsNext && !winner) {
            aiMove(tableValue, setTableValue, setXisNext);
        }
    }, [xIsNext, tableValue, winner]);
    return (
        <>
            <div className='space-y-3'>
                <button className={`rounded-full bg-red-800/40 border border-red-800 px-4 py-2 text-xl font-bold uppercase w-full ${winner ? 'animate-bounce' : ''}`} onClick={resetGame}>{winner ? 'Iniciar nuevo Juego' : 'Reiniciar'}</button>
                <div className="flex flex-col items-center justify-center bg-stone-900/40 text-gray-200 rounded-lg">
                    {winner && <h2 className='text-4xl font-bold uppercase bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-[#0c4a6e]'>{winner === 'Tie' ? '¡Es un empate!' : `Ganador: ${winner}`}</h2>}
                    <div className="grid grid-cols-3 gap-2 p-4 bg-stone-900/40 rounded-lg shadow-lg">
                        {Array(9).fill(null).map((_, index) => (
                            <Square key={index} value={tableValue[index]} onSquareClick={() => { handleClick(index) }} />
                        ))}
                    </div>
                </div>

            </div>
            <div className="flex justify-between w-auto gap-10">
                <div className="flex gap-1 items-center bg-purple-800 bg-opacity-50 px-4 py-2 rounded-full">
                    <User className="w-6 h-6 mr-2 text-purple-400" />
                    <span>
                        EL JUGADOR X ERES TÚ
                    </span>

                    {winnerCounter.X > 0 && <p>Tiene {winnerCounter.X} victoria</p>}
                </div>
                <div className="flex items-center bg-gray-800 bg-opacity-50 px-4 py-2 rounded-full">
                    <span>
                        Empates {winnerCounter.Tie}
                    </span>
                </div>
                <div className="flex gap-1 items-center bg-teal-800 bg-opacity-50 px-4 py-2 rounded-full">
                    <Cpu className="w-6 h-6 mr-2 text-teal-400" />
                    <span>
                        EL JUGADOR O ES LA IA
                    </span>

                    {winnerCounter.O > 0 && <p>Tiene {winnerCounter.O} victoria</p>}
                </div>
            </div>
        </>
    )
}