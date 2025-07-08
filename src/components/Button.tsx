import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    action: () => void;
    gameOver?: boolean;
}


export function Button({ action, gameOver=false, className }: ButtonProps) {
    return (
        <button
            onClick={action}
            className={`bg-gradient-to-r text-white font-bold py-3 px-6 rounded-xl shadow-lg backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-105 active:scale-95 ${className}`}
        >
            {gameOver ? "Play Again" : "Reset Game"}
        </button>
    )
}