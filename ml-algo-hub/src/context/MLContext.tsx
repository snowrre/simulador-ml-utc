"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type DataType = 'numeric' | 'categorical' | 'date';

export interface ColumnMetadata {
    name: string;
    type: DataType;
    uniqueValues: number;
    nullCount: number;
}

/*
## 🛠️ Desarrollo Pendiente (Fases Restantes)
- [x] Corregir flujo de 'Cargar Dataset' (limpieza de estado) <!-- id: 7 -->
- [x] Renombrar ejemplo a 'iris_simplex.csv' y quitar borrado <!-- id: 8 -->
- [ ] Implementar One-Hot Encoding real <!-- id: 3 -->
- [ ] Visualización de Árbol de Decisión <!-- id: 4 -->
- [ ] Analogía Visual KNN (Perro y Trufas) <!-- id: 9 -->
- [ ] Gráfico de Vecinos más Cercanos (KNN) <!-- id: 5 -->
*/
export interface PreprocessingSettings {
    missingDataStrategy: 'delete' | 'mean' | 'median' | 'mode';
    scalingStrategy: 'none' | 'standard' | 'minmax';
    oneHotEncoding: boolean;
    trainTestSplit: number; // e.g. 0.8
}

export interface Experiment {
    id: string;
    timestamp: number;
    fileName: string;
    taskType: 'classification' | 'regression';
    preprocessing: PreprocessingSettings;
    modelType: 'knn' | 'dt' | 'rf';
    results: any;
}

export interface MLDataState {
    rawData: any[] | null;
    columns: ColumnMetadata[];
    targetColumn: string | null;
    featureColumns: string[];
    taskType: 'classification' | 'regression';
    fileName: string | null;
    preprocessing: PreprocessingSettings;
    experiments: Experiment[];
}

interface MLContextType {
    state: MLDataState;
    setRawData: (data: any[], fileName: string) => void;
    setTargetColumn: (col: string | null) => void;
    toggleFeatureColumn: (col: string) => void;
    setTaskType: (type: 'classification' | 'regression') => void;
    updatePreprocessing: (settings: Partial<PreprocessingSettings>) => void;
    applyPreprocessing: () => { trainX: number[][], trainY: any[], testX: number[][], testY: any[] } | null;
    saveExperiment: (modelType: 'knn' | 'dt' | 'rf', results: any) => void;
    deleteExperiment: (id: string) => void;
    resetState: () => void;
}

const initialState: MLDataState = {
    rawData: null,
    columns: [],
    targetColumn: null,
    featureColumns: [],
    taskType: 'classification',
    fileName: null,
    preprocessing: {
        missingDataStrategy: 'mean',
        scalingStrategy: 'standard',
        oneHotEncoding: true,
        trainTestSplit: 0.8,
    },
    experiments: [],
};

const MLContext = createContext<MLContextType | undefined>(undefined);

