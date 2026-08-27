export interface Bucket {
  key: string;
  label: string;
}

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function bucketByMonth(dateStr: string): Bucket {
  const key = dateStr.slice(0, 7); // "YYYY-MM"
  const monthIndex = Number(key.slice(5, 7)) - 1;
  return { key, label: MONTH_LABELS[monthIndex] ?? key };
}

// Standard dependency-free ISO-8601 week algorithm: shift to the Thursday of
// the same week (ISO weeks run Mon-Sun, and a week "belongs" to the year
// containing its Thursday), then measure how many whole weeks separate that
// Thursday from the first Thursday of its own ISO week-year.
export function bucketByWeek(dateStr: string): Bucket {
  const date = new Date(`${dateStr}T00:00:00`);
  const thursday = new Date(date);
  thursday.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));

  const weekYear = thursday.getFullYear();
  const firstThursday = new Date(weekYear, 0, 4);
  firstThursday.setDate(firstThursday.getDate() + 3 - ((firstThursday.getDay() + 6) % 7));

  const weekNumber =
    1 + Math.round((thursday.getTime() - firstThursday.getTime()) / (7 * 24 * 60 * 60 * 1000));

  const key = `${weekYear}-W${String(weekNumber).padStart(2, "0")}`;
  return { key, label: `Wk ${weekNumber}` };
}
