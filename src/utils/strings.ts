export function processInputValue(value: string) {
  let sign = "";

  if (value.startsWith("-")) {
    sign = "-";
    value = value.slice(1);
  }

  value = value.replace(/[^0-9.]/g, "");
  value = value.replace(/^0+/, "");

  return `${sign}${value || "0"}`;
}
