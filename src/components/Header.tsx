import { Brain } from 'lucide-react'

interface HeaderProps {
    title?: string;
    description?: string;
}

export function Header({ title, description }: HeaderProps) {
    return (
        <div className="container mx-auto bg-gradient-to-r from-purple-900/50 via-gray-900/50 to-teal-900/50 text-white py-3 rounded-2xl overflow-hidden">
            <div className="mx-auto">
                <div className="flex items-center justify-center mb-6 ">
                    <Brain className="w-12 h-12 text-purple-400 mr-4" />
                    <h1 className="text-center text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-pulse">
                        {title}
                    </h1>
                </div>
                <p className="mt-4 text-xl text-gray-300 text-center w-[90%] mx-auto">
                    {description}
                </p>
            </div>
        </div>
    )
}