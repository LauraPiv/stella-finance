import { BEGINNER_TRACK } from "@/lib/learning-content";

export default function LearnPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">
          Trilha para iniciantes
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Conceitos financeiros explicados de forma simples, no seu tempo.
        </p>
      </div>

      <ol className="flex flex-col gap-4">
        {BEGINNER_TRACK.map((lesson, i) => (
          <li key={lesson.title} className="rounded-lg border border-zinc-200 p-4">
            <p className="text-xs font-medium text-zinc-400">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-1 font-medium text-zinc-900">{lesson.title}</h2>
            <p className="mt-1.5 text-sm text-zinc-600">{lesson.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
