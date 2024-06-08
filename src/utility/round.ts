export const round = (value: string, decimal: number = 2): string => {
  return parseFloat(Number(value).toFixed(decimal)).toString();
};

export const roundNumber = (
  value: number,
  decimal: number = 0,
): number => {
  return parseFloat(value.toFixed(decimal));
};
