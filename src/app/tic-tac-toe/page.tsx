import { Header } from "@/components/Header";
import { Game } from "@/page/tic-tac-toe/Game";

export default function TicTacToePage() {
    return (
        <main className="flex flex-col items-center justify-center gap-5 my-5">
            <Header title="Tic-Tac-Toe con IA 🤖" description="¡Prepárate para el duelo definitivo en Tic-Tac-Toe! 😎 Enfréntate a una inteligencia artificial que no conoce la piedad. ¿Podrás hacer tres en línea o terminarás viendo cómo te gana una máquina en un juego que aprendiste en la primaria? ¡Haz tu mejor jugada, porque esta IA no se rinde! 🤖✨" />
            <Game />
        </main>
    );
}
