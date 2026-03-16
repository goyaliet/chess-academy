import LessonPage from "@/components/LessonPage";
import { modules } from "@/lib/lessons";

export default function StrategyPage() {
  const mod = modules.find((m) => m.id === "strategy")!;
  return <LessonPage module={mod} />;
}
