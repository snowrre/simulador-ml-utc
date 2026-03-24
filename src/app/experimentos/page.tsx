"use client";

import React from 'react';
import ExperimentsDashboard from '@/components/simulador/ExperimentsDashboard';
import Link from 'next/link';

export default function ExperimentosPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
            <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 pt-32 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex mb-6" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-3">
                            <li className="inline-flex items-center">
                                <Link href="/simulador" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-tech-blue dark:text-gray-400 dark:hover:text-white transition-colors">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                    Simulador ML
                                </Link>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                                    <span className="ml-1 text-sm font-medium text-gray-400 md:ml-2 uppercase tracking-widest font-black">Historial de Experimentos</span>
                                </div>
                            </li>
                        </ol>
                    </nav>
                    <h1 className="text-4xl font-black text-navy-slate dark:text-white uppercase italic tracking-tighter">Mis Experimentos</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Revisa, compara y exporta tus simulaciones pasadas.</p>
                </div>
            </div>

            <div className="mt-8">
                <ExperimentsDashboard />
            </div>
        </div>
    );
}


