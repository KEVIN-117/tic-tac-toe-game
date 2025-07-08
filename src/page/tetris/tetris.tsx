"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/Button"
import { motion, AnimatePresence } from "motion/react"
import { Music } from "lucide-react"

interface Tetromino {
    shape: number[][]
    color: string
}

const TETROMINOS: Record<string, Tetromino> = {
    I: { shape: [[1, 1, 1, 1]], color: "from-cyan-400 to-cyan-600" },
    J: {
        shape: [
            [1, 0, 0],
            [1, 1, 1],
        ],
        color: "from-blue-400 to-blue-600",
    },
    L: {
        shape: [
            [0, 0, 1],
            [1, 1, 1],
        ],
        color: "from-orange-400 to-orange-600",
    },
    O: {
        shape: [
            [1, 1],
            [1, 1],
        ],
        color: "from-yellow-400 to-yellow-600",
    },
    S: {
        shape: [
            [0, 1, 1],
            [1, 1, 0],
        ],
        color: "from-green-400 to-green-600",
    },
    T: {
        shape: [
            [0, 1, 0],
            [1, 1, 1],
        ],
        color: "from-purple-400 to-purple-600",
    },
    Z: {
        shape: [
            [1, 1, 0],
            [0, 1, 1],
        ],
        color: "from-red-400 to-red-600",
    },
}

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const INITIAL_DROP_TIME = 800
const SPEED_INCREASE_FACTOR = 0.95

const createEmptyBoard = () => Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0))

const randomTetromino = () => {
    const keys = Object.keys(TETROMINOS)
    const randKey = keys[Math.floor(Math.random() * keys.length)]
    return TETROMINOS[randKey]
}

