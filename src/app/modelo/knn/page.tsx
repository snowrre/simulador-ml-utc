"use client";

import React from 'react';
import KNNManager from '@/components/simulador/KNNManager';
import WizardStepper from '@/components/simulador/WizardStepper';
import Link from 'next/link';

export default function KNNModelPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
            <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 pt-32 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <WizardStepper />
                    
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <h1 className="text-4xl font-black text-navy-slate dark:text-white uppercase italic tracking-tighter">Entrenamiento: K-Nearest Neighbors</h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Clasificación basada en similitud matemática. Respaldado por el servidor Python + Scikit-Learn.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <KNNManager />
            </div>

            {/* Final Compare Link Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 p-4 z-40">
                <div className="max-w-7xl mx-auto flex justify-end">
                    <Link 
                        href="/comparativa"
                        className="px-10 py-4 bg-navy-slate text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all text-sm"
                    >
                        Ver Comparativa Final
                    </Link>
                </div>
            </div>
        </div>
    );
}
