import LessonPage from "@/components/LessonPage";
import { modules } from "@/lib/lessons";

export default function OpeningsPage() {
  const mod = modules.find((m) => m.id === "openings")!;
  return <LessonPage module={mod} />;
}
