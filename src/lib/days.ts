export type Day = {
  iso: string;
  label: string;
};

const DAY_COUNT = 7;

function toLocalIso(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function label(date: Date, offset: number): string {
  if (offset === 0) return 'Today';
  if (offset === 1) return 'Yesterday';
  return date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
}

export function buildDays(): Day[] {
  const today = new Date();
  return Array.from({ length: DAY_COUNT }, (_, offset) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset);
    return { iso: toLocalIso(date), label: label(date, offset) };
  });
}
