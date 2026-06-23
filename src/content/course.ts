export type CourseSection = "core" | "codex" | "project" | "expert";

export type LessonAvailability = "mvp-target" | "planned";

export type LessonSummary = {
  id: string;
  title: string;
  availability: LessonAvailability;
};

export type CourseLevel = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  section: CourseSection;
  theme: string;
  lessons: LessonSummary[];
};

const mvpLessonIds = new Set([
  "1.1",
  "1.2",
  "1.3",
  "1.4",
  "1.5",
  "1.6",
  "2.1",
  "2.2",
  "2.3",
  "2.4",
  "2.5",
  "2.6",
  "2.7",
  "2.8",
  "2.9",
  "2.10",
  "2.11",
  "2.12",
  "2.13",
  "3.1",
  "3.2",
  "3.3",
  "3.4",
  "3.5",
  "3.6",
  "3.7",
  "3.8",
  "3.9",
  "3.10",
  "3.11",
  "3.12",
  "3.13",
  "8.1",
  "8.2",
  "8.3",
]);

function lessons(levelId: number, titles: string[]): LessonSummary[] {
  return titles.map((title, index) => {
    const id = `${levelId}.${index + 1}`;

    return {
      id,
      title,
      availability: mvpLessonIds.has(id) ? "mvp-target" : "planned",
    };
  });
}

