import { z } from "zod";
import type { FileTreeInput } from "../terminal/types.ts";
import type {
  CommandExpectation,
  FileSystemExpectation,
} from "../terminal/validation.ts";

const commandExpectationSchema = z.union([
  z.string().min(1),
  z.object({ pattern: z.string().min(1) }),
]);

const fileSystemExpectationSchema = z.object({
  exists: z
    .array(
      z.object({
        path: z.string().min(1),
        type: z.enum(["file", "directory"]).optional(),
        content: z.string().optional(),
      }),
    )
    .optional(),
  absent: z.array(z.string().min(1)).optional(),
});

const baseSectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
});

export const narrativeSectionSchema = baseSectionSchema.extend({
  type: z.literal("narrative"),
  body: z.string().min(1),
  keyPoints: z.array(z.string().min(1)).optional(),
});

export const quizSectionSchema = baseSectionSchema.extend({
  type: z.literal("quiz"),
  question: z.string().min(1),
  options: z.array(z.string().min(1)).min(2),
  correctIndex: z.number().int().nonnegative(),
  explanation: z.string().min(1),
});

export const fillInBlankSectionSchema = baseSectionSchema.extend({
  type: z.literal("fillInBlank"),
  prompt: z.string().min(1),
  answers: z.array(z.string().min(1)).min(1),
  hint: z.string().min(1),
  successMessage: z.string().min(1),
});

export const checklistSectionSchema = baseSectionSchema.extend({
  type: z.literal("checklist"),
  items: z.array(z.string().min(1)).min(1),
  successMessage: z.string().min(1),
});

export const promptTemplateSectionSchema = baseSectionSchema.extend({
  type: z.literal("promptTemplate"),
  instruction: z.string().min(1),
  startingPrompt: z.string().min(1),
  requiredParts: z.array(z.string().min(1)).min(1),
  successMessage: z.string().min(1),
});

export const terminalStepSectionSchema = baseSectionSchema.extend({
  type: z.literal("terminalStep"),
  instructions: z.string().min(1),
  initialFileSystem: z.record(z.string(), z.custom<FileTreeInput>()).optional(),
  startingDirectory: z.string().min(1).optional(),
  expectedCommands: z.array(commandExpectationSchema).optional(),
  expectedCurrentDirectory: z.string().min(1).optional(),
  expectedFileSystem: fileSystemExpectationSchema.optional(),
  successMessage: z.string().min(1),
  hint: z.string().min(1),
  failureFeedback: z.string().min(1),
});

export const lessonSectionSchema = z.discriminatedUnion("type", [
  narrativeSectionSchema,
  quizSectionSchema,
  fillInBlankSectionSchema,
  checklistSectionSchema,
  promptTemplateSectionSchema,
  terminalStepSectionSchema,
]);

export const lessonSchema = z.object({
  id: z.string().min(1),
  levelId: z.number().int().positive(),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  estimatedMinutes: z.number().int().positive(),
  sections: z.array(lessonSectionSchema).min(1),
  nextLessonId: z.string().min(1).optional(),
  completionMessage: z.string().min(1),
});

export const lessonsSchema = z.array(lessonSchema);

export type NarrativeSection = z.infer<typeof narrativeSectionSchema>;
export type QuizSection = z.infer<typeof quizSectionSchema>;
export type FillInBlankSection = z.infer<typeof fillInBlankSectionSchema>;
export type ChecklistSection = z.infer<typeof checklistSectionSchema>;
export type PromptTemplateSection = z.infer<typeof promptTemplateSectionSchema>;
export type TerminalStepSection = Omit<
  z.infer<typeof terminalStepSectionSchema>,
  "expectedCommands" | "expectedFileSystem"
> & {
  expectedCommands?: CommandExpectation[];
  expectedFileSystem?: FileSystemExpectation;
};
export type LessonSection =
  | NarrativeSection
  | QuizSection
  | FillInBlankSection
  | ChecklistSection
  | PromptTemplateSection
  | TerminalStepSection;
export type Lesson = Omit<z.infer<typeof lessonSchema>, "sections"> & {
  sections: LessonSection[];
};

export function validateLessons(lessons: Lesson[]) {
  return lessonsSchema.parse(lessons);
}
