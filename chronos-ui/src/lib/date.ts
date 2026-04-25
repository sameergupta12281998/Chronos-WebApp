export type DateLike = string | number | null | undefined;

const toDate = (value: DateLike): Date | null => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  // Chronos API returns epoch seconds (possibly fractional).
  if (typeof value === 'number') {
    const ms = value < 1e12 ? value * 1000 : value;
    const d = new Date(ms);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  if (/^-?\d+(\.\d+)?$/.test(value)) {
    const num = Number(value);
    const ms = num < 1e12 ? num * 1000 : num;
    const d = new Date(ms);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const formatDateTime = (value: DateLike): string => {
  const d = toDate(value);
  if (!d) {
    return value === null || value === undefined || value === '' ? '-' : String(value);
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d);
};

export const toIsoString = (input: string): string => {
  const parsed = new Date(input);
  return parsed.toISOString();
};
