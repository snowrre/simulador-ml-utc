import React, { useState, useRef } from 'react';
import { predictSingle, predictBatch } from '@/lib/api';
import { useML } from '@/context/MLContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, AlertCircle, ArrowRight, FileUp, Download, CheckCircle2, Loader2 } from 'lucide-react';

interface PredictorFormProps {
    modelType: 'knn' | 'tree';
}

export default function PredictorForm({ modelType }: PredictorFormProps) {
    const { state } = useML();
    const [activeTab, setActiveTab] = useState<'individual' | 'batch'>('individual');
    const [featureValues, setFeatureValues] = useState<Record<string, string>>({});
    const [predictionResult, setPredictionResult] = useState<string | null>(null);
    const [batchResults, setBatchResults] = useState<any[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Mapeo selectivo para nombres legibles
    const getPredictionName = (val: any) => {
        if (state.rawData && state.targetColumn) {
            const sampleRow = state.rawData.find(row => String(row[state.targetColumn!]) === String(val));
            if (sampleRow && sampleRow['target_name']) return sampleRow['target_name'];
        }
        return String(val);
    };

    const handlePredict = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setPredictionResult(null);
        setIsLoading(true);

        try {
            const features = state.featureColumns.map(col => {
                const val = featureValues[col];
                if (!val || isNaN(Number(val))) {
                    throw new Error(`Por favor, ingresa un valor numérico válido para ${col}`);
                }
                return Number(val);
            });

            const result = await predictSingle(modelType, features);
            setPredictionResult(getPredictionName(result.prediction));
        } catch (err: any) {
            setError(err.message || 'Error al predecir. ¿El modelo fue entrenado?');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);
        setBatchResults(null);
        setIsLoading(true);

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const text = event.target?.result as string;
                const rows = text.split('\n').map(row => row.split(',')).filter(row => row.length >= state.featureColumns.length);
                
                // Skip header if exists (check if first row contains non-numeric)
                const dataRows = isNaN(Number(rows[0][0])) ? rows.slice(1) : rows;
                
                const features_list = dataRows.map(row => 
                    row.slice(0, state.featureColumns.length).map(v => Number(v.trim()))
                );

                if (features_list.length === 0) throw new Error("Archivo CSV vacío o inválido");

                const result = await predictBatch(modelType, features_list);
                
                const formattedResults = result.predictions.map((p: any, i: number) => ({
                    id: i + 1,
                    input: dataRows[i].slice(0, 3).join(', ') + '...',
                    prediction: getPredictionName(p)
                }));

                setBatchResults(formattedResults);
            } catch (err: any) {
                setError(err.message || "Error al procesar el archivo CSV. Asegúrate de que coincida con las columnas del modelo.");
            } finally {
                setIsLoading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        };
        reader.readAsText(file);
    };

    const downloadTemplate = () => {
        const header = state.featureColumns.join(',') + '\n';
        const sample = state.featureColumns.map(() => '0.0').join(',') + '\n';
        const blob = new Blob([header + sample], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `plantilla_prediccion_${modelType}.csv`;
        a.click();
    };

    return (
        <div id="prediction-form-card" className="bg-white dark:bg-gray-900 rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 border border-tech-blue/20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <Target className="w-64 h-64 text-tech-blue" />
            </div>

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-[1.5rem] bg-tech-blue/10 text-tech-blue flex items-center justify-center shadow-inner">
                            <Target className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-navy-slate dark:text-white uppercase italic tracking-tighter">Predicción Avanzada</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Laboratorio de Inferencia {modelType.toUpperCase()}</p>
                        </div>
                    </div>

                    <div className="flex bg-gray-50 dark:bg-white/5 p-1.5 rounded-2xl border border-gray-100 dark:border-white/10">
                        <button 
                            onClick={() => setActiveTab('individual')}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'individual' ? 'bg-white dark:bg-navy-slate text-tech-blue shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Individual
                        </button>
                        <button 
                            onClick={() => setActiveTab('batch')}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'batch' ? 'bg-white dark:bg-navy-slate text-tech-blue shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Masivo (CSV)
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'individual' ? (
                        <motion.form 
                            key="individual"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            onSubmit={handlePredict} 
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {state.featureColumns.map(colName => (
                                    <div key={colName} className="space-y-2 group">
                                        <label className="text-[9px] font-black text-gray-400 group-hover:text-tech-blue uppercase tracking-widest block transition-colors">
                                            {colName}
                                        </label>
                                        <input
                                            type="number" step="0.01" required
                                            value={featureValues[colName] || ''}
                                            onChange={(e) => setFeatureValues({...featureValues, [colName]: e.target.value})}
                                            className="w-full px-5 py-4 bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-navy-slate dark:text-white font-black text-sm focus:ring-4 focus:ring-tech-blue/10 focus:border-tech-blue outline-none transition-all placeholder:text-gray-300"
                                            placeholder="0.00"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6 items-center justify-between pt-4">
                                <button
                                    type="submit" disabled={isLoading}
                                    className="w-full sm:w-auto px-10 py-5 bg-navy-slate text-white dark:bg-white dark:text-navy-slate rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                                    {isLoading ? 'Analizando...' : 'Clasificar Ahora'}
                                </button>

                                {predictionResult && (
                                    <div className="flex-1 w-full flex items-center gap-5 bg-emerald/5 border border-emerald/10 p-5 rounded-[2rem]">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald text-white flex items-center justify-center shadow-lg shadow-emerald/20 shrink-0">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-emerald uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                                                <span className="w-1 h-3 bg-emerald rounded-full"></span>
                                                Detección Exitosa
                                            </p>
                                            <p className="text-2xl font-black text-navy-slate dark:text-white italic tracking-tighter uppercase shrink-0">
                                                {predictionResult}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.form>
                    ) : (
                        <motion.div 
                            key="batch"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-8 border-2 border-dashed border-tech-blue/20 rounded-[2.5rem] bg-tech-blue/5 flex flex-col items-center justify-center text-center space-y-6 hover:bg-tech-blue/10 transition-all group cursor-pointer relative">
                                    <input 
                                        type="file" accept=".csv" ref={fileInputRef} onChange={handleBatchUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <div className="w-20 h-20 rounded-3xl bg-tech-blue/20 text-tech-blue flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <FileUp className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-navy-slate dark:text-white uppercase italic">Subir Dataset de Prueba</h4>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-2">Formatos aceptados: .CSV (Mismas columnas)</p>
                                    </div>
                                </div>

                                <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-[2.5rem] border border-gray-100 dark:border-white/10 flex flex-col justify-between">
                                    <div>
                                        <h4 className="text-sm font-black text-navy-slate dark:text-white uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <Download className="w-4 h-4 text-tech-blue" />
                                            Guía de Estructura
                                        </h4>
                                        <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                                            Para una predicción masiva exitosa, el archivo debe contener exactamente las columnas entrenadas en el mismo orden. 
                                            Puedes descargar una plantilla lista para usar aquí abajo.
                                        </p>
                                    </div>
                                    <button 
                                        onClick={downloadTemplate}
                                        className="mt-6 flex items-center gap-2 text-[10px] font-black text-tech-blue uppercase tracking-widest hover:translate-x-2 transition-transform"
                                    >
                                        Descargar Plantilla CSV <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>

                            {batchResults && (
                                <div className="overflow-hidden rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm">
                                    <table className="w-full text-left text-[11px]">
                                        <thead className="bg-gray-50 dark:bg-white/5 text-gray-400 font-black uppercase tracking-widest">
                                            <tr>
                                                <th className="px-6 py-4">ID</th>
                                                <th className="px-6 py-4">Entrada (Primeros datos)</th>
                                                <th className="px-6 py-4 text-right">Resultado del Modelo</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                            {batchResults.map((res) => (
                                                <tr key={res.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-4 font-black text-gray-400">{res.id}</td>
                                                    <td className="px-6 py-4 font-medium text-gray-600 dark:text-gray-300">{res.input}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <span className="px-3 py-1 bg-tech-blue/10 text-tech-blue rounded-full font-black uppercase text-[9px]">
                                                            {res.prediction}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {error && (
                    <div className="mt-8 flex items-center gap-3 text-red-500 bg-red-50 dark:bg-red-900/10 p-5 rounded-3xl border border-red-100 dark:border-red-900/20 text-xs font-black uppercase tracking-tight">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}
