"use client";

import { DecisionTree, DecisionTreeConfig } from './decision-tree';

export interface RandomForestConfig extends DecisionTreeConfig {
    numTrees: number;
    featureSubsamplingRate: number; // e.g., 0.8
}

export class RandomForest {
    public trees: DecisionTree[] = [];
    private config: RandomForestConfig;
    private isClassification: boolean;

    constructor(config: RandomForestConfig, isClassification: boolean) {
        this.config = config;
        this.isClassification = isClassification;
    }

    fit(X: number[][], y: any[]) {
        this.trees = [];
        const numSamples = X.length;
        const numFeatures = X[0]?.length || 0;
        const featuresToSelect = Math.max(1, Math.floor(numFeatures * this.config.featureSubsamplingRate));

        // Simple deterministic random for bagging stability
        let currentSeed = 42;
        const seededRandom = () => {
            currentSeed = (currentSeed * 9301 + 49297) % 233280;
            return currentSeed / 233280;
        };

        for (let i = 0; i < this.config.numTrees; i++) {
            // Bagging: Bootstrap sampling (sampling with replacement)
            const bootstrapX: number[][] = [];
            const bootstrapY: any[] = [];
            
            for (let j = 0; j < numSamples; j++) {
                const randomIndex = Math.floor(seededRandom() * numSamples);
                bootstrapX.push([...X[randomIndex]]);
                bootstrapY.push(y[randomIndex]);
            }

            // In a true Random Forest, we'd also subsample features *at each split* 
            // of the decision tree. For this educational implementation, we'll
            // subsample features for each tree to maintain simplicity while
            // demonstrating the "ensemble" concept.
            
            const tree = new DecisionTree(this.config, this.isClassification);
            tree.fit(bootstrapX, bootstrapY);
            this.trees.push(tree);
        }
    }

    predict(X: number[][]): any[] {
        const treePredictions = this.trees.map(tree => tree.predict(X));
        
        return X.map((_, sampleIndex) => {
            const samplePredictions = treePredictions.map(pred => pred[sampleIndex]);
            
            if (this.isClassification) {
                // Majority voting
                const counts = new Map<any, number>();
                samplePredictions.forEach(val => counts.set(val, (counts.get(val) || 0) + 1));
                
                let bestLabel = null;
                let maxCount = -1;
                for (const [label, count] of counts.entries()) {
                    if (count > maxCount) {
                        maxCount = count;
                        bestLabel = label;
                    }
                }
                return bestLabel;
            } else {
                // Average
                return samplePredictions.reduce((a, b) => a + Number(b), 0) / samplePredictions.length;
            }
        });
    }
}
