import { mockRemoteUrls } from "../git/simulator.ts";
import type { FileTreeInput } from "../terminal/types.ts";
import type { Lesson, TerminalStepSection } from "./lessonSchema.ts";

const dir = (children: Record<string, FileTreeInput> = {}): FileTreeInput => ({
  type: "directory",
  children,
});

const projectHome = (
  children: Record<string, FileTreeInput> = starterFiles,
): Record<string, FileTreeInput> => ({
  home: dir({
    codex: dir({
      project: dir(children),
    }),
  }),
});

const starterFiles: Record<string, FileTreeInput> = {
  "README.md": "# Tiny Tracker\nA small practice project.",
  "app.js": 'console.log("Tiny Tracker");',
};

const remoteUrl = "https://example.test/tiny-tracker.git";

const narrative = (
  id: string,
  title: string,
  body: string,
  keyPoints?: string[],
) => ({
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

const initializedProject = [
  "git init",
  "git add .",
  'git commit -m "Start tiny tracker"',
];

export const level4Lessons: Lesson[] = [
  {
    id: "4.1",
    levelId: 4,
    title: "Why Version Control Exists",
    subtitle: "Turn changes into checkpoints you can inspect and recover.",
    estimatedMinutes: 7,
    nextLessonId: "4.2",
    completionMessage:
      "You can explain why a project needs a history of intentional checkpoints.",
    sections: [
      narrative(
        "4.1-intro",
        "Changes need a history",
        "Version control is a system for recording how project files change over time. Git is the version-control tool used in this level. It helps you inspect changes, save checkpoints, try work on a side path, and return to a known state.",
        [
          "The working directory is the project folder you are editing now.",
          "A commit is a named checkpoint of selected project files, not a backup of your whole computer.",
          "Git makes Codex work safer because you can review a diff before saving or undo an uncommitted mistake.",
        ],
      ),
      quiz(
        "4.1-checkpoint",
        "What is a Git commit?",
        [
          "A checkpoint of selected project files",
          "A backup of every file on the computer",
          "A message sent directly to GitHub",
        ],
        0,
        "A commit records a project checkpoint. Git only knows about the repository and the files selected for that checkpoint.",
      ),
      quiz(
        "4.1-codex",
        "Why is Git useful before asking Codex to change a project?",
        [
          "You can inspect the diff and return to a stable checkpoint.",
          "Git makes every Codex change automatically correct.",
          "Git gives Codex access to private accounts.",
        ],
        0,
        "Git does not guarantee correctness. It gives you a visible, recoverable history so changes are easier to review.",
      ),
    ],
  },
  {
    id: "4.2",
    levelId: 4,
    title: "Starting a Repository with git init",
    subtitle: "Tell Git to begin watching one project folder.",
    estimatedMinutes: 7,
    nextLessonId: "4.3",
    completionMessage: "You initialized a browser-safe Git repository.",
    sections: [
      narrative(
        "4.2-intro",
        "A repository is a project Git tracks",
        "A repository, often shortened to repo, is a project folder with Git history. git init creates the empty history structure for the current folder. It does not commit files and it does not contact GitHub.",
      ),
      terminalStep("4.2-terminal", "Initialize Tiny Tracker", {
        instructions:
          "Run git init inside the simulated /home/codex/project folder.",
        initialFileSystem: projectHome(),
        startingDirectory: "/home/codex/project",
        expectedCommands: ["git init"],
        expectedGit: {
          initialized: true,
          repositoryRoot: "/home/codex/project",
          currentBranch: "main",
          commitCount: 0,
          untrackedPaths: ["README.md", "app.js"],
        },
        successMessage:
          "Repository initialized. Git can now describe changes in this project, but no checkpoint exists yet.",
        hint: "Use git followed by init.",
        failureFeedback:
          "Run git init by itself from /home/codex/project.",
      }),
      quiz(
        "4.2-check",
        "Did git init upload the project anywhere?",
        [
          "No. It created local Git state for this simulated folder.",
          "Yes. It published the project to GitHub.",
        ],
        0,
        "Git starts locally. GitHub is a separate hosted service introduced later.",
      ),
    ],
  },
  {
    id: "4.3",
    levelId: 4,
    title: "Checking State with git status",
    subtitle: "Ask Git what is tracked, staged, changed, or new.",
    estimatedMinutes: 8,
    nextLessonId: "4.4",
    completionMessage: "You can read the main sections of Git status.",
    sections: [
      narrative(
        "4.3-intro",
        "Status is your safe first question",
        "git status describes the current repository. An untracked file exists in the working directory but has not been selected for a commit. A staged file has been selected for the next commit.",
      ),
      terminalStep("4.3-terminal", "Inspect the new repository", {
        instructions:
          "Run git status and find the branch plus the two untracked files.",
        initialFileSystem: projectHome(),
        startingDirectory: "/home/codex/project",
        setupCommands: ["git init"],
        expectedCommands: ["git status"],
        expectedOutput: {
          contains: ["On branch main", "Untracked files:", "README.md", "app.js"],
        },
        expectedGit: {
          currentBranch: "main",
          untrackedPaths: ["README.md", "app.js"],
          clean: false,
        },
        successMessage:
          "Good. Status showed where you are and what Git has not tracked yet.",
        hint: "Use git status. It only reports state.",
        failureFeedback:
          "Run git status and read the Untracked files section.",
      }),
      quiz(
        "4.3-check",
        "What does untracked mean?",
        [
          "The file exists, but Git has not selected it for history yet.",
          "The file has been deleted.",
          "The file is already on GitHub.",
        ],
        0,
        "Untracked means Git sees the file in the project but it is not part of the index or a commit.",
      ),
    ],
  },
  {
    id: "4.4",
    levelId: 4,
    title: "Staging Changes with git add",
    subtitle: "Choose what belongs in the next checkpoint.",
    estimatedMinutes: 9,
    nextLessonId: "4.5",
    completionMessage: "You used the staging area to select one file.",
    sections: [
      narrative(
        "4.4-intro",
        "The staging area is a selection",
        "The staging area, also called the index, holds the exact file versions chosen for the next commit. git add README.md stages one file. git add . stages every current change in the repository.",
        [
          "git add does not upload anything.",
          "git add does not create a commit.",
          "Staging lets you keep unrelated changes out of one checkpoint.",
        ],
      ),
      terminalStep("4.4-terminal", "Stage only README.md", {
        instructions:
          "Run git add README.md, then git status. Leave app.js untracked.",
        initialFileSystem: projectHome(),
        startingDirectory: "/home/codex/project",
        setupCommands: ["git init"],
        expectedCommands: ["git add README.md", "git status"],
        expectedOutput: {
          contains: [
            "Changes staged for the next commit:",
            "added: README.md",
            "Untracked files:",
            "app.js",
          ],
        },
        expectedGit: {
          stagedPaths: ["README.md"],
          untrackedPaths: ["app.js"],
        },
        successMessage:
          "README.md is staged while app.js remains outside the next checkpoint.",
        hint: "Use git add with one filename, then inspect with git status.",
        failureFeedback:
          "Stage README.md specifically. Do not use git add . for this exercise.",
      }),
      quiz(
        "4.4-check",
        "What does git add choose?",
        [
          "What goes into the next commit",
          "What is immediately uploaded to GitHub",
          "Which program runs next",
        ],
        0,
        "Staging is the deliberate selection step before a commit.",
      ),
    ],
  },
  {
    id: "4.5",
    levelId: 4,
    title: "Your First Commit",
    subtitle: "Save a meaningful project checkpoint.",
    estimatedMinutes: 9,
    nextLessonId: "4.6",
    completionMessage: "You created your first Git checkpoint.",
    sections: [
      narrative(
        "4.5-intro",
        "A commit records the staged snapshot",
        'git commit -m "message" saves the staged file versions with a short explanation. A useful message says what the checkpoint accomplishes.',
      ),
      terminalStep("4.5-terminal", "Commit the starter project", {
        instructions:
          'Stage every project file with git add ., then commit with git commit -m "Start tiny tracker".',
        initialFileSystem: projectHome(),
        startingDirectory: "/home/codex/project",
        setupCommands: ["git init"],
        expectedCommands: [
          "git add .",
          'git commit -m "Start tiny tracker"',
        ],
        expectedGit: {
          commitCount: 1,
          latestCommitMessage: "Start tiny tracker",
          clean: true,
          snapshot: [
            { path: "README.md" },
            { path: "app.js" },
          ],
        },
        successMessage:
          "Checkpoint saved. The working tree and staging area now match the commit.",
        hint: "First stage all current files with git add ., then commit with the exact message.",
        failureFeedback:
          "A commit needs staged changes and a message. Run the add command before the commit command.",
      }),
      quiz(
        "4.5-check",
        "What happens if nothing is staged?",
        [
          "Git refuses to create a new commit.",
          "Git commits every file automatically.",
          "Git deletes the previous commit.",
        ],
        0,
        "The simulator requires a real staged difference before it creates a checkpoint.",
      ),
    ],
  },
  {
    id: "4.6",
    levelId: 4,
    title: "The Edit, Add, Commit Cycle",
    subtitle: "Practice the small loop behind everyday Git work.",
    estimatedMinutes: 10,
    nextLessonId: "4.7",
    completionMessage: "You completed a full edit, stage, and commit cycle.",
    sections: [
      narrative(
        "4.6-intro",
        "Git work happens in a repeatable loop",
        "Edit a file in the working directory. Inspect the change. Stage the version you want. Commit the checkpoint. Repeating this small loop keeps history understandable.",
      ),
      terminalStep("4.6-terminal", "Improve app.js and save the change", {
        instructions:
          'Run echo "console.log(\'Tracker ready\');" > app.js, inspect git status, stage app.js, then commit with the message "Show tracker ready message".',
        initialFileSystem: projectHome(),
        startingDirectory: "/home/codex/project",
        setupCommands: initializedProject,
        expectedCommands: [
          { pattern: '^echo "console\\.log\\(.+Tracker ready.+\\);" > app\\.js$' },
          "git status",
          "git add app.js",
          'git commit -m "Show tracker ready message"',
        ],
        expectedGit: {
          commitCount: 2,
          latestCommitMessage: "Show tracker ready message",
          clean: true,
          snapshot: [
            {
              path: "app.js",
              content: "console.log('Tracker ready');",
            },
          ],
        },
        successMessage:
          "Cycle complete: the working edit became a staged selection and then a clear checkpoint.",
        hint: "Edit first, inspect with status, add app.js, then commit.",
        failureFeedback:
          "Keep the order edit → status → add → commit. The final app.js text and commit message must match.",
      }),
      quiz(
        "4.6-check",
        "Why inspect status between editing and committing?",
        [
          "To see which changes are staged, unstaged, or untracked",
          "To publish the project",
          "To erase the previous checkpoint",
        ],
        0,
        "Status keeps the checkpoint intentional instead of relying on memory.",
      ),
    ],
  },
  {
    id: "4.7",
    levelId: 4,
    title: "Viewing History with git log",
    subtitle: "Read the checkpoints that brought the project here.",
    estimatedMinutes: 8,
    nextLessonId: "4.8",
    completionMessage: "You inspected commit history in a compact form.",
    sections: [
      narrative(
        "4.7-intro",
        "History answers what changed and why",
        "git log shows commits from newest to oldest. Each commit has a short hash, a message, a time, parent checkpoints, and a snapshot. git log --oneline gives a compact history.",
      ),
      terminalStep("4.7-terminal", "Read two checkpoints", {
        instructions:
          "Run git log --oneline and find the newest and oldest messages.",
        initialFileSystem: projectHome(),
        startingDirectory: "/home/codex/project",
        setupCommands: [
          ...initializedProject,
          'echo "Track one project at a time." >> README.md',
          "git add README.md",
          'git commit -m "Clarify project guide"',
        ],
        expectedCommands: ["git log --oneline"],
        expectedOutput: {
          contains: ["Clarify project guide", "Start tiny tracker"],
        },
        expectedGit: {
          commitCount: 2,
          latestCommitMessage: "Clarify project guide",
        },
        successMessage:
          "You read the project story from the latest checkpoint back to the first.",
        hint: "Add --oneline after git log.",
        failureFeedback:
          "Run git log --oneline. The newest message should appear first.",
      }),
      quiz(
        "4.7-check",
        "What is the short hash used for?",
        [
          "Identifying a specific commit",
          "Encrypting the project",
          "Logging in to GitHub",
        ],
        0,
        "The short hash is a compact identifier for one checkpoint in this simulated history.",
      ),
    ],
  },
  {
    id: "4.8",
    levelId: 4,
    title: "Seeing What Changed with git diff",
    subtitle: "Review line changes before and after staging.",
    estimatedMinutes: 11,
    nextLessonId: "4.9",
    completionMessage: "You compared working and staged changes with a diff.",
    sections: [
      narrative(
        "4.8-intro",
        "A diff is a change report",
        "A diff shows removed lines with - and added lines with +. git diff compares tracked working files with the staging area. git diff --staged compares the staging area with the latest commit.",
        [
          "Reviewing a diff is one of the safest ways to inspect Codex changes.",
          "A diff explains change; it does not run the changed program.",
        ],
      ),
      terminalStep("4.8-terminal", "Inspect before and after staging", {
        instructions:
          "Run git diff, stage README.md, then run git diff --staged.",
        initialFileSystem: projectHome(),
        startingDirectory: "/home/codex/project",
        setupCommands: [
          ...initializedProject,
          'echo "# Tiny Tracker" > README.md',
        ],
        expectedCommands: [
          "git diff",
          "git add README.md",
          "git diff --staged",
        ],
        expectedOutput: {
          contains: ["diff -- README.md", "-A small practice project."],
        },
        expectedGit: {
          stagedPaths: ["README.md"],
          stagedDiffContains: [
            "diff -- README.md",
            "-A small practice project.",
          ],
        },
        successMessage:
          "You reviewed the working change, staged it, and reviewed exactly what the next commit would contain.",
        hint: "Use plain git diff first. After git add README.md, add --staged.",
        failureFeedback:
          "The latest output should be the staged README diff. Run the three commands in order.",
      }),
      quiz(
        "4.8-check",
        "Which command previews the next commit?",
        ["git diff --staged", "git init", "git remote -v"],
        0,
        "The staged diff compares the index with the latest commit.",
      ),
    ],
  },
  {
    id: "4.9",
    levelId: 4,
    title: "Undoing Changes Safely",
    subtitle: "Discard one uncommitted file edit with git restore.",
    estimatedMinutes: 9,
    nextLessonId: "4.10",
    completionMessage: "You restored a file from the latest checkpoint.",
    sections: [
      narrative(
        "4.9-intro",
        "Restore is deliberate recovery",
        "git restore filename replaces the working copy of a tracked file with the version in the latest commit. This discards uncommitted edits to that file, so inspect the diff first.",
      ),
      terminalStep("4.9-terminal", "Inspect and restore README.md", {
        instructions:
          "Run git diff, restore README.md, then run git status to confirm the working tree is clean.",
        initialFileSystem: projectHome(),
        startingDirectory: "/home/codex/project",
        setupCommands: [
          ...initializedProject,
          'echo "Accidental replacement" > README.md',
        ],
        expectedCommands: [
          "git diff",
          "git restore README.md",
          "git status",
        ],
        expectedOutput: {
          contains: ["nothing to commit, working tree clean"],
        },
        expectedGit: {
          clean: true,
          snapshot: [
            {
              path: "README.md",
              content: "# Tiny Tracker\nA small practice project.",
            },
          ],
        },
        expectedFileSystem: {
          exists: [
            {
              path: "/home/codex/project/README.md",
              type: "file",
              content: "# Tiny Tracker\nA small practice project.",
            },
          ],
        },
        successMessage:
          "README.md is back to the committed version. The accidental edit is gone.",
        hint: "Inspect first with git diff, then use git restore README.md.",
        failureFeedback:
          "Restore the tracked README.md file and confirm with git status.",
      }),
      quiz(
        "4.9-check",
        "What does git restore README.md discard?",
        [
          "Uncommitted working edits to README.md",
          "Every commit in the repository",
          "The remote repository",
        ],
        0,
        "Restore is file-level recovery from the latest committed snapshot.",
      ),
    ],
  },
  {
    id: "4.10",
    levelId: 4,
    title: "Understanding GitHub",
    subtitle: "Separate local history from hosted collaboration.",
    estimatedMinutes: 8,
    nextLessonId: "4.11",
    completionMessage: "You can clearly explain Git versus GitHub.",
    sections: [
      narrative(
        "4.10-intro",
        "Git and GitHub are related, not identical",
        "Git is the version-control system that records history in a repository. GitHub is a hosted service where repositories can be shared, reviewed, and discussed. Git works without GitHub. A remote is a saved name and URL for another copy of a repository.",
        [
          "Local means the repository state on your computer or, here, in the browser simulation.",
          "Remote means another repository location, often on a hosted service.",
          "This course never authenticates with or connects to real GitHub.",
        ],
      ),
      quiz(
        "4.10-git",
        "Which statement is correct?",
        [
          "Git records history; GitHub hosts repositories and collaboration.",
          "Git and GitHub are two names for exactly the same program.",
          "Git only works while connected to GitHub.",
        ],
        0,
        "Git is the history tool. GitHub is one place teams can share Git repositories.",
      ),
      quiz(
        "4.10-remote",
        "What is a remote?",
        [
          "A named connection description for another repository location",
          "A commit that deletes local files",
          "A branch that automatically publishes a website",
        ],
        0,
        "A remote stores a name such as origin and a URL. It does not upload until a push happens.",
      ),
    ],
  },
  {
    id: "4.11",
    levelId: 4,
    title: "Pushing to GitHub",
    subtitle: "Send local commits to a simulated remote repository.",
    estimatedMinutes: 10,
    nextLessonId: "4.12",
    completionMessage: "You configured a mocked remote and pushed local history.",
    sections: [
      narrative(
        "4.11-intro",
        "Push shares commits",
        "git remote add origin <url> saves a remote named origin. git remote -v lists saved remotes. git push sends branch commits to the remote. In this lesson, all three actions stay inside the browser.",
      ),
      terminalStep("4.11-terminal", "Configure and push safely", {
        instructions:
          `Run git remote add origin ${remoteUrl}, inspect it with git remote -v, then run git push.`,
        initialFileSystem: projectHome(),
        startingDirectory: "/home/codex/project",
        setupCommands: initializedProject,
        expectedCommands: [
          `git remote add origin ${remoteUrl}`,
          "git remote -v",
          "git push",
        ],
        expectedOutput: {
          contains: [
            "Pushed main to origin in the simulated remote.",
            "No GitHub login or network request occurred.",
          ],
        },
        expectedGit: {
          remotes: [{ name: "origin", url: remoteUrl }],
          pushedBranches: [{ remoteName: "origin", branch: "main" }],
          clean: true,
        },
        successMessage:
          "The simulated remote now has the main branch. No real account, network, or GitHub repository was used.",
        hint: "Add origin first, list it with -v, then push the current branch.",
        failureFeedback:
          "The remote must be named origin and the committed main branch must be pushed.",
      }),
      quiz(
        "4.11-check",
        "What does git push send?",
        [
          "Commits from a local branch to a remote repository",
          "Every file on the computer",
          "Uncommitted edits only",
        ],
        0,
        "Push shares committed history. Uncommitted working changes are not part of that history.",
      ),
    ],
  },
  {
    id: "4.12",
    levelId: 4,
    title: "Downloading Projects with git clone",
    subtitle: "Create a local project from a mocked remote.",
    estimatedMinutes: 10,
    nextLessonId: "4.13",
    completionMessage: "You cloned and inspected a browser-safe project preset.",
    sections: [
      narrative(
        "4.12-intro",
        "Clone creates a project folder and Git history",
        "git clone <url> copies a remote repository into a new folder and configures origin. git pull later downloads newer remote commits into the current branch. The lesson URL points to a built-in preset, not the internet.",
      ),
      terminalStep("4.12-terminal", "Clone Tiny Site", {
        instructions:
          `Run git clone ${mockRemoteUrls.tinySite}, move into tiny-site, run git pull, then inspect git status.`,
        initialFileSystem: projectHome({}),
        startingDirectory: "/home/codex",
        expectedCommands: [
          `git clone ${mockRemoteUrls.tinySite}`,
          "cd tiny-site",
          "git pull",
          "git status",
        ],
        expectedCurrentDirectory: "/home/codex/tiny-site",
        expectedOutput: {
          contains: ["On branch main", "nothing to commit, working tree clean"],
        },
        expectedFileSystem: {
          exists: [
            {
              path: "/home/codex/tiny-site/README.md",
              type: "file",
            },
            {
              path: "/home/codex/tiny-site/index.html",
              type: "file",
            },
          ],
        },
        expectedGit: {
          repositoryRoot: "/home/codex/tiny-site",
          currentBranch: "main",
          commitCount: 1,
          clean: true,
          remotes: [
            { name: "origin", url: mockRemoteUrls.tinySite },
          ],
        },
        successMessage:
          "Tiny Site is now a clean cloned repository with an origin remote. git pull confirmed it was already current.",
        hint: "Clone first, cd into the new folder, pull, then check status.",
        failureFeedback:
          "Use the exact mocked URL, then work from /home/codex/tiny-site.",
      }),
      quiz(
        "4.12-check",
        "What did clone create?",
        [
          "A project folder with files, history, branches, and an origin remote",
          "A real GitHub account",
          "A copy of every repository on GitHub",
        ],
        0,
        "Clone creates one local repository from one remote source.",
      ),
    ],
  },
  {
    id: "4.13",
    levelId: 4,
    title: "Creating Branches",
    subtitle: "Use a safe side path for an experiment.",
    estimatedMinutes: 11,
    nextLessonId: "4.14",
    completionMessage: "You created and switched among safe project branches.",
    sections: [
      narrative(
        "4.13-intro",
        "A branch is a movable history label",
        "A branch points to a commit and moves as new commits are added. It gives an experiment a separate name and path through history. git switch is the clearer modern command; git checkout is an older command that can also switch or create branches.",
      ),
      terminalStep("4.13-terminal", "Create branches with both command styles", {
        instructions:
          "Create feature with git branch feature, switch to it, return to main with git checkout main, create experiment with git checkout -b experiment, then list branches.",
        initialFileSystem: projectHome(),
        startingDirectory: "/home/codex/project",
        setupCommands: initializedProject,
        expectedCommands: [
          "git branch feature",
          "git switch feature",
          "git checkout main",
          "git checkout -b experiment",
          "git branch",
        ],
        expectedOutput: {
          contains: ["feature", "* experiment", "main"],
        },
        expectedGit: {
          currentBranch: "experiment",
          branches: ["main", "feature", "experiment"],
          clean: true,
        },
        successMessage:
          "You created two side paths and can see which branch is current.",
        hint: "Use branch, switch, checkout, checkout -b, then branch again.",
        failureFeedback:
          "Finish on experiment and make sure main, feature, and experiment all exist.",
      }),
      quiz(
        "4.13-check",
        "Why create a branch before asking Codex for an experiment?",
        [
          "The experiment has a separate history path that is easier to review or discard.",
          "The branch guarantees the experiment has no bugs.",
          "The branch publishes the experiment automatically.",
        ],
        0,
        "Branches organize change. They do not replace testing or review.",
      ),
    ],
  },
  {
    id: "4.14",
    levelId: 4,
    title: "Merging Branches",
    subtitle: "Bring a completed side path back into main.",
    estimatedMinutes: 12,
    nextLessonId: "4.15",
    completionMessage: "You merged a feature branch into main.",
    sections: [
      narrative(
        "4.14-intro",
        "Merge combines branch histories",
        "git merge feature brings the feature branch result into the current branch. When only the feature moved, Git can fast-forward main. If both branches changed different files, Git can combine them. If both changed the same lines, a merge conflict needs human judgment.",
      ),
      terminalStep("4.14-terminal", "Build and merge a feature", {
        instructions:
          'Create feature/add-note, add feature.txt containing "Feature ready", commit it as "Add feature note", switch to main, merge the feature branch, then inspect status.',
        initialFileSystem: projectHome(),
        startingDirectory: "/home/codex/project",
        setupCommands: initializedProject,
        expectedCommands: [
          "git switch -c feature/add-note",
          'echo "Feature ready" > feature.txt',
          "git add feature.txt",
          'git commit -m "Add feature note"',
          "git switch main",
          "git merge feature/add-note",
          "git status",
        ],
        expectedOutput: {
          contains: ["On branch main", "nothing to commit, working tree clean"],
        },
        expectedGit: {
          currentBranch: "main",
          branches: ["main", "feature/add-note"],
          commitCount: 2,
          latestCommitMessage: "Add feature note",
          clean: true,
          snapshot: [
            { path: "feature.txt", content: "Feature ready" },
          ],
        },
        successMessage:
          "Main now points to the feature checkpoint, and the working tree is clean.",
        hint: "Commit on the feature branch before switching back to main and merging.",
        failureFeedback:
          "The feature must be committed, merged into main, and visible as feature.txt.",
      }),
      quiz(
        "4.14-check",
        "What is a merge conflict?",
        [
          "Git needs help because changes cannot be combined safely on their own.",
          "Git has deleted both branches.",
          "GitHub has rejected the password.",
        ],
        0,
        "A conflict is a request for judgment. This Level 4 simulator explains conflicts but intentionally does not provide a full conflict editor.",
      ),
    ],
  },
  {
    id: "4.15",
    levelId: 4,
    title: "Pull Requests and Reviews",
    subtitle: "Treat proposed changes as a review conversation.",
    estimatedMinutes: 10,
    nextLessonId: "4.16",
    completionMessage: "You can explain a pull request as a review workflow.",
    sections: [
      narrative(
        "4.15-intro",
        "A pull request is a conversation around a branch",
        "A pull request, often shortened to PR, is a hosted review page that proposes merging one branch into another. It shows commits and diffs, lets people ask questions, and records approval. It is not a magical publishing button and this course does not create real PRs.",
      ),
      terminalStep("4.15-terminal", "Review the proposed change locally", {
        instructions:
          "Run git diff to inspect the uncommitted README.md change before imagining a pull request.",
        initialFileSystem: projectHome(),
        startingDirectory: "/home/codex/project",
        setupCommands: [
          ...initializedProject,
          'echo "Review changes before merging." >> README.md',
        ],
        expectedCommands: ["git diff"],
        expectedOutput: {
          contains: [
            "diff -- README.md",
            "+Review changes before merging.",
          ],
        },
        expectedGit: {
          unstagedPaths: ["README.md"],
          workingDiffContains: ["+Review changes before merging."],
        },
        successMessage:
          "You inspected the evidence a reviewer would discuss before approving a change.",
        hint: "Use plain git diff for an unstaged working change.",
        failureFeedback:
          "Run git diff and look for the added review sentence.",
      }),
      quiz(
        "4.15-check",
        "What is the main purpose of a pull request?",
        [
          "Review and discuss proposed branch changes before merging",
          "Automatically prove every change is correct",
          "Replace Git commits",
        ],
        0,
        "A PR gathers the diff, checks, and human review into one collaboration thread.",
      ),
    ],
  },
  {
    id: "4.16",
    levelId: 4,
    title: "Writing Good Commits",
    subtitle: "Make project history useful to your future self.",
    estimatedMinutes: 9,
    nextLessonId: "4.17",
    completionMessage: "You wrote a focused commit with a useful message.",
    sections: [
      narrative(
        "4.16-intro",
        "A good commit tells one small story",
        "Useful commits group related changes and use a message that describes the outcome. “Explain project setup” is more helpful than “stuff” because a future reader can understand why the checkpoint exists.",
        [
          "Keep one commit focused on one purpose.",
          "Use a short action phrase.",
          "Review git diff --staged before committing important changes.",
        ],
      ),
      terminalStep("4.16-terminal", "Save a clear documentation commit", {
        instructions:
          'Review git diff, stage README.md, review git diff --staged, then commit with git commit -m "Explain project setup".',
        initialFileSystem: projectHome(),
        startingDirectory: "/home/codex/project",
        setupCommands: [
          ...initializedProject,
          'echo "Run the tracker with the project tools." >> README.md',
        ],
        expectedCommands: [
          "git diff",
          "git add README.md",
          "git diff --staged",
          'git commit -m "Explain project setup"',
        ],
        expectedGit: {
          commitCount: 2,
          latestCommitMessage: "Explain project setup",
          clean: true,
          snapshot: [
            {
              path: "README.md",
              content:
                "# Tiny Tracker\nA small practice project.\nRun the tracker with the project tools.",
            },
          ],
        },
        successMessage:
          "The commit is focused, reviewed, and named for the outcome it adds.",
        hint: "Inspect, stage, inspect the staged diff, then use the exact message.",
        failureFeedback:
          "The latest commit should be Explain project setup and include the README sentence.",
      }),
      quiz(
        "4.16-check",
        "Which message is more useful?",
        ["Add empty-state message", "changes"],
        0,
        "A specific action phrase makes history easier to scan and review.",
      ),
    ],
  },
  {
    id: "4.17",
    levelId: 4,
    title: "Full Git Workflow Challenge",
    subtitle: "Protect a project from first checkpoint through safe push.",
    estimatedMinutes: 18,
    nextLessonId: "5.1",
    completionMessage:
      "Level 4 complete. You can inspect, checkpoint, branch, merge, recover, and share simulated Git history.",
    sections: [
      narrative(
        "4.17-intro",
        "One complete, reviewable workflow",
        "The final challenge validates the repository state, not just the command list. Build a clean main branch with two commits, a merged feature, a readable history, and a pushed simulated remote.",
        [
          "Everything remains inside the browser-safe virtual filesystem.",
          "The remote uses example.test and never contacts GitHub.",
          "Reset returns the challenge to its exact starting state.",
        ],
      ),
      terminalStep("4.17-terminal", "Ship Tiny Tracker history", {
        instructions:
          `Complete the workflow: initialize, inspect status, append "Track projects safely." to README.md, stage README.md and app.js, commit "Start tiny tracker", create feature/add-note, create feature.txt with "Feature ready", stage and commit it as "Add feature note", switch to main, merge, inspect log and diff, add origin ${remoteUrl}, inspect the remote, and push.`,
        initialFileSystem: projectHome(),
        startingDirectory: "/home/codex/project",
        expectedCommands: [
          "git init",
          "git status",
          'echo "Track projects safely." >> README.md',
          "git add README.md app.js",
          'git commit -m "Start tiny tracker"',
          "git switch -c feature/add-note",
          'echo "Feature ready" > feature.txt',
          "git add feature.txt",
          'git commit -m "Add feature note"',
          "git switch main",
          "git merge feature/add-note",
          "git log --oneline",
          "git diff",
          `git remote add origin ${remoteUrl}`,
          "git remote -v",
          "git push",
        ],
        expectedGit: {
          repositoryRoot: "/home/codex/project",
          currentBranch: "main",
          branches: ["main", "feature/add-note"],
          commitCount: 2,
          latestCommitMessage: "Add feature note",
          clean: true,
          snapshot: [
            {
              path: "README.md",
              content:
                "# Tiny Tracker\nA small practice project.\nTrack projects safely.",
            },
            {
              path: "feature.txt",
              content: "Feature ready",
            },
          ],
          remotes: [{ name: "origin", url: remoteUrl }],
          pushedBranches: [{ remoteName: "origin", branch: "main" }],
        },
        expectedOutput: {
          contains: [
            "Pushed main to origin in the simulated remote.",
            "No GitHub login or network request occurred.",
          ],
        },
        successMessage:
          "Workflow complete. The final state proves the feature is committed, merged into main, clean, and pushed to the simulated origin.",
        hint: "Work in phases: init/status → edit/add/commit → branch/edit/add/commit → switch/merge → log/diff → remote/push.",
        failureFeedback:
          "The final state must be clean on main with two commits, feature.txt committed, feature/add-note present, and main pushed to origin.",
      }),
      quiz(
        "4.17-check",
        "Which habit best protects future Codex work?",
        [
          "Start from a clean checkpoint, use a branch, inspect diffs, test, and commit clear results.",
          "Let every change accumulate without checking status.",
          "Push unreviewed work and hope the remote fixes it.",
        ],
        0,
        "Git is most useful as a review and recovery habit around careful work, not as an automatic correctness machine.",
      ),
    ],
  },
];
