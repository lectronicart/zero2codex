import { useCallback, useEffect, useMemo, useState } from "react";

export type ProgressState = {
  version: 1;
  completedLessons: string[];
  currentLessonId: string | null;
  currentSectionIndex: number;
  sectionHighWaterMark: Record<string, number>;
  completionDates: Record<string, string>;
};

export type ProgressStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export const progressStorageKey = "zero2codex.progress.v1";

export const defaultProgressState: ProgressState = {
  version: 1,
  completedLessons: [],
  currentLessonId: null,
  currentSectionIndex: 0,
  sectionHighWaterMark: {},
  completionDates: {},
};

export function loadProgress(storage: ProgressStorage | null = getStorage()) {
  if (!storage) {
    return defaultProgressState;
  }

  const raw = storage.getItem(progressStorageKey);
  if (!raw) {
    return defaultProgressState;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return normalizeProgress(parsed);
  } catch {
    return defaultProgressState;
  }
}

export function saveProgress(
  progress: ProgressState,
  storage: ProgressStorage | null = getStorage(),
) {
  if (!storage) {
    return;
  }

  storage.setItem(progressStorageKey, JSON.stringify(progress));
}

export function updateLessonPosition(
  progress: ProgressState,
  lessonId: string,
  sectionIndex: number,
): ProgressState {
  const currentHighWater = progress.sectionHighWaterMark[lessonId] ?? 0;

  return {
    ...progress,
    currentLessonId: lessonId,
    currentSectionIndex: sectionIndex,
    sectionHighWaterMark: {
      ...progress.sectionHighWaterMark,
      [lessonId]: Math.max(currentHighWater, sectionIndex),
    },
  };
}

export function completeLesson(
  progress: ProgressState,
  lessonId: string,
  completedAt = new Date().toISOString(),
): ProgressState {
  return {
    ...progress,
    completedLessons: Array.from(new Set([...progress.completedLessons, lessonId])),
    currentLessonId: lessonId,
    completionDates: {
      ...progress.completionDates,
      [lessonId]: completedAt,
    },
  };
}

export function restartLesson(
  progress: ProgressState,
  lessonId: string,
): ProgressState {
  const highWater = { ...progress.sectionHighWaterMark };
  delete highWater[lessonId];

  return {
    ...progress,
    currentLessonId: lessonId,
    currentSectionIndex: 0,
    sectionHighWaterMark: highWater,
  };
}

export function useProgress() {
  const [progress, setProgress] = useState(() => loadProgress());

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const api = useMemo(
    () => ({
      setLessonPosition: (lessonId: string, sectionIndex: number) => {
        setProgress((current) =>
          updateLessonPosition(current, lessonId, sectionIndex),
        );
      },
      markLessonComplete: (lessonId: string) => {
        setProgress((current) => completeLesson(current, lessonId));
      },
      restart: (lessonId: string) => {
        setProgress((current) => restartLesson(current, lessonId));
      },
    }),
    [],
  );

  const isLessonComplete = useCallback(
    (lessonId: string) => progress.completedLessons.includes(lessonId),
    [progress.completedLessons],
  );

  return {
    progress,
    isLessonComplete,
    ...api,
  };
}

function normalizeProgress(progress: Partial<ProgressState>): ProgressState {
  return {
    version: 1,
    completedLessons: Array.isArray(progress.completedLessons)
      ? progress.completedLessons.filter((id): id is string => typeof id === "string")
      : [],
    currentLessonId:
      typeof progress.currentLessonId === "string"
        ? progress.currentLessonId
        : null,
    currentSectionIndex:
      typeof progress.currentSectionIndex === "number"
        ? Math.max(0, progress.currentSectionIndex)
        : 0,
    sectionHighWaterMark:
      typeof progress.sectionHighWaterMark === "object" &&
      progress.sectionHighWaterMark !== null
        ? progress.sectionHighWaterMark
        : {},
    completionDates:
      typeof progress.completionDates === "object" && progress.completionDates !== null
        ? progress.completionDates
        : {},
  };
}

function getStorage(): ProgressStorage | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}
