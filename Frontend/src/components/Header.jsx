import { Heart, Sparkles } from 'lucide-react';

export default function Header() {
    return (
        <header className="py-8 px-4 md:px-8 max-w-7xl mx-auto flex items-center justify-between border-b border-beige-200">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-700 rounded-lg shadow-xl text-white">
                    <Heart size={28} strokeWidth={3} fill="white" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-primary-900 uppercase tracking-tighter">
                        Sarah Hub
                    </h1>
                    <p className="text-xs text-primary-600 font-black uppercase tracking-widest">
                        Level Up Your Health
                    </p>
                </div>
            </div>
            <div className="hidden md:block">
                <span className="text-sm text-primary-900 font-black uppercase border-2 border-primary-900 px-4 py-1">
                    Sarah Edition
                </span>
            </div>
        </header>
    );
}
