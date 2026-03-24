"use client";

import React, { useState } from 'react';
import { useML } from '@/context/MLContext';
import { motion } from 'framer-motion';
import DecisionTreeVisualization from './DecisionTreeVisualization';
import { DecisionTree, DecisionTreeConfig } from '@/lib/ml/decision-tree';
import { calculateClassificationMetrics, calculateRegressionMetrics } from '@/lib/ml/metrics';
import { Play, FileDown } from 'lucide-react';
import { generateMLReport } from '@/lib/ml-report-generator';

const ExportButton = ({ onClick, modelName }: { onClick: () => void, modelName: string }) => (
    <button 
        onClick={onClick}
        className="flex items-center gap-2 px-6 py-3 bg-navy-slate/5 text-navy-slate dark:text-gray-300 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-navy-slate hover:text-white transition-all border border-navy-slate/10"
    >
        <FileDown className="w-4 h-4" />
        Descargar Reporte Pro de {modelName}
    </button>
);

export default function DecisionTreeManager() {
    const { state, applyPreprocessing, saveExperiment } = useML();
    const [config, setConfig] = useState<DecisionTreeConfig>({
        maxDepth: 5,
        minSamplesSplit: 2,
        criterion: (state.taskType === 'classification' ? 'gini' : 'mse') as any
    });
    
    const [results, setResults] = useState<any>(null);
    const [isTraining, setIsTraining] = useState(false);

    const handleTrain = () => {
        const preprocessed = applyPreprocessing();
        if (!preprocessed) return;

        setIsTraining(true);
        const startTime = performance.now();

        setTimeout(() => {
            try {
                const { trainX, trainY, testX, testY } = preprocessed;
                
                const dt = new DecisionTree(config, state.taskType === 'classification');
                
                dt.fit(trainX, trainY);
                const predictions = dt.predict(testX);
                
                const featureImportance = dt.getFeatureImportance();
                const importance = featureImportance.map((score, i) => ({
                    name: state.featureColumns[i] || `Feature ${i}`,
                    score
                }));

                const treeStructure = dt.getTreeStructure();

                let result: any;
                if (state.taskType === 'classification') {
                    const metrics = calculateClassificationMetrics(testY, predictions);
                    result = {
                        ...metrics,
                        importance,
                        featureImportance,
                        treeStructure,
                        executionTime: `${(performance.now() - startTime).toFixed(1)}ms`
                    };
                } else {
                    const metrics = calculateRegressionMetrics(testY as number[], predictions as number[]);
                    result = {
                        accuracy: metrics.r2,
                        ...metrics,
                        importance,
                        featureImportance,
                        treeStructure,
                        executionTime: `${(performance.now() - startTime).toFixed(1)}ms`
                    };
                }

                setResults(result);
                saveExperiment('dt', result);
            } catch (error) {
                console.error("Decision Tree training error:", error);
            } finally {
                setIsTraining(false);
            }
        }, 1000);
    };

    return (
        <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 space-y-8 sm:space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <span className="text-xs font-black uppercase tracking-widest text-emerald bg-emerald/10 px-3 py-1 rounded-full mb-3 inline-block">Entrenamiento</span>
                    <h2 className="text-4xl font-black text-navy-slate dark:text-white italic tracking-tight uppercase">Árbol de Decisión</h2>
                    <button 
                        onClick={() => window.dispatchEvent(new CustomEvent('start-ml-tutorial', { detail: '/simulador/modelo/dt' }))}
                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-emerald/10 text-emerald rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald hover:text-white transition-all group w-fit"
                    >
                        <Play className="w-3 h-3 fill-current" />
                        Ver Tutorial de esta sección
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Config Card */}
                <div id="dt-params-card" className="lg:col-span-4 xl:col-span-3 bg-white dark:bg-gray-900 rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-8 border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
                    <h3 className="text-xl font-black text-navy-slate dark:text-white mb-8 uppercase italic tracking-tight">Parámetros Árbol</h3>
                    
                    <div className="space-y-8">
                        {/* Max Depth Selector */}
                        <div>
                            <div className="flex justify-between mb-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Profundidad Máxima</label>
                                <span className="text-xl font-black text-emerald">{config.maxDepth}</span>
                            </div>
                            <input 
                                type="range" min="1" max="20" step="1" 
                                value={config.maxDepth} 
                                onChange={(e) => setConfig({...config, maxDepth: parseInt(e.target.value)})}
                                className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald"
                            />
                        </div>

                        {/* Criterion Selector */}
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Criterio</label>
                            <div className="grid grid-cols-2 gap-3">
                                {state.taskType === 'classification' ? (
                                    ['gini', 'entropy'].map(c => (
                                        <button 
                                            key={c}
                                            onClick={() => setConfig({...config, criterion: c as any})}
                                            className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                config.criterion === c ? 'bg-emerald text-white' : 'bg-gray-50 dark:bg-white/5 text-gray-500'
                                            }`}
                                        >
                                            {c}
                                        </button>
                                    ))
                                ) : (
                                    ['mse', 'mae'].map(c => (
                                        <button 
                                            key={c}
                                            onClick={() => setConfig({...config, criterion: c as any})}
                                            className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                config.criterion === c ? 'bg-emerald text-white' : 'bg-gray-50 dark:bg-white/5 text-gray-500'
                                            }`}
                                        >
                                            {c}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                        <button 
                            id="btn-train-model"
                            onClick={handleTrain}
                            disabled={isTraining}
                            className="w-full py-5 bg-navy-slate text-white rounded-[2rem] font-black text-lg uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                        >
                            {isTraining ? 'Entrenando...' : 'Ejecutar Árbol'}
                        </button>
                    </div>
                </div>
 
                {/* Results Column */}
                <div className="lg:col-span-8 xl:col-span-9 space-y-8">
                    {results ? (
                        <div className="flex flex-col gap-8">
                            {/* Performance and Tree */}
                            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 border border-gray-100 dark:border-white/10 shadow-sm">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                                    <div>
                                        <h4 className="text-2xl font-black text-navy-slate dark:text-white uppercase italic tracking-tighter">Arquitectura del Árbol</h4>
                                        <div className="flex gap-4 mt-2">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inferencia: {results.executionTime}</span>
                                            <span className="text-[10px] font-black text-tech-blue uppercase tracking-widest">Accuracy: {(results.accuracy * 100).toFixed(1)}%</span>
                                        </div>
                                    </div>
                                    <ExportButton 
                                        modelName="Árbol de Decisión" 
                                        onClick={() => generateMLReport({
                                            fileName: state.fileName || 'Iris_Simulated.csv',
                                            modelType: 'Decision Tree',
                                            results: { ...results, config: config },
                                            taskType: state.taskType,
                                            featureColumns: state.featureColumns,
                                            targetColumn: state.targetColumn || 'N/A'
                                        })}
                                    />
                                </div>
                                
                                <DecisionTreeVisualization treeData={results.treeStructure} featureNames={state.featureColumns} />
                                
                                <div className="mt-8 p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 italic">Resumen de Métricas</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        {state.taskType === 'classification' ? [
                                            { label: 'Accuracy', val: results.accuracy },
                                            { label: 'Precision', val: results.precision },
                                            { label: 'Recall', val: results.recall },
                                            { label: 'F1 Score', val: results.f1 }
                                        ].map(m => (
                                            <div key={m.label}>
                                                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-0.5">{m.label}</p>
                                                <p className="text-sm font-black text-navy-slate dark:text-white">{(m.val * 100).toFixed(1)}%</p>
                                            </div>
                                        )) : [
                                            { label: 'R² Score', val: results.r2 },
                                            { label: 'MAE', val: results.mae },
                                            { label: 'MSE', val: results.mse },
                                            { label: 'RMSE', val: results.rmse }
                                        ].map(m => (
                                            <div key={m.label}>
                                                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-0.5">{m.label}</p>
                                                <p className="text-sm font-black text-navy-slate dark:text-white">{m.label === 'R² Score' ? (m.val * 100).toFixed(1) + '%' : m.val.toFixed(4)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full bg-gray-50 dark:bg-white/5 rounded-[4rem] border-4 border-dashed border-gray-100 dark:border-white/10 flex flex-col items-center justify-center p-20 text-center scale-[0.98] transition-all hover:scale-100">
                            <div className="w-24 h-24 bg-emerald/10 rounded-[2.5rem] flex items-center justify-center mb-8 rotate-3">
                                <svg className="w-12 h-12 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h3 className="text-3xl font-black text-gray-300 uppercase italic tracking-tighter">Listo para entrenar</h3>
                            <p className="text-gray-400 font-medium max-w-sm mt-4 text-sm">Ajusta la profundidad y los criterios arriba para visualizar la estructura logística de tu modelo.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
