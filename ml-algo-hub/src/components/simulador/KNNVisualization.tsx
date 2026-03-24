"use client";

import React, { useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ScatterController,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { Target, Info } from 'lucide-react';
import { motion } from 'framer-motion';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ScatterController,
    Title,
    Tooltip,
    Legend
);

interface KNNVisualizationProps {
    data: any[];
    neighbors?: number[];
    isClassification?: boolean;
    knnModel?: any; // To predict for the background
}

export default function KNNVisualization({ data, neighbors, isClassification, knnModel }: KNNVisualizationProps) {
    // Generate background grid for decision boundary (if classification)
    const backgroundData = useMemo(() => {
        if (!isClassification || !knnModel || data.length === 0) return [];
        
        const grid = [];
        const resolution = 20; // 20x20 grid
        for (let i = 0; i <= resolution; i++) {
            for (let j = 0; j <= resolution; j++) {
                const x = (i / resolution) * 100;
                const y = (j / resolution) * 100;
                
                // We assume 2 features for visualization, or we just map 2
                // Since this is purely visual, we use a query
                const prediction = knnModel.predictOne([x, y]).prediction;
                grid.push({ x, y, label: prediction });
            }
        }
        return grid;
    }, [isClassification, knnModel, data.length]);

    const chartData = {
        datasets: [
            // Background Boundary Points (Smaller, faded)
            {
                label: 'Frontera',
                data: backgroundData,
                backgroundColor: (context: any) => {
                    const label = context.raw?.label;
                    if (!label) return 'transparent';
                    // Simple color mapping for common labels
                    const colorMap: Record<string, string> = {
                        'setosa': 'rgba(59, 130, 246, 0.1)',
                        'versicolor': 'rgba(16, 185, 129, 0.1)',
                        'virginica': 'rgba(139, 92, 246, 0.1)',
                        '0': 'rgba(59, 130, 246, 0.1)',
                        '1': 'rgba(16, 185, 129, 0.1)'
                    };
                    return colorMap[String(label).toLowerCase()] || 'rgba(100, 100, 100, 0.05)';
                },
                pointRadius: 6,
                pointStyle: 'rect',
                showLine: false,
            },
            {
                label: 'Puntos de Datos',
                data: data.slice(0, 100).map((d, i) => ({
                    x: Math.random() * 100, // Normalized for viz
                    y: Math.random() * 100,
                    id: i,
                    original: d
                })),
                backgroundColor: (context: any) => {
                    const id = context.raw?.id;
                    return neighbors?.includes(id) ? '#3b82f6' : '#cbd5e1'; 
                },
                pointRadius: (context: any) => {
                    const id = context.raw?.id;
                    return neighbors?.includes(id) ? 8 : 4;
                },
                pointStyle: 'circle'
            },
            {
                label: 'Punto de Prueba',
                data: [{ x: 50, y: 50 }],
                backgroundColor: '#ef4444',
                pointRadius: 10,
                pointStyle: 'rectRot',
            }
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 0 }, // Off for better perf during exploration
        scales: {
            x: { display: false, min: -5, max: 105 },
            y: { display: false, min: -5, max: 105 },
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: (context: any) => {
                        if (context.datasetIndex === 0) return `Zona: ${context.raw.label}`;
                        const id = context.raw?.id;
                        if (id === undefined) return 'Punto de Prueba';
                        return neighbors?.includes(id) ? 'Vecino Cercano' : 'Dato de Entrenamiento';
                    }
                }
            }
        },
    };

    return (
        <div className="w-full space-y-8">
            <div className="w-full h-80 bg-white/50 dark:bg-gray-950/50 backdrop-blur-3xl rounded-[3.5rem] p-8 border border-gray-100 dark:border-white/10 relative overflow-hidden shadow-inner group">
                <div className="absolute top-4 left-8 z-10">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-tech-blue/40">Visualización 2D Espacial</span>
                </div>
                <Scatter data={chartData as any} options={options as any} />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="p-5 bg-navy-slate/5 rounded-3xl border border-navy-slate/10 flex items-center gap-4 transition-all"
                >
                    <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/10">
                        <div className="w-7 h-7 bg-red-500 transform rotate-45 rounded-md" />
                    </div>
                    <div>
                        <h5 className="text-[11px] font-black uppercase text-red-500 tracking-wider">Dato de Prueba</h5>
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tight opacity-60 italic">Consulta</p>
                    </div>
                </motion.div>
                <div className="p-5 bg-tech-blue/5 rounded-3xl border border-tech-blue/10 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-lg shadow-tech-blue/10">
                        <div className="w-7 h-7 bg-tech-blue rounded-full" />
                    </div>
                    <div>
                        <h5 className="text-[11px] font-black uppercase text-tech-blue tracking-wider">Frontera</h5>
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tight opacity-60 italic">Espacio de Decisión</p>
                    </div>
                </div>
            </div>
            
            <div className="p-6 bg-tech-blue/10 backdrop-blur-md rounded-[2.5rem] border border-tech-blue/20 relative overflow-hidden group">
                <div className="flex items-start gap-4 relative z-10">
                    <div className="bg-tech-blue p-2 rounded-xl">
                        <Info className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-[11px] text-navy-slate dark:text-gray-300 font-bold leading-relaxed uppercase tracking-tight italic">
                        La <span className="text-tech-blue underline decoration-dotted">Frontera de Decisión</span> (fondo difuminado) representa el área de influencia de cada clase. El modelo clasifica el punto de prueba basándose en la mayoría de sus vecinos en este espacio.
                    </p>
                </div>
            </div>
        </div>
    );
}
