"use client";

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useML } from '@/context/MLContext';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

export default function MLSimulatorLanding() {
    const { setRawData, resetState, setSelectedProject } = useML();
    const router = useRouter();
    const [activeTag, setActiveTag] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState<'knn' | 'arbol' | null>(null);

    const loadDatasetAndRedirect = async (project: 'knn' | 'arbol', filename: string) => {
        setIsLoading(project);
        resetState();
        setSelectedProject(project);
        try {
            const response = await fetch(`${API_BASE_URL}/datasets/${filename}`);
            if (response.ok) {
                const text = await response.text();
                const Papa = (await import('papaparse')).default;
                Papa.parse(text, {
                    header: true,
                    dynamicTyping: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        setRawData(results.data, filename);
                        router.push('/dataset');
                    }
                });
            } else {
                console.error("Dataset not found on server");
                router.push('/dataset');
            }
        } catch (e) {
            console.error("Error fetching dataset", e);
            router.push('/dataset');
        }
    };

    const handleProyectoKNN = () => {
        loadDatasetAndRedirect('knn', 'iris.csv');
    };

    const handleProyectoArbol = () => {
        loadDatasetAndRedirect('arbol', 'breast_cancer.csv');
    };

    const handleNewDataset = () => {
        resetState();
        router.push('/dataset');
    };

    const algorithmHelp: Record<string, string> = {
        'Clasificación': 'Categoriza datos en grupos (ej: Spam o No Spam).',
        'Distancias': 'Método para medir qué tan similares son dos puntos en los datos.',
        'Lógica': 'Estructura de decisiones basada en condiciones "Si... Entonces...".',
        'Reglas': 'Patrones extraídos por el modelo para explicar sus decisiones.',
        'Importancia': 'Determina qué variables afectan más al resultado final.'
    };
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-tech-blue/5 via-transparent to-emerald/5 opacity-50"></div>
                
                {/* Background Patterns */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20 dark:opacity-10">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-tech-blue rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 -right-24 w-80 h-80 bg-emerald rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-block px-4 py-1.5 rounded-full bg-tech-blue/10 text-tech-blue text-xs font-black uppercase tracking-widest mb-6">
                                Simulador Educativo de Machine Learning
                            </span>
                            <h1 id="hero-title" className="text-3xl sm:text-5xl md:text-6xl font-black text-navy-slate dark:text-white mb-6 md:mb-8 leading-tight">
                                Entrena Inteligencia Artificial <span className="text-tech-blue italic underline decoration-emerald/30 underline-offset-8">sin código</span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 md:mb-12 leading-relaxed">
                                Plataforma interactiva de clasificación y diagnosis. Explora algoritmos avanzados con datasets pre-cargados.
                            </p>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                                    <button 
                                        id="btn-cargar-dataset"
                                        onClick={handleNewDataset}
                                        className="px-6 sm:px-8 md:px-10 py-4 md:py-5 bg-tech-blue text-white rounded-2xl font-black text-base md:text-lg shadow-xl shadow-tech-blue/30 hover:bg-blue-600 transition-all hover:-translate-y-1 flex items-center justify-center gap-3 w-full sm:w-auto"
                                    >
                                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                        Cargar mis Propios Datos
                                    </button>
                                    <button 
                                        id="btn-ver-ejemplos"
                                        onClick={() => document.getElementById('examples-section')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="px-6 sm:px-8 md:px-10 py-4 md:py-5 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 text-navy-slate dark:text-white rounded-2xl font-black text-base md:text-lg shadow-lg hover:border-tech-blue transition-all hover:-translate-y-1 flex items-center justify-center gap-3 w-full sm:w-auto"
                                    >
                                        <svg className="w-5 h-5 md:w-6 md:h-6 text-tech-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                        Explorar Ejemplos
                                    </button>
                        </motion.div>
                    </div>

                    {/* New Examples Selection Section */}
                    <div id="examples-section" className="mt-40 scroll-mt-24">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                            <div className="max-w-xl">
                                <span className="text-xs font-black text-tech-blue uppercase tracking-widest bg-tech-blue/10 px-4 py-1.5 rounded-full mb-4 inline-block">Métricas scikit-learn integradas</span>
                                <h2 className="text-3xl md:text-4xl font-black text-navy-slate dark:text-white uppercase italic tracking-tighter">Proyectos de Ejemplo</h2>
                                <p className="text-gray-600 dark:text-gray-400 mt-4 font-medium leading-relaxed text-sm md:text-base">
                                    Lleva la teoría a la práctica y valida tus conocimientos utilizando implementaciones reales respaldadas por Python. Cada proyecto utiliza su propio flujo independiente.
                                </p>
                            </div>
                            <div className="hidden md:block">
                                <div className="flex items-center gap-4 px-6 py-3 bg-emerald/10 text-emerald rounded-2xl border border-emerald/10">
                                    <div className="w-2 h-2 bg-emerald rounded-full animate-pulse"></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest italic">Nuevas Visualizaciones Premium Activas</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* KNN Project */}
                            <motion.div 
                                id="card-proyecto-knn"
                                whileHover={{ y: -5 }}
                                className="group relative bg-white dark:bg-gray-900 rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 border border-tech-blue/20 shadow-lg hover:shadow-2xl hover:shadow-tech-blue/10 transition-all"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <svg className="w-24 h-24 text-tech-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                                </div>
                                <h3 className="text-xs font-black text-tech-blue uppercase tracking-widest mb-4 italic">Clasificación por Similitud</h3>
                                <h4 className="text-2xl md:text-3xl font-black text-navy-slate dark:text-white uppercase italic tracking-tighter mb-4">Proyecto KNN</h4>
                                <p className="text-gray-600 dark:text-gray-400 font-medium mb-8 md:mb-12 min-h-[80px] text-sm md:text-base">
                                    Entorno aislado para trabajar con K-Nearest Neighbors. Utiliza datasets como <span className="text-tech-blue font-black italic">Iris</span> o <span className="text-tech-blue font-black italic">Breast Cancer</span> y evalúa métricas exactas.
                                </p>
                                <button 
                                    onClick={handleProyectoKNN}
                                    className="px-8 py-5 bg-navy-slate text-white dark:bg-white dark:text-navy-slate rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg group-hover:bg-tech-blue group-hover:text-white transition-all w-full flex items-center justify-center gap-3"
                                >
                                    {isLoading === 'knn' ? 'Cargando Dataset...' : 'Abrir Proyecto KNN'}
                                    {isLoading !== 'knn' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                                </button>
                            </motion.div>

                            {/* Decision Tree Project */}
                            <motion.div 
                                id="card-proyecto-arbol"
                                whileHover={{ y: -5 }}
                                className="group relative bg-white dark:bg-gray-900 rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 border border-emerald/20 shadow-lg hover:shadow-2xl hover:shadow-emerald/10 transition-all"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <svg className="w-24 h-24 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                                </div>
                                <h3 className="text-xs font-black text-emerald uppercase tracking-widest mb-4 italic">Lógica Predictiva</h3>
                                <h4 className="text-2xl md:text-3xl font-black text-navy-slate dark:text-white uppercase italic tracking-tighter mb-4">Proyecto Árbol de Decisión</h4>
                                <p className="text-gray-600 dark:text-gray-400 font-medium mb-8 md:mb-12 min-h-[80px] text-sm md:text-base">
                                    Entorno aislado dedicado a Árboles de Decisión. Explora la forma en que el algoritmo crea reglas a partir de los datos y analiza su rendimiento espacial.
                                </p>
                                <button 
                                    onClick={handleProyectoArbol}
                                    className="px-8 py-5 bg-navy-slate text-white dark:bg-white dark:text-navy-slate rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg group-hover:bg-emerald group-hover:text-white transition-all w-full flex items-center justify-center gap-3"
                                >
                                    {isLoading === 'arbol' ? 'Cargando Dataset...' : 'Abrir Proyecto Árbol'}
                                    {isLoading !== 'arbol' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                                </button>
                            </motion.div>
                        </div>
                    </div>

                    {/* Algorithms Section */}
                    <div className="mt-40">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-black text-navy-slate dark:text-white uppercase tracking-tighter italic">Algoritmos Incluidos</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-8 rounded-[3rem] bg-tech-blue text-white shadow-2xl relative overflow-hidden group">
                                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700 pointer-events-none"></div>
                                <h4 className="text-4xl md:text-5xl font-black mb-4 md:mb-6 opacity-30 tracking-tighter">KNN</h4>
                                <h3 className="text-xl md:text-2xl font-black mb-4 uppercase tracking-tight italic">K-Nearest Neighbors</h3>
                                <p className="text-blue-100 font-medium leading-relaxed mb-6 md:mb-8 text-sm md:text-base">
                                    Clasificación basada en la similitud. Descubre cómo la IA agrupa datos según sus vecinos más cercanos y aprende sobre métricas de distancia.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {(['Clasificación', 'Distancias'] as const).map(tag => (
                                        <button 
                                            key={tag} 
                                            onClick={() => setActiveTag(tag)}
                                            className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest leading-none flex items-center hover:bg-white/40 transition-colors relative z-10"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="p-8 rounded-[3rem] bg-emerald text-white shadow-2xl relative overflow-hidden group">
                                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700 pointer-events-none"></div>
                                <h4 className="text-4xl md:text-5xl font-black mb-4 md:mb-6 opacity-30 tracking-tighter">DT</h4>
                                <h3 className="text-xl md:text-2xl font-black mb-4 uppercase tracking-tight italic">Decision Tree</h3>
                                <p className="text-emerald-100 font-medium leading-relaxed mb-6 md:mb-8 text-sm md:text-base">
                                    Modelado por lógica de decisiones ramificadas. Visualiza la toma de decisiones lógica y las reglas que el modelo aprende de tus datos.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {(['Lógica', 'Reglas', 'Importancia'] as const).map(tag => (
                                        <button 
                                            key={tag} 
                                            onClick={() => setActiveTag(tag)}
                                            className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest leading-none flex items-center hover:bg-white/40 transition-colors relative z-10"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popover / Info Box */}
            <AnimatePresence>
                {activeTag && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl relative border border-gray-100 dark:border-white/10"
                        >
                            <button 
                                onClick={() => setActiveTag(null)}
                                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-navy-slate dark:hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            
                            <div className="mb-6">
                                <span className="inline-block px-3 py-1 rounded-full bg-tech-blue/10 text-tech-blue text-[10px] font-black uppercase tracking-widest mb-4">
                                    Concepto Educativo
                                </span>
                                <h3 className="text-2xl font-black text-navy-slate dark:text-white uppercase italic tracking-tighter">
                                    {activeTag}
                                </h3>
                            </div>
                            
                            <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                                {activeTag ? algorithmHelp[activeTag] : ''}
                            </p>

                            <button 
                                onClick={() => setActiveTag(null)}
                                className="mt-8 w-full py-4 bg-navy-slate dark:bg-white dark:text-navy-slate text-white rounded-xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-opacity"
                            >
                                Entendido
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}


