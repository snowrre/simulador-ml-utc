const fs = require('fs');

class KNN {
    constructor(config, isClassification) {
        this.config = config;
        this.isClassification = isClassification;
        this.trainX = [];
        this.trainY = [];
    }

    fit(X, y) {
        this.trainX = X;
        this.trainY = y;
    }

    predict(X) {
        return X.map(x => this.predictOne(x).prediction);
    }

    predictOne(x) {
        const euclideanDistance = (a, b) => Math.sqrt(a.reduce((acc, val, i) => acc + Math.pow(val - b[i], 2), 0));
        const manhattanDistance = (a, b) => a.reduce((acc, val, i) => acc + Math.abs(val - b[i]), 0);

        const distances = this.trainX.map((trainX, idx) => ({
            index: idx,
            distance: this.config.distanceMetric === 'euclidean' 
                ? euclideanDistance(x, trainX) 
                : manhattanDistance(x, trainX)
        }));

        distances.sort((a, b) => a.distance - b.distance);
        const neighbors = distances.slice(0, this.config.k);

        if (this.isClassification) {
            const votes = new Map();
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
        }
        return { prediction: 0 };
    }
}

function calculateClassificationMetrics(yTrue, yPred) {
    const n = yTrue.length;
    const labels = Array.from(new Set([...yTrue, ...yPred]));
    
    let correct = 0;
    for (let i = 0; i < n; i++) {
        if (String(yTrue[i]) === String(yPred[i])) correct++;
    }
    const accuracy = correct / n;
    
    const matrix = Array.from({ length: labels.length }, () => new Array(labels.length).fill(0));
    for (let i = 0; i < n; i++) {
        const trueIdx = labels.findIndex(l => String(l) === String(yTrue[i]));
        const predIdx = labels.findIndex(l => String(l) === String(yPred[i]));
        if (trueIdx !== -1 && predIdx !== -1) {
            matrix[trueIdx][predIdx]++;
        }
    }

    return { accuracy, matrix, labels };
}

// Simple test
const X = [[1, 2], [1.5, 1.8], [5, 4], [5.2, 4.1], [8, 8], [8.1, 8.2]];
const y = ['A', 'A', 'B', 'B', 'C', 'C'];

const knn = new KNN({ k: 1, distanceMetric: 'euclidean', weights: 'uniform' }, true);
knn.fit(X.slice(0, 4), y.slice(0, 4));

const preds = knn.predict(X.slice(4));
console.log(calculateClassificationMetrics(y.slice(4), preds));
