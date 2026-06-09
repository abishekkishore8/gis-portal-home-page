export function formatIndianWholeNumber(value: number): string {
  const sign = value < 0 ? "-" : "";
  const digits = Math.trunc(Math.abs(value)).toString();

  if (digits.length <= 3) {
    return `${sign}${digits}`;
  }

  const lastThree = digits.slice(-3);
  const leading = digits.slice(0, -3);
  const groupedLeading = leading.replace(/\B(?=(\d{2})+(?!\d))/g, ",");

  return `${sign}${groupedLeading},${lastThree}`;
}