export function monthsUntil(targetDate: string): number {
  const today = new Date();
  const target = new Date(`${targetDate}T00:00:00`);
  const months =
    (target.getFullYear() - today.getFullYear()) * 12 +
    (target.getMonth() - today.getMonth());
  return Math.max(months, 1);
}

export function monthlyAmountNeeded(
  targetAmount: number,
  currentAmount: number,
  targetDate: string,
): number {
  const remaining = Math.max(targetAmount - currentAmount, 0);
  return remaining / monthsUntil(targetDate);
}
