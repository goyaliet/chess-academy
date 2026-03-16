"use client";

export interface Progress {
  level: "beginner" | "intermediate" | "advanced" | null;
  assessmentComplete: boolean;
  assessmentScore: number; // out of 5
  completedLessons: string[];
  completedPuzzles: string[];
  badges: string[];
  streakDays: number;
  lastVisit: string | null;
  totalPuzzlesSolved: number;
}

const defaultProgress: Progress = {
  level: null,
  assessmentComplete: false,
  assessmentScore: 0,
  completedLessons: [],
  completedPuzzles: [],
  badges: [],
  streakDays: 0,
  lastVisit: null,
  totalPuzzlesSolved: 0,
};

const KEY = "chess-academy-progress";

export function getProgress(): Progress {
  if (typeof window === "undefined") return defaultProgress;
  try {
    const stored = localStorage.getItem(KEY);
    if (!stored) return defaultProgress;
    return { ...defaultProgress, ...JSON.parse(stored) };
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(updates: Partial<Progress>): Progress {
  const current = getProgress();
  const updated = { ...current, ...updates };
  localStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}

export function completePuzzle(puzzleId: string): Progress {
  const current = getProgress();
  if (current.completedPuzzles.includes(puzzleId)) return current;
  return saveProgress({
    completedPuzzles: [...current.completedPuzzles, puzzleId],
    totalPuzzlesSolved: current.totalPuzzlesSolved + 1,
  });
}

export function completeLesson(lessonId: string, badge?: string): Progress {
  const current = getProgress();
  const updates: Partial<Progress> = {
    completedLessons: current.completedLessons.includes(lessonId)
      ? current.completedLessons
      : [...current.completedLessons, lessonId],
  };
  if (badge && !current.badges.includes(badge)) {
    updates.badges = [...current.badges, badge];
  }
  return saveProgress(updates);
}

export function setAssessmentResult(
  score: number,
  level: Progress["level"]
): Progress {
  return saveProgress({
    assessmentComplete: true,
    assessmentScore: score,
    level,
  });
}

export function updateStreak(): void {
  const current = getProgress();
  const today = new Date().toDateString();
  if (current.lastVisit === today) return;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const newStreak =
    current.lastVisit === yesterday ? current.streakDays + 1 : 1;
  saveProgress({ streakDays: newStreak, lastVisit: today });
}

export function resetProgress(): void {
  localStorage.removeItem(KEY);
}
