import { z } from "zod";
import type { FileTreeInput } from "../terminal/types.ts";
import type {
  CommandExpectation,
  FileSystemExpectation,
  OutputExpectation,
} from "../terminal/validation.ts";
import type { GitExpectation } from "../git/validation.ts";

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

const outputExpectationSchema = z.object({
  contains: z.array(z.string().min(1)).optional(),
  absent: z.array(z.string().min(1)).optional(),
  equals: z.array(z.string()).optional(),
  matches: z.array(z.string().min(1)).optional(),
});

const gitExpectationSchema = z.object({
  initialized: z.boolean().optional(),
  repositoryRoot: z.string().min(1).optional(),
  currentBranch: z.string().min(1).optional(),
  branches: z.array(z.string().min(1)).optional(),
  commitCount: z.number().int().nonnegative().optional(),
  latestCommitMessage: z.string().min(1).optional(),
  stagedPaths: z.array(z.string().min(1)).optional(),
  unstagedPaths: z.array(z.string().min(1)).optional(),
  untrackedPaths: z.array(z.string().min(1)).optional(),
  clean: z.boolean().optional(),
  remotes: z
    .array(
      z.object({
        name: z.string().min(1),
        url: z.string().min(1),
      }),
    )
    .optional(),
  pushedBranches: z
    .array(
      z.object({
        remoteName: z.string().min(1),
        branch: z.string().min(1),
      }),
    )
    .optional(),
  snapshot: z
    .array(
      z.object({
        path: z.string().min(1),
        content: z.string().optional(),
      }),
    )
    .optional(),
  workingDiffContains: z.array(z.string().min(1)).optional(),
  stagedDiffContains: z.array(z.string().min(1)).optional(),
  conflictFiles: z.array(z.string().min(1)).optional(),
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

const classificationCategorySchema = z.enum([
  "file",
  "folder",
  "not-file",
  "desktop",
  "terminal",
]);

export type FoundationTreeNode = {
  id: string;
  label: string;
  kind: "file" | "folder";
  children?: FoundationTreeNode[];
};

const treeNodeSchema: z.ZodType<FoundationTreeNode> = z.lazy(() =>
  z.object({
    id: z.string().min(1),
    label: z.string().min(1),
    kind: z.enum(["file", "folder"]),
    children: z.array(treeNodeSchema).optional(),
  }),
);

const classifyItemsInteractionSchema = z.object({
  kind: z.literal("classifyItems"),
  categories: z.array(
    z.object({
      id: classificationCategorySchema,
      label: z.string().min(1),
    }),
  ),
  items: z.array(
    z.object({
      id: z.string().min(1),
      label: z.string().min(1),
      description: z.string().min(1),
      correctCategory: classificationCategorySchema,
      explanation: z.string().min(1),
    }),
  ).min(1),
});

const chooseOneInteractionSchema = z.object({
  kind: z.literal("chooseOne"),
  prompt: z.string().min(1),
  tree: treeNodeSchema.optional(),
  options: z.array(
    z.object({
      id: z.string().min(1),
      label: z.string().min(1),
      description: z.string().min(1),
    }),
  ).min(2),
  correctOptionId: z.string().min(1),
  explanation: z.string().min(1),
});

const pathBuilderInteractionSchema = z.object({
  kind: z.literal("pathBuilder"),
  prompt: z.string().min(1),
  choices: z.array(z.string().min(1)).min(2),
  expectedSegments: z.array(z.string().min(1)).min(1),
  displayPrefix: z.string().optional(),
  explanation: z.string().min(1),
});

const pathClassifierInteractionSchema = z.object({
  kind: z.literal("pathClassifier"),
  prompt: z.string().min(1),
  paths: z.array(
    z.object({
      id: z.string().min(1),
      path: z.string().min(1),
      correctKind: z.enum(["absolute", "relative"]),
      explanation: z.string().min(1),
    }),
  ).min(1),
});

const matchPairsInteractionSchema = z.object({
  kind: z.literal("matchPairs"),
  prompt: z.string().min(1),
  items: z.array(
    z.object({
      id: z.string().min(1),
      label: z.string().min(1),
      description: z.string().min(1),
      correctMatchId: z.string().min(1),
    }),
  ).min(1),
  matches: z.array(
    z.object({
      id: z.string().min(1),
      label: z.string().min(1),
      description: z.string().min(1),
    }),
  ).min(2),
});

const sequenceInteractionSchema = z.object({
  kind: z.literal("sequence"),
  prompt: z.string().min(1),
  steps: z.array(
    z.object({
      id: z.string().min(1),
      label: z.string().min(1),
    }),
  ).min(2),
  correctOrder: z.array(z.string().min(1)).min(2),
  explanation: z.string().min(1),
});

const reviewChallengeInteractionSchema = z.object({
  kind: z.literal("levelOneReviewChallenge"),
  scenario: z.string().min(1),
  tree: treeNodeSchema,
  classificationItems: z.array(
    z.object({
      id: z.string().min(1),
      label: z.string().min(1),
      description: z.string().min(1),
      correctCategory: z.enum(["file", "folder"]),
    }),
  ).min(1),
  pathChoices: z.array(z.string().min(1)).min(2),
  answer: z.object({
    classifications: z.record(z.string(), z.enum(["file", "folder"])),
    treePath: z.string().min(1),
    pathSegments: z.array(z.string().min(1)).min(1),
    fileType: z.string().min(1),
    readmePurpose: z.string().min(1),
    sourceFolder: z.string().min(1),
    nextConcept: z.string().min(1),
  }),
  options: z.object({
    treePaths: z.array(z.string().min(1)).min(2),
    fileTypes: z.array(z.string().min(1)).min(2),
    readmePurposes: z.array(z.string().min(1)).min(2),
    sourceFolders: z.array(z.string().min(1)).min(2),
    nextConcepts: z.array(z.string().min(1)).min(2),
  }),
});

export const foundationInteractionSectionSchema = baseSectionSchema.extend({
  type: z.literal("foundationInteraction"),
  instructions: z.string().min(1),
  simulationLabel: z.string().min(1),
  hint: z.string().min(1),
  successMessage: z.string().min(1),
  failureFeedback: z.string().min(1),
  interaction: z.discriminatedUnion("kind", [
    classifyItemsInteractionSchema,
    chooseOneInteractionSchema,
    pathBuilderInteractionSchema,
    pathClassifierInteractionSchema,
    matchPairsInteractionSchema,
    sequenceInteractionSchema,
    reviewChallengeInteractionSchema,
  ]),
});

export const terminalStepSectionSchema = baseSectionSchema.extend({
  type: z.literal("terminalStep"),
  instructions: z.string().min(1),
  initialFileSystem: z.record(z.string(), z.custom<FileTreeInput>()).optional(),
  startingDirectory: z.string().min(1).optional(),
  setupCommands: z.array(z.string().min(1)).optional(),
  expectedCommands: z.array(commandExpectationSchema).optional(),
  expectedCurrentDirectory: z.string().min(1).optional(),
  expectedFileSystem: fileSystemExpectationSchema.optional(),
  expectedOutput: outputExpectationSchema.optional(),
  expectedGit: gitExpectationSchema.optional(),
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
  foundationInteractionSectionSchema,
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
export type FoundationInteractionSection = z.infer<
  typeof foundationInteractionSectionSchema
>;
export type TerminalStepSection = Omit<
  z.infer<typeof terminalStepSectionSchema>,
  "expectedCommands" | "expectedFileSystem" | "expectedGit"
> & {
  expectedCommands?: CommandExpectation[];
  expectedFileSystem?: FileSystemExpectation;
  expectedOutput?: OutputExpectation;
  expectedGit?: GitExpectation;
};
export type LessonSection =
  | NarrativeSection
  | QuizSection
  | FillInBlankSection
  | ChecklistSection
  | PromptTemplateSection
  | FoundationInteractionSection
  | TerminalStepSection;
export type Lesson = Omit<z.infer<typeof lessonSchema>, "sections"> & {
  sections: LessonSection[];
};

export function validateLessons(lessons: Lesson[]) {
  return lessonsSchema.parse(lessons);
}
