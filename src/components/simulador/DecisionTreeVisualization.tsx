"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface TreeNodeProps {
    label: string;
    subLabel?: string;
    isLeaf?: boolean;
    depth: number;
}

const TreeNode = ({ label, subLabel, isLeaf, depth }: TreeNodeProps) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: depth * 0.1 }}
        className={`p-5 rounded-[2rem] border-2 flex flex-col items-center min-w-[200px] shadow-lg relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl transition-all hover:scale-105 z-10 ${
            isLeaf 
                ? 'border-emerald/30 text-emerald-600 dark:text-emerald-400 shadow-emerald/5' 
                : 'border-tech-blue/30 text-tech-blue-600 dark:text-tech-blue-400 shadow-tech-blue/5'
        }`}
    >
        <div className={`absolute -top-3 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${
            isLeaf ? 'bg-emerald text-white border-emerald/20' : 'bg-tech-blue text-white border-tech-blue/20'
        }`}>
            {isLeaf ? 'Clase' : 'Decisión'}
        </div>
        <span className="text-xs font-black text-center mt-2 leading-tight uppercase italic tracking-tight dark:text-gray-100">{label}</span>
        {subLabel && (
            <div className="mt-2 pt-2 border-t border-gray-100 dark:border-white/5 w-full flex justify-center">
                <span className="text-[9px] font-black opacity-40 uppercase tracking-tighter italic dark:text-gray-400">{subLabel}</span>
            </div>
        )}
    </motion.div>
);

export default function DecisionTreeVisualization({ treeData, featureNames }: { treeData?: any, featureNames?: string[] }) {
    if (!treeData) return (
        <div className="w-full h-48 flex items-center justify-center bg-gray-50/50 dark:bg-white/5 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-white/10">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Esperando estructura del modelo...</p>
        </div>
    );

    const renderNode = (node: any, depth: number = 0): React.ReactNode => {
        if (node.isLeaf) {
            return (
                <div className="flex flex-col items-center">
                    <TreeNode 
                        label={String(node.value)} 
                        isLeaf 
                        depth={depth} 
                    />
                </div>
            );
        }

        const featureName = featureNames?.[node.featureIndex] || `F${node.featureIndex}`;
        
        return (
            <div className="flex flex-col items-center relative">
                <TreeNode 
                    label={`${featureName} <= ${Number(node.threshold).toFixed(2)}`} 
                    subLabel={`Profundidad: ${depth}`}
                    depth={depth} 
                />
                
                <div className="flex gap-24 md:gap-40 mt-16 relative w-full justify-center px-4 md:px-8">
                    <div className="relative flex-1 flex flex-col items-center min-w-[250px]">
                        <div className="absolute top-[-64px] right-0 w-full h-16">
                             <svg className="w-full h-full overflow-visible">
                                <motion.line 
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    x1="100%" y1="0" x2="50%" y2="100%" 
                                    stroke="currentColor" strokeWidth="2" 
                                    className="text-gray-200 dark:text-gray-700"
                                />
                             </svg>
                        </div>
                        <span className="text-[10px] font-black text-emerald-500 mb-2 z-10 bg-white dark:bg-gray-900 px-2 rounded-full border border-emerald/20">SÍ</span>
                        {renderNode(node.left, depth + 1)}
                    </div>
                    
                    <div className="relative flex-1 flex flex-col items-center min-w-[250px]">
                        <div className="absolute top-[-64px] left-0 w-full h-16">
                             <svg className="w-full h-full overflow-visible">
                                <motion.line 
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    x1="0" y1="0" x2="50%" y2="100%" 
                                    stroke="currentColor" strokeWidth="2" 
                                    className="text-gray-200 dark:text-gray-700"
                                />
                             </svg>
                        </div>
                        <span className="text-[10px] font-black text-red-500 mb-2 z-10 bg-white dark:bg-gray-900 px-2 rounded-full border border-red/20">NO</span>
                        {renderNode(node.right, depth + 1)}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full bg-white dark:bg-gray-950 rounded-[3rem] p-12 border border-gray-100 dark:border-white/5 shadow-inner relative overflow-hidden group">
            <TransformWrapper
                initialScale={0.8}
                initialPositionX={0}
                initialPositionY={0}
                minScale={0.2}
                maxScale={2}
                centerOnInit={true}
            >
                {({ zoomIn, zoomOut, resetTransform }: { zoomIn: any, zoomOut: any, resetTransform: any }) => (
                    <>
                        <div className="absolute top-8 left-8 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => zoomIn()} className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-tech-blue hover:bg-tech-blue hover:text-white transition-all shadow-xl">
                                <ZoomIn className="w-5 h-5" />
                            </button>
                            <button onClick={() => zoomOut()} className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-tech-blue hover:bg-tech-blue hover:text-white transition-all shadow-xl">
                                <ZoomOut className="w-5 h-5" />
                            </button>
                            <button onClick={() => resetTransform()} className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-tech-blue hover:bg-tech-blue hover:text-white transition-all shadow-xl">
                                <Maximize className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="w-full flex justify-between items-center mb-12 relative z-10">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Visualización Interactiva (Arrastra para navegar)</h4>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-tech-blue"></div>
                                    <span className="text-[9px] font-black uppercase text-gray-400">Decisión</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-emerald"></div>
                                    <span className="text-[9px] font-black uppercase text-gray-400">Resultado</span>
                                </div>
                            </div>
                        </div>

                        <TransformComponent wrapperClass="!w-full !h-full !max-h-[800px] cursor-grab active:cursor-grabbing" contentClass="!w-full !flex !justify-center !items-center">
                            <div className="p-12 pb-24">
                                {renderNode(treeData)}
                            </div>
                        </TransformComponent>
                    </>
                )}
            </TransformWrapper>
        </div>
    );
}

