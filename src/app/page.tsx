import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center gap-5 my-5">
      <h1 className="text-4xl font-bold">Welcome to the Game center!</h1>
      <p className="text-lg">Select a game to play:</p>
      <ul className="list-disc list-inside">
        <li>
          <Link href="/tic-tac-toe" className="text-blue-500 hover:underline">
            Tic Tac Toe
          </Link>
        </li>
        <li>
          <Link href="/tetris" className="text-blue-500 hover:underline">
            Tetris
          </Link>
        </li>
        {/* Add more games here as needed */}
      </ul>
      <p className="text-sm text-gray-500 mt-4">
        This is a simple game center built with Next.js.
      </p>
      <p className="text-sm text-gray-500">
        Explore the code on{' '}
        <a
          href="https://github.com/your-repo/tic-tac"
          className="text-blue-500 hover:underline"
        >
          GitHub
        </a>
      </p>
    </main>
  );
}
