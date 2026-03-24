"use client";

import React from 'react';

interface ConfusionMatrixProps {
    matrix: number[][];
    classes: any[];
}

export default function ConfusionMatrix({ matrix, classes }: ConfusionMatrixProps) {
    if (!matrix || !classes || classes.length === 0) return null;

    return (
        <div className="w-full mt-4 flex flex-col items-center">
            <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Matriz de Confusión</h5>
            <div className="overflow-x-auto w-full max-w-4xl mx-auto pb-4 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                <table className="w-auto mx-auto text-center border-collapse">
                    <thead>
                        <tr>
                            <th className="p-3 text-[10px] text-gray-400 font-black uppercase tracking-widest text-left border-b border-gray-100 dark:border-white/10">Real \ Predic.</th>
                            {classes.map((c, i) => (
                                <th key={`head-${i}`} className="p-3 text-[10px] text-navy-slate dark:text-gray-300 font-black uppercase border-b border-gray-100 dark:border-white/10 truncate max-w-[100px]" title={String(c)}>
                                    {String(c)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {matrix.map((row, i) => (
                            <tr key={`row-${i}`}>
                                <th className="p-3 text-[10px] text-navy-slate dark:text-gray-300 font-black uppercase text-left border-r border-gray-100 dark:border-white/10 truncate max-w-[100px]" title={String(classes[i])}>
                                    {String(classes[i])}
                                </th>
                                {row.map((val, j) => {
                                    const isCorrect = i === j;
                                    return (
                                        <td key={`cell-${i}-${j}`} className="p-2">
                                            <div className={`h-10 md:h-12 px-4 mx-auto min-w-[3.5rem] flex items-center justify-center rounded-xl font-black text-sm transition-all ${
                                                isCorrect && val > 0 ? 'bg-emerald text-white shadow-md shadow-emerald/20' : 
                                                isCorrect ? 'bg-emerald/10 text-emerald-600' :
                                                val > 0 ? 'bg-red-50 dark:bg-red-900/20 text-red-600 font-bold' : 'bg-gray-50 dark:bg-white/5 text-gray-400'
                                            }`}>
                                                {val}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="flex gap-6 mt-2 justify-center">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-md bg-emerald shadow-sm"></div>
                    <span className="text-[9px] font-black uppercase text-gray-500">Acierto</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-md bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800"></div>
                    <span className="text-[9px] font-black uppercase text-gray-500">Error</span>
                </div>
            </div>
        </div>
    );
}

