"use client";

import React from 'react';
import { useML } from '@/context/MLContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Play } from 'lucide-react';

export default function ExperimentsDashboard() {
    const { state, deleteExperiment } = useML();

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <span className="text-xs font-black uppercase tracking-widest text-tech-blue bg-tech-blue/10 px-3 py-1 rounded-full mb-3 inline-block">Resultados</span>
                    <h2 className="text-4xl font-black text-navy-slate dark:text-white italic tracking-tight uppercase">Mis Experimentos</h2>
                    <button 
                        onClick={() => window.dispatchEvent(new CustomEvent('start-ml-tutorial'))}
                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-tech-blue/10 text-tech-blue rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-tech-blue hover:text-white transition-all group w-fit"
                    >
                        <Play className="w-3 h-3 fill-current" />
                        Ver Tutorial de esta sección
                    </button>
                </div>
            </div>
            <div id="experiments-list-section" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                    {state.experiments.length === 0 ? (
                        <div className="col-span-full h-64 bg-gray-50 dark:bg-white/5 rounded-[3rem] border-4 border-dashed border-gray-100 dark:border-white/10 flex flex-col items-center justify-center text-center p-12">
                            <p className="text-xl font-black text-gray-300 uppercase italic">No hay experimentos guardados</p>
                            <p className="text-gray-400 font-medium mt-2">Entrena un modelo y guárdalo para verlo aquí.</p>
                        </div>
                    ) : (
                        state.experiments.map((exp) => (
                            <motion.div
                                key={exp.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/10 shadow-sm group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => deleteExperiment(exp.id)}
                                        className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${exp.modelType === 'knn' ? 'bg-tech-blue' : 'bg-emerald'}`}>
                                        <span className="font-black text-xs">{exp.modelType.toUpperCase()}</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(exp.timestamp).toLocaleDateString()}</p>
                                        <h3 className="text-lg font-black text-navy-slate dark:text-white truncate max-w-[150px]">{exp.fileName}</h3>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl text-center">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Accuracy</p>
                                        <p className={`text-xl font-black ${exp.modelType === 'knn' ? 'text-tech-blue' : 'text-emerald'}`}>
                                            {(exp.results.accuracy * 100).toFixed(0)}%
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl text-center">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Time</p>
                                        <p className="text-xl font-black text-navy-slate dark:text-white">{exp.results.executionTime}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Link 
                                        href="/comparativa" 
                                        className="w-full py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl font-black text-[10px] uppercase tracking-widest text-center hover:bg-tech-blue hover:text-white transition-all"
                                    >
                                        Ver Detalles
                                    </Link>
                                    <button className="w-full py-3 border border-gray-100 dark:border-white/10 text-gray-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-tech-blue hover:text-tech-blue transition-all">
                                        Replicar Simulación
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

