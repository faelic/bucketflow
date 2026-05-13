export function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  }).format(amount);
}

export function formatTokenAmount(amount: number, maximumFractionDigits = 6) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(amount);
}

export function formatDateLabel(value: string | null) {
  if (!value) return "Available now";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTimeLabel(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatBpsAsPercent(bps: number) {
  return `${bps / 100}%`;
}

export function formatShortAddress(value?: string) {
  if (!value) return "";

  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export function formatShortTransactionHash(value?: string) {
  if (!value) return "";

  return `${value.slice(0, 10)}...${value.slice(-6)}`;
}
