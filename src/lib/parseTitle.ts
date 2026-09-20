export type ParsedTitle = {
  category: string | null;
  title: string;
};

export function parseTitle(raw: string): ParsedTitle {
  const match = raw.match(/^\[([^\]]+)\]\s*/);
  if (!match) return { category: null, title: raw };
  return { category: match[1], title: raw.slice(match[0].length) };
}
