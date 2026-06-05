export const toCompactNumber = (value: number) => {
  const formatter = new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 2,
  });
  return formatter.format(value);
};

export const toFixedNumber = (value: number, digit = 2) => floorToNDecimals(value || 0, digit);

export const withCommas = (input: number | string = '') => {
  if (!input && input !== 0) return String(input);

  const [integerPart, decimalPart] = String(input).split('.');

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};

export const formatPnl = (pnl: number | string, isPercent = false) => {
  const percent = isPercent ? '%' : '';
  if (Number(pnl) < 0) return `${withCommas(pnl)}${percent}`;
  if (Number(pnl) === 0) return `0${percent}`;
  return `+${withCommas(pnl)}${percent}`;
};

export const minDigits = (value: number, digits = 2) => {
  return ('0' + value).slice(-digits);
};

export const toHexadecimal = (decimalNumber: number) => {
  const hexNumber = decimalNumber.toString(16);
  return `0x${hexNumber}`;
};

export const floorToNDecimals = (num: number, decimals: number) => {
  const factor = Math.pow(10, decimals > 4 ? 4 : decimals);
  return Math.floor(num * factor) / factor;
};

export function roundUpDecimals(num: number, decimals: number): number {
  return Math.ceil(num * 10 ** decimals) / 10 ** decimals;
}

export const decimalPlaces = (value: string) => {
  const decimalString = value.split('.')[1];
  return decimalString ? decimalString.length : 0;
};

export const roundDownNumber = (value?: number | string, precision: number = 12): number => {
  if (!value) return 0;

  const precisionFactor = 10 ** (precision);

  const num = typeof value === 'string' ? parseFloat(value) : value;
  const scaled = Math.floor(num * precisionFactor);

  return scaled / precisionFactor;
};

export const formatUnitsRoundDownToNumber = (
  value: bigint,
  decimals: number = 18,
  precision: number = 12,
): number => {
  if (!value) return 0;

  const base = BigInt(10) ** BigInt(decimals);
  const precisionFactor = BigInt(10) ** BigInt(precision);

  const scaled = (value * precisionFactor) / base;

  return Number(scaled) / Number(precisionFactor);
};
