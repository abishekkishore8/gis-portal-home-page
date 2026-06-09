const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

const phase2Dir = path.resolve(__dirname, "../village/Phase2");
const listPath = path.resolve(__dirname, "../List of Microplan villages Phase I& II.xlsx");
const finalDbPath = "C:/Users/abish/Downloads/Final microplan database Phase-2.xlsx";

function readWorkbookInfo(filePath) {
  const workbook = xlsx.readFile(filePath, { cellFormula: true, cellNF: true, cellText: true });
  const firstSheet = workbook.SheetNames[0];

  return {
    file: filePath,
    sheets: workbook.SheetNames,
    firstSheet,
    firstSheetPreview: xlsx.utils.sheet_to_json(workbook.Sheets[firstSheet], { defval: "" }).slice(0, 5),
  };
}

const phase2Files = fs.readdirSync(phase2Dir).filter((name) => name.endsWith(".xlsx"));

const result = {
  phase2Files,
  samplePhase2: phase2Files.length ? readWorkbookInfo(path.join(phase2Dir, phase2Files[0])) : null,
  listWorkbook: readWorkbookInfo(listPath),
  finalDbExists: fs.existsSync(finalDbPath),
  finalDbWorkbook: fs.existsSync(finalDbPath) ? readWorkbookInfo(finalDbPath) : null,
};

console.log(JSON.stringify(result, null, 2));