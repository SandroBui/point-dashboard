export const truncateAddress = (address: string) => {
  if (!address) return null;
  return `${address.slice(0, 6)}..${address.slice(-4)}`;
};

export const copyTextToClipboard = (text: string, onSuccess?: () => void) => {
  navigator.clipboard.writeText(text).then(() => {
    onSuccess?.();
  });
};