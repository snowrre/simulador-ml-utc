"use client";

import Link from 'next/link';
import { useTheme } from "@/context/ThemeContext";
import { usePathname } from 'next/navigation';

export default function NavbarSimulador() {
    const { setTheme, resolvedTheme } = useTheme();
    const pathname = usePathname();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-[72px] items-center">
                    {/* Logo & Selection */}
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="flex items-center space-x-2 group">
                            <div className="w-10 h-10 bg-tech-blue rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-tech-blue/20 group-hover:scale-105 transition-transform duration-300">
                                S
                            </div>
                            <span className="text-xl font-black text-navy-slate dark:text-white tracking-tight italic uppercase">
                                Simulador ML
                            </span>
                        </Link>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Legend */}
                        <div className="hidden lg:flex flex-col items-end mr-4">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Entorno de</span>
                            <span className="text-sm font-black text-navy-slate dark:text-white italic">Simulacion Avanzada</span>
                        </div>

                        <button
                            onClick={() => window.dispatchEvent(new CustomEvent('start-ml-tutorial'))}
                            className="px-4 py-2 bg-tech-blue/10 text-tech-blue text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-tech-blue/20 transition-all flex items-center gap-2"
                            id="btn-ver-tutorial"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Ver Tutorial
                        </button>

                        <button
                            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                            className="p-2 w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            title="Alternar tema"
                        >
                            {resolvedTheme === 'dark' ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}


