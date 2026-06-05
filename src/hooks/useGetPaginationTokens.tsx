type PaginationToken = number | "ellipsis";

export default function useGetPaginationTokens(
  currentPage: number,
  totalPages: number,
): PaginationToken[] {
  const safeTotal = Math.max(1, totalPages);
  const safeCurrent = Math.min(Math.max(1, currentPage), safeTotal);

  if (safeTotal <= 7) {
    return Array.from({ length: safeTotal }, (_, idx) => idx + 1);
  }

  const tokens: PaginationToken[] = [];
  const siblings = 1;
  const left = Math.max(2, safeCurrent - siblings);
  const right = Math.min(safeTotal - 1, safeCurrent + siblings);

  tokens.push(1);
  if (left > 2) tokens.push("ellipsis");

  for (let p = left; p <= right; p++) tokens.push(p);

  if (right < safeTotal - 1) tokens.push("ellipsis");
  tokens.push(safeTotal);

  return tokens;
}
