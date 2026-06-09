const xlsx = require("xlsx");
const workbook = xlsx.readFile("List of Microplan villages Phase I& II.xlsx", { cellFormula: true, cellNF: true, cellText: true });
const sheet = workbook.Sheets["Phase 2"];
const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });
const names = rows
  .filter((row) => typeof row["Phase II Microplan details"] === "number")
  .map((row) => String(row.__EMPTY_1 || "").trim())
  .filter(Boolean);
console.log(names.join("\n"));
