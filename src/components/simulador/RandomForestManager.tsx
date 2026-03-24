"use client";

import React, { useState } from 'react';
import { useML } from '@/context/MLContext';
import { motion } from 'framer-motion';
import { RandomForest, RandomForestConfig } from '@/lib/ml/rf';
import { calculateClassificationMetrics, calculateRegressionMetrics } from '@/lib/ml/metrics';
import InfoTooltip from './InfoTooltip';
import { Play, FileDown } from 'lucide-react';
import { generateMLReport } from '@/lib/ml-report-generator';
import DecisionTreeVisualization from './DecisionTreeVisualization';
import ConfusionMatrix from './ConfusionMatrix';

const ExportButton = ({ onClick, modelName }: { onClick: () => void, modelName: string }) => (
    <button 
        onClick={onClick}
        className="flex items-center gap-2 px-6 py-3 bg-navy-slate/5 text-navy-slate dark:text-gray-300 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-navy-slate hover:text-white transition-all border border-navy-slate/10"
    >
        <FileDown className="w-4 h-4" />
        Descargar Reporte Pro de {modelName}
    </button>
);

export default function RandomForestManager() {
    const { state, saveExperiment } = useML();
    const [config, setConfig] = useState<RandomForestConfig>({
        numTrees: 10,
        maxDepth: 5,
        minSamplesSplit: 2,
        criterion: state.taskType === 'classification' ? 'gini' : 'mse',
        featureSubsamplingRate: 0.8
    });
    const [isTraining, setIsTraining] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [forest, setForest] = useState<RandomForest | null>(null);

    const trainModel = async () => {
        if (!state.rawData || !state.targetColumn) return;
        setIsTraining(true);
        
        await new Promise(r => setTimeout(r, 1500));

        try {
            const X = state.rawData.map(row => state.featureColumns.map(col => Number(row[col]) || 0));
            const y = state.rawData.map(row => row[state.targetColumn!]);

            const rf = new RandomForest(config, state.taskType === 'classification');
            rf.fit(X, y);
            setForest(rf);
            
            const predictions = rf.predict(X);
            
            let resultData: any;
            if (state.taskType === 'classification') {
                const metrics = calculateClassificationMetrics(y, predictions);
                resultData = {
                    ...metrics,
                    config: { ...config }
                };
            } else {
                const metrics = calculateRegressionMetrics(y as number[], predictions as number[]);
                resultData = {
                    accuracy: metrics.r2,
                    ...metrics,
                    config: { ...config }
                };
            }

            setResults(resultData);
            saveExperiment('rf', resultData);
        } catch (error) {
            console.error(error);
        } finally {
            setIsTraining(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 space-y-12">
            {/* Same header as original */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <span className="text-xs font-black uppercase tracking-widest text-emerald bg-emerald/10 px-3 py-1 rounded-full mb-3 inline-block">Entrenamiento</span>
                    <h2 className="text-4xl font-black text-navy-slate dark:text-white italic tracking-tight uppercase">Bosque Aleatorio</h2>
                    <button 
                        onClick={() => window.dispatchEvent(new CustomEvent('start-ml-tutorial', { detail: '/modelo/rf' }))}
                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-emerald/10 text-emerald rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald hover:text-white transition-all group w-fit"
                    >
                        <Play className="w-3 h-3 fill-current" />
                        Ver Tutorial de esta sección
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Config Card */}
                <div id="rf-params-card" className="bg-white dark:bg-gray-900 rounded-[3.5rem] p-10 border border-gray-100 dark:border-white/10 shadow-sm">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-14 h-14 bg-emerald/10 text-emerald rounded-2xl flex items-center justify-center">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-navy-slate dark:text-white uppercase italic tracking-tighter">Bosques Aleatorios</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Random Forest</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between mb-4">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center">
                                    Número de Árboles
                                    <InfoTooltip content="Más árboles suelen dar mejor precisión, pero tardan más en entrenar." />
                                </label>
                                <span className="text-tech-blue font-black">{config.numTrees}</span>
                            </div>
                            <input 
                                type="range" min="1" max="50" value={config.numTrees} 
                                onChange={(e) => setConfig({...config, numTrees: parseInt(e.target.value)})}
                                className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-tech-blue"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-4">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center">
                                    Profundidad Máxima
                                    <InfoTooltip content="Controla qué tanto puede aprender el árbol." />
                                </label>
                                <span className="text-tech-blue font-black">{config.maxDepth}</span>
                            </div>
                            <input 
                                type="range" min="1" max="20" value={config.maxDepth} 
                                onChange={(e) => setConfig({...config, maxDepth: parseInt(e.target.value)})}
                                className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-tech-blue"
                            />
                        </div>

                        <button 
                            id="btn-train-model"
                            onClick={trainModel}
                            disabled={isTraining}
                            className={`w-full py-5 rounded-[2rem] font-black text-lg uppercase tracking-widest transition-all ${
                                isTraining ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-tech-blue text-white shadow-xl shadow-tech-blue/20 hover:scale-[1.02]'
                            }`}
                        >
                            {isTraining ? 'Entrenando Bosque...' : 'Entrenar Modelo'}
                        </button>
                    </div>
                </div>

                {/* Results Column */}
                <div className="lg:col-span-2 space-y-8">
                    {results ? (
                        <div className="space-y-8">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-gray-900 rounded-[3.5rem] p-10 border border-gray-100 dark:border-white/10 shadow-sm"
                            >
                                <div className="flex justify-between items-center mb-10">
                                    <h3 className="text-2xl font-black text-navy-slate dark:text-white uppercase italic tracking-tighter">Rendimiento del Bosque</h3>
                                    <ExportButton 
                                        modelName="Random Forest" 
                                        onClick={() => generateMLReport({
                                            fileName: state.fileName || 'Iris_Dataset.csv',
                                            modelType: 'Random Forest',
                                            results: results,
                                            taskType: state.taskType,
                                            featureColumns: state.featureColumns,
                                            targetColumn: state.targetColumn || 'N/A'
                                        })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
                                    {[
                                        { label: 'Accuracy', value: results.accuracy, color: 'text-tech-blue' },
                                        { label: 'Precision', value: results.precision, color: 'text-emerald' },
                                        { label: 'Recall', value: results.recall, color: 'text-amber-500' },
                                        { label: 'F1-Score', value: results.f1, color: 'text-purple-500' }
                                    ].map((stat) => (
                                        <div key={stat.label} className="p-6 bg-gray-50 dark:bg-white/5 rounded-[2rem] text-center">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
                                            <p className={`text-2xl font-black ${stat.color}`}>{(stat.value * 100).toFixed(1)}%</p>
                                        </div>
                                    ))}
                                </div>

                                {state.taskType === 'classification' && results.confusionMatrix && results.classes && (
                                    <div className="mb-12 border-t border-gray-50 dark:border-white/5 pt-6">
                                        <ConfusionMatrix matrix={results.confusionMatrix} classes={results.classes} />
                                    </div>
                                )}

                                <div className="p-8 bg-tech-blue text-white rounded-[2.5rem] relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h4 className="text-lg font-black uppercase italic mb-4 tracking-tight">Análisis del Experto</h4>
                                        <p className="text-sm font-medium opacity-90 leading-relaxed">
                                            El Bosque Aleatorio ha promediado las decisiones de {config.numTrees} árboles independientes. 
                                            {results.accuracy > 0.8 
                                                ? " Este enfoque robusto ha logrado capturar patrones complejos con gran estabilidad académica."
                                                : " Se recomienda ajustar los parámetros para mejorar la robustez del modelo."}
                                        </p>
                                    </div>
                                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                                </div>
                            </motion.div>

                            {/* Forest Visualization (First Tree) */}
                            {forest && forest.trees.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center justify-between px-6">
                                        <h3 className="text-xl font-black text-navy-slate dark:text-white uppercase italic tracking-tighter">Árbol Representativo (Tree #1)</h3>
                                        <span className="text-[10px] font-black text-gray-400 bg-gray-100 dark:bg-gray-800 px-4 py-1 rounded-full uppercase">Uno de {config.numTrees} Árboles</span>
                                    </div>
                                    <DecisionTreeVisualization 
                                        treeData={(forest.trees[0] as any).root} 
                                        featureNames={state.featureColumns} 
                                    />
                                </motion.div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-[3.5rem] flex flex-col items-center justify-center p-12 text-center text-gray-400">
                            <svg className="w-20 h-20 mb-6 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.631.316a6 6 0 01-3.86.517L5.42 15.3l-1.022.547a2 2 0 000 3.12l1.022.547 2.387.477a6 6 0 003.86-.517l.631-.316a6 6 0 013.86-.517l2.387.477 1.022-.547a2 2 0 000-3.12z" /></svg>
                            <p className="text-xl font-bold italic uppercase tracking-tight">Esperando entrenamiento...</p>
                            <p className="mt-2 font-medium">Inicia el entrenamiento del bosque para visualizar su estructura interna.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

