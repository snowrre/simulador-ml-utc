"use client";

// Simple Euclidean Distance
export const euclideanDistance = (a: number[], b: number[]) => {
    return Math.sqrt(a.reduce((acc, val, i) => acc + Math.pow(val - b[i], 2), 0));
};

// Simple Manhattan Distance
export const manhattanDistance = (a: number[], b: number[]) => {
    return a.reduce((acc, val, i) => acc + Math.abs(val - b[i]), 0);
};

export interface KNNConfig {
    k: number;
    distanceMetric: 'euclidean' | 'manhattan';
    weights: 'uniform' | 'distance';
}

export class KNN {
    private trainX: number[][] = [];
    private trainY: any[] = [];
    private config: KNNConfig;
    private isClassification: boolean;

    constructor(config: KNNConfig, isClassification: boolean) {
        this.config = config;
        this.isClassification = isClassification;
    }

    fit(X: number[][], y: any[]) {
        this.trainX = X;
        this.trainY = y;
    }

    predict(X: number[][]): any[] {
        return X.map(x => this.predictOne(x).prediction);
    }

    predictOne(x: number[]): { prediction: any, neighbors: number[] } {
        const distances = this.trainX.map((trainX, idx) => ({
            index: idx,
            distance: this.config.distanceMetric === 'euclidean' 
                ? euclideanDistance(x, trainX) 
                : manhattanDistance(x, trainX)
        }));

        // Sort by distance
        distances.sort((a, b) => a.distance - b.distance);

        // Get k nearest
        const neighbors = distances.slice(0, this.config.k);

        if (this.isClassification) {
            const votes = new Map<any, number>();
            neighbors.forEach(n => {
                const weight = this.config.weights === 'uniform' ? 1 : 1 / (n.distance || 0.001);
                const label = this.trainY[n.index];
                votes.set(label, (votes.get(label) || 0) + weight);
            });

            let bestLabel = null;
            let maxVotes = -1;
            for (const [label, count] of votes.entries()) {
                if (count > maxVotes) {
                    maxVotes = count;
                    bestLabel = label;
                }
            }

            return { prediction: bestLabel, neighbors: neighbors.map(n => n.index) };
        } else {
            // Regression
            let sumWeights = 0;
            let sumValues = 0;
            neighbors.forEach(n => {
                const weight = this.config.weights === 'uniform' ? 1 : 1 / (n.distance || 0.001);
                sumWeights += weight;
                sumValues += this.trainY[n.index] * weight;
            });
            return { prediction: sumValues / sumWeights, neighbors: neighbors.map(n => n.index) };
        }
    }
}
