"use client";

import React, { useState } from 'react';
import { useML } from '@/context/MLContext';
import { KNN } from '@/lib/ml/knn';
import { calculateClassificationMetrics, calculateRegressionMetrics } from '@/lib/ml/metrics';
import { motion } from 'framer-motion';
import KNNVisualization from './KNNVisualization';
import ConfusionMatrix from './ConfusionMatrix';
import { Play, FileDown } from 'lucide-react';
import { generateMLReport } from '@/lib/ml-report-generator';
import PredictorForm from './PredictorForm';
import { trainModel } from '@/lib/api';

const ExportButton = ({ onClick, modelName }: { onClick: () => void, modelName: string }) => (
    <button 
        onClick={onClick}
        className="flex items-center gap-2 px-6 py-3 bg-navy-slate/5 text-navy-slate dark:text-gray-300 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-navy-slate hover:text-white transition-all border border-navy-slate/10"
    >
        <FileDown className="w-4 h-4" />
        Descargar Reporte Pro de {modelName}
    </button>
);

export default function KNNManager() {
    const { state, applyPreprocessing, saveExperiment } = useML();
    const [config, setConfig] = useState({
        k: 3,
        distanceMetric: 'euclidean' as 'euclidean' | 'manhattan',
        weights: 'uniform' as 'uniform' | 'distance'
    });
    
    const [results, setResults] = useState<any>(null);
    const [isTraining, setIsTraining] = useState(false);

    const handleTrain = () => {
        const preprocessed = applyPreprocessing();
        if (!preprocessed) return;

        setIsTraining(true);
        const startTime = performance.now();

        // 🟢 Sincronización silenciosa con Flask para el PredictorForm
        const datasetName = state.fileName || 'wine.csv';
        trainModel('knn', datasetName, {
            k_neighbors: config.k,
            distance_metric: config.distanceMetric,
            weights: config.weights
        }).catch(err => console.error("Flask background sync error:", err));

        // Give a small delay for UX so it doesn't feel too instant
        setTimeout(() => {
            try {
                const { trainX, trainY, testX, testY } = preprocessed;
                
                const knn = new KNN(config, state.taskType === 'classification');
                knn.fit(trainX, trainY);
                
                const testIdx = 0; // Point to show neighbors for
                const { prediction: singlePred, neighbors } = knn.predictOne(testX[testIdx]);
                const predictions = knn.predict(testX);
                
                let result: any;
                if (state.taskType === 'classification') {
                    let finalTestY = testY;
                    let finalPredictions = predictions;

                    // Mapeo automático de números a nombres de clases si target_name está disponible
                    if (state.rawData && state.targetColumn) {
                        const targetMap = new Map();
                        state.rawData.forEach(r => {
                            if (r['target_name'] !== undefined) {
                                targetMap.set(String(r[state.targetColumn!]), String(r['target_name']));
                            }
                        });
                        
                        // Si hay mapeo válido (ej. Iris dataset), transformar los arreglos
                        if (targetMap.size > 0) {
                            finalTestY = testY.map(y => targetMap.get(String(y)) || y);
                            finalPredictions = predictions.map(y => targetMap.get(String(y)) || y);
                        }
                    }

                    const metrics = calculateClassificationMetrics(finalTestY, finalPredictions);
                    result = {
                        ...metrics,
                        model: knn,
                        neighbors,
                        executionTime: `${(performance.now() - startTime).toFixed(1)}ms`
                    };
                } else {
                    const metrics = calculateRegressionMetrics(testY as number[], predictions as number[]);
                    result = {
                        accuracy: metrics.r2, // Use R2 as "accuracy" proxy for UI consistency
                        ...metrics,
                        model: knn,
                        neighbors,
                        executionTime: `${(performance.now() - startTime).toFixed(1)}ms`
                    };
                }

                setResults(result);
                
                // Save to history WITHOUT the heavy model instance
                const { model, ...serializableResult } = result;
                saveExperiment('knn', serializableResult);
            } catch (error) {
                console.error("Training error:", error);
            } finally {
                setIsTraining(false);
            }
        }, 800);
    };

    return (
        <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 space-y-8 sm:space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <span className="text-xs font-black uppercase tracking-widest text-tech-blue bg-tech-blue/10 px-3 py-1 rounded-full mb-3 inline-block">Entrenamiento</span>
                    <h2 className="text-4xl font-black text-navy-slate dark:text-white italic tracking-tight uppercase">Modelo KNN</h2>
                    <button 
                        onClick={() => window.dispatchEvent(new CustomEvent('start-ml-tutorial', { detail: '/modelo/knn' }))}
                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-tech-blue/10 text-tech-blue rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-tech-blue hover:text-white transition-all group w-fit"
                    >
                        <Play className="w-3 h-3 fill-current" />
                        Ver Tutorial de esta sección
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Config Card */}
                <div id="knn-params-card" className="lg:col-span-4 xl:col-span-3 bg-white dark:bg-gray-900 rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-8 border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
                    <h3 className="text-xl font-black text-navy-slate dark:text-white mb-8 uppercase italic tracking-tight">Parámetros KNN</h3>
                    
                    <div className="space-y-8">
                        {/* K Selector */}
                        <div>
                            <div className="flex justify-between mb-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Número de Vecinos (K)</label>
                                <span className="text-xl font-black text-tech-blue">{config.k}</span>
                            </div>
                            <input 
                                type="range" min="1" max="21" step="2" 
                                value={config.k} 
                                onChange={(e) => setConfig({...config, k: parseInt(e.target.value)})}
                                className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-tech-blue"
                            />
                        </div>

                        {/* Metric Selector */}
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Métrica de Distancia</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['euclidean', 'manhattan'].map(m => (
                                    <button 
                                        key={m}
                                        onClick={() => setConfig({...config, distanceMetric: m as any})}
                                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                            config.distanceMetric === m ? 'bg-tech-blue text-white' : 'bg-gray-50 dark:bg-white/5 text-gray-500'
                                        }`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Weights Selector */}
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Pesos</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['uniform', 'distance'].map(w => (
                                    <button 
                                        key={w}
                                        onClick={() => setConfig({...config, weights: w as any})}
                                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                            config.weights === w ? 'bg-tech-blue text-white' : 'bg-gray-50 dark:bg-white/5 text-gray-500'
                                        }`}
                                    >
                                        {w}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button 
                            id="btn-train-model"
                            onClick={handleTrain}
                            disabled={isTraining}
                            className="w-full py-5 bg-navy-slate text-white rounded-[2rem] font-black text-lg uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                        >
                            {isTraining ? 'Entrenando...' : 'Ejecutar KNN'}
                        </button>
                    </div>
                </div>

                {/* Results Column */}
                <div className="lg:col-span-8 xl:col-span-9 space-y-8">
                    {results ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Model Identity (Ficha Técnica) */}
                            <div className="md:col-span-2 bg-navy-slate text-white rounded-[2.5rem] sm:rounded-[3rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-80 h-80 bg-tech-blue/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                                <div className="relative z-10">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-6 border-b border-white/5">
                                        <div>
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-tech-blue mb-2">Ficha Técnica de Identidad</h4>
                                            <h3 className="text-3xl font-black italic uppercase tracking-tighter">Certificación del Modelo</h3>
                                        </div>
                                        <div className="flex flex-col items-center px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Detección Actual</p>
                                            <span className="text-xl font-black text-tech-blue uppercase italic tracking-tighter">
                                                {results.classes ? results.classes[0] : '...'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                        {/* Features Grid */}
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                <div className="w-1 h-3 bg-tech-blue rounded-full"></div>
                                                Variables de Entrada (Features)
                                            </p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {state.featureColumns.map(f => (
                                                    <div key={f} className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-gray-300 uppercase tracking-tight flex items-center gap-2 hover:bg-white/10 transition-all cursor-default group/chip">
                                                        <div className="w-1 h-1 rounded-full bg-tech-blue/50 group-hover/chip:bg-tech-blue"></div>
                                                        {f}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Targets Grid */}
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                <div className="w-1 h-3 bg-emerald rounded-full"></div>
                                                Objetivos de Clasificación (Targets)
                                            </p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {results.classes ? results.classes.map((c: string) => (
                                                    <div key={c} className="px-4 py-2.5 bg-emerald/10 border border-emerald/20 rounded-xl text-[10px] font-black text-emerald uppercase tracking-tight flex items-center gap-2 hover:bg-emerald/20 transition-all cursor-default group/target">
                                                        <div className="w-1 h-1 rounded-full bg-emerald"></div>
                                                        {c}
                                                    </div>
                                                )) : (
                                                    <span className="text-gray-500 italic text-[10px]">Cargando categorías...</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Metrics Grid */}
                            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-8 border border-gray-100 dark:border-white/10 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="text-lg font-black text-navy-slate dark:text-white uppercase italic">
                                        {state.fileName === 'iris.csv' ? 'Métricas: Clasificación de Flores' : 'Métricas de Rendimiento'}
                                    </h4>
                                    <ExportButton 
                                        modelName="KNN" 
                                        onClick={() => generateMLReport({
                                            fileName: state.fileName || 'Iris_Simulated.csv',
                                            modelType: 'KNN',
                                            results: {
                                                ...results,
                                                config: config
                                            },
                                            taskType: state.taskType,
                                            featureColumns: state.featureColumns,
                                            targetColumn: state.targetColumn || 'N/A'
                                        })}
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                    {state.taskType === 'classification' ? [
                                        { label: 'Accuracy', val: results.accuracy, color: 'text-tech-blue' },
                                        { label: 'Precision', val: results.precision, color: 'text-emerald' },
                                        { label: 'Recall', val: results.recall, color: 'text-amber-500' },
                                        { label: 'F1 Score', val: results.f1, color: 'text-purple-500' }
                                    ].map(m => (
                                        <div key={m.label} className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{m.label}</p>
                                            <p className={`text-2xl font-black ${m.color}`}>{(m.val * 100).toFixed(1)}%</p>
                                        </div>
                                    )) : [
                                        { label: 'R² Score', val: results.r2, color: 'text-tech-blue' },
                                        { label: 'MAE', val: results.mae, color: 'text-emerald' },
                                        { label: 'MSE', val: results.mse, color: 'text-amber-500' },
                                        { label: 'RMSE', val: results.rmse, color: 'text-purple-500' }
                                    ].map(m => (
                                        <div key={m.label} className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{m.label}</p>
                                            <p className={`text-2xl font-black ${m.color}`}>{m.label === 'R² Score' ? (m.val * 100).toFixed(1) + '%' : m.val.toFixed(4)}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 pt-6 border-t border-gray-50 dark:border-white/5 flex justify-between items-center">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tiempo de ejecución</span>
                                    <span className="text-sm font-black italic">{results.executionTime}</span>
                                </div>
                            </div>

                            {/* Advantages & Disadvantages Block (As requested in exam) */}
                            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-8 border border-gray-100 dark:border-white/10 shadow-sm">
                                <h4 className="text-lg font-black text-navy-slate dark:text-white mb-6 uppercase italic">Análisis del Algoritmo (KNN)</h4>
                                <div className="space-y-6">
                                    <div className="p-5 bg-emerald/5 border border-emerald/10 rounded-2xl">
                                        <h5 className="text-[10px] font-black text-emerald uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald"></div>
                                            Ventajas Metodológicas
                                        </h5>
                                        <ul className="text-[11px] font-bold text-gray-600 dark:text-gray-400 space-y-2 uppercase tracking-tight">
                                            <li>• Simple de entender e implementar.</li>
                                            <li>• No requiere fase de entrenamiento explícita (Lazy Learner).</li>
                                            <li>• Robusto ante ruidos en los datos (outliers).</li>
                                        </ul>
                                    </div>
                                    <div className="p-5 bg-red-500/5 border border-red-500/10 rounded-2xl">
                                        <h5 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                            Desventajas / Limitaciones
                                        </h5>
                                        <ul className="text-[11px] font-bold text-gray-600 dark:text-gray-400 space-y-2 uppercase tracking-tight">
                                            <li>• Computacionalmente costoso en la predicción con datasets grandes.</li>
                                            <li>• Sensible a la escala de las características (normalización requerida).</li>
                                            <li>• Requiere definir el valor óptimo de K.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Confusion Matrix or Regression Plot placeholder */}
                            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-8 border border-gray-100 dark:border-white/10 shadow-sm flex flex-col items-center justify-center">
                                <h4 className="text-lg font-black text-navy-slate dark:text-white mb-2 uppercase italic w-full text-center">Visualización de Vecinos</h4>
                                <p className="text-[9px] text-gray-400 font-medium mb-8 text-center uppercase tracking-widest">Distribución espacial y fronteras de decisión</p>
                                <KNNVisualization 
                                    data={state.rawData || []} 
                                    neighbors={results.neighbors || [1, 5, 8]} 
                                    isClassification={state.taskType === 'classification'}
                                    knnModel={results.model}
                                />
                                {state.taskType === 'classification' && results.confusionMatrix && results.classes && (
                                    <ConfusionMatrix matrix={results.confusionMatrix} classes={results.classes} />
                                )}
                            </div>
                            
                            {/* Predictor Form */}
                            <div className="md:col-span-2 mt-4">
                                <PredictorForm modelType="knn" />
                            </div>
                        </div>
                    ) : (
                        <div className="h-full bg-gray-50 dark:bg-white/5 rounded-[3rem] border-4 border-dashed border-gray-100 dark:border-white/10 flex flex-col items-center justify-center p-20 text-center">
                            <div className="w-20 h-20 bg-tech-blue/10 rounded-[2rem] flex items-center justify-center mb-6">
                                <svg className="w-10 h-10 text-tech-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <h3 className="text-2xl font-black text-gray-300 uppercase italic">Listo para Entrenar</h3>
                            <p className="text-gray-400 font-medium max-w-xs mt-4">Configura los parámetros y presiona ejecutar para ver los resultados.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
