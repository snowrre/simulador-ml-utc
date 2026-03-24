"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';

const steps = [
    { title: 'Dataset', path: '/simulador/dataset', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
    )},
    { title: 'Limpieza', path: '/simulador/preprocesamiento', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
    )},
    { title: 'Modelo', path: '/simulador/modelo', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
    )},
    { title: 'Resultados', path: '/simulador/comparativa', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    )},
];

export default function WizardStepper() {
    const router = useRouter();
    const pathname = usePathname();

    const currentStepIndex = steps.findIndex(step => pathname.includes(step.path));

    return (
        <div className="w-full max-w-4xl mx-auto mb-12">
            <div className="relative flex justify-between items-center">
                {/* Connection Lines */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 dark:bg-gray-800 -z-10 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                        className="h-full bg-tech-blue"
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                </div>

                {steps.map((step, index) => {
                    const isActive = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                        <div key={step.path} className="flex flex-col items-center">
                            <motion.button
                                onClick={() => router.push(step.path)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                                    isCurrent 
                                        ? 'bg-tech-blue text-white shadow-xl shadow-tech-blue/30 scale-110' 
                                        : isActive 
                                            ? 'bg-tech-blue/10 text-tech-blue dark:bg-tech-blue/20' 
                                            : 'bg-white dark:bg-gray-900 text-gray-400 border border-gray-100 dark:border-gray-800'
                                }`}
                            >
                                {step.icon}
                            </motion.button>
                            <span className={`mt-3 text-[10px] font-black uppercase tracking-[0.2em] ${
                                isActive ? 'text-navy-slate dark:text-white' : 'text-gray-400'
                            }`}>
                                {step.title}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
