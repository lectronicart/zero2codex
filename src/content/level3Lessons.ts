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

const text = (...lines: string[]) => lines.join("\n");

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

const roadmap = text(
  "1. Learn what files contain",
  "2. Practice reading before editing",
  "3. Save notes in plain text",
  "4. Search for important words",
  "5. Count lines when checking logs",
  "6. Ask for help when stuck",
  "7. Keep examples small",
  "8. Verify the result",
  "9. Reset and try again",
  "10. Explain what changed",
  "11. Share the useful command",
  "12. Move to the next lesson",
);

const serverLog = text(
  "09:00 INFO server started",
  "09:01 INFO route /health ok",
  "09:02 WARN slow response",
  "09:03 INFO route /course ok",
  "09:04 ERROR missing lesson file",
  "09:05 INFO retry scheduled",
  "09:06 ERROR timeout while reading notes",
);

export const level3Lessons: Lesson[] = [
  {
    id: "3.1",
    levelId: 3,
    title: "Looking Inside Files with cat",
    subtitle: "Print a file so you can read what is inside.",
    estimatedMinutes: 6,
    nextLessonId: "3.2",
    completionMessage: "You can now inspect text files before changing them.",
    sections: [
      narrative(
        "3.1-intro",
        "Files are meant to be read",
        "The cat command prints a text file into the terminal. In these lessons, use it when you want to see the whole file at once.",
        ["cat does not edit the file.", "It helps you inspect before you act."],
      ),
      terminalStep("3.1-terminal", "Read notes.txt", {
        instructions: "Use cat notes.txt to print the file contents.",
        initialFileSystem: home({
          "notes.txt": text(
            "Read first, edit second.",
            "Codex helps when you can show it files.",
          ),
        }),
        startingDirectory: "/home/codex",
        expectedCommands: ["cat notes.txt"],
        expectedOutput: {
          contains: ["Codex helps when you can show it files."],
        },
        successMessage:
          "Good. cat printed the text inside notes.txt without changing the file.",
        hint: "Use cat followed by the file name.",
        failureFeedback: "Try cat notes.txt from /home/codex.",
      }),
      quiz(
        "3.1-check",
        "What changed after cat ran?",
        ["Nothing changed. It printed the file text.", "The file was deleted.", "A folder was created."],
        0,
        "cat is an inspection command. It reads text and prints it to the terminal.",
      ),
    ],
  },
  {
    id: "3.2",
    levelId: 3,
    title: "Peeking at the Top with head",
    subtitle: "Read the first few lines of a longer file.",
    estimatedMinutes: 7,
    nextLessonId: "3.3",
    completionMessage: "You can now preview the top of a file.",
    sections: [
      narrative(
        "3.2-intro",
        "Start at the beginning",
        "The head command prints the first 10 lines of a file by default. Use head -n 3 when you only want the first three lines.",
      ),
      terminalStep("3.2-terminal", "Show the first three lines", {
        instructions: "Run head -n 3 roadmap.txt to see only the first three lines.",
        initialFileSystem: home({ "roadmap.txt": roadmap }),
        startingDirectory: "/home/codex",
        expectedCommands: ["head -n 3 roadmap.txt"],
        expectedOutput: {
          equals: [
            "1. Learn what files contain",
            "2. Practice reading before editing",
            "3. Save notes in plain text",
          ],
        },
        successMessage:
          "Nice. head showed the top three lines and left the rest of the file alone.",
        hint: "Use head, then -n 3, then the file name.",
        failureFeedback: "Try head -n 3 roadmap.txt.",
      }),
    ],
  },
  {
    id: "3.3",
    levelId: 3,
    title: "Peeking at the End with tail",
    subtitle: "Read the newest-looking lines at the bottom.",
    estimatedMinutes: 7,
    nextLessonId: "3.4",
    completionMessage: "You can now inspect the end of a file.",
    sections: [
      narrative(
        "3.3-intro",
        "The bottom often has the latest clue",
        "The tail command prints the last 10 lines of a file by default. Logs often grow downward, so tail is useful when the newest event is at the end.",
      ),
      terminalStep("3.3-terminal", "Show the last two log lines", {
        instructions: "Run tail -n 2 server.log to see the last two lines.",
        initialFileSystem: home({ "server.log": serverLog }),
        startingDirectory: "/home/codex",
        expectedCommands: ["tail -n 2 server.log"],
        expectedOutput: {
          equals: [
            "09:05 INFO retry scheduled",
            "09:06 ERROR timeout while reading notes",
          ],
        },
        successMessage:
          "Great. tail showed the bottom of the log, where the latest error appeared.",
        hint: "Use tail -n 2 server.log.",
        failureFeedback: "Try tail -n 2 server.log.",
      }),
    ],
  },
  {
    id: "3.4",
    levelId: 3,
    title: "Printing Text with echo",
    subtitle: "Make the terminal print text you provide.",
    estimatedMinutes: 6,
    nextLessonId: "3.5",
    completionMessage: "You can now print simple text in the terminal.",
    sections: [
      narrative(
        "3.4-intro",
        "echo repeats text back to you",
        "The echo command prints the words you give it. By itself, echo does not save anything. It is useful for quick checks and for redirects in the next lessons.",
      ),
      terminalStep("3.4-terminal", "Print a sentence", {
        instructions: "Run echo Terminal practice matters.",
        initialFileSystem: home({}),
        startingDirectory: "/home/codex",
        expectedCommands: ["echo Terminal practice matters"],
        expectedOutput: {
          equals: ["Terminal practice matters"],
        },
        successMessage:
          "echo printed your sentence. Nothing was saved yet because there was no redirect.",
        hint: "Type echo, then the sentence.",
        failureFeedback: "Try echo Terminal practice matters.",
      }),
    ],
  },
  {
    id: "3.5",
    levelId: 3,
    title: "Writing to Files with >",
    subtitle: "Create or overwrite a file with command output.",
    estimatedMinutes: 8,
    nextLessonId: "3.6",
    completionMessage: "You wrote text into a virtual file.",
    sections: [
      narrative(
        "3.5-intro",
        "The > redirect writes output into a file",
        "A redirect sends command output somewhere else. echo \"First draft\" > notes.txt creates notes.txt or replaces its old contents with First draft.",
        ["> overwrites the file.", "Use it carefully when a file already has text."],
      ),
      terminalStep("3.5-terminal", "Write notes.txt", {
        instructions: "Run echo \"First draft\" > notes.txt to write a file.",
        initialFileSystem: home({}),
        startingDirectory: "/home/codex",
        expectedCommands: ["echo \"First draft\" > notes.txt"],
        expectedFileSystem: {
          exists: [{ path: "/home/codex/notes.txt", type: "file", content: "First draft" }],
        },
        successMessage:
          "notes.txt now contains First draft. The terminal did not print the sentence because > sent it into the file.",
        hint: "Use echo with quotes, then >, then notes.txt.",
        failureFeedback: "Try echo \"First draft\" > notes.txt.",
      }),
    ],
  },
  {
    id: "3.6",
    levelId: 3,
    title: "Appending to Files with >>",
    subtitle: "Add a new line without replacing the old text.",
    estimatedMinutes: 8,
    nextLessonId: "3.7",
    completionMessage: "You appended text without overwriting the file.",
    sections: [
      narrative(
        "3.6-intro",
        "Two arrows append",
        "The >> redirect adds output to the end of a file. Use it when you want to keep the old text and add another line.",
      ),
      terminalStep("3.6-terminal", "Append a second line", {
        instructions: "Run echo \"Second line\" >> notes.txt to add text to the end.",
        initialFileSystem: home({ "notes.txt": "First draft" }),
        startingDirectory: "/home/codex",
        expectedCommands: ["echo \"Second line\" >> notes.txt"],
        expectedFileSystem: {
          exists: [
            { path: "/home/codex/notes.txt", type: "file", content: text("First draft", "Second line") },
          ],
        },
        successMessage:
          "notes.txt kept First draft and added Second line underneath it.",
        hint: "Use two greater-than signs: >>",
        failureFeedback: "Try echo \"Second line\" >> notes.txt.",
      }),
    ],
  },
  {
    id: "3.7",
    levelId: 3,
    title: "Copying File Contents",
    subtitle: "Use cat and > to make a text copy.",
    estimatedMinutes: 8,
    nextLessonId: "3.8",
    completionMessage: "You copied file contents with a redirect.",
    sections: [
      narrative(
        "3.7-intro",
        "Output can become input for a file",
        "cat source.txt prints text. Adding > copy.txt sends that printed text into a new file instead of showing it on screen.",
      ),
      terminalStep("3.7-terminal", "Copy source.txt into copy.txt", {
        instructions: "Run cat source.txt > copy.txt to copy the file contents.",
        initialFileSystem: home({
          "source.txt": text("Keep commands small.", "Verify what changed."),
        }),
        startingDirectory: "/home/codex",
        expectedCommands: ["cat source.txt > copy.txt"],
        expectedFileSystem: {
          exists: [
            { path: "/home/codex/source.txt", type: "file", content: text("Keep commands small.", "Verify what changed.") },
            { path: "/home/codex/copy.txt", type: "file", content: text("Keep commands small.", "Verify what changed.") },
          ],
        },
        successMessage:
          "copy.txt now has the same text as source.txt. The original stayed in place.",
        hint: "Use cat source.txt, then redirect with > copy.txt.",
        failureFeedback: "Try cat source.txt > copy.txt.",
      }),
    ],
  },
  {
    id: "3.8",
    levelId: 3,
    title: "Searching Inside Files with grep",
    subtitle: "Find matching lines in one file.",
    estimatedMinutes: 8,
    nextLessonId: "3.9",
    completionMessage: "You can now search inside a file.",
    sections: [
      narrative(
        "3.8-intro",
        "grep looks for matching lines",
        "The grep command searches text files and prints the lines that contain your search text. In this course, grep uses simple text matching instead of advanced patterns.",
      ),
      terminalStep("3.8-terminal", "Find Codex in notes.txt", {
        instructions: "Run grep \"Codex\" notes.txt to find the matching line.",
        initialFileSystem: home({
          "notes.txt": text(
            "Start by reading the file.",
            "Codex can edit files when you give clear context.",
            "Verify the result before moving on.",
          ),
        }),
        startingDirectory: "/home/codex",
        expectedCommands: ["grep \"Codex\" notes.txt"],
        expectedOutput: {
          contains: ["notes.txt:2:Codex can edit files when you give clear context."],
        },
        successMessage:
          "grep found the Codex line and showed the file name plus line number.",
        hint: "Use grep, the quoted search text, then the file name.",
        failureFeedback: "Try grep \"Codex\" notes.txt.",
      }),
    ],
  },
  {
    id: "3.9",
    levelId: 3,
    title: "Searching Across Folders with grep -r and rg",
    subtitle: "Search more than one file at a time.",
    estimatedMinutes: 9,
    nextLessonId: "3.10",
    completionMessage: "You can now search folders recursively.",
    sections: [
      narrative(
        "3.9-intro",
        "Recursive search opens the whole folder",
        "grep -r searches through a folder and its files. rg is a simulated version of ripgrep, a fast search tool developers commonly use for project-wide searches.",
      ),
      terminalStep("3.9-terminal", "Search the docs folder", {
        instructions:
          "Run grep -r \"Codex\" docs, then run rg \"terminal\" docs to compare the two search commands.",
        initialFileSystem: home({
          docs: dir({
            "setup.txt": text("Codex works best with project context.", "Keep setup notes close."),
            "guide.txt": text("Read files before editing.", "terminal practice makes searches easier."),
            "ideas.txt": "Build one small lesson at a time.",
          }),
        }),
        startingDirectory: "/home/codex",
        expectedCommands: ["grep -r \"Codex\" docs", "rg \"terminal\" docs"],
        expectedOutput: {
          contains: ["docs/guide.txt:2:terminal practice makes searches easier."],
        },
        successMessage:
          "You used grep -r and rg to search across the docs folder.",
        hint: "First use grep -r with Codex, then rg with terminal.",
        failureFeedback: "Run both searches: grep -r \"Codex\" docs and rg \"terminal\" docs.",
      }),
    ],
  },
  {
    id: "3.10",
    levelId: 3,
    title: "Chaining Commands with Pipes",
    subtitle: "Send one command's output into the next command.",
    estimatedMinutes: 9,
    nextLessonId: "3.11",
    completionMessage: "You chained two safe commands with a pipe.",
    sections: [
      narrative(
        "3.10-intro",
        "A pipe connects output to input",
        "The | symbol sends the output from the command on the left into the command on the right. This simulator supports one pipe at a time for beginner practice.",
      ),
      terminalStep("3.10-terminal", "Filter cat output", {
        instructions: "Run cat notes.txt | grep \"Codex\" to print the file and filter for one line.",
        initialFileSystem: home({
          "notes.txt": text(
            "Terminal commands can be chained.",
            "Codex prompts get better with exact evidence.",
            "Small tools combine into useful workflows.",
          ),
        }),
        startingDirectory: "/home/codex",
        expectedCommands: ["cat notes.txt | grep \"Codex\""],
        expectedOutput: {
          equals: ["Codex prompts get better with exact evidence."],
        },
        successMessage:
          "The pipe sent cat output into grep, and grep kept only the Codex line.",
        hint: "Put | between cat notes.txt and grep \"Codex\".",
        failureFeedback: "Try cat notes.txt | grep \"Codex\".",
      }),
    ],
  },
  {
    id: "3.11",
    levelId: 3,
    title: "Counting with wc",
    subtitle: "Count lines, words, and characters.",
    estimatedMinutes: 8,
    nextLessonId: "3.12",
    completionMessage: "You can now count text in a file.",
    sections: [
      narrative(
        "3.11-intro",
        "wc measures text",
        "The wc command counts text. In this simulator, wc shows lines, words, and characters by default. Use wc -l when you only need the line count.",
      ),
      terminalStep("3.11-terminal", "Count note lines", {
        instructions: "Run wc -l notes.txt to count the lines in notes.txt.",
        initialFileSystem: home({
          "notes.txt": text("one", "two", "three", "four"),
        }),
        startingDirectory: "/home/codex",
        expectedCommands: ["wc -l notes.txt"],
        expectedOutput: {
          equals: ["4 notes.txt"],
        },
        successMessage:
          "wc -l counted four lines. Counts are useful when checking search results.",
        hint: "Use wc with the -l option and the file name.",
        failureFeedback: "Try wc -l notes.txt.",
      }),
    ],
  },
  {
    id: "3.12",
    levelId: 3,
    title: "Detective Work: Investigate Logs",
    subtitle: "Use search, pipes, counts, and redirects to capture clues.",
    estimatedMinutes: 12,
    nextLessonId: "3.13",
    completionMessage: "You investigated a log with several terminal tools.",
    sections: [
      narrative(
        "3.12-intro",
        "Debugging starts with evidence",
        "A log is a text file full of events. Instead of reading every line by hand, you can search for clues, count matches, and save a smaller report.",
      ),
      terminalStep("3.12-terminal", "Investigate app.log", {
        instructions:
          "Run grep \"ERROR\" logs/app.log, then grep \"ERROR\" logs/app.log | wc -l, then grep \"timeout\" logs/app.log > timeout-report.txt, then cat timeout-report.txt.",
        initialFileSystem: home({
          logs: dir({
            "app.log": text(
              "INFO boot complete",
              "ERROR timeout while loading profile",
              "WARN retrying profile request",
              "ERROR failed to save draft",
              "INFO request complete",
              "ERROR timeout while loading assets",
            ),
          }),
        }),
        startingDirectory: "/home/codex",
        expectedCommands: [
          "grep \"ERROR\" logs/app.log",
          "grep \"ERROR\" logs/app.log | wc -l",
          "grep \"timeout\" logs/app.log > timeout-report.txt",
          "cat timeout-report.txt",
        ],
        expectedFileSystem: {
          exists: [
            {
              path: "/home/codex/timeout-report.txt",
              type: "file",
              content: text(
                "logs/app.log:2:ERROR timeout while loading profile",
                "logs/app.log:6:ERROR timeout while loading assets",
              ),
            },
          ],
        },
        expectedOutput: {
          contains: ["logs/app.log:6:ERROR timeout while loading assets"],
        },
        successMessage:
          "Case closed. You found errors, counted them, saved the timeout matches, and inspected the report.",
        hint: "Work in order: search ERROR, count ERROR with a pipe, redirect timeout matches, then cat the report.",
        failureFeedback:
          "Keep going. The final report should contain the two timeout error lines.",
      }),
    ],
  },
  {
    id: "3.13",
    levelId: 3,
    title: "Level 3 Review",
    subtitle: "Practice reading, writing, searching, and counting.",
    estimatedMinutes: 12,
    completionMessage: "Level 3 complete. You can read, write, search, and count text safely.",
    sections: [
      narrative(
        "3.13-intro",
        "Review means doing the small moves again",
        "This review has three short terminal challenges. Each one focuses on a different Level 3 habit: preview text, write notes, and count search results.",
      ),
      terminalStep("3.13-head", "Challenge 1: preview a guide", {
        instructions: "Run head -n 2 guide.txt to preview the first two lines.",
        initialFileSystem: home({
          "guide.txt": text(
            "Read before changing.",
            "Search before guessing.",
            "Count before claiming.",
            "Save useful clues.",
          ),
        }),
        startingDirectory: "/home/codex",
        expectedCommands: ["head -n 2 guide.txt"],
        expectedOutput: {
          equals: ["Read before changing.", "Search before guessing."],
        },
        successMessage: "Challenge 1 complete. You previewed the guide.",
        hint: "Use head with -n 2.",
        failureFeedback: "Try head -n 2 guide.txt.",
      }),
      terminalStep("3.13-write", "Challenge 2: write a review note", {
        instructions:
          "Create review.txt with Codex review note, then append Check logs before guessing.",
        initialFileSystem: home({}),
        startingDirectory: "/home/codex",
        expectedCommands: [
          "echo \"Codex review note\" > review.txt",
          "echo \"Check logs before guessing\" >> review.txt",
        ],
        expectedFileSystem: {
          exists: [
            {
              path: "/home/codex/review.txt",
              type: "file",
              content: text("Codex review note", "Check logs before guessing"),
            },
          ],
        },
        successMessage: "Challenge 2 complete. You wrote and appended text.",
        hint: "Use > for the first line and >> for the second line.",
        failureFeedback:
          "Create review.txt with >, then append the second line with >>.",
      }),
      terminalStep("3.13-count", "Challenge 3: count errors", {
        instructions: "Run grep \"ERROR\" logs/app.log | wc -l to count error lines.",
        initialFileSystem: home({
          logs: dir({
            "app.log": text(
              "INFO start",
              "ERROR missing file",
              "INFO retry",
              "ERROR retry failed",
            ),
          }),
        }),
        startingDirectory: "/home/codex",
        expectedCommands: ["grep \"ERROR\" logs/app.log | wc -l"],
        expectedOutput: {
          equals: ["2"],
        },
        successMessage: "Challenge 3 complete. You counted the matching lines.",
        hint: "Pipe grep output into wc -l.",
        failureFeedback: "Try grep \"ERROR\" logs/app.log | wc -l.",
      }),
      quiz(
        "3.13-check",
        "Which redirect keeps existing text and adds a new line?",
        [">>", ">", "|"],
        0,
        ">> appends. A single > overwrites, and | sends output into another command.",
      ),
    ],
  },
];
