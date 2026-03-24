const xlsx = require('xlsx');
const workbook = xlsx.readFile('test_sample.xlsx');
const sheetName = workbook.SheetNames[0];
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
console.log("Total rows:", data.length);
console.log("Data sample:", data.slice(0, 3));
