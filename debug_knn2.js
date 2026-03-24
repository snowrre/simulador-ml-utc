const xlsx = require('xlsx');

// 1. Load Data
const workbook = xlsx.readFile('test_sample.xlsx');
const sheetName = workbook.SheetNames[0];
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

const featureCols = Object.keys(data[0]).slice(0, -1);
const targetCol = Object.keys(data[0])[Object.keys(data[0]).length - 1];

console.log("Feature cols: ", featureCols);
console.log("Target col: ", targetCol);

// 2. Preprocessing
let processedData = [...data];

const featureEncoders = {};
featureCols.forEach(colName => {
    const isCategorical = false; // simplify for now, check if strings
    // In our test_sample.xlsx, we assume numeric features
});

const X = processedData.map(row => 
    featureCols.map(colName => Number(row[colName]) || 0)
);
const y = processedData.map(row => String(row[targetCol]));

console.log("Sample X:", X[0]);
console.log("Sample y:", y[0]);

// MinMaxScaler
for (let i = 0; i < featureCols.length; i++) {
    const values = X.map(row => row[i]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    X.forEach(row => {
        row[i] = (row[i] - min) / (max - min || 1);
    });
}

const indices = Array.from({ length: X.length }, (_, i) => i);
const seed = 42;
let currentSeed = seed;
const seededRandom = () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
};
for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
}

const splitIndex = Math.floor(indices.length * 0.8);
const trainIndices = indices.slice(0, splitIndex);
const testIndices = indices.slice(splitIndex);

const trainX = trainIndices.map(i => X[i]);
const trainY = trainIndices.map(i => y[i]);
const testX = testIndices.map(i => X[i]);
const testY = testIndices.map(i => y[i]);

// 3. KNN
const euclideanDistance = (a, b) => Math.sqrt(a.reduce((acc, val, i) => acc + Math.pow(val - b[i], 2), 0));
const predictOne = (x, trainX, trainY, k) => {
    const distances = trainX.map((trX, idx) => ({
        index: idx,
        distance: euclideanDistance(x, trX)
    }));
    distances.sort((a, b) => a.distance - b.distance);
    const neighbors = distances.slice(0, k);

    const votes = new Map();
    neighbors.forEach(n => {
        const weight = 1; // uniform
        const label = trainY[n.index];
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
    return bestLabel;
};

const preds = testX.map(x => predictOne(x, trainX, trainY, 3));

// 4. Metrics
let correct = 0;
for (let i = 0; i < testY.length; i++) {
    if (String(testY[i]) === String(preds[i])) correct++;
}
console.log("Accuracy:", correct / testY.length);
