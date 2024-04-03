export const currencyFormat = (value: number, digits?: number) => {
  const formattedValue = value.toLocaleString('pt-BR', {
    maximumFractionDigits: digits ?? 8,
  });

  return formattedValue;
};
