import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Página no encontrada",
    robots: { index: false, follow: false },
};

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
            <div className="max-w-lg w-full text-center">
                {/* Logo */}
                <Link href="/" className="inline-flex items-center gap-3 mb-12 group">
                    <div className="w-12 h-12 bg-tech-blue rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-tech-blue/20 group-hover:scale-105 transition-transform">
                        H
                    </div>
                    <span className="text-2xl font-black text-navy-slate dark:text-white tracking-tight">The Tech Hub</span>
                </Link>

                {/* 404 */}
                <div className="relative mb-8">
                    <div className="text-[10rem] font-black text-gray-100 dark:text-gray-800 leading-none select-none">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-tech-blue/10 dark:bg-tech-blue/20 rounded-3xl flex items-center justify-center">
                            <svg className="w-10 h-10 text-tech-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <h1 className="text-3xl font-extrabold text-navy-slate dark:text-white mb-4">
                    Página no encontrada
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-10 leading-relaxed">
                    La página que buscas no existe o fue movida. ¿Quizás buscabas una solución del catálogo?
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="px-8 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-navy-slate dark:text-white font-bold rounded-xl hover:border-tech-blue hover:text-tech-blue transition-all"
                    >
                        Ir al Inicio
                    </Link>
                    <Link
                        href="/catalogo"
                        className="px-8 py-3 bg-tech-blue text-white font-bold rounded-xl shadow-lg shadow-tech-blue/20 hover:bg-blue-700 hover:shadow-xl transition-all"
                    >
                        Ver Catálogo
                    </Link>
                </div>
            </div>
        </div>
    );
}


