import React from 'react'

export function Square({ value, onSquareClick }: { value: string, onSquareClick: () => void }) {
    return (
        <>
            <button className={`w-32 h-32 text-4xl font-bold bg-stone-900/40 border border-gray-700 rounded-md shadow-md transition-all duration-200 ease-in-out hover:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-200 ${value === 'X' ? 'bg-purple-800 bg-opacity-50' : ''} ${value === 'O' ? 'bg-teal-800 bg-opacity-50' : ''}`}
                onClick={onSquareClick}>
                {value}
            </button>
        </>
    )
}