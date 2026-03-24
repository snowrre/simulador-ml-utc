const n = 150;
const y = [...Array(50).fill('A'), ...Array(50).fill('B'), ...Array(50).fill('C')];
const indices = Array.from({ length: n }, (_, i) => i);
let currentSeed = 42;
const seededRandom = () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
};
for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
}

const split = Math.floor(n * 0.8);
const trainIndices = indices.slice(0, split);
const testIndices = indices.slice(split);

const trainY = trainIndices.map(i => y[i]);
const testY = testIndices.map(i => y[i]);

const countClasses = (arr) => arr.reduce((acc, c) => ({...acc, [c]: (acc[c]||0)+1}), {});
console.log("Train:", countClasses(trainY));
console.log("Test:", countClasses(testY));
