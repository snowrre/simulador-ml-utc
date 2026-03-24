"use client";

import React from 'react';
import { useML } from '@/context/MLContext';
import { motion } from 'framer-motion';
import InfoTooltip from './InfoTooltip';
import { Play } from 'lucide-react';

export default function PreprocessingManager({ onNext }: { onNext: () => void }) {
    const { state, updatePreprocessing } = useML();
    const { preprocessing } = state;

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <span className="text-xs font-black uppercase tracking-widest text-tech-blue bg-tech-blue/10 px-3 py-1 rounded-full mb-3 inline-block">Preprocesamiento</span>
                    <h2 className="text-4xl font-black text-navy-slate dark:text-white italic tracking-tight uppercase">Configura tus Datos</h2>
                    <button 
                        onClick={() => window.dispatchEvent(new CustomEvent('start-ml-tutorial', { detail: '/simulador/preprocesamiento' }))}
                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-tech-blue/10 text-tech-blue rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-tech-blue hover:text-white transition-all group w-fit"
                    >
                        <Play className="w-3 h-3 fill-current" />
                        Ver Tutorial de esta sección
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Configuration Column */}
                <div className="space-y-8">
                    {/* Missing Data Strategy */}
                    <div id="preprocessing-strategy" className="bg-white dark:bg-gray-900 rounded-[3rem] p-8 border border-gray-100 dark:border-white/10 shadow-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            </div>
                            <h3 className="text-xl font-black text-navy-slate dark:text-white uppercase italic tracking-tight">Tratamiento de Datos Faltantes</h3>
                            <InfoTooltip content="Define qué hacer con los huecos en tus datos. La Media es común para datos numéricos equilibrados." />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { id: 'delete', label: 'Eliminar Filas', desc: 'Borra registros incompletos' },
                                { id: 'mean', label: 'Media', desc: 'Promedio de la columna' },
                                { id: 'median', label: 'Mediana', desc: 'Valor central' },
                                { id: 'mode', label: 'Moda', desc: 'Valor más frecuente' }
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => updatePreprocessing({ missingDataStrategy: opt.id as any })}
                                    className={`p-6 rounded-[2rem] border-2 text-left transition-all ${
                                        preprocessing.missingDataStrategy === opt.id 
                                        ? 'border-tech-blue bg-tech-blue/5' 
                                        : 'border-gray-50 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 hover:border-gray-200'
                                    }`}
                                >
                                    <p className={`text-sm font-black uppercase tracking-widest mb-2 ${
                                        preprocessing.missingDataStrategy === opt.id ? 'text-tech-blue' : 'text-gray-500'
                                    }`}>
                                        {opt.label}
                                    </p>
                                    <p className="text-xs text-gray-400 font-medium">{opt.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Scaling & Encoding */}
                    <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-8 border border-gray-100 dark:border-white/10 shadow-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-tech-blue/10 text-tech-blue rounded-2xl flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
                            </div>
                            <h3 className="text-xl font-black text-navy-slate dark:text-white uppercase italic tracking-tight">Escalado y Codificación</h3>
                            <InfoTooltip content="El escalado evita que variables con números grandes dominen el modelo. One-Hot es para que la IA entienda palabras." />
                        </div>
                        
                        <div className="space-y-8">
                            {/* Scaling */}
                            <div id="scaling-section">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Escalado de Datos (Recomendado para KNN)</p>
                                <div className="flex gap-4">
                                    {[
                                        { id: 'none', label: 'Ninguno' },
                                        { id: 'standard', label: 'StandardScaler' },
                                        { id: 'minmax', label: 'MinMaxScaler' }
                                    ].map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => updatePreprocessing({ scalingStrategy: opt.id as any })}
                                            className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${
                                                preprocessing.scalingStrategy === opt.id 
                                                ? 'bg-tech-blue text-white border-tech-blue' 
                                                : 'text-gray-500 border-gray-50 dark:border-white/5'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Encoding */}
                            <div id="encoding-section" className="flex items-center justify-between p-6 bg-gray-50 dark:bg-white/5 rounded-[2rem]">
                                <div>
                                    <p className="text-sm font-black text-navy-slate dark:text-white uppercase tracking-tight">One-Hot Encoding</p>
                                    <p className="text-xs text-gray-400 font-medium">Convierte variables categóricas a vectores binarios.</p>
                                </div>
                                <button 
                                    onClick={() => updatePreprocessing({ oneHotEncoding: !preprocessing.oneHotEncoding })}
                                    className={`w-14 h-8 rounded-full transition-all relative ${
                                        preprocessing.oneHotEncoding ? 'bg-emerald' : 'bg-gray-300 dark:bg-gray-700'
                                    }`}
                                >
                                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${
                                        preprocessing.oneHotEncoding ? 'left-7' : 'left-1'
                                    }`}></div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Split & Summary Column */}
                <div className="space-y-8">
                    {/* Train/Test Split */}
                    <div id="train-test-split-section" className="bg-white dark:bg-gray-900 rounded-[3rem] p-8 border border-gray-100 dark:border-white/10 shadow-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-emerald/10 text-emerald rounded-2xl flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
                            </div>
                            <h3 className="text-xl font-black text-navy-slate dark:text-white uppercase italic tracking-tight">División Train / Test</h3>
                            <InfoTooltip content="Separamos datos para entrenar el cerebro de la IA y otros para ver si aprendió bien." />
                        </div>
                        
                        <div className="space-y-8">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-5xl font-black text-tech-blue">{(preprocessing.trainTestSplit * 100).toFixed(0)}<span className="text-2xl text-gray-300">%</span></p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Entrenamiento</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-emerald">{((1 - preprocessing.trainTestSplit) * 100).toFixed(0)}<span className="text-lg text-gray-300">%</span></p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Prueba</p>
                                </div>
                            </div>
                            
                            <input 
                                type="range" 
                                min="0.5" 
                                max="0.95" 
                                step="0.05" 
                                value={preprocessing.trainTestSplit} 
                                onChange={(e) => updatePreprocessing({ trainTestSplit: parseFloat(e.target.value) })}
                                className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-tech-blue"
                            />
                            
                            <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100 dark:border-blue-800">
                                <p className="text-xs text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
                                    <strong>Tip:</strong> Una división 80/20 es un buen punto de partida para la mayoría de los experimentos.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Final Pipeline Summary */}
                    <div className="bg-navy-slate text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-8 relative z-10">Resumen del Pipeline</h3>
                        
                        <div className="space-y-6 relative z-10">
                            {[
                                { step: 'Limpieza', value: preprocessing.missingDataStrategy.toUpperCase() },
                                { step: 'Encoding', value: preprocessing.oneHotEncoding ? 'ONE-HOT' : 'NINGUNO' },
                                { step: 'Escalado', value: preprocessing.scalingStrategy.toUpperCase() },
                                { step: 'Train Split', value: `${(preprocessing.trainTestSplit * 100)}%` }
                            ].map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center border-b border-white/10 pb-4">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.step}</span>
                                    <span className="text-sm font-black italic">{item.value}</span>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={onNext}
                            className="w-full mt-10 py-5 bg-tech-blue text-white rounded-[2rem] font-black text-lg uppercase tracking-widest shadow-xl shadow-tech-blue/20 hover:scale-[1.02] transition-all"
                        >
                            Confirmar y Entrenar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
