export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // Revoke on the next tick: revoking synchronously can cancel the download
  // before the browser has started reading from the blob URL.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function parseFilename(
  contentDisposition: string | null,
): string | undefined {
  if (!contentDisposition) return undefined;

  // Prefer RFC 5987 `filename*=UTF-8''...` when present.
  const encodedMatch = contentDisposition.match(
    /filename\*=(?:UTF-8'')?([^;]+)/i,
  );
  if (encodedMatch?.[1]) {
    try {
      return decodeURIComponent(encodedMatch[1].trim().replace(/^"|"$/g, ""));
    } catch {
      return encodedMatch[1].trim().replace(/^"|"$/g, "");
    }
  }

  const match = contentDisposition.match(/filename="?([^";]+)"?/i);
  return match?.[1]?.trim();
}
