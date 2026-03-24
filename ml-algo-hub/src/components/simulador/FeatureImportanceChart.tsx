"use client";

import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface FeatureImportanceChartProps {
    features: string[];
    importances: number[];
}

export default function FeatureImportanceChart({ features, importances }: FeatureImportanceChartProps) {
    if (!features || !importances || features.length === 0) {
        return <div className="h-full flex items-center justify-center text-[10px] font-black text-gray-400 uppercase tracking-widest italic opacity-50">Sin datos de impacto</div>;
    }
    // Sort features by importance
    const sortedData = features.map((f, i) => ({ 
        name: f, 
        value: importances[i] || 0 
    })).sort((a, b) => b.value - a.value);

    const data = {
        labels: sortedData.map(d => d.name),
        datasets: [
            {
                label: 'Importancia Relativa',
                data: sortedData.map(d => d.value),
                backgroundColor: (context: any) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 400, 0);
                    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
                    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.8)');
                    return gradient;
                },
                borderRadius: 8,
                borderSkipped: false,
                barThickness: 24,
            },
        ],
    };

    const options = {
        indexAxis: 'y' as const,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context: any) => `Impacto: ${(context.raw * 100).toFixed(1)}%`
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                max: 1.05,
                grid: { display: false },
                ticks: {
                    callback: (value: any) => `${(value * 100).toFixed(0)}%`,
                    font: { size: 10, weight: 'bold' }
                }
            },
            y: {
                grid: { display: false },
                ticks: {
                    font: { size: 10, weight: 'bold' },
                    color: '#64748b'
                }
            }
        }
    };

    return (
        <div className="w-full h-full min-h-[300px]">
            <Bar data={data} options={options} />
        </div>
    );
}
