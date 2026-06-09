const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

const phase2Dir = path.resolve("village/Phase2");
const listPath = path.resolve("List of Microplan villages Phase I& II.xlsx");

function preview(filePath) {
  const workbook = xlsx.readFile(filePath, { cellFormula: true, cellNF: true, cellText: true });
  const firstSheet = workbook.SheetNames[0];
  const rows = xlsx.utils.sheet_to_json(workbook.Sheets[firstSheet], { defval: "" });
  return {
    file: path.basename(filePath),
    sheets: workbook.SheetNames,
    firstSheet,
    headers: rows.length ? Object.keys(rows[0]) : [],
    firstTwoRows: rows.slice(0, 2),
  };
}

const phase2Files = fs.readdirSync(phase2Dir).filter((name) => name.endsWith(".xlsx")).slice(0, 3);
const result = {
  phase2: phase2Files.map((name) => preview(path.join(phase2Dir, name))),
  list: preview(listPath),
};
console.log(JSON.stringify(result, null, 2));
