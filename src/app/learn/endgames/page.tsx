import LessonPage from "@/components/LessonPage";
import { modules } from "@/lib/lessons";

export default function EndgamesPage() {
  const mod = modules.find((m) => m.id === "endgames")!;
  return <LessonPage module={mod} />;
}