export function MLProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<MLDataState>(initialState);

    const setRawData = (data: any[], fileName: string) => {
        if (data.length === 0) return;

        const colNames = Object.keys(data[0]);
        const columns: ColumnMetadata[] = colNames.map(name => {
            const values = data.map(row => row[name]);
            const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
            const uniqueCount = new Set(nonNullValues).size;
            const nullCount = values.length - nonNullValues.length;

            // Simple type detection
            let type: DataType = 'categorical';
            const isNumeric = nonNullValues.every(v => !isNaN(Number(v)));
            if (isNumeric) {
                type = 'numeric';
            } else if (nonNullValues.every(v => !isNaN(Date.parse(v)))) {
                type = 'date';
            }

            return { name, type, uniqueValues: uniqueCount, nullCount };
        });

        setState({
            ...initialState,
            rawData: data,
            columns,
            fileName,
        });
    };

    const setTargetColumn = (col: string | null) => {
        setState(prev => ({
            ...prev,
            targetColumn: col,
            featureColumns: prev.featureColumns.filter(f => f !== col),
        }));
    };

    const toggleFeatureColumn = (col: string) => {
        setState(prev => {
            if (prev.featureColumns.includes(col)) {
                return { ...prev, featureColumns: prev.featureColumns.filter(f => f !== col) };
            } else {
                return { 
                    ...prev, 
                    featureColumns: [...prev.featureColumns, col],
                    targetColumn: prev.targetColumn === col ? null : prev.targetColumn
                };
            }
        });
    };

    const setTaskType = (type: 'classification' | 'regression') => {
        setState(prev => ({ ...prev, taskType: type }));
    };

    const updatePreprocessing = (settings: Partial<PreprocessingSettings>) => {
        setState(prev => ({
            ...prev,
            preprocessing: { ...prev.preprocessing, ...settings }
        }));
    };

    const saveExperiment = (modelType: 'knn' | 'dt' | 'rf', results: any) => {
        setState(prev => {
            const newExperiment: Experiment = {
                id: Math.random().toString(36).substr(2, 9),
                timestamp: Date.now(),
                fileName: prev.fileName || 'Unknown',
                taskType: prev.taskType,
                preprocessing: { ...prev.preprocessing },
                modelType,
                results
            };
            return {
                ...prev,
                experiments: [newExperiment, ...prev.experiments]
            };
        });
    };

    const deleteExperiment = (id: string) => {
        setState(prev => ({
            ...prev,
            experiments: prev.experiments.filter(e => e.id !== id)
        }));
    };

    const applyPreprocessing = (): { trainX: number[][], trainY: any[], testX: number[][], testY: any[] } | null => {
        if (!state.rawData || !state.targetColumn || state.featureColumns.length === 0) return null;

        const { preprocessing } = state;
        // Optimization: Use shallow copy for structure, only copy if mutation is needed
        let processedData = [...state.rawData]; 

        // 1. Handle Missing Data
        state.featureColumns.forEach(colName => {
            const colMeta = state.columns.find(c => c.name === colName);
            if (!colMeta || colMeta.nullCount === 0) return;

            if (preprocessing.missingDataStrategy === 'delete') {
                processedData = processedData.filter((row: any) => row[colName] !== null && row[colName] !== undefined && row[colName] !== '');
            } else if (colMeta.type === 'numeric') {
                const values = processedData.map((r: any) => Number(r[colName])).filter((v: any) => !isNaN(v));
                let fillValue = 0;
                
                if (preprocessing.missingDataStrategy === 'mean' && values.length > 0) {
                    fillValue = values.reduce((a: any, b: any) => a + b, 0) / values.length;
                } else if (preprocessing.missingDataStrategy === 'median' && values.length > 0) {
                    const sorted = [...values].sort((a, b) => a - b);
                    fillValue = sorted[Math.floor(sorted.length / 2)];
                } else if (preprocessing.missingDataStrategy === 'mode' && values.length > 0) {
                    const counts: any = {};
                    values.forEach((v: any) => counts[v] = (counts[v] || 0) + 1);
                    fillValue = Number(Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b));
                }

                processedData = processedData.map((row: any) => {
                    const val = row[colName];
                    if (val === null || val === undefined || val === '') {
                        return { ...row, [colName]: fillValue };
                    }
                    return row;
                });
            }
        });

        // 2. Transform to Matrices (X, y)
        // Categorical Encoding (Label Encoding)
        const featureEncoders: Record<string, Record<any, number>> = {};
        state.featureColumns.forEach(colName => {
            const colMeta = state.columns.find(c => c.name === colName);
            if (colMeta?.type === 'categorical') {
                const uniqueVals = Array.from(new Set(processedData.map((r: any) => r[colName])));
                featureEncoders[colName] = {};
                uniqueVals.sort().forEach((v, i) => featureEncoders[colName][v] = i);
            }
        });

        // Target Encoding for Classification
        let targetEncoder: Record<any, number> = {};
        if (state.taskType === 'classification') {
            const uniqueTargets = Array.from(new Set(processedData.map((r: any) => r[state.targetColumn!])));
            uniqueTargets.sort().forEach((v, i) => targetEncoder[v] = i);
        }

        const X = processedData.map((row: any) => 
            state.featureColumns.map(colName => {
                const val = row[colName];
                if (featureEncoders[colName]) {
                    return featureEncoders[colName][val] ?? 0;
                }
                const numVal = Number(val);
                return isNaN(numVal) ? 0 : numVal;
            })
        );

        const y = state.taskType === 'classification' 
            ? processedData.map((row: any) => row[state.targetColumn!]) // Keep original labels for classification metrics
            : processedData.map((row: any) => {
                const numVal = Number(row[state.targetColumn!]);
                return isNaN(numVal) ? 0 : numVal;
            });

        // 3. Scaling
        if (preprocessing.scalingStrategy !== 'none') {
            for (let i = 0; i < state.featureColumns.length; i++) {
                const colName = state.featureColumns[i];
                const colMeta = state.columns.find(c => c.name === colName);
                if (colMeta?.type !== 'numeric') continue;

                const values = X.map(row => row[i]);
                const min = Math.min(...values);
                const max = Math.max(...values);
                const mean = values.reduce((a, b) => a + b, 0) / (values.length || 1);
                const std = Math.sqrt(values.map(v => Math.pow(v - mean, 2)).reduce((a, b) => a + b, 0) / (values.length || 1));

                X.forEach(row => {
                    if (preprocessing.scalingStrategy === 'minmax') {
                        row[i] = (row[i] - min) / (max - min || 1);
                    } else if (preprocessing.scalingStrategy === 'standard') {
                        row[i] = (row[i] - mean) / (std || 1);
                    }
                });
            }
        }

        // 4. Train/Test Split (Stable shuffle using a simple LCG-based random)
        const indices = Array.from({ length: X.length }, (_, i) => i);
        
        // Simpler deterministic shuffle for the simulator
        const seed = 42; // Fixed seed for stability as per user request
        let currentSeed = seed;
        const seededRandom = () => {
            currentSeed = (currentSeed * 9301 + 49297) % 233280;
            return currentSeed / 233280;
        };

        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(seededRandom() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        const splitIndex = Math.floor(indices.length * preprocessing.trainTestSplit);
        const trainIndices = indices.slice(0, splitIndex);
        const testIndices = indices.slice(splitIndex);

        return {
            trainX: trainIndices.map(i => X[i]),
            trainY: trainIndices.map(i => y[i]),
            testX: testIndices.map(i => X[i]),
            testY: testIndices.map(i => y[i])
        };
    };

    const resetState = () => setState(initialState);

    return (
        <MLContext.Provider value={{ 
            state, 
            setRawData, 
            setTargetColumn, 
            toggleFeatureColumn, 
            setTaskType, 
            updatePreprocessing, 
            applyPreprocessing,
            saveExperiment, 
            deleteExperiment, 
            resetState 
        }}>
            {children}
        </MLContext.Provider>
    );
}

export function useML() {
    const context = useContext(MLContext);
    if (!context) {
        throw new Error('useML must be used within an MLProvider');
    }
    return context;
}
