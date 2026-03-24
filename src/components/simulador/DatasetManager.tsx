"use client";

import React, { useCallback, useState } from 'react';
import { useML } from '@/context/MLContext';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import InfoTooltip from './InfoTooltip';
import { Play, Database } from 'lucide-react';
import { getDatasets } from '@/lib/api';

export default function DatasetManager() {
    const { state, setRawData, setTargetColumn, toggleFeatureColumn, setTaskType } = useML();
    const router = useRouter();
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileUpload = (file: File) => {
        const isCSV = file.name.endsWith('.csv');
        const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

        if (!isCSV && !isExcel) {
            setError('Por favor, selecciona un archivo CSV o Excel (.xlsx, .xls).');
            return;
        }

        setError(null);

        if (isCSV) {
            Papa.parse(file, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: (results) => {
                    if (results.data && results.data.length > 0) {
                        setRawData(results.data, file.name);
                    } else {
                        setError('El archivo parece estar vacío.');
                    }
                },
                error: (err) => {
                    setError(`Error al leer el CSV: ${err.message}`);
                }
            });
        } else if (isExcel) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target?.result as ArrayBuffer);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);

                    if (jsonData && jsonData.length > 0) {
                        setRawData(jsonData, file.name);
                    } else {
                        setError('El archivo Excel parece estar vacío.');
                    }
                } catch (err) {
                    setError('Error al procesar el archivo Excel.');
                    console.error(err);
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileUpload(file);
    }, []);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileUpload(file);
    };

    if (!state.rawData) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-4">
                <motion.div
                    id="dataset-upload-zone"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`border-4 border-dashed rounded-[3rem] p-16 text-center transition-all ${
                        isDragging ? 'border-tech-blue bg-tech-blue/5' : 'border-gray-100 dark:border-gray-800'
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={onDrop}
                >
                    <div className="w-24 h-24 bg-tech-blue/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                        <svg className="w-12 h-12 text-tech-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-black text-navy-slate dark:text-white mb-4 italic uppercase tracking-tight">Sube tu Dataset</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium text-lg">Arrastra tu archivo CSV o Excel (.xlsx, .xls) aquí o haz clic para buscar</p>
                    
                    <div className="flex flex-col items-center gap-6">
                        <button 
                            onClick={() => window.dispatchEvent(new CustomEvent('start-ml-tutorial'))}
                            className="flex items-center gap-2 px-6 py-3 bg-tech-blue/10 text-tech-blue rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-tech-blue hover:text-white transition-all group shadow-sm"
                        >
                            <Play className="w-3 h-3 fill-current" />
                            Ver Tutorial de esta sección
                        </button>

                        <label id="btn-select-file" className="inline-block px-10 py-4 bg-tech-blue text-white rounded-2xl font-black text-lg cursor-pointer shadow-xl shadow-tech-blue/20 hover:bg-blue-600 transition-all hover:-translate-y-1">
                            Seleccionar Archivo
                            <input type="file" className="hidden" accept=".csv, .xlsx, .xls" onChange={onFileChange} />
                        </label>

                        <div className="mt-12 flex flex-col items-center">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Datasets Obligatorios del Examen</h3>
                            <div className="flex gap-4">
                                {[
                                    { name: 'Iris Blossom', file: 'iris.csv', icon: '🌸' },
                                    { name: 'Breast Cancer', file: 'breast_cancer.csv', icon: '🎗️' }
                                ].map(ds => (
                                    <button 
                                        key={ds.file}
                                        onClick={async () => {
                                            try {
                                                const response = await fetch(`http://localhost:5000/api/datasets/${ds.file}`);
                                                if (response.ok) {
                                                    const text = await response.text();
                                                    Papa.parse(text, {
                                                        header: true,
                                                        dynamicTyping: true,
                                                        complete: (results) => {
                                                            setRawData(results.data, ds.file);
                                                            
                                                            // Auto-configurar variables para que el usuario no se confunda
                                                            setTimeout(() => {
                                                                if (ds.file === 'iris.csv') {
                                                                    setTargetColumn('target');
                                                                    ['sepal length (cm)', 'sepal width (cm)', 'petal length (cm)', 'petal width (cm)'].forEach(col => {
                                                                        toggleFeatureColumn(col);
                                                                    });
                                                                } else if (ds.file === 'breast_cancer.csv') {
                                                                    setTargetColumn('target');
                                                                    // Select first 5 features to avoid overwhelming the form
                                                                    const features = Object.keys(results.data[0] as any).filter(k => k !== 'target' && k !== 'target_name').slice(0, 5);
                                                                    features.forEach(col => {
                                                                        toggleFeatureColumn(col);
                                                                    });
                                                                }
                                                            }, 100);
                                                        }
                                                    });
                                                } else {
                                                    setError(`El dataset ${ds.file} no está en el servidor Flask.`);
                                                }
                                            } catch (e) {
                                                setError("Error al conectar con Flask para obtener el dataset.");
                                            }
                                        }}
                                        className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/10 rounded-[2rem] hover:border-tech-blue hover:bg-tech-blue/5 transition-all group w-40"
                                    >
                                        <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{ds.icon}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-navy-slate dark:text-white">{ds.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {error && (
                        <p className="mt-6 text-red-500 font-bold bg-red-50 dark:bg-red-900/20 py-2 px-4 rounded-xl inline-block">
                            {error}
                        </p>
                    )}
                </motion.div>
            </div>
        );
    }

    const previewRows = state.rawData.slice(0, 5);
    const hasIssues = state.columns.some(c => c.nullCount > 0 || c.uniqueValues === 1);

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 space-y-12">
            {/* Summary & Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <span className="text-xs font-black uppercase tracking-widest text-tech-blue bg-tech-blue/10 px-3 py-1 rounded-full mb-3 inline-block">Dataset Cargado</span>
                      <h2 className="text-4xl font-black text-navy-slate dark:text-white italic tracking-tight uppercase flex items-center gap-3">
                        {state.fileName}
                        {state.fileName !== 'iris_simplex.csv' && (
                            <button onClick={() => window.location.reload()} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl hover:text-red-500 transition-all" title="Eliminar dataset">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        )}
                    </h2>
                    <button 
                        onClick={() => window.dispatchEvent(new CustomEvent('start-ml-tutorial', { detail: state.rawData ? '/dataset/loaded' : '/dataset' }))}
                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-tech-blue/10 text-tech-blue rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-tech-blue hover:text-white transition-all group w-fit"
                    >
                        <Play className="w-3 h-3 fill-current" />
                        Ver Tutorial de esta sección
                    </button>
                    <div className="px-6 py-3 bg-tech-blue text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-lg">
                        Clasificación de Datos
                    </div>
                </div>
             </div>

            {/* Health Report & Variables Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Variable Config */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-8 border border-gray-100 dark:border-white/10 shadow-sm">
                        <div id="variable-config-section" className="flex items-center mb-6">
                            <h3 className="text-xl font-black text-navy-slate dark:text-white uppercase italic tracking-tight">Configuración de Variables</h3>
                            <InfoTooltip content="Target (Y): Lo que quieres predecir. Features (X): Los datos usados para predecir." />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {state.columns.map((col) => {
                                const isTarget = state.targetColumn === col.name;
                                const isFeature = state.featureColumns.includes(col.name);
                                
                                return (
                                    <div 
                                        key={col.name}
                                        className={`p-6 rounded-[2rem] border-2 transition-all ${
                                            isTarget ? 'border-tech-blue bg-tech-blue/5' : 
                                            isFeature ? 'border-emerald bg-emerald/5' : 'border-gray-50 dark:border-white/5 bg-gray-50/50 dark:bg-white/5'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                                                col.type === 'numeric' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                            }`}>
                                                {col.type}
                                            </span>
                                            {col.nullCount > 0 && (
                                                <span title={`${col.nullCount} valores nulos`} className="text-amber-500">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="font-bold text-navy-slate dark:text-white mb-6 truncate">{col.name}</h4>
                                        <div className="flex flex-col gap-2">
                                            <button 
                                                onClick={() => setTargetColumn(isTarget ? null : col.name)}
                                                className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                    isTarget ? 'bg-tech-blue text-white' : 'bg-white dark:bg-gray-800 text-gray-500 border border-gray-100 dark:border-white/10'
                                                }`}
                                            >
                                                {isTarget ? 'Target (Y)' : 'Marcar como Y'}
                                            </button>
                                            <button 
                                                onClick={() => toggleFeatureColumn(col.name)}
                                                className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                    isFeature ? 'bg-emerald text-white' : 'bg-white dark:bg-gray-800 text-gray-500 border border-gray-100 dark:border-white/10'
                                                }`}
                                            >
                                                {isFeature ? 'Feature (X)' : 'Marcar como X'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Health Report */}
                <div className="space-y-8">
                    <div id="dataset-health-report-card" className="bg-white dark:bg-gray-900 rounded-[3rem] p-8 border border-gray-100 dark:border-white/10 shadow-sm h-full">
                        <h3 className="text-xl font-black text-navy-slate dark:text-white mb-6 uppercase italic tracking-tight">Reporte de Salud</h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${state.rawData.length > 0 ? 'bg-emerald/10 text-emerald' : 'bg-red-100 text-red-700'}`}>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Tamaño</p>
                                    <p className="text-sm font-bold text-navy-slate dark:text-white">{state.rawData.length} filas</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${!hasIssues ? 'bg-emerald/10 text-emerald' : 'bg-amber-100 text-amber-600'}`}>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Calidad de Datos</p>
                                    <p className="text-sm font-bold text-navy-slate dark:text-white">{hasIssues ? 'Problemas detectados' : 'Sin problemas evidentes'}</p>
                                </div>
                            </div>

                            {/* Alert Box for Issues */}
                            {hasIssues && (
                                <div className="p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 rounded-[2rem]">
                                    <p className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                        Atención Requerida
                                    </p>
                                    <ul className="text-xs text-amber-800 dark:text-amber-300 space-y-2 font-medium">
                                        {state.columns.filter(c => c.nullCount > 0).map(c => (
                                            <li key={c.name}>• <strong>{c.name}</strong> tiene {c.nullCount} valores nulos.</li>
                                        ))}
                                        {state.columns.filter(c => c.uniqueValues === 1).map(c => (
                                            <li key={c.name}>• <strong>{c.name}</strong> tiene un solo valor (no aporta información).</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Next Step Logic */}
                            {!state.targetColumn || state.featureColumns.length === 0 ? (
                                <div className="p-6 bg-tech-blue/5 border border-tech-blue/10 rounded-[2rem]">
                                    <p className="text-xs font-black text-tech-blue uppercase tracking-widest mb-2">Próximo Paso</p>
                                    <p className="text-xs text-gray-500 font-medium">Selecciona una variable <strong>Target (Y)</strong> y al menos una <strong>Feature (X)</strong> para continuar.</p>
                                </div>
                            ) : (
                                <motion.button 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={() => router.push('/preprocesamiento')}
                                    className="w-full py-4 bg-tech-blue text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-tech-blue/20 hover:bg-blue-600 transition-all hover:-translate-y-1"
                                >
                                    Ir a Preprocesamiento
                                </motion.button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Table */}
            <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                    <h3 className="text-lg font-black text-navy-slate dark:text-white uppercase italic tracking-tight leading-none">Vista Previa de Datos (Primeras 5 Filas)</h3>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{state.columns.length} columnas • {state.rawData.length} filas totales</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10">
                                {state.columns.map(col => (
                                    <th key={col.name} className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">
                                        {col.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                            {previewRows.map((row, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                                    {state.columns.map(col => (
                                        <td key={col.name} className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap">
                                            {row[col.name]?.toString() || '—'}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

