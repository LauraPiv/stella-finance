"use client";

function greetingForHour(hour: number) {
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export function Greeting({ name }: { name?: string | null }) {
  const part = greetingForHour(new Date().getHours());
  return (
    <span suppressHydrationWarning>
      {part}
      {name ? `, ${name}` : ""}
    </span>
  );
}
