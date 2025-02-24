export const processInputValue = (value: string): string => {
  if (value === "") {
    return "";
  }

  value = value.replace(/[^-.0-9]/g, "");
  value = value.replace(/^(-?)0+(\d+)/, "$1$2");

  return value || "0";
};
