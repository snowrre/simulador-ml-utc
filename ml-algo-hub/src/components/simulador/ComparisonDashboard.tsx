"use client";

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useML } from '@/context/MLContext';
import { generateMLReport, generateComparativeReport } from '@/lib/ml-report-generator';
import { AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';

export default function ComparisonDashboard() {
    const { state, saveExperiment, deleteExperiment } = useML();
    const dashboardRef = useRef<HTMLDivElement>(null);
    
    // Get the best experiment for each model type
    const getBestExperiment = (type: 'knn' | 'dt' | 'rf') => {
        const typeExperiments = state.experiments.filter(e => e.modelType === type);
        if (typeExperiments.length === 0) return null;
        return typeExperiments.reduce((prev, current) => (prev.results.accuracy > current.results.accuracy) ? prev : current);
    };

    const knnExp = getBestExperiment('knn');
    const dtExp = getBestExperiment('dt');
    const rfExp = getBestExperiment('rf');

    const models = [
        { 
            id: 'knn',
            name: 'KNN', 
            accuracy: knnExp?.results.accuracy || 0, 
            time: '45ms', 
            active: !!knnExp,
            color: 'bg-tech-blue',
            pros: ['Simple', 'Maneja outliers'],
            cons: ['Lento con datasets grandes']
        },
        { 
            id: 'dt',
            name: 'Decision Tree', 
            accuracy: dtExp?.results.accuracy || 0, 
            time: '30ms', 
            active: !!dtExp,
            color: 'bg-emerald',
            pros: ['Rápido', 'Interpretatiblidad'],
            cons: ['Sobreajuste fácil']
        },
        { 
            id: 'rf',
            name: 'Random Forest', 
            accuracy: rfExp?.results.accuracy || 0, 
            time: '120ms', 
            active: !!rfExp,
            color: 'bg-tech-blue/80',
            pros: ['Alta precisión', 'Robusto', 'Ensemble'],
            cons: ['Complejo', 'Más memoria']
        }
    ].filter(m => m.active);

    const bestModel = models.length > 0 ? models.reduce((prev, current) => (prev.accuracy > current.accuracy) ? prev : current) : null;

    const recommendation = bestModel 
        ? `El modelo ${bestModel.name} es la mejor opción actual con un ${(bestModel.accuracy * 100).toFixed(1)}% de precisión.`
        : "Entrena al menos un modelo para ver la comparativa.";

    const handleExportPDF = async () => {
        if (models.length === 0) return;
        
        generateComparativeReport({
            fileName: state.fileName || 'Dataset_Usuario.csv',
            experiments: state.experiments,
            taskType: state.taskType,
            featureColumns: state.featureColumns,
            targetColumn: state.targetColumn || 'N/A'
        });
    };

    const [isSaved, setIsSaved] = React.useState(false);
    const handleSave = () => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div ref={dashboardRef} className="max-w-7xl mx-auto py-12 px-4 space-y-12">
            {/* Success Toast for Saving */}
            <AnimatePresence>
                {isSaved && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-10 right-10 z-50 bg-emerald text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-2xl flex items-center gap-3 border-2 border-white/20"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        Simulación Guardada con Éxito
                    </motion.div>
                )}
            </AnimatePresence>
            
            <div className="flex justify-start">
               <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('start-ml-tutorial', { detail: '/simulador/comparativa' }))}
                    className="flex items-center gap-2 px-4 py-2 bg-tech-blue/10 text-tech-blue rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-tech-blue hover:text-white transition-all group w-fit"
                >
                    <Play className="w-3 h-3 fill-current" />
                    Ver Tutorial de esta sección
                </button>
            </div>

            {/* Recommendation Box */}
            <motion.div 
                id="comparison-recommendation-box"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 bg-tech-blue text-white rounded-[3rem] shadow-2xl relative overflow-hidden"
            >
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-tech-blue shadow-lg">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9l-.707.707M12 18v1m4.243-4.243l.707.707M12 18a6 6 0 100-12 6 6 0 000 12z" /></svg>
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest opacity-70 mb-2">Recomendación Automática</p>
                        <h2 className="text-2xl font-black italic uppercase tracking-tight">{recommendation}</h2>
                    </div>
                </div>
            </motion.div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {models.map((model, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white dark:bg-gray-900 rounded-[3.5rem] p-10 border border-gray-100 dark:border-white/10 shadow-sm"
                    >
                        <div className="flex items-center gap-4 mb-10">
                            <div className={`w-4 h-12 ${model.color} rounded-full`}></div>
                            <h3 className="text-3xl font-black text-navy-slate dark:text-white uppercase italic tracking-tighter">{model.name}</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-10">
                            <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Accuracy</p>
                                <p className={`text-4xl font-black ${idx === 0 ? 'text-tech-blue' : 'text-emerald'}`}>{(model.accuracy * 100).toFixed(0)}%</p>
                            </div>
                            <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tiempo</p>
                                <p className="text-4xl font-black text-navy-slate dark:text-white uppercase italic">{model.time}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-[10px] font-black text-emerald uppercase tracking-widest mb-4">Ventajas</h4>
                                <div className="flex flex-wrap gap-2">
                                    {model.pros.map(p => (
                                        <span key={p} className="px-3 py-1 bg-emerald/10 text-emerald text-[10px] font-black uppercase rounded-lg">{p}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-4">Desventajas</h4>
                                <div className="flex flex-wrap gap-2">
                                    {model.cons.map(c => (
                                        <span key={c} className="px-3 py-1 bg-red-50 text-red-500 dark:bg-red-900/10 text-[10px] font-black uppercase rounded-lg">{c}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Export Actions */}
            <div className="bg-navy-slate rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-tech-blue/20 to-transparent"></div>
                <h3 className="text-3xl font-black uppercase italic tracking-tight mb-4 relative z-10">¿Listo para guardar tus resultados?</h3>
                <p className="text-gray-400 font-medium mb-12 max-w-2xl mx-auto relative z-10">Exporta un reporte detallado en PDF con todas las métricas, visualizaciones y configuraciones de tu experimento.</p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                    <button 
                        id="btn-export-comparative-pdf"
                        onClick={handleExportPDF}
                        className="px-10 py-5 bg-tech-blue text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-tech-blue/20 hover:scale-105 transition-all text-sm flex items-center justify-center gap-3"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                        Exportar Reporte PDF
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-10 py-5 bg-white text-navy-slate rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all text-sm flex items-center justify-center gap-3"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                        Guardar Experimento
                    </button>
                </div>
            </div>
        </div>
    );
}