export const courseLevels: CourseLevel[] = [
  {
    id: 1,
    slug: "computers-are-not-magic",
    title: "Computers Are Not Magic",
    subtitle: "Build the mental model a beginner needs before touching code.",
    section: "core",
    theme: "orientation",
    lessons: lessons(1, [
      "What Is a File?",
      "What Is a Folder?",
      "What Is a File Path?",
      "File Types and What Is Inside",
      "What Is a Program?",
      "What Is a Terminal?",
    ]),
  },
  {
    id: 2,
    slug: "first-30-minutes-terminal",
    title: "Your First 30 Minutes in the Terminal",
    subtitle: "Learn to move around, create things, and recover calmly.",
    section: "core",
    theme: "terminal",
    lessons: lessons(2, [
      "Where Am I? Use pwd",
      "What Is Here? Use ls",
      "Moving Into Folders with cd",
      "Going Back Up with cd ..",
      "Going Home with cd ~",
      "Creating Folders with mkdir",
      "Creating Files with touch",
      "Deleting Files with rm",
      "Deleting Folders with rm -r",
      "Copying Files with cp",
      "Moving and Renaming with mv",
      "Putting It All Together: Build a Folder Project",
      "Level 2 Review",
    ]),
  },
  {
    id: 3,
    slug: "reading-and-writing-files",
    title: "Reading and Writing Files",
    subtitle: "Inspect text, redirect output, search files, and chain commands.",
    section: "core",
    theme: "files",
    lessons: lessons(3, [
      "Looking Inside Files with cat",
      "Peeking at the Top with head",
      "Peeking at the End with tail",
      "Printing Text with echo",
      "Writing to Files with >",
      "Appending to Files with >>",
      "Copying File Contents",
      "Searching Inside Files with grep",
      "Searching Across Folders with grep -r and rg",
      "Chaining Commands with Pipes",
      "Counting with wc",
      "Detective Work: Investigate Logs",
      "Level 3 Review",
    ]),
  },
  {
    id: 4,
    slug: "code-has-history",
    title: "Your Code Has a History",
    subtitle: "Use Git to make experiments safe and changes reviewable.",
    section: "core",
    theme: "git",
    lessons: lessons(4, [
      "Why Version Control Exists",
      "Starting a Repository with git init",
      "Checking State with git status",
      "Staging Changes with git add",
      "Your First Commit",
      "The Edit, Add, Commit Cycle",
      "Viewing History with git log",
      "Seeing What Changed with git diff",
      "Undoing Changes Safely",
      "Understanding GitHub",
      "Pushing to GitHub",
      "Downloading Projects with git clone",
      "Creating Branches",
      "Merging Branches",
      "Pull Requests and Reviews",
      "Writing Good Commits",
      "Full Git Workflow Challenge",
    ]),
  },
  {
    id: 5,
    slug: "how-software-works",
    title: "How Software Actually Works",
    subtitle: "Connect websites, servers, APIs, databases, and deployment.",
    section: "core",
    theme: "systems",
    lessons: lessons(5, [
      "What Is Code?",
      "Programming Languages",
      "What Is a Website, Really?",
      "Client vs Server",
      "HTTP: How Computers Talk",
      "What Is an API?",
      "JSON: The Universal Data Format",
      "What Is a Database?",
      "SQL: Talking to Databases",
      "Frontend vs Backend",
      "The Tech Stack",
      "What Is the Cloud?",
      "Deployment",
      "DNS and Domains",
    ]),
  },
  {
    id: 6,
    slug: "talk-to-the-internet",
    title: "Talk to the Internet",
    subtitle: "Practice URLs, requests, status codes, APIs, and secret safety.",
    section: "core",
    theme: "network",
    lessons: lessons(6, [
      "What Is a URL, Really?",
      "Your First curl",
      "Query Parameters in Action",
      "Status Codes Are a Language",
      "Request Headers",
      "Sending Data with POST",
      "Your First Real Public API",
      "OpenAI API Keys and Secret Safety",
      "Calling the GitHub API",
      "Reading API Documentation",
      "When API Requests Go Wrong",
      "From curl to Code",
    ]),
  },
  {
    id: 7,
    slug: "building-with-real-tools",
    title: "Building With Real Tools",
    subtitle: "Install Node, run scripts, build a tiny API, and meet localhost.",
    section: "core",
    theme: "tools",
    lessons: lessons(7, [
      "Installing Node.js",
      "Your First JavaScript REPL",
      "Running a JavaScript File",
      "What Is npm?",
      "Creating a Project",
      "Installing Packages",
      ".gitignore and Environment Files",
      "Hello World Server",
      "Running Your Server",
      "What Is localhost?",
      "Adding Routes",
      "Serving JSON",
      "Serving HTML",
      "Stopping, Restarting, and Debugging",
      "Level 7 Challenge: Build a Tiny API",
    ]),
  },
  {
    id: 8,
    slug: "codex-your-coding-agent",
    title: "Codex - Your Coding Agent",
    subtitle: "Use Codex to inspect, plan, edit, test, review, and ship.",
    section: "codex",
    theme: "codex",
    lessons: lessons(8, [
      "What Is Codex?",
      "Choosing a Surface: App, CLI, IDE, or Cloud",
      "Installing and Authenticating the Codex CLI",
      "Your First Codex Thread",
      "Giving Codex the Right Context",
      "Reading Code with Codex",
      "Creating Files with Codex",
      "Editing Existing Code",
      "Letting Codex Run Commands",
      "Prompt Patterns: Goal, Context, Constraints, Done When",
      "Plan Mode for Fuzzy Work",
      "Reviewing the Diff",
      "Debugging with Codex",
      "Git Workflow with Codex",
      "When Not to Use Codex",
      "Level 8 Challenge: Build a Small Feature with Codex",
    ]),
  },
  {
    id: 9,
    slug: "project-memory-and-agents",
    title: "Project Memory and AGENTS.md",
    subtitle: "Teach future Codex sessions how your project works.",
    section: "codex",
    theme: "memory",
    lessons: lessons(9, [
      "What Is Project Memory?",
      "Writing Your First AGENTS.md",
      "Layered Instructions and Overrides",
      "Defining Done for Codex",
      "Keeping Instructions Short and Useful",
    ]),
  },
  {
    id: 10,
    slug: "mcp-and-connected-tools",
    title: "MCP and Connected Tools",
    subtitle: "Connect Codex to external tools with explicit boundaries.",
    section: "codex",
    theme: "tools",
    lessons: lessons(10, [
      "What Is MCP?",
      "Adding Your First MCP Server",
      "Using Docs, GitHub, Browser, or Design Tools Safely",
      "OAuth, Tokens, and Approval Boundaries",
      "MCP Challenge: Add One Useful Tool to a Workflow",
    ]),
  },
  {
    id: 11,
    slug: "context-is-everything",
    title: "Context Is Everything",
    subtitle: "Manage long tasks, threads, handoffs, and compaction.",
    section: "codex",
    theme: "context",
    lessons: lessons(11, [
      "The Context Window",
      "Threads, Resume, Fork, and Search",
      "Handoff Notes for Future Sessions",
      "Compaction and Long-Running Work",
      "Context Toolkit Challenge",
    ]),
  },
  {
    id: 12,
    slug: "codex-advanced-workflows",
    title: "Codex Advanced Workflows",
    subtitle: "Worktrees, browser QA, automations, subagents, and exec.",
    section: "codex",
    theme: "advanced",
    lessons: lessons(12, [
      "Worktrees and Handoff",
      "In-App Browser and Visual QA",
      "Automations and Recurring Checks",
      "Subagents and Parallel Exploration",
      "codex exec and CI Automation",
    ]),
  },
  {
    id: 13,
    slug: "junior-developer-patterns",
    title: "Junior Developer Patterns",
    subtitle: "Practice the durable habits that make AI-assisted work safe.",
    section: "core",
    theme: "developer",
    lessons: lessons(13, [
      "Reading Someone Else's Code",
      "Understanding a Function You Did Not Write",
      "The Debugging Mindset",
      "Logs, Breakpoints, and Tests",
      "Finding Answers Without Guessing",
      "Environment Variables and Secrets",
      "Basic Security Awareness",
      "Deploying to the Internet",
      "Custom Domains",
      "The Professional Developer Workflow",
      "Managing Cost, Time, and Model Choice",
      "What to Learn Next",
    ]),
  },
  {
    id: 14,
    slug: "build-and-ship-real-product",
    title: "The Project - Build and Ship a Real Product",
    subtitle: "Plan, build, test, deploy, document, and reflect.",
    section: "project",
    theme: "capstone",
    lessons: lessons(14, [
      "Planning the Capstone",
      "Scaffolding the Project with Codex",
      "Building the Backend",
      "Building the UI",
      "Connecting Client and Server",
      "Testing and Debugging with Codex",
      "Browser QA and Visual Polish",
      "Deploying the Project",
      "Writing README and Handoff Docs",
      "Launch, Reflect, and Keep Building",
    ]),
  },
  {
    id: 15,
    slug: "codex-subagents",
    title: "Codex Subagents",
    subtitle: "Coordinate focused helpers without losing the thread.",
    section: "expert",
    theme: "agents",
    lessons: lessons(15, ["Command a Small Team of Agents"]),
  },
  {
    id: 16,
    slug: "codex-from-anywhere",
    title: "Codex from Anywhere",
    subtitle: "Understand remote, cloud, and mobile-friendly workflows.",
    section: "expert",
    theme: "remote",
    lessons: lessons(16, ["Remote, Cloud, and Mobile-Friendly Codex Workflows"]),
  },
  {
    id: 17,
    slug: "models-cost-and-workflows",
    title: "Models, Cost, and Workflows",
    subtitle: "Choose the right model, reasoning effort, and workflow.",
    section: "expert",
    theme: "strategy",
    lessons: lessons(17, ["Choose the Right Model, Reasoning Effort, and Workflow"]),
  },
];

export const courseStats = {
  totalLevels: courseLevels.length,
  totalLessons: courseLevels.reduce(
    (total, level) => total + level.lessons.length,
    0,
  ),
  mvpLessons: courseLevels.reduce(
    (total, level) =>
      total +
      level.lessons.filter((lesson) => lesson.availability === "mvp-target")
        .length,
    0,
  ),
};

export function findLessonById(lessonId: string) {
  for (const level of courseLevels) {
    const lesson = level.lessons.find((candidate) => candidate.id === lessonId);

    if (lesson) {
      return { level, lesson };
    }
  }

  return null;
}
