/**
 * Machine Learning Metrics Library
 * Provides accurate calculations for classification and regression tasks.
 */

// --- Classification Metrics ---

export interface ClassificationMetrics {
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
    confusionMatrix: number[][];
    classes: any[];
}

export function calculateClassificationMetrics(yTrue: any[], yPred: any[]): ClassificationMetrics {
    if (yTrue.length !== yPred.length || yTrue.length === 0) {
        throw new Error("Invalid input lengths for metrics calculation.");
    }

    const n = yTrue.length;
    const labels = Array.from(new Set([...yTrue, ...yPred]));
    const labelToIndex = new Map(labels.map((label, idx) => [label, idx]));
    const numClasses = labels.length;

    // Accuracy
    let correct = 0;
    for (let i = 0; i < n; i++) {
        // Robust comparison to handle string/number mismatches common in CSV/JSON
        if (String(yTrue[i]) === String(yPred[i])) correct++;
    }
    const accuracy = correct / n;

    // Confusion Matrix
    const matrix = Array.from({ length: numClasses }, () => new Array(numClasses).fill(0));
    for (let i = 0; i < n; i++) {
        const trueLabel = yTrue[i];
        const predLabel = yPred[i];
        
        // Find matching label using robust comparison
        const trueIdx = labels.findIndex(l => String(l) === String(trueLabel));
        const predIdx = labels.findIndex(l => String(l) === String(predLabel));
        
        if (trueIdx !== -1 && predIdx !== -1) {
            matrix[trueIdx][predIdx]++;
        }
    }

    // Macro-Averaging Precision, Recall, F1
    let totalPrecision = 0;
    let totalRecall = 0;

    for (let i = 0; i < numClasses; i++) {
        const tp = matrix[i][i];
        const fp = matrix.reduce((sum, row, idx) => (idx !== i ? sum + row[i] : sum), 0);
        const fn = matrix[i].reduce((sum, val, idx) => (idx !== i ? sum + val : sum), 0);

        const prec = tp + fp === 0 ? 0 : tp / (tp + fp);
        const rec = tp + fn === 0 ? 0 : tp / (tp + fn);

        totalPrecision += prec;
        totalRecall += rec;
    }

    const precision = totalPrecision / numClasses;
    const recall = totalRecall / numClasses;
    const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);

    return { accuracy, precision, recall, f1, confusionMatrix: matrix, classes: labels };
}

// --- Regression Metrics ---

export interface RegressionMetrics {
    mse: number;
    mae: number;
    rmse: number;
    r2: number;
}

export function calculateRegressionMetrics(yTrue: number[], yPred: number[]): RegressionMetrics {
    if (yTrue.length !== yPred.length || yTrue.length === 0) {
        throw new Error("Invalid input lengths for metrics calculation.");
    }

    const n = yTrue.length;
    let sumSquaredError = 0;
    let sumAbsoluteError = 0;
    let sumY = 0;

    for (let i = 0; i < n; i++) {
        const error = yTrue[i] - yPred[i];
        sumSquaredError += error * error;
        sumAbsoluteError += Math.abs(error);
        sumY += yTrue[i];
    }

    const mse = sumSquaredError / n;
    const mae = sumAbsoluteError / n;
    const rmse = Math.sqrt(mse);

    // R-Squared calculation
    const meanY = sumY / n;
    let totalSumSquares = 0;
    for (let i = 0; i < n; i++) {
        const diff = yTrue[i] - meanY;
        totalSumSquares += diff * diff;
    }

    const r2 = totalSumSquares === 0 ? 0 : 1 - (sumSquaredError / totalSumSquares);

    return { mse, mae, rmse, r2 };
}
