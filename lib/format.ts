export function getDateFormat(locale: string) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => (word[0] || "").toUpperCase())
    .join("");
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  else if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  else if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  else return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function formatWeight(weightInKg: number) {
  if (weightInKg < 1000) return `${weightInKg} kg`;
  else return `${(weightInKg / 1000).toFixed(2)} tons`;
}
