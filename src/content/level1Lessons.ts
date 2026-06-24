import type {
  FoundationInteractionSection,
  Lesson,
} from "./lessonSchema.ts";

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

const interaction = (
  id: string,
  title: string,
  section: Omit<FoundationInteractionSection, "id" | "type" | "title">,
): FoundationInteractionSection => ({
  id,
  type: "foundationInteraction",
  title,
  ...section,
});

const projectTree = {
  id: "home",
  label: "Home",
  kind: "folder" as const,
  children: [
    {
      id: "documents",
      label: "Documents",
      kind: "folder" as const,
      children: [
        {
          id: "recipes",
          label: "Recipes",
          kind: "folder" as const,
          children: [
            {
              id: "chili",
              label: "chili.txt",
              kind: "file" as const,
            },
          ],
        },
        {
          id: "projects",
          label: "Projects",
          kind: "folder" as const,
          children: [
            {
              id: "tiny-api",
              label: "tiny-api",
              kind: "folder" as const,
              children: [
                {
                  id: "readme",
                  label: "README.md",
                  kind: "file" as const,
                },
                {
                  id: "src",
                  label: "src",
                  kind: "folder" as const,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "pictures",
      label: "Pictures",
      kind: "folder" as const,
      children: [
        {
          id: "vacation",
          label: "vacation.jpg",
          kind: "file" as const,
        },
      ],
    },
  ],
};

const finalProjectTree = {
  id: "challenge-home",
  label: "Home",
  kind: "folder" as const,
  children: [
    {
      id: "challenge-documents",
      label: "Documents",
      kind: "folder" as const,
      children: [
        {
          id: "challenge-projects",
          label: "Projects",
          kind: "folder" as const,
          children: [
            {
              id: "challenge-tiny-api",
              label: "tiny-api",
              kind: "folder" as const,
              children: [
                {
                  id: "challenge-readme",
                  label: "README.md",
                  kind: "file" as const,
                },
                {
                  id: "challenge-package",
                  label: "package.json",
                  kind: "file" as const,
                },
                {
                  id: "challenge-src",
                  label: "src",
                  kind: "folder" as const,
                  children: [
                    {
                      id: "challenge-server",
                      label: "server.js",
                      kind: "file" as const,
                    },
                  ],
                },
                {
                  id: "challenge-data",
                  label: "data",
                  kind: "folder" as const,
                  children: [
                    {
                      id: "challenge-projects-json",
                      label: "projects.json",
                      kind: "file" as const,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const level1Lessons: Lesson[] = [
  {
    id: "1.1",
    levelId: 1,
    title: "What Is a File?",
    subtitle: "Meet the named pieces of information computers store.",
    estimatedMinutes: 6,
    nextLessonId: "1.2",
    completionMessage: "A file is no longer a mystery. It is a named piece of stored information.",
    sections: [
      narrative(
        "1.1-intro",
        "A file holds information",
        "A file is a named piece of information stored by a computer. A file can hold writing, a photo, music, video, code, a spreadsheet, or many other kinds of information.",
        [
          "Name: what the file is called, such as shopping-list.txt.",
          "Type: a clue about the kind of information inside.",
          "Contents: the information stored in the file.",
          "Location: the folder where the file is kept.",
        ],
      ),
      interaction("1.1-sort", "Sort files from other things", {
        instructions:
          "Choose whether each item is a file. A folder can hold files, but the folder itself is not a file.",
        simulationLabel: "Simulation: familiar computer items",
        hint: "Look for a name that describes one stored piece of information.",
        successMessage:
          "Correct. Documents, photos, songs, spreadsheets, and code can all be files.",
        failureFeedback:
          "A file is one named piece of stored information. A folder is a container, and a keyboard is a physical object.",
        interaction: {
          kind: "classifyItems",
          categories: [
            { id: "file", label: "File" },
            { id: "not-file", label: "Not a file" },
          ],
          items: [
            {
              id: "birthday-photo",
              label: "birthday-photo.jpg",
              description: "A saved picture from a birthday.",
              correctCategory: "file",
              explanation: "The photo is stored as one named image file.",
            },
            {
              id: "shopping-list",
              label: "shopping-list.txt",
              description: "A saved list of groceries.",
              correctCategory: "file",
              explanation: "The written list is stored as one text file.",
            },
            {
              id: "favorite-song",
              label: "favorite-song.mp3",
              description: "A saved music track.",
              correctCategory: "file",
              explanation: "The song is stored as one audio file.",
            },
            {
              id: "photos-folder",
              label: "Photos",
              description: "A container used to organize many pictures.",
              correctCategory: "not-file",
              explanation: "Photos is a folder that can contain image files.",
            },
            {
              id: "keyboard",
              label: "Keyboard",
              description: "A physical device used to type.",
              correctCategory: "not-file",
              explanation: "A keyboard is hardware, not stored information.",
            },
            {
              id: "app-js",
              label: "app.js",
              description: "Saved instructions for part of a program.",
              correctCategory: "file",
              explanation: "Code instructions are stored in files too.",
            },
          ],
        },
      }),
      quiz(
        "1.1-check",
        "Which item is most likely a file containing written notes?",
        ["meeting-notes.txt", "Documents", "Mouse"],
        0,
        "meeting-notes.txt is a named text file. Documents is usually a folder, and a mouse is a physical device.",
      ),
      narrative(
        "1.1-why",
        "Why this matters later",
        "Code, project instructions, settings, and data are all stored in files. Before Codex can help with a project, you need to recognize the files that make the project.",
      ),
    ],
  },
  {
    id: "1.2",
    levelId: 1,
    title: "What Is a Folder?",
    subtitle: "See how computers organize files into useful groups.",
    estimatedMinutes: 6,
    nextLessonId: "1.3",
    completionMessage: "You can read a simple folder tree and choose a sensible home for a file.",
    sections: [
      narrative(
        "1.2-intro",
        "Folders are containers",
        "A folder is a container that organizes files and other folders. The folder usually does not hold the photo or writing directly. It holds the files that contain that information.",
        [
          "A folder can contain files.",
          "A folder can also contain another folder.",
          "A project is often a carefully organized group of folders and files.",
        ],
      ),
      interaction("1.2-tree", "Explore a folder tree", {
        instructions:
          "Read the simulated tree, then choose the most sensible folder for a new photo named graduation.jpg.",
        simulationLabel: "Simulation: folder tree on a fictional computer",
        hint: "Choose the folder already used for picture files.",
        successMessage:
          "Right. Pictures is the clearest home for graduation.jpg in this simple structure.",
        failureFeedback:
          "Look at the files already inside each folder. vacation.jpg is a clue about where another photo belongs.",
        interaction: {
          kind: "chooseOne",
          prompt: "Where should graduation.jpg go?",
          tree: projectTree,
          options: [
            {
              id: "documents",
              label: "Documents",
              description: "Contains Recipes and Projects.",
            },
            {
              id: "pictures",
              label: "Pictures",
              description: "Already contains vacation.jpg.",
            },
            {
              id: "tiny-api",
              label: "tiny-api",
              description: "A software project folder.",
            },
          ],
          correctOptionId: "pictures",
          explanation:
            "Folders help people and programs find related files without searching through one giant pile.",
        },
      }),
      quiz(
        "1.2-check",
        "Can a folder contain another folder?",
        ["Yes. Folders can contain files and other folders.", "No. Folders only contain files."],
        0,
        "Folders inside folders create a structure, like drawers inside a cabinet.",
      ),
      narrative(
        "1.2-why",
        "Why this matters later",
        "Software projects are folder structures. Knowing where a file lives helps you tell Codex what to inspect and helps you avoid changing the wrong file.",
      ),
    ],
  },
  {
    id: "1.3",
    levelId: 1,
    title: "What Is a File Path?",
    subtitle: "Read the address that points to a file or folder.",
    estimatedMinutes: 8,
    nextLessonId: "1.4",
    completionMessage: "You can follow folders in order and tell absolute paths from relative ones.",
    sections: [
      narrative(
        "1.3-intro",
        "A path is an address",
        "A file path is an address that tells a computer where a file or folder lives. It is built from folder names and, often, a file name. Think of it as directions through folders.",
        [
          "Absolute path: directions that begin from the top location.",
          "Relative path: directions that begin from where you are now.",
          "Different operating systems may draw paths differently, but the address idea stays the same.",
        ],
      ),
      interaction("1.3-builder", "Build the path to README.md", {
        instructions:
          "Choose each path piece in order to follow Home → Documents → Projects → tiny-api → README.md.",
        simulationLabel: "Simulation: path builder on a fictional computer",
        hint: "Start with Home, follow the folders from broad to specific, and finish with the file.",
        successMessage: "You built a valid path from the top folder to README.md.",
        failureFeedback:
          "Read the arrow directions again. A path lists each folder in order before the final file name.",
        interaction: {
          kind: "pathBuilder",
          prompt: "Assemble the address for README.md.",
          choices: ["README.md", "Projects", "Home", "tiny-api", "Documents"],
          expectedSegments: ["Home", "Documents", "Projects", "tiny-api", "README.md"],
          explanation:
            "Each slash separates one step in the route through the folder structure.",
        },
      }),
      interaction("1.3-kinds", "Absolute or relative?", {
        instructions:
          "Classify each simulated path. An absolute path begins from the top. A relative path begins from the current location.",
        simulationLabel: "Simulation: path examples, not your real files",
        hint: "A leading slash is the clue for these absolute path examples.",
        successMessage: "Correct. You can tell whether directions start at the top or from nearby.",
        failureFeedback:
          "Check the beginning. In these examples, / starts at the top; a folder or file name starts from the current place.",
        interaction: {
          kind: "pathClassifier",
          prompt: "Choose the path kind for each example.",
          paths: [
            {
              id: "absolute-readme",
              path: "/home/learner/Documents/Projects/tiny-api/README.md",
              correctKind: "absolute",
              explanation: "The leading slash shows this starts from the top.",
            },
            {
              id: "relative-recipe",
              path: "Documents/Recipes/chili.txt",
              correctKind: "relative",
              explanation: "This starts with a nearby folder name.",
            },
            {
              id: "relative-server",
              path: "src/server.js",
              correctKind: "relative",
              explanation: "This starts from the current project folder.",
            },
          ],
        },
      }),
      quiz(
        "1.3-check",
        "If you are already inside the tiny-api folder, which path is shorter for README.md?",
        ["README.md", "/home/learner/Documents/Projects/tiny-api/README.md"],
        0,
        "README.md is a relative path from inside tiny-api. It starts from where you already are.",
      ),
      narrative(
        "1.3-why",
        "Why this matters later",
        "Terminal tools, Git, Node, and Codex tasks often need the correct file or folder path. A correct path keeps your instructions aimed at the right place.",
      ),
    ],
  },
  {
    id: "1.4",
    levelId: 1,
    title: "File Types and What Is Inside",
    subtitle: "Use filename endings as clues about stored information.",
    estimatedMinutes: 8,
    nextLessonId: "1.5",
    completionMessage: "You can use common extensions to predict what a file likely contains.",
    sections: [
      narrative(
        "1.4-intro",
        "Extensions are helpful labels",
        "A filename extension is a small ending, such as .txt or .jpg, that often tells a computer and a person what kind of file it is. The extension is a clue. The real contents still matter.",
        [
          ".txt plain writing; .jpg or .png image; .mp3 audio; .mp4 video.",
          ".pdf document; .js JavaScript code; .json structured data; .md Markdown text.",
          "README.md is readable project information written in Markdown.",
        ],
      ),
      interaction("1.4-match", "Match files to likely contents", {
        instructions:
          "Match each filename to the kind of information you would most likely see inside.",
        simulationLabel: "Simulation: file extension inspector",
        hint: "Look at the small ending after the final dot.",
        successMessage: "Nice. You used file extensions as clues without treating them as magic.",
        failureFeedback:
          "Focus on the extension: .txt is writing, .png is an image, .js is code, .json is structured data, and .md is readable project notes.",
        interaction: {
          kind: "matchPairs",
          prompt: "Choose the likely contents for each file.",
          items: [
            {
              id: "notes",
              label: "notes.txt",
              description: "A simple text filename.",
              correctMatchId: "plain-writing",
            },
            {
              id: "logo",
              label: "logo.png",
              description: "A common image filename.",
              correctMatchId: "image-pixels",
            },
            {
              id: "server",
              label: "server.js",
              description: "A JavaScript source filename.",
              correctMatchId: "code-instructions",
            },
            {
              id: "package",
              label: "package.json",
              description: "A structured project data filename.",
              correctMatchId: "structured-data",
            },
            {
              id: "readme",
              label: "README.md",
              description: "A common project guide filename.",
              correctMatchId: "formatted-notes",
            },
          ],
          matches: [
            {
              id: "plain-writing",
              label: "Plain writing",
              description: "Words without special layout.",
            },
            {
              id: "image-pixels",
              label: "An image",
              description: "Visual picture data.",
            },
            {
              id: "code-instructions",
              label: "Code instructions",
              description: "Instructions written for a program.",
            },
            {
              id: "structured-data",
              label: "Structured data",
              description: "Named values arranged for programs to read.",
            },
            {
              id: "formatted-notes",
              label: "Readable formatted notes",
              description: "Project information with simple headings and lists.",
            },
          ],
        },
      }),
      quiz(
        "1.4-check",
        "Which file would most likely contain instructions for understanding or running a project?",
        ["README.md", "logo.png", "favorite-song.mp3"],
        0,
        "README files commonly explain what a project is and how to work with it.",
      ),
      narrative(
        "1.4-why",
        "Why this matters later",
        "Projects contain files such as README.md, package.json, source-code files, .gitignore, and sometimes .env. Sensitive settings and .env safety will be taught later; for now, just recognize that file types help you choose what to inspect.",
      ),
    ],
  },
  {
    id: "1.5",
    levelId: 1,
    title: "What Is a Program?",
    subtitle: "See how instructions turn an input into an output.",
    estimatedMinutes: 7,
    nextLessonId: "1.6",
    completionMessage: "You can explain a program as instructions that respond to input.",
    sections: [
      narrative(
        "1.5-intro",
        "Programs follow instructions",
        "A program is a set of instructions a computer can follow. Apps, games, websites, calculators, and text-based tools are all kinds of programs. Code is one way people write those instructions.",
        [
          "Input: information or an action given to the program.",
          "Instructions: the steps the program follows.",
          "Output: what the program shows, saves, plays, or changes.",
          "Calculator example: 2 + 2 goes in, addition happens, and 4 comes out.",
        ],
      ),
      interaction("1.5-sequence", "Put the program steps in order", {
        instructions:
          "A tiny project tracker adds a project to a list. Move the simulated steps into the order a program would follow.",
        simulationLabel: "Simulation: a tiny program responding to a click",
        hint: "Start with the user action. The program must read before it can save, and save before it can show the result.",
        successMessage: "Correct. The program turned one user action into a saved, visible result.",
        failureFeedback:
          "Think in cause-and-effect order: click, read, save, show.",
        interaction: {
          kind: "sequence",
          prompt: "Use the Up and Down buttons to arrange the four steps.",
          steps: [
            { id: "show", label: "Program shows the project in the list." },
            { id: "read", label: "Program reads the project name." },
            { id: "click", label: "User clicks Add." },
            { id: "save", label: "Program saves the project data." },
          ],
          correctOrder: ["click", "read", "save", "show"],
          explanation:
            "Programs follow an ordered set of instructions so the same kind of input can produce a reliable result.",
        },
      }),
      quiz(
        "1.5-check",
        "Which part of a program decides what happens after a user clicks a button?",
        ["The program's instructions", "The folder name", "The screen brightness"],
        0,
        "The program's instructions describe what to read, change, save, or show after the click.",
      ),
      narrative(
        "1.5-why",
        "Why this matters later",
        "Codex can help you understand, change, test, and create programs. You still need a basic picture of the input, instructions, and output so you can judge whether a change makes sense.",
      ),
    ],
  },
  {
    id: "1.6",
    levelId: 1,
    title: "What Is a Terminal?",
    subtitle: "Meet the text-based tool you will practice with next.",
    estimatedMinutes: 12,
    nextLessonId: "2.1",
    completionMessage:
      "Level 1 complete. Computers are organized systems, and you are ready to explore one with safe terminal practice.",
    sections: [
      narrative(
        "1.6-intro",
        "A terminal is another way to work",
        "A terminal is a text-based way to communicate with a computer. Instead of clicking folders and buttons, you type exact instructions. It works with the same files, folders, paths, and programs you already met.",
        [
          "The terminal is not magic and is not automatically dangerous.",
          "Exact text instructions can inspect, create, organize, and run things.",
          "Level 2 uses a browser simulation first. It cannot touch your real computer.",
        ],
      ),
      interaction("1.6-desktop-terminal", "Desktop click or terminal text?", {
        instructions:
          "Choose whether each simulated action describes clicking in a desktop interface or typing text in a terminal.",
        simulationLabel: "Simulation: two ways to work with the same computer",
        hint: "Desktop actions mention icons, windows, or clicking. Terminal actions mention typed text.",
        successMessage: "Right. The destination can be the same even when the way you give instructions changes.",
        failureFeedback:
          "Look for the action: clicking an icon is desktop-style; typing an exact instruction is terminal-style.",
        interaction: {
          kind: "classifyItems",
          categories: [
            { id: "desktop", label: "Desktop interface" },
            { id: "terminal", label: "Terminal" },
          ],
          items: [
            {
              id: "open-click",
              label: "Open Projects by double-clicking its folder icon",
              description: "Uses a pointer and a visual folder.",
              correctCategory: "desktop",
              explanation: "This is a visual desktop action.",
            },
            {
              id: "open-type",
              label: "Type an instruction that moves into Projects",
              description: "Uses exact text instead of clicking.",
              correctCategory: "terminal",
              explanation: "This is a terminal action.",
            },
            {
              id: "list-window",
              label: "Read filenames in an open file-browser window",
              description: "Uses a visual window.",
              correctCategory: "desktop",
              explanation: "This is a desktop interface view.",
            },
            {
              id: "list-text",
              label: "Type an instruction that asks what is here",
              description: "Uses a text request.",
              correctCategory: "terminal",
              explanation: "This is a terminal action.",
            },
          ],
        },
      }),
      narrative(
        "1.6-preview",
        "Read a terminal preview",
        "The preview below is simulated. The $ symbol is a prompt: it shows the terminal is ready. pwd is the typed command asking 'Where am I?' and /home/learner is the output. ls asks 'What is here?' and the names below it are output.",
        [
          "$ pwd",
          "/home/learner",
          "$ ls",
          "Documents  Pictures  Projects",
          "You do not need to memorize these commands yet.",
        ],
      ),
      interaction("1.6-parts", "Prompt, command, or output?", {
        instructions: "Match each part of the simulated terminal preview to its job.",
        simulationLabel: "Simulation: terminal preview, not a real command line",
        hint: "The prompt waits, the command is typed, and the output is the computer's response.",
        successMessage: "You can now read the basic shape of a terminal conversation.",
        failureFeedback:
          "Remember the order: prompt says ready, command asks, output answers.",
        interaction: {
          kind: "matchPairs",
          prompt: "Match each example to its role.",
          items: [
            {
              id: "prompt-part",
              label: "$",
              description: "Appears before typed instructions.",
              correctMatchId: "prompt-role",
            },
            {
              id: "command-part",
              label: "pwd",
              description: "Text entered by the learner.",
              correctMatchId: "command-role",
            },
            {
              id: "output-part",
              label: "/home/learner",
              description: "Text shown after the instruction.",
              correctMatchId: "output-role",
            },
          ],
          matches: [
            {
              id: "prompt-role",
              label: "Prompt",
              description: "The terminal is ready.",
            },
            {
              id: "command-role",
              label: "Command",
              description: "The typed instruction.",
            },
            {
              id: "output-role",
              label: "Output",
              description: "The computer's response.",
            },
          ],
        },
      }),
      quiz(
        "1.6-check",
        "Does the terminal replace folders and files?",
        [
          "No. It is another way to work with the same folders and files.",
          "Yes. Folders and files disappear when a terminal opens.",
        ],
        0,
        "A terminal changes the way you give instructions, not the basic organization of the computer.",
      ),
      narrative(
        "1.6-why",
        "Why this matters later",
        "Level 2 begins safe, hands-on terminal practice with pwd, ls, and cd. You will use a browser simulation before you ever need a real terminal.",
      ),
      interaction("1.6-review-files", "Find the Project: identify the files", {
        instructions:
          "Before locating README.md, match the main files in the tiny-api project to their likely contents.",
        simulationLabel: "Final Level 1 challenge: fictional project files",
        hint: "Use the extension clues from Lesson 1.4.",
        successMessage: "Good. You can predict the job of each main project file.",
        failureFeedback:
          "README.md is project guidance, package.json is project data, server.js is code, and projects.json is structured saved data.",
        interaction: {
          kind: "matchPairs",
          prompt: "Match each file to its likely contents.",
          items: [
            {
              id: "review-readme",
              label: "README.md",
              description: "A Markdown file at the top of the project.",
              correctMatchId: "project-guide",
            },
            {
              id: "review-package",
              label: "package.json",
              description: "A JSON file at the top of the project.",
              correctMatchId: "project-settings",
            },
            {
              id: "review-server",
              label: "server.js",
              description: "A JavaScript file inside src.",
              correctMatchId: "server-code",
            },
            {
              id: "review-projects",
              label: "projects.json",
              description: "A JSON file inside data.",
              correctMatchId: "saved-project-data",
            },
          ],
          matches: [
            {
              id: "project-guide",
              label: "Project notes and setup instructions",
              description: "Readable information for people using the project.",
            },
            {
              id: "project-settings",
              label: "Structured project settings and package information",
              description: "Data used by project tools.",
            },
            {
              id: "server-code",
              label: "Code instructions for the server",
              description: "Instructions a program can run.",
            },
            {
              id: "saved-project-data",
              label: "Structured saved project data",
              description: "Named values stored for the program.",
            },
          ],
        },
      }),
      interaction("1.6-review", "Find the Project", {
        instructions:
          "Use everything from Level 1 to locate README.md and explain what the project structure tells you.",
        simulationLabel: "Final Level 1 challenge: simulated folder tree",
        hint:
          "Follow Home, Documents, Projects, tiny-api, then README.md. The src folder holds source code. Level 2 begins by asking where you are and what is here.",
        successMessage:
          "Challenge complete. You found the file, built its path, recognized its type, and connected the project tree to the terminal ideas in Level 2.",
        failureFeedback:
          "One or more answers need another look. Follow the tree from top to bottom, then use the filename endings and folder names as clues.",
        interaction: {
          kind: "levelOneReviewChallenge",
          scenario:
            "A learner needs to locate README.md inside the fictional tiny-api project.",
          tree: finalProjectTree,
          classificationItems: [
            {
              id: "challenge-item-readme",
              label: "README.md",
              description: "Contains readable project information.",
              correctCategory: "file",
            },
            {
              id: "challenge-item-src",
              label: "src",
              description: "Contains server.js.",
              correctCategory: "folder",
            },
            {
              id: "challenge-item-package",
              label: "package.json",
              description: "Contains structured project data.",
              correctCategory: "file",
            },
            {
              id: "challenge-item-tiny-api",
              label: "tiny-api",
              description: "Contains the whole project structure.",
              correctCategory: "folder",
            },
          ],
          pathChoices: [
            "README.md",
            "Projects",
            "Home",
            "src",
            "tiny-api",
            "Documents",
            "data",
          ],
          answer: {
            classifications: {
              "challenge-item-readme": "file",
              "challenge-item-src": "folder",
              "challenge-item-package": "file",
              "challenge-item-tiny-api": "folder",
            },
            treePath: "Home/Documents/Projects/tiny-api/README.md",
            pathSegments: ["Home", "Documents", "Projects", "tiny-api", "README.md"],
            fileType: "Markdown text",
            readmePurpose: "Project notes and setup instructions",
            sourceFolder: "src",
            nextConcept: "show what is here",
          },
          options: {
            treePaths: [
              "Home/Documents/Projects/tiny-api/README.md",
              "Home/Pictures/tiny-api/README.md",
              "Home/Documents/README.md/tiny-api",
            ],
            fileTypes: ["Markdown text", "Image", "Audio"],
            readmePurposes: [
              "Project notes and setup instructions",
              "A vacation photo",
              "Music for the project",
            ],
            sourceFolders: ["src", "data", "Documents"],
            nextConcepts: [
              "show what is here",
              "delete everything",
              "install an account",
            ],
          },
        },
      }),
    ],
  },
];