export default function Tetris() {
    const [board, setBoard] = useState(createEmptyBoard())
    const [currentPiece, setCurrentPiece] = useState<{ x: number; y: number; tetromino: Tetromino } | null>(null)
    const [score, setScore] = useState(0)
    const [gameOver, setGameOver] = useState(false)
    const [dropTime, setDropTime] = useState(INITIAL_DROP_TIME)
    const [level, setLevel] = useState(1)
    const [isMusicPlaying, setIsMusicPlaying] = useState(false)
    const [completedRows, setCompletedRows] = useState<number[]>([])
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const dropInterval = useRef<NodeJS.Timeout | null>(null)

    const checkCollision = (x: number, y: number, shape: number[][]) => {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col] !== 0) {
                    const newX = x + col
                    const newY = y + row
                    if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT || (newY >= 0 && board[newY][newX] !== 0)) {
                        return true
                    }
                }
            }
        }
        return false
    }

    const isValidMove = (x: number, y: number, shape: number[][]) => !checkCollision(x, y, shape)

    const moveLeft = useCallback(() => {
        if (currentPiece && isValidMove(currentPiece.x - 1, currentPiece.y, currentPiece.tetromino.shape)) {
            setCurrentPiece((prev) => {
                if (!prev) return null
                return { ...prev, x: prev.x - 1 }
            })
        }
    }, [currentPiece, board])

    const moveRight = useCallback(() => {
        if (currentPiece && isValidMove(currentPiece.x + 1, currentPiece.y, currentPiece.tetromino.shape)) {
            setCurrentPiece((prev) => {
                if (!prev) return null
                return { ...prev, x: prev.x + 1 }
            })
        }
    }, [currentPiece, board])

    const moveDown = useCallback(() => {
        if (!currentPiece) return
        if (isValidMove(currentPiece.x, currentPiece.y + 1, currentPiece.tetromino.shape)) {
            setCurrentPiece((prev) => {
                if (!prev) return null
                return { ...prev, y: prev.y + 1 }
            })
        } else {
            placePiece()
        }
    }, [currentPiece, board])

    const rotate = useCallback(() => {
        if (!currentPiece) return
        const rotated = currentPiece.tetromino.shape[0].map((_, i) =>
            currentPiece.tetromino.shape.map((row) => row[i]).reverse(),
        )
        let newX = currentPiece.x
        let newY = currentPiece.y

        // Try to rotate, if not possible, try to adjust position
        if (!isValidMove(newX, newY, rotated)) {
            // Try to move left
            if (isValidMove(newX - 1, newY, rotated)) {
                newX -= 1
            }
            // Try to move right
            else if (isValidMove(newX + 1, newY, rotated)) {
                newX += 1
            }
            // Try to move up
            else if (isValidMove(newX, newY - 1, rotated)) {
                newY -= 1
            }
            // If still not possible, don't rotate
            else {
                return
            }
        }

        setCurrentPiece((prev) => {
            if (!prev) return null
            return {
                ...prev,
                x: newX,
                y: newY,
                tetromino: { ...prev.tetromino, shape: rotated },
            }
        })

        // Continue falling after rotation
        if (isValidMove(newX, newY + 1, rotated) && newY + 1 < BOARD_HEIGHT) {
            setCurrentPiece((prev) => {
                if (!prev) return null
                return { ...prev, y: prev.y + 1 }
            })
        }
    }, [currentPiece, board])

    const placePiece = useCallback(() => {
        if (!currentPiece) return
        const newBoard = board.map((row) => [...row])
        currentPiece.tetromino.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    const boardY = y + currentPiece.y
                    const boardX = x + currentPiece.x
                    if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
                        newBoard[boardY][boardX] = currentPiece.tetromino.color
                    }
                }
            })
        })
        setBoard(newBoard)
        clearLines(newBoard)
        spawnNewPiece()
    }, [currentPiece, board])

    const clearLines = useCallback(
        (newBoard: number[][]) => {
            const linesCleared: number[] = []
            const updatedBoard = newBoard.filter((row, index) => {
                if (row.every((cell) => cell !== 0)) {
                    linesCleared.push(index)
                    return false
                }
                return true
            })

            if (linesCleared.length > 0) {
                setCompletedRows(linesCleared)
                setTimeout(() => {
                    while (updatedBoard.length < BOARD_HEIGHT) {
                        updatedBoard.unshift(Array(BOARD_WIDTH).fill(0))
                    }
                    setBoard(updatedBoard)
                    setCompletedRows([])

                    const newScore = score + linesCleared.length * 100
                    setScore(newScore)

                    if (Math.floor(newScore / 500) > level - 1) {
                        setLevel((prev) => prev + 1)
                        setDropTime((prev) => prev * SPEED_INCREASE_FACTOR)
                    }
                }, 600) // Aumenté el tiempo para que se vea mejor la animación
            }
        },
        [score, level],
    )

    const spawnNewPiece = useCallback(() => {
        const newPiece = {
            x: Math.floor(BOARD_WIDTH / 2) - 1,
            y: 0,
            tetromino: randomTetromino(),
        }
        if (checkCollision(newPiece.x, newPiece.y, newPiece.tetromino.shape)) {
            setGameOver(true)
        } else {
            setCurrentPiece(newPiece)
        }
    }, [board])

    useEffect(() => {
        if (!currentPiece && !gameOver) {
            spawnNewPiece()
        }
    }, [currentPiece, gameOver, spawnNewPiece])

    useEffect(() => {
        if (!gameOver) {
            dropInterval.current = setInterval(moveDown, dropTime)
        }
        return () => {
            if (dropInterval.current) {
                if (dropInterval.current) {
                    clearInterval(dropInterval.current)
                }
            }
        }
    }, [moveDown, gameOver, dropTime])

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (gameOver) return
            switch (e.key) {
                case "ArrowLeft":
                    moveLeft()
                    break
                case "ArrowRight":
                    moveRight()
                    break
                case "ArrowDown":
                    moveDown()
                    break
                case "ArrowUp":
                    rotate()
                    break
                default:
                    break
            }
        }
        window.addEventListener("keydown", handleKeyPress)
        return () => window.removeEventListener("keydown", handleKeyPress)
    }, [moveLeft, moveRight, moveDown, rotate, gameOver])

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.5
            audioRef.current.loop = true
            if (!gameOver && isMusicPlaying) {
                audioRef.current.play().catch((error) => console.error("Audio playback failed:", error))
            } else {
                audioRef.current.pause()
            }
        }
    }, [gameOver, isMusicPlaying])

    const resetGame = () => {
        setBoard(createEmptyBoard())
        setCurrentPiece(null)
        setScore(0)
        setGameOver(false)
        setDropTime(INITIAL_DROP_TIME)
        setLevel(1)
        setCompletedRows([])
        if (dropInterval.current) {
            clearInterval(dropInterval.current)
        }
    }

    const renderCell = (x: number, y: number) => {
        if (
            currentPiece &&
            currentPiece.tetromino.shape[y - currentPiece.y] &&
            currentPiece.tetromino.shape[y - currentPiece.y][x - currentPiece.x]
        ) {
            return currentPiece.tetromino.color
        }
        return board[y][x]
    }

    const toggleMusic = () => {
        setIsMusicPlaying(!isMusicPlaying)
    }

    return (
        <div className="flex flex-col items-center justify-center relative overflow-hidden">
            {/* Efectos de fondo futurista */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="relative z-10">
                <div className="flex items-center gap-4 backdrop-blur-xl bg-white/5 p-8 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden">
                    <div className="z-10 flex gap-4 mt-6">
                        <Button
                            onClick={resetGame}
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                        >
                            {gameOver ? "Play Again" : "Reset Game"}
                        </Button>
                    </div>
                    {/* Efecto de brillo interno */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>

                    <div>
                        {gameOver && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-xl font-bold text-center text-red-400 drop-shadow-2xl backdrop-blur-sm bg-red-500/10 p-2 rounded-2xl border border-red-500/30 mb-2"
                            >
                                GAME OVER!
                            </motion.div>
                        )}
                        <div
                            className="grid bg-black/20 backdrop-blur-sm relative z-10 rounded-2xl overflow-hidden border border-cyan-500/30"
                            style={{
                                gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
                                width: `${BOARD_WIDTH * 24}px`,
                                height: `${BOARD_HEIGHT * 24}px`,
                                boxShadow: "inset 0 0 50px rgba(6, 182, 212, 0.1)",
                            }}
                        >

                            {board.map((row, y) =>
                                row.map((_, x) => (
                                    <AnimatePresence key={`${y}-${x}`}>
                                        <motion.div
                                            initial={false}
                                            animate={{
                                                opacity: completedRows.includes(y) ? 0 : 1,
                                                scale: completedRows.includes(y) ? 1.2 : 1,
                                                rotateZ: completedRows.includes(y) ? 180 : 0,
                                            }}
                                            transition={{
                                                duration: 0.6,
                                                ease: "easeInOut",
                                                opacity: { duration: 0.3 },
                                                scale: { duration: 0.4 },
                                                rotateZ: { duration: 0.5 },
                                            }}
                                            className={`w-6 h-6 relative text-center ${renderCell(x, y) ? `bg-gradient-to-br ${renderCell(x, y)} shadow-lg` : "bg-gray-900/30"
                                                }`}
                                            style={{
                                                border: renderCell(x, y)
                                                    ? "1px solid rgba(255, 255, 255, 0.2)"
                                                    : "1px solid rgba(255, 255, 255, 0.05)",
                                                boxShadow: renderCell(x, y)
                                                    ? "inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 0 10px rgba(6, 182, 212, 0.3)"
                                                    : "none",
                                            }}
                                        >
                                            {renderCell(x, y) && (
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-sm"></div>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                )),
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                        <Button
                            onClick={toggleMusic}
                            disabled={gameOver}
                            className="flex justify-center items-center bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                        >
                            <Music className="w-4 h-4 mr-2" />
                            {isMusicPlaying ? "Stop Music" : "Play Music"}
                        </Button>
                    </div>
                </div>

                <div className="mt-6 flex flex-col items-center space-y-3">
                    <div className="flex space-x-8">
                        <div className="text-2xl font-bold text-cyan-400 drop-shadow-lg">
                            Score: <span className="text-white">{score}</span>
                        </div>
                        <div className="text-xl font-bold text-purple-400 drop-shadow-lg">
                            Level: <span className="text-white">{level}</span>
                        </div>
                    </div>

                    <div className="text-sm text-gray-300 backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full border border-white/10">
                        Press ↑ to rotate • ←→ to move • ↓ to drop
                    </div>
                </div>
            </div>

            <audio
                ref={audioRef}
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tetris-kxnh5j7hpNEcFspAndlU2huV5n6dvk.mp3"
            />
        </div>
    )
}
