import LessonPage from "@/components/LessonPage";
import { modules } from "@/lib/lessons";

export default function TacticsPage() {
  const mod = modules.find((m) => m.id === "tactics")!;
  return <LessonPage module={mod} />;
}
