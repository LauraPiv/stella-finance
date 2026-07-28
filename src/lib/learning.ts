const XP_PER_LEVEL = 100;

export function levelFromXp(xp: number) {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpProgressInLevel(xp: number) {
  return xp % XP_PER_LEVEL;
}

export function xpForNextLevel() {
  return XP_PER_LEVEL;
}

export function computeStreak(completionTimestamps: string[]): number {
  const uniqueDays = [...new Set(completionTimestamps.map((d) => d.slice(0, 10)))]
    .sort()
    .reverse();

  if (uniqueDays.length === 0) return 0;

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 0; i < uniqueDays.length - 1; i++) {
    const current = new Date(`${uniqueDays[i]}T00:00:00`);
    const prev = new Date(`${uniqueDays[i + 1]}T00:00:00`);
    const diffDays = Math.round((current.getTime() - prev.getTime()) / 86400000);
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
