import type { Lesson, TerminalStepSection } from "./lessonSchema.ts";
import type { FileTreeInput } from "../terminal/types.ts";

const dir = (children: Record<string, FileTreeInput> = {}): FileTreeInput => ({
  type: "directory",
  children,
});

const home = (children: Record<string, FileTreeInput>): Record<string, FileTreeInput> => ({
  home: dir({
    codex: dir(children),
  }),
});

const narrative = (id: string, title: string, body: string, keyPoints?: string[]) => ({
  id,
  type: "narrative" as const,
  title,
  body,
  keyPoints,
});

const quiz = (
  id: string,
  question: string,
  options: string[],
  correctIndex: number,
  explanation: string,
) => ({
  id,
  type: "quiz" as const,
  title: "Quick check",
  question,
  options,
  correctIndex,
  explanation,
});

const terminalStep = (
  id: string,
  title: string,
  step: Omit<TerminalStepSection, "id" | "type" | "title">,
): TerminalStepSection => ({
  id,
  type: "terminalStep",
  title,
  ...step,
});

export const level2Lessons: Lesson[] = [
  {
    id: "2.1",
    levelId: 2,
    title: "Where Am I? Use pwd",
    subtitle: "Print the folder you are standing in.",
    estimatedMinutes: 5,
    nextLessonId: "2.2",
    completionMessage: "You can now ask the terminal where you are.",
    sections: [
      narrative(
        "2.1-intro",
        "The terminal always has a location",
        "A terminal session is like standing inside one folder. The pwd command means print working directory. It shows the full path to your current folder.",
        ["pwd does not change anything.", "It only reports your current path."],
      ),
      terminalStep("2.1-terminal", "Run pwd", {
        instructions: "Type pwd and press Enter.",
        initialFileSystem: home({ projects: dir({ demo: dir() }) }),
        startingDirectory: "/home/codex/projects/demo",
        expectedCommands: ["pwd"],
        expectedCurrentDirectory: "/home/codex/projects/demo",
        successMessage:
          "Nice. pwd printed /home/codex/projects/demo, so you know exactly where you are.",
        hint: "The command is three letters: pwd",
        failureFeedback: "Use pwd by itself. It does not need a file or folder name.",
      }),
      quiz(
        "2.1-check",
        "What changed after pwd ran?",
        ["Nothing changed. It printed the current path.", "It created a folder.", "It moved into home."],
        0,
        "pwd is a safe inspection command. It reports location without changing files.",
      ),
    ],
  },
  {
    id: "2.2",
    levelId: 2,
    title: "What Is Here? Use ls",
    subtitle: "List the files and folders in the current place.",
    estimatedMinutes: 6,
    nextLessonId: "2.3",
    completionMessage: "You can now look around before moving.",
    sections: [
      narrative(
        "2.2-intro",
        "Look before you leap",
        "The ls command lists what is inside the current folder. Folders appear with a slash in this simulator so they are easy to spot.",
      ),
      terminalStep("2.2-terminal", "Run ls", {
        instructions: "Type ls to list what is in /home/codex.",
        initialFileSystem: home({
          projects: dir({ demo: dir() }),
          "welcome.txt": "You are learning the terminal.",
        }),
        startingDirectory: "/home/codex",
        expectedCommands: ["ls"],
        successMessage:
          "Good. ls showed projects/ and welcome.txt. You inspected the folder without changing it.",
        hint: "Use the two-letter list command: ls",
        failureFeedback: "Run ls by itself from the current folder.",
      }),
      quiz(
        "2.2-check",
        "In this simulator, what does a slash after a name mean?",
        ["It is a folder.", "It is deleted.", "It is a command."],
        0,
        "The slash is a visual hint that the item is a folder you can cd into.",
      ),
    ],
  },
  {
    id: "2.3",
    levelId: 2,
    title: "Moving Into Folders with cd",
    subtitle: "Change your current folder.",
    estimatedMinutes: 7,
    nextLessonId: "2.4",
    completionMessage: "You moved into a folder on purpose.",
    sections: [
      narrative(
        "2.3-intro",
        "cd changes your location",
        "The cd command means change directory. A directory is a folder. When you run cd projects/demo, the prompt moves into that folder path.",
      ),
      terminalStep("2.3-terminal", "Move into projects/demo", {
        instructions: "Use cd projects/demo to move from home into the demo project.",
        initialFileSystem: home({ projects: dir({ demo: dir({ "readme.txt": "Demo project" }) }) }),
        startingDirectory: "/home/codex",
        expectedCommands: ["cd projects/demo"],
        expectedCurrentDirectory: "/home/codex/projects/demo",
        successMessage:
          "You are now inside /home/codex/projects/demo. The prompt changed because your location changed.",
        hint: "Type cd projects/demo",
        failureFeedback: "Use cd with the folder path projects/demo.",
      }),
    ],
  },
  {
    id: "2.4",
    levelId: 2,
    title: "Going Back Up with cd ..",
    subtitle: "Move from a child folder to its parent.",
    estimatedMinutes: 6,
    nextLessonId: "2.5",
    completionMessage: "You can back out of a folder safely.",
    sections: [
      narrative(
        "2.4-intro",
        "Two dots mean parent folder",
        "The path .. points one folder up. If you are in /home/codex/projects/demo, cd .. moves you to /home/codex/projects.",
      ),
      terminalStep("2.4-terminal", "Move up one folder", {
        instructions: "Use cd .. to move from demo back to projects.",
        initialFileSystem: home({ projects: dir({ demo: dir() }) }),
        startingDirectory: "/home/codex/projects/demo",
        expectedCommands: ["cd .."],
        expectedCurrentDirectory: "/home/codex/projects",
        successMessage:
          "Perfect. You moved up one level, from demo to projects.",
        hint: "Type cd followed by two dots.",
        failureFeedback: "Use cd .. exactly. The space matters.",
      }),
    ],
  },
  {
    id: "2.5",
    levelId: 2,
    title: "Going Home with cd ~",
    subtitle: "Jump back to the home folder.",
    estimatedMinutes: 6,
    nextLessonId: "2.6",
    completionMessage: "You can always return home.",
    sections: [
      narrative(
        "2.5-intro",
        "The tilde is home",
        "The ~ symbol points to your home folder. In zero2codex lessons, home is /home/codex.",
      ),
      terminalStep("2.5-terminal", "Return home", {
        instructions: "Use cd ~ to jump back to /home/codex.",
        initialFileSystem: home({ projects: dir({ demo: dir() }) }),
        startingDirectory: "/home/codex/projects/demo",
        expectedCommands: ["cd ~"],
        expectedCurrentDirectory: "/home/codex",
        successMessage:
          "You are back at /home/codex. Home is a safe reset point when you feel lost.",
        hint: "Type cd ~",
        failureFeedback: "Use cd with the tilde symbol: cd ~",
      }),
    ],
  },
  {
    id: "2.6",
    levelId: 2,
    title: "Creating Folders with mkdir",
    subtitle: "Make a new folder for a project.",
    estimatedMinutes: 7,
    nextLessonId: "2.7",
    completionMessage: "You created a folder in the virtual file system.",
    sections: [
      narrative(
        "2.6-intro",
        "mkdir makes folders",
        "The mkdir command means make directory. It creates a folder at the path you give it. It will not create a folder if the parent path does not exist.",
      ),
      terminalStep("2.6-terminal", "Create sandbox", {
        instructions: "Create a folder named sandbox.",
        initialFileSystem: home({ projects: dir() }),
        startingDirectory: "/home/codex",
        expectedCommands: ["mkdir sandbox"],
        expectedFileSystem: {
          exists: [{ path: "/home/codex/sandbox", type: "directory" }],
        },
        successMessage:
          "sandbox/ exists now. mkdir changed the file system by adding a folder.",
        hint: "Use mkdir followed by the folder name.",
        failureFeedback: "Try mkdir sandbox from /home/codex.",
      }),
    ],
  },
  {
    id: "2.7",
    levelId: 2,
    title: "Creating Files with touch",
    subtitle: "Make an empty file.",
    estimatedMinutes: 7,
    nextLessonId: "2.8",
    completionMessage: "You created your first file.",
    sections: [
      narrative(
        "2.7-intro",
        "touch creates a blank file",
        "The touch command creates a file if it does not already exist. For now, use it to make empty files you can organize.",
      ),
      terminalStep("2.7-terminal", "Create notes.txt", {
        instructions: "Create a file named notes.txt.",
        initialFileSystem: home({ projects: dir() }),
        startingDirectory: "/home/codex",
        expectedCommands: ["touch notes.txt"],
        expectedFileSystem: {
          exists: [{ path: "/home/codex/notes.txt", type: "file", content: "" }],
        },
        successMessage:
          "notes.txt exists now. touch added a blank file to your current folder.",
        hint: "Use touch followed by the file name.",
        failureFeedback: "Try touch notes.txt from /home/codex.",
      }),
    ],
  },
  {
    id: "2.8",
    levelId: 2,
    title: "Deleting Files with rm",
    subtitle: "Remove a file only when you mean it.",
    estimatedMinutes: 8,
    nextLessonId: "2.9",
    completionMessage: "You removed a file safely in the simulator.",
    sections: [
      narrative(
        "2.8-intro",
        "rm removes files",
        "The rm command deletes files. In the real terminal, deletion can be permanent, so this course starts in a safe simulated folder.",
      ),
      terminalStep("2.8-terminal", "Remove draft.txt", {
        instructions: "Remove the file named draft.txt.",
        initialFileSystem: home({
          "draft.txt": "temporary idea",
          "keep.txt": "do not delete",
        }),
        startingDirectory: "/home/codex",
        expectedCommands: ["rm draft.txt"],
        expectedFileSystem: {
          absent: ["/home/codex/draft.txt"],
          exists: [{ path: "/home/codex/keep.txt", type: "file" }],
        },
        successMessage:
          "draft.txt is gone, and keep.txt is still there. rm changed only the file you named.",
        hint: "Use rm followed by the file name you want to remove.",
        failureFeedback: "Remove draft.txt, not keep.txt.",
      }),
    ],
  },
  {
    id: "2.9",
    levelId: 2,
    title: "Deleting Folders with rm -r",
    subtitle: "Remove a folder and everything inside it.",
    estimatedMinutes: 8,
    nextLessonId: "2.10",
    completionMessage: "You used the explicit folder delete option.",
    sections: [
      narrative(
        "2.9-intro",
        "Folders need an explicit delete option",
        "This simulator asks for rm -r before deleting folders. The -r means recursive: include the things inside the folder too.",
      ),
      terminalStep("2.9-terminal", "Remove old-project", {
        instructions: "Remove the folder named old-project.",
        initialFileSystem: home({
          "old-project": dir({ "notes.txt": "old notes" }),
          current: dir(),
        }),
        startingDirectory: "/home/codex",
        expectedCommands: ["rm -r old-project"],
        expectedFileSystem: {
          absent: ["/home/codex/old-project"],
          exists: [{ path: "/home/codex/current", type: "directory" }],
        },
        successMessage:
          "old-project/ is gone. rm -r was explicit about deleting a folder and its contents.",
        hint: "Use rm -r followed by the folder name.",
        failureFeedback: "A folder needs rm -r here. Try rm -r old-project.",
      }),
    ],
  },
  {
    id: "2.10",
    levelId: 2,
    title: "Copying Files with cp",
    subtitle: "Duplicate a file without changing the original.",
    estimatedMinutes: 8,
    nextLessonId: "2.11",
    completionMessage: "You copied a file and kept the original.",
    sections: [
      narrative(
        "2.10-intro",
        "cp needs a source and destination",
        "The cp command copies from one path to another. The first path is the thing you already have. The second path is the new copy.",
      ),
      terminalStep("2.10-terminal", "Copy notes.txt", {
        instructions: "Copy notes.txt to backup-notes.txt.",
        initialFileSystem: home({
          "notes.txt": "Remember to practice.",
        }),
        startingDirectory: "/home/codex",
        expectedCommands: ["cp notes.txt backup-notes.txt"],
        expectedFileSystem: {
          exists: [
            { path: "/home/codex/notes.txt", type: "file", content: "Remember to practice." },
            { path: "/home/codex/backup-notes.txt", type: "file", content: "Remember to practice." },
          ],
        },
        successMessage:
          "Now both files exist with the same text. cp copied the file instead of moving it.",
        hint: "Use cp source destination.",
        failureFeedback: "Try cp notes.txt backup-notes.txt.",
      }),
    ],
  },
  {
    id: "2.11",
    levelId: 2,
    title: "Moving and Renaming with mv",
    subtitle: "Move a file or give it a better name.",
    estimatedMinutes: 8,
    nextLessonId: "2.12",
    completionMessage: "You renamed a file with mv.",
    sections: [
      narrative(
        "2.11-intro",
        "mv changes where a thing lives",
        "The mv command can move a file into another folder or rename it in the same folder. Either way, the old path stops existing.",
      ),
      terminalStep("2.11-terminal", "Rename draft.txt", {
        instructions: "Rename draft.txt to final.txt.",
        initialFileSystem: home({
          "draft.txt": "ready to share",
        }),
        startingDirectory: "/home/codex",
        expectedCommands: ["mv draft.txt final.txt"],
        expectedFileSystem: {
          absent: ["/home/codex/draft.txt"],
          exists: [{ path: "/home/codex/final.txt", type: "file", content: "ready to share" }],
        },
        successMessage:
          "draft.txt became final.txt. mv changed the file path but kept the content.",
        hint: "Use mv old-name new-name.",
        failureFeedback: "Try mv draft.txt final.txt.",
      }),
    ],
  },
  {
    id: "2.12",
    levelId: 2,
    title: "Putting It All Together: Build a Folder Project",
    subtitle: "Use several commands to organize project files.",
    estimatedMinutes: 12,
    nextLessonId: "2.13",
    completionMessage: "You organized a tiny project from the terminal.",
    sections: [
      narrative(
        "2.12-intro",
        "A real workflow is a chain of small moves",
        "Most terminal work is not one magic command. It is a sequence: inspect where you are, create folders, create files, copy useful things, rename messy things, and delete scraps.",
      ),
      terminalStep("2.12-terminal", "Organize the portfolio project", {
        instructions:
          "Create portfolio/, create portfolio/assets/, add portfolio/README.md, copy notes.txt into portfolio/notes.txt, rename todo.txt to portfolio/tasks.txt, and remove draft.txt.",
        initialFileSystem: home({
          "notes.txt": "Project notes",
          "todo.txt": "Ship the project",
          "draft.txt": "scratch",
        }),
        startingDirectory: "/home/codex",
        expectedCommands: [
          { pattern: "^mkdir portfolio$" },
          { pattern: "^mkdir portfolio/assets$" },
          { pattern: "^touch portfolio/README\\.md$" },
          { pattern: "^cp notes\\.txt portfolio/notes\\.txt$" },
          { pattern: "^mv todo\\.txt portfolio/tasks\\.txt$" },
          { pattern: "^rm draft\\.txt$" },
        ],
        expectedFileSystem: {
          exists: [
            { path: "/home/codex/portfolio", type: "directory" },
            { path: "/home/codex/portfolio/assets", type: "directory" },
            { path: "/home/codex/portfolio/README.md", type: "file" },
            { path: "/home/codex/portfolio/notes.txt", type: "file", content: "Project notes" },
            { path: "/home/codex/portfolio/tasks.txt", type: "file", content: "Ship the project" },
          ],
          absent: ["/home/codex/draft.txt", "/home/codex/todo.txt"],
        },
        successMessage:
          "The portfolio folder is organized. You created folders, made a file, copied notes, moved tasks, and deleted the scratch file.",
        hint: "Work in order: mkdir, mkdir, touch, cp, mv, rm.",
        failureFeedback:
          "Keep going in order. The final project needs portfolio/assets, README.md, notes.txt, tasks.txt, and no draft.txt.",
      }),
    ],
  },
  {
    id: "2.13",
    levelId: 2,
    title: "Level 2 Review",
    subtitle: "Prove you can inspect, move, create, copy, rename, and clean up.",
    estimatedMinutes: 10,
    completionMessage: "Level 2 complete. You can handle the beginner file commands.",
    sections: [
      narrative(
        "2.13-intro",
        "Review is practice with less hand-holding",
        "This review combines the commands from Level 2. You can use help, pwd, and ls as often as you want before changing files.",
      ),
      terminalStep("2.13-terminal", "Complete the review workspace", {
        instructions:
          "Check where you are, list the folder, create review/, create review/notes.txt, copy guide.txt to review/guide-copy.txt, and remove old.txt.",
        initialFileSystem: home({
          "guide.txt": "Level 2 guide",
          "old.txt": "remove me",
        }),
        startingDirectory: "/home/codex",
        expectedCommands: [
          "pwd",
          "ls",
          "mkdir review",
          "touch review/notes.txt",
          "cp guide.txt review/guide-copy.txt",
          "rm old.txt",
        ],
        expectedFileSystem: {
          exists: [
            { path: "/home/codex/review", type: "directory" },
            { path: "/home/codex/review/notes.txt", type: "file" },
            { path: "/home/codex/review/guide-copy.txt", type: "file", content: "Level 2 guide" },
          ],
          absent: ["/home/codex/old.txt"],
        },
        successMessage:
          "Review passed. You inspected first, then organized the workspace with safe file commands.",
        hint: "The required order is pwd, ls, mkdir, touch, cp, rm.",
        failureFeedback:
          "Use the command list in the instructions. You can type help or reset if you get tangled.",
      }),
      quiz(
        "2.13-check",
        "Which command returns you to /home/codex from anywhere in these lessons?",
        ["cd ~", "rm -r", "touch ~"],
        0,
        "cd ~ moves back to the home folder.",
      ),
    ],
  },
];
