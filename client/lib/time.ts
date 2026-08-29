const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** Short relative label, e.g. "2 hours ago", "Saved yesterday", "Saved 4 days ago". */
export function timeAgo(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (days === 1) return "Saved yesterday";
  if (days < 30) return `Saved ${days} days ago`;
  return `Saved on ${MONTH_NAMES[date.getMonth()]} ${date.getDate()}`;
}

/** Timeline bucket used to group memory lists, e.g. "Today", "Yesterday", "Earlier this week", "August 2026". */
export function timelineGroup(iso: string): string {
  const date = new Date(iso);
  const now = new Date();

  if (isSameDay(date, now)) return "Today";

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(date, yesterday)) return "Yesterday";

  const diffDays = Math.floor((now.getTime() - date.getTime()) / (24 * 60 * 60 * 1000));
  if (diffDays < 7) return "Earlier this week";

  return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}
