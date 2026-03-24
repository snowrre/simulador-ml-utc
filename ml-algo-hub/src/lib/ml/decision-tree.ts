"use client";

export interface DecisionTreeConfig {
    maxDepth: number;
    minSamplesSplit: number;
    criterion: 'gini' | 'entropy' | 'mse' | 'mae';
}

interface Node {
    featureIndex?: number;
    threshold?: number;
    left?: Node;
    right?: Node;
    value?: any;
    isLeaf: boolean;
    gain?: number;
}

export class DecisionTree {
    private root: Node | null = null;
    private config: DecisionTreeConfig;
    private isClassification: boolean;
    private numFeatures: number = 0;

    constructor(config: DecisionTreeConfig, isClassification: boolean = true) {
        this.config = config;
        this.isClassification = isClassification;
    }

    fit(X: number[][], y: any[]) {
        if (X.length === 0) return;
        this.numFeatures = X[0].length;
        this.root = this.buildTree(X, y, 0);
    }

    private buildTree(X: number[][], y: any[], depth: number): Node {
        const numSamples = X.length;
        const numLabels = new Set(y).size;

        // Base cases
        if (depth >= this.config.maxDepth || numLabels <= 1 || numSamples < this.config.minSamplesSplit) {
            return { value: this.calculateLeafValue(y), isLeaf: true };
        }

        const bestSplit = this.findBestSplit(X, y);
        if (!bestSplit || bestSplit.gain <= 0) {
            return { value: this.calculateLeafValue(y), isLeaf: true };
        }

        return {
            featureIndex: bestSplit.featureIndex,
            threshold: bestSplit.threshold,
            gain: bestSplit.gain,
            left: this.buildTree(bestSplit.XLeft, bestSplit.yLeft, depth + 1),
            right: this.buildTree(bestSplit.XRight, bestSplit.yRight, depth + 1),
            isLeaf: false
        };
    }

    private findBestSplit(X: number[][], y: any[]) {
        let bestGain = -1;
        let bestSplit = null;

        for (let featureIndex = 0; featureIndex < this.numFeatures; featureIndex++) {
            const values = X.map(row => row[featureIndex]);
            const uniqueValues = Array.from(new Set(values));
            
            for (const threshold of uniqueValues) {
                const { XLeft, yLeft, XRight, yRight } = this.split(X, y, featureIndex, threshold);
                
                if (yLeft.length === 0 || yRight.length === 0) continue;

                const gain = this.calculateGain(y, yLeft, yRight);
                if (gain > bestGain) {
                    bestGain = gain;
                    bestSplit = { featureIndex, threshold, gain, XLeft, yLeft, XRight, yRight };
                }
            }
        }

        return bestSplit;
    }

    private split(X: number[][], y: any[], featureIndex: number, threshold: number) {
        const XLeft: number[][] = [];
        const yLeft: any[] = [];
        const XRight: number[][] = [];
        const yRight: any[] = [];

        for (let i = 0; i < X.length; i++) {
            if (X[i][featureIndex] <= threshold) {
                XLeft.push(X[i]);
                yLeft.push(y[i]);
            } else {
                XRight.push(X[i]);
                yRight.push(y[i]);
            }
        }

        return { XLeft, yLeft, XRight, yRight };
    }

    private calculateGain(y: any[], yLeft: any[], yRight: any[]) {
        const weightLeft = yLeft.length / y.length;
        const weightRight = yRight.length / y.length;
        
        if (this.isClassification) {
            const parentImpurity = this.calculateImpurity(y);
            return parentImpurity - (weightLeft * this.calculateImpurity(yLeft) + weightRight * this.calculateImpurity(yRight));
        } else {
            if (this.config.criterion === 'mae') {
                return this.calculateMAEVariation(y) - (weightLeft * this.calculateMAEVariation(yLeft) + weightRight * this.calculateMAEVariation(yRight));
            } else {
                return this.calculateVariance(y) - (weightLeft * this.calculateVariance(yLeft) + weightRight * this.calculateVariance(yRight));
            }
        }
    }

    private calculateImpurity(y: any[]) {
        const counts = new Map<any, number>();
        y.forEach(label => counts.set(label, (counts.get(label) || 0) + 1));
        const probs = Array.from(counts.values()).map(c => c / y.length);
        
        if (this.config.criterion === 'gini') {
            return 1 - probs.reduce((acc, p) => acc + p * p, 0);
        } else {
            return -probs.reduce((acc, p) => acc + (p > 0 ? p * Math.log2(p) : 0), 0);
        }
    }

    private calculateVariance(y: number[]) {
        if (y.length === 0) return 0;
        const mean = y.reduce((a, b) => a + Number(b), 0) / y.length;
        return y.reduce((acc, val) => acc + Math.pow(Number(val) - mean, 2), 0) / y.length;
    }

    private calculateMAEVariation(y: number[]) {
        if (y.length === 0) return 0;
        const sorted = [...y].sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)];
        return y.reduce((acc, val) => acc + Math.abs(Number(val) - median), 0) / y.length;
    }

    private calculateLeafValue(y: any[]) {
        if (this.isClassification) {
            const counts = new Map<any, number>();
            y.forEach(label => counts.set(label, (counts.get(label) || 0) + 1));
            return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0][0];
        } else {
            return y.reduce((a, b) => a + Number(b), 0) / y.length;
        }
    }

    predict(X: number[][]): any[] {
        return X.map(features => this.predictOne(this.root, features));
    }

    private predictOne(node: Node | null, features: number[]): any {
        if (!node) return null;
        if (node.isLeaf) return node.value;

        if (features[node.featureIndex!] <= node.threshold!) {
            return this.predictOne(node.left!, features);
        } else {
            return this.predictOne(node.right!, features);
        }
    }

    getTreeStructure(): any {
        return this.root;
    }

    getFeatureImportance(): number[] {
        const importances = new Array(this.numFeatures).fill(0);
        const calculateNodeImportance = (node: Node | null) => {
            if (!node || node.isLeaf) return;
            if (node.featureIndex !== undefined) {
                importances[node.featureIndex] += node.gain || 0;
            }
            calculateNodeImportance(node.left!);
            calculateNodeImportance(node.right!);
        };
        calculateNodeImportance(this.root);
        const sum = importances.reduce((a, b) => a + b, 0);
        return sum === 0 ? importances : importances.map(v => v / sum);
    }
}
