export function processInputValue(value: string): string {
  value = value.replace(/[^0-9.]/g, "");
  value = value.replace(/^0+/, "");

  return value || "0";
}
