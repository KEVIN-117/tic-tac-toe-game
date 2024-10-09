import { Brain } from 'lucide-react'

export function Header() {
    return (
        <div className="container mx-auto bg-gradient-to-r from-purple-900/50 via-gray-900/50 to-teal-900/50 text-white py-8">
            <div className="mx-auto">
                <div className="flex items-center justify-center mb-6">
                    <Brain className="w-12 h-12 text-purple-400 mr-4" />
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                        Ingeniería de Sistemas
                    </h1>
                </div>
                <p className="mt-4 text-xl text-gray-300 text-center w-[90%] mx-auto">
                    ¡Prepárate para el duelo definitivo en Tic-Tac-Toe! 😎 Enfréntate a una inteligencia artificial que no conoce la piedad. ¿Podrás hacer tres en línea o terminarás viendo cómo te gana una máquina en un juego que aprendiste en la primaria? ¡Haz tu mejor jugada, porque esta IA no se rinde! 🤖✨
                </p>
            </div>
        </div>
    )
}