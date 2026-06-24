import type {
  ConceptInteractionSection,
  Lesson,
} from "./lessonSchema.ts";

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

const whyCodex = (id: string, body: string) =>
  narrative(id, "Why this matters with Codex", body);

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

const concept = (
  id: string,
  title: string,
  section: Omit<ConceptInteractionSection, "id" | "type" | "title">,
): ConceptInteractionSection => ({
  id,
  type: "conceptInteraction",
  title,
  ...section,
});

const projectName = "Creator Project Tracker";

export const level5Lessons: Lesson[] = [
  {
    id: "5.1",
    levelId: 5,
    title: "What Is Code?",
    subtitle: "Turn an input into an output by following written instructions.",
    estimatedMinutes: 7,
    nextLessonId: "5.2",
    completionMessage: "You can explain code as instructions software can follow.",
    sections: [
      narrative(
        "5.1-intro",
        "Code gives software instructions",
        `Code is written instructions that software can follow. In ${projectName}, a person enters a project title, instructions check it and save it, and the app shows the new project. The input is what enters the system; the output is what the system produces.`,
        [
          "Input: information supplied to software.",
          "Instructions: the rules applied to that information.",
          "Output: the result produced by those rules.",
        ],
      ),
      concept("5.1-flow", "Build the input-to-output flow", {
        instructions:
          "Place each part of adding a project into its correct role.",
        simulationLabel: "Simulation: code flow",
        hint: "The typed title enters first. The validation rule runs next. The saved project card is the result.",
        successMessage: "Correct. Code turns an input into an output by following instructions.",
        failureFeedback: "Trace what enters, what rule runs, and what result appears.",
        interaction: {
          kind: "systemBuilder",
          prompt: "Complete the three-part flow.",
          slots: [
            { id: "input", label: "Input", description: "Information enters the app.", correctComponentId: "typed-title" },
            { id: "instructions", label: "Instructions", description: "The software follows a rule.", correctComponentId: "validate-save" },
            { id: "output", label: "Output", description: "The app produces a result.", correctComponentId: "project-card" },
          ],
          components: [
            { id: "project-card", label: "New project card appears", description: "The visible result." },
            { id: "typed-title", label: 'User types "Portfolio launch"', description: "Information supplied to the app." },
            { id: "validate-save", label: "Check the title, then save it", description: "Written instructions the software follows." },
          ],
          summary: "The user supplies a title, code validates and saves it, and the app displays a project card.",
        },
      }),
      whyCodex(
        "5.1-codex",
        "When you ask Codex to change code, describe the input, the rule, and the expected output. That gives Codex a testable target, and it gives you a clear result to verify.",
      ),
      quiz(
        "5.1-check",
        "Which description best defines code?",
        ["Written instructions software can follow", "Any text stored in a file", "A finished website"],
        0,
        "Code is written instructions. Files can contain code, but not every file is code.",
      ),
    ],
  },
  {
    id: "5.2",
    levelId: 5,
    title: "Programming Languages",
    subtitle: "Match common languages and data formats to their usual jobs.",
    estimatedMinutes: 8,
    nextLessonId: "5.3",
    completionMessage: "You can distinguish code languages, markup, styles, queries, and data.",
    sections: [
      narrative(
        "5.2-intro",
        "Different tools express different kinds of instructions",
        "A programming language gives humans a structured way to write instructions for computers. JavaScript and Python are general programming languages. HTML describes page structure, CSS describes presentation, SQL asks databases for data, and JSON represents data. They work together, but they are not all the same kind of language.",
      ),
      concept("5.2-match", "Match each tool to its job", {
        instructions: `Sort the technologies used around ${projectName}.`,
        simulationLabel: "Simulation: language roles",
        hint: "HTML is structure, CSS is presentation, SQL talks to databases, and JSON carries data.",
        successMessage: "Correct. A modern product combines several specialized languages and formats.",
        failureFeedback: "Focus on the usual job of each technology, not whether it appears in a text file.",
        interaction: {
          kind: "assignment",
          prompt: "Choose the best general use for each item.",
          categories: [
            { id: "behavior", label: "Application behavior" },
            { id: "structure", label: "Page structure" },
            { id: "presentation", label: "Page presentation" },
            { id: "database", label: "Database questions" },
            { id: "data", label: "Data format" },
          ],
          items: [
            { id: "javascript", label: "JavaScript", description: "Runs interactive behavior in browsers and servers.", correctCategoryId: "behavior" },
            { id: "python", label: "Python", description: "A general-purpose programming language often used for tools, data, and servers.", correctCategoryId: "behavior" },
            { id: "html", label: "HTML", description: "Describes headings, forms, links, and other page structure.", correctCategoryId: "structure" },
            { id: "css", label: "CSS", description: "Controls layout, color, spacing, and presentation.", correctCategoryId: "presentation" },
            { id: "sql", label: "SQL", description: "Reads and changes structured database records.", correctCategoryId: "database" },
            { id: "json", label: "JSON", description: "Represents structured data exchanged between systems.", correctCategoryId: "data" },
          ],
        },
      }),
      whyCodex(
        "5.2-codex",
        "Knowing each file’s role helps you ask Codex for the right kind of change and review whether it edited JavaScript behavior, HTML structure, CSS presentation, SQL, or JSON data.",
      ),
      quiz(
        "5.2-check",
        "Which statement is accurate?",
        ["JSON represents data; it is not executable application code.", "CSS queries databases.", "SQL controls page colors."],
        0,
        "JSON is a data format. It can be read by code, but it is not itself a program.",
      ),
    ],
  },
  {
    id: "5.3",
    levelId: 5,
    title: "What Is a Website, Really?",
    subtitle: "Connect browser files, server delivery, and interactive behavior.",
    estimatedMinutes: 8,
    nextLessonId: "5.4",
    completionMessage: "You can describe a website as cooperating files, code, a browser, and often a server.",
    sections: [
      narrative(
        "5.3-intro",
        "A website is a small system",
        `A website is not one magical object. ${projectName} uses files that describe structure and style, JavaScript for behavior, a server that sends resources or data, and a browser that turns those pieces into the page a person sees.`,
      ),
      concept("5.3-anatomy", "Assemble the website journey", {
        instructions: "Place the main parts in the relationship that makes a page appear.",
        simulationLabel: "Simulation: website anatomy",
        hint: "The browser asks, the server sends resources, and the browser renders them.",
        successMessage: "Correct. A website appears when the browser receives and renders the right resources.",
        failureFeedback: "Start with the person’s browser, then identify who sends the files and who renders them.",
        interaction: {
          kind: "systemBuilder",
          prompt: "Complete the page-delivery map.",
          slots: [
            { id: "visitor", label: "Visitor opens the site", description: "The request begins on a person’s device.", correctComponentId: "browser" },
            { id: "delivery", label: "Resources are delivered", description: "Another computer responds with files or data.", correctComponentId: "server" },
            { id: "render", label: "Page becomes visible", description: "Structure, style, and behavior are combined.", correctComponentId: "web-files" },
          ],
          components: [
            { id: "server", label: "Web server", description: "Sends files or data in a response." },
            { id: "web-files", label: "HTML + CSS + JavaScript", description: "The browser renders these into an interactive page." },
            { id: "browser", label: "Browser", description: "Requests and displays the site." },
          ],
          summary: "A browser requests the site, a server responds, and the browser renders HTML, CSS, and JavaScript.",
        },
      }),
      whyCodex(
        "5.3-codex",
        "When a page looks wrong, this model helps you tell Codex whether the problem is in delivered files, browser rendering, application behavior, or server data instead of saying only that the website is broken.",
      ),
      quiz(
        "5.3-check",
        "Where are HTML, CSS, and JavaScript usually turned into a visible page?",
        ["In the browser", "Inside DNS", "Inside a database table"],
        0,
        "The browser interprets the received resources and renders the visible page.",
      ),
    ],
  },
  {
    id: "5.4",
    levelId: 5,
    title: "Client vs Server",
    subtitle: "Separate work done near the user from work done on another computer.",
    estimatedMinutes: 8,
    nextLessonId: "5.5",
    completionMessage: "You can sort browser/client responsibilities from server responsibilities.",
    sections: [
      narrative(
        "5.4-intro",
        "Client and server are roles",
        `A client requests or displays something for a user. In this level, the client is usually a browser. A server listens for requests and responds with files or data. In ${projectName}, the browser shows project cards while the server checks permissions and supplies saved projects.`,
      ),
      concept("5.4-sort", "Sort client and server responsibilities", {
        instructions: "Assign each responsibility to the browser/client or the server.",
        simulationLabel: "Simulation: client and server",
        hint: "Visible clicks and rendering happen in the browser. Protected rules and shared saved data belong on the server.",
        successMessage: "Correct. Client and server cooperate, but they own different responsibilities.",
        failureFeedback: "Ask whether the task happens on the user’s visible page or must be trusted and shared on a server.",
        interaction: {
          kind: "assignment",
          prompt: `Who should do each job in ${projectName}?`,
          categories: [
            { id: "client", label: "Browser / client" },
            { id: "server", label: "Server" },
          ],
          items: [
            { id: "click", label: "Respond to an Add Project button click", description: "The user directly interacts with the page.", correctCategoryId: "client" },
            { id: "render", label: "Render project cards", description: "Turn received data into visible interface elements.", correctCategoryId: "client" },
            { id: "permissions", label: "Verify who may edit a project", description: "A rule users must not be able to bypass.", correctCategoryId: "server" },
            { id: "shared-data", label: "Return the team’s saved projects", description: "Shared persistent information is requested.", correctCategoryId: "server" },
          ],
        },
      }),
      whyCodex(
        "5.4-codex",
        "Knowing client versus server helps you ask Codex where a bug likely lives and prevents unsafe requests such as putting a protected permission rule only in browser code.",
      ),
      quiz(
        "5.4-check",
        "Which job belongs on the server?",
        ["Enforce a protected permission rule", "Draw a visible button", "Show hover styling"],
        0,
        "Rules that must be trusted should be enforced by the server, not only by browser code.",
      ),
    ],
  },
  {
    id: "5.5",
    levelId: 5,
    title: "HTTP: How Computers Talk",
    subtitle: "Step through a request and response without making a real network call.",
    estimatedMinutes: 10,
    nextLessonId: "5.6",
    completionMessage: "You can identify the essential parts of an HTTP request and response.",
    sections: [
      narrative(
        "5.5-intro",
        "HTTP is a request-and-response agreement",
        "HTTP is a set of rules clients and servers use to communicate. A request includes a URL or path and a method such as GET or POST. It can include headers with extra context and a body with sent data. A response includes a status code, headers, and often a body. A 200 status means the request succeeded; 404 means the resource was not found.",
      ),
      concept("5.5-http", "Send a simulated HTTP request", {
        instructions: `Request the list of projects from ${projectName}, then step through the round trip.`,
        simulationLabel: "Simulation: no network request",
        hint: "Reading a list uses GET. The project collection lives at /api/projects.",
        successMessage: "Request complete. You followed a GET request from client to server and a 200 response back.",
        failureFeedback: "Choose the method used to read data and the path for the projects collection.",
        interaction: {
          kind: "requestResponse",
          prompt: "Build the request, send it, and advance through every phase.",
          request: {
            methods: ["GET", "POST", "DELETE"],
            paths: ["/", "/api/projects", "/styles.css"],
            correctMethod: "GET",
            correctPath: "/api/projects",
            headers: ["Accept: application/json"],
          },
          phases: [
            { id: "client", actor: "Browser", title: "Build request", detail: "The client chooses GET and /api/projects." },
            { id: "server", actor: "Server", title: "Receive request", detail: "The server reads the method, path, and headers." },
            { id: "work", actor: "Backend", title: "Prepare data", detail: "Application code gathers the saved project records." },
            { id: "response", actor: "Browser", title: "Receive response", detail: "The client receives a status code and JSON body." },
          ],
          response: {
            status: 200,
            statusText: "OK",
            body: '{\n  "projects": ["Portfolio launch", "Course site"]\n}',
          },
        },
      }),
      whyCodex(
        "5.5-codex",
        "HTTP vocabulary lets you give Codex precise evidence: the method, path, request body, status code, and response. Those details are far more useful than saying the internet part failed.",
      ),
      quiz(
        "5.5-check",
        "What does an HTTP status code describe?",
        ["The result of handling a request", "The programming language used", "The database password"],
        0,
        "A status code summarizes how the server handled the request.",
      ),
    ],
  },
  {
    id: "5.6",
    levelId: 5,
    title: "What Is an API?",
    subtitle: "Use a defined software doorway to request project data.",
    estimatedMinutes: 9,
    nextLessonId: "5.7",
    completionMessage: "You can explain an API as a defined way for software systems to communicate.",
    sections: [
      narrative(
        "5.6-intro",
        "An API defines how software may ask",
        `An application programming interface, or API, is a defined way for one piece of software to communicate with another. ${projectName} exposes an endpoint named /api/projects. The browser can send an allowed request to that endpoint and receive a documented response.`,
      ),
      concept("5.6-api", "Call the fictional projects API", {
        instructions: "Choose the documented read operation and follow the API response.",
        simulationLabel: "Simulation: fictional API",
        hint: "The API contract says GET /api/projects returns the project list.",
        successMessage: "Correct. The client used the API’s defined request and received its documented data shape.",
        failureFeedback: "Use the endpoint and method described by the API contract.",
        interaction: {
          kind: "requestResponse",
          prompt: "API contract: GET /api/projects returns JSON.",
          request: {
            methods: ["GET", "PATCH"],
            paths: ["/api/projects", "/api/weather"],
            correctMethod: "GET",
            correctPath: "/api/projects",
          },
          phases: [
            { id: "contract", actor: "Client", title: "Follow the API contract", detail: "The client uses an allowed method and endpoint." },
            { id: "handler", actor: "API", title: "Run endpoint logic", detail: "The API handler gathers project records." },
            { id: "return", actor: "Client", title: "Read structured response", detail: "The client receives JSON in the promised shape." },
          ],
          response: {
            status: 200,
            statusText: "OK",
            body: '{\n  "projects": [\n    { "id": 1, "title": "Portfolio launch" }\n  ]\n}',
          },
        },
      }),
      whyCodex(
        "5.6-codex",
        "When Codex builds or uses an API, check the contract: endpoint, method, inputs, outputs, and errors. Understanding the boundary helps you review whether both sides agree.",
      ),
      quiz(
        "5.6-check",
        "What is an API endpoint?",
        ["A defined address for a software operation", "A visual CSS rule", "A Git branch"],
        0,
        "An endpoint is a defined location where an API accepts a particular kind of request.",
      ),
    ],
  },
  {
    id: "5.7",
    levelId: 5,
    title: "JSON: The Universal Data Format",
    subtitle: "Inspect objects, arrays, strings, numbers, booleans, and nested values.",
    estimatedMinutes: 10,
    nextLessonId: "5.8",
    completionMessage: "You can inspect a JSON response and distinguish JSON data from executable code.",
    sections: [
      narrative(
        "5.7-intro",
        "JSON represents structured data",
        "JSON is a text format for structured data. Objects use braces and named properties. Arrays use brackets and contain a list of values. Strings use double quotes; numbers and booleans do not. Values can be nested. JSON describes data—it does not run instructions like application code.",
      ),
      concept("5.7-json", "Inspect a project JSON response", {
        instructions: "Read the JSON and answer questions about its structure and values.",
        simulationLabel: "Simulation: JSON inspector",
        hint: "Braces mark an object, brackets mark an array, and true is a boolean.",
        successMessage: "Correct. You identified nested JSON values and their data types.",
        failureFeedback: "Check the punctuation around each value and follow the nesting one level at a time.",
        interaction: {
          kind: "jsonInspector",
          prompt: `Inspect this response from ${projectName}.`,
          source: `{
  "project": {
    "id": 7,
    "title": "Portfolio launch",
    "published": false,
    "tags": ["design", "website"]
  }
}`,
          questions: [
            { id: "root", prompt: "What is the top-level value?", options: ["object", "array", "string"], correctOption: "object" },
            { id: "id", prompt: "What type is project.id?", options: ["number", "string", "boolean"], correctOption: "number" },
            { id: "published", prompt: "What type is project.published?", options: ["boolean", "array", "object"], correctOption: "boolean" },
            { id: "tags", prompt: "What type is project.tags?", options: ["array", "number", "string"], correctOption: "array" },
          ],
        },
      }),
      whyCodex(
        "5.7-codex",
        "Understanding JSON helps you inspect API responses, configuration, and test data Codex creates. You can catch a wrong property name or data type instead of trusting that valid-looking text is correct.",
      ),
      quiz(
        "5.7-check",
        "Which statement is true?",
        ["JSON represents data and is not executable code.", "JSON strings use no quotes.", "Every JSON value must be an array."],
        0,
        "JSON is a data format that programs can parse and use.",
      ),
    ],
  },
  {
    id: "5.8",
    levelId: 5,
    title: "What Is a Database?",
    subtitle: "Store persistent records that can be searched and changed safely.",
    estimatedMinutes: 9,
    nextLessonId: "5.9",
    completionMessage: "You can explain why an application uses a database for persistent structured records.",
    sections: [
      narrative(
        "5.8-intro",
        "A database keeps organized information over time",
        `A database stores persistent information so it remains available after a request ends or a server restarts. ${projectName} keeps one record per project with fields such as id, title, and status. Unlike a loose folder of files, a database provides structured queries, consistency rules, and coordinated access for many users.`,
      ),
      concept("5.8-records", "Choose the safe database action", {
        instructions: "Read the records and choose the operation that matches the product request.",
        simulationLabel: "Simulation: project records",
        hint: "The request is to change the status of an existing row, not create or remove one.",
        successMessage: "Correct. Updating the matching record preserves the project and changes only its status.",
        failureFeedback: "Find the existing project and choose the operation that changes one field.",
        interaction: {
          kind: "dataTable",
          prompt: 'The user marks "Course site" as done. What should the database operation do?',
          columns: ["id", "title", "status"],
          rows: [
            { id: 1, title: "Portfolio launch", status: "active" },
            { id: 2, title: "Course site", status: "active" },
          ],
          choices: [
            { id: "read", label: "Read all records", description: "Returns rows without changing them." },
            { id: "update", label: "Update record 2", description: "Changes the existing Course site status to done." },
            { id: "delete", label: "Delete record 2", description: "Removes the project entirely." },
          ],
          correctChoiceId: "update",
        },
      }),
      whyCodex(
        "5.8-codex",
        "When Codex changes data code, knowing what must persist helps you review the schema, validation, and exact records affected instead of treating the database as an invisible box.",
      ),
      quiz(
        "5.8-check",
        "What does persistent mean here?",
        ["The data remains available after one request or restart.", "The data is always public.", "The data cannot be changed."],
        0,
        "Persistent data survives beyond one temporary operation.",
      ),
    ],
  },
  {
    id: "5.9",
    levelId: 5,
    title: "SQL: Talking to Databases",
    subtitle: "Recognize safe simulated SELECT, INSERT, UPDATE, and DELETE operations.",
    estimatedMinutes: 10,
    nextLessonId: "5.10",
    completionMessage: "You can recognize the four basic SQL data operations.",
    sections: [
      narrative(
        "5.9-intro",
        "SQL asks a database to work with records",
        "SQL is a language for working with relational databases. SELECT reads rows. INSERT adds a row. UPDATE changes existing rows. DELETE removes rows. A real query must be reviewed carefully, especially UPDATE and DELETE, because its conditions determine which records change.",
      ),
      concept("5.9-query", "Choose the SQL operation", {
        instructions: "Select the query concept that answers the request without changing data.",
        simulationLabel: "Simulation: no SQL execution",
        hint: "The product only needs to read active projects.",
        successMessage: "Correct. SELECT reads the matching rows without changing them.",
        failureFeedback: "Use the operation for reading records, not adding, changing, or removing them.",
        interaction: {
          kind: "dataTable",
          prompt: "The dashboard needs to show every active project. Which query concept fits?",
          columns: ["id", "title", "status"],
          rows: [
            { id: 1, title: "Portfolio launch", status: "active" },
            { id: 2, title: "Course site", status: "done" },
          ],
          choices: [
            { id: "select", label: "SELECT ... WHERE status = 'active'", description: "Read rows matching a condition." },
            { id: "insert", label: "INSERT a project", description: "Create a new row." },
            { id: "update", label: "UPDATE every project", description: "Change existing rows." },
            { id: "delete", label: "DELETE completed projects", description: "Remove rows." },
          ],
          correctChoiceId: "select",
        },
      }),
      whyCodex(
        "5.9-codex",
        "If Codex proposes SQL, identify whether it reads or mutates data and inspect its WHERE condition. Basic SQL literacy helps you prevent broad, destructive changes.",
      ),
      quiz(
        "5.9-check",
        "Which SQL operation removes rows?",
        ["DELETE", "SELECT", "INSERT"],
        0,
        "DELETE removes matching rows and must be used with careful conditions.",
      ),
    ],
  },
  {
    id: "5.10",
    levelId: 5,
    title: "Frontend vs Backend",
    subtitle: "Sort visible interface work from server-side application work.",
    estimatedMinutes: 9,
    nextLessonId: "5.11",
    completionMessage: "You can distinguish frontend, backend, and database responsibilities.",
    sections: [
      narrative(
        "5.10-intro",
        `Two sides of ${projectName}`,
        "The frontend is the interface and browser-side behavior a person directly experiences. The backend is server-side application logic that handles requests, rules, and data access. The database stores persistent records. A feature often crosses all three layers.",
      ),
      concept("5.10-sort", "Locate each responsibility", {
        instructions: "Sort each feature responsibility into frontend, backend, or database.",
        simulationLabel: "Simulation: application layers",
        hint: "Visible layout is frontend, trusted request handling is backend, and persistent rows belong in the database.",
        successMessage: "Correct. You separated presentation, application logic, and persistent storage.",
        failureFeedback: "Ask whether the job is visible in the browser, trusted on the server, or stored as persistent data.",
        interaction: {
          kind: "assignment",
          prompt: `Where does each part of ${projectName} belong?`,
          categories: [
            { id: "frontend", label: "Frontend" },
            { id: "backend", label: "Backend" },
            { id: "database", label: "Database" },
          ],
          items: [
            { id: "cards", label: "Project card layout", description: "The visible arrangement, text, and buttons.", correctCategoryId: "frontend" },
            { id: "form", label: "Form interaction", description: "The browser collects a title and shows validation feedback.", correctCategoryId: "frontend" },
            { id: "permission", label: "Edit permission check", description: "A trusted rule decides whether the request is allowed.", correctCategoryId: "backend" },
            { id: "endpoint", label: "POST /api/projects handler", description: "Server code receives and processes a request.", correctCategoryId: "backend" },
            { id: "rows", label: "Saved project records", description: "Persistent project titles and statuses.", correctCategoryId: "database" },
          ],
        },
      }),
      whyCodex(
        "5.10-codex",
        "Frontend versus backend vocabulary helps you scope Codex work, review which files changed, and spot a solution that puts trusted logic in the wrong layer.",
      ),
      quiz(
        "5.10-check",
        "Where should a trusted permission check run?",
        ["Backend", "Only in frontend CSS", "DNS"],
        0,
        "The backend must enforce rules users should not be able to bypass.",
      ),
    ],
  },
  {
    id: "5.11",
    levelId: 5,
    title: "The Tech Stack",
    subtitle: "Build the collection of technologies behind one product.",
    estimatedMinutes: 10,
    nextLessonId: "5.12",
    completionMessage: "You can describe a tech stack as cooperating technology choices across product layers.",
    sections: [
      narrative(
        "5.11-intro",
        "A stack is a set of technology choices",
        `A tech stack is the collection of technologies used to build and run a product. One possible ${projectName} stack uses React in the browser, a Node.js API on the backend, PostgreSQL for records, a hosting service for running the app, and a domain people can visit. A stack is not a ranking; it is a set of cooperating layers.`,
      ),
      concept("5.11-stack", "Build the full stack", {
        instructions: "Choose the component that fills each layer of the fictional product.",
        simulationLabel: "Simulation: full-stack system map",
        hint: "Follow the path from the visitor’s address through hosting, frontend, backend API, and database.",
        successMessage: "Stack complete. Every technology has a clear layer and responsibility.",
        failureFeedback: "Match each technology to the layer it is designed to serve.",
        interaction: {
          kind: "systemBuilder",
          prompt: `Assemble one possible stack for ${projectName}.`,
          slots: [
            { id: "domain", label: "Public address", description: "The name a visitor types.", correctComponentId: "domain-name" },
            { id: "hosting", label: "Hosting", description: "Managed computers run and deliver the app.", correctComponentId: "hosting-service" },
            { id: "frontend", label: "Frontend", description: "The browser interface.", correctComponentId: "react" },
            { id: "backend", label: "Backend / API", description: "Server-side request handling.", correctComponentId: "node" },
            { id: "database", label: "Database", description: "Persistent project records.", correctComponentId: "postgres" },
          ],
          components: [
            { id: "postgres", label: "PostgreSQL", description: "Relational database." },
            { id: "react", label: "React", description: "Frontend interface library." },
            { id: "domain-name", label: "creatorprojects.example", description: "Human-readable domain." },
            { id: "node", label: "Node.js API", description: "Backend JavaScript runtime and handlers." },
            { id: "hosting-service", label: "Cloud hosting service", description: "Runs and delivers the deployed application." },
          ],
          summary: "The domain points visitors to hosting, which serves a frontend that calls a backend API connected to a database.",
        },
      }),
      whyCodex(
        "5.11-codex",
        "Before asking Codex to add a feature, name the stack and the layer in scope. That context keeps suggestions compatible with the technologies the project actually uses.",
      ),
      quiz(
        "5.11-check",
        "What is a tech stack?",
        ["The collection of technologies used to build and run a product", "Only the frontend framework", "A list of Git commits"],
        0,
        "A stack spans the product’s cooperating technology layers.",
      ),
    ],
  },
  {
    id: "5.12",
    levelId: 5,
    title: "What Is the Cloud?",
    subtitle: "Replace the sky metaphor with managed physical computers.",
    estimatedMinutes: 8,
    nextLessonId: "5.13",
    completionMessage: "You can explain cloud hosting without treating it as magic.",
    sections: [
      narrative(
        "5.12-intro",
        "The cloud is still someone else’s computers",
        "Cloud services run on physical computers in data centers. A provider manages hardware, networking, power, and tools that let teams rent computing, storage, and databases. The word cloud describes how those resources are delivered as services—not a place where software floats.",
      ),
      concept("5.12-sort", "Separate cloud facts from cloud myths", {
        instructions: "Sort each statement by whether it accurately describes cloud computing.",
        simulationLabel: "Simulation: cloud mental model",
        hint: "Cloud providers manage physical infrastructure; teams still own their code, configuration, costs, and security choices.",
        successMessage: "Correct. Cloud services abstract physical computers; they do not remove them or remove responsibility.",
        failureFeedback: "Reject statements that describe the cloud as magic, weightless, or responsibility-free.",
        interaction: {
          kind: "assignment",
          prompt: "Which statements are accurate?",
          categories: [
            { id: "fact", label: "Cloud fact" },
            { id: "myth", label: "Cloud myth" },
          ],
          items: [
            { id: "physical", label: "Runs on physical data-center computers", description: "Processors, memory, disks, and networks still do the work.", correctCategoryId: "fact" },
            { id: "managed", label: "Infrastructure can be managed as a service", description: "A provider handles some operational work.", correctCategoryId: "fact" },
            { id: "sky", label: "Software floats in the sky", description: "A metaphor mistaken for the real system.", correctCategoryId: "myth" },
            { id: "automatic", label: "Every cloud app is automatically secure and free", description: "Configuration, access, and cost still require decisions.", correctCategoryId: "myth" },
          ],
        },
      }),
      whyCodex(
        "5.12-codex",
        "When Codex mentions cloud resources, translate them into concrete services, configuration, permissions, cost, and physical runtime limits. The cloud does not make verification optional.",
      ),
      quiz(
        "5.12-check",
        "What powers cloud services?",
        ["Physical computers and networks in data centers", "No hardware at all", "A browser cache only"],
        0,
        "Cloud providers operate real infrastructure and expose it through managed services.",
      ),
    ],
  },
  {
    id: "5.13",
    levelId: 5,
    title: "Deployment",
    subtitle: "Order the path from a reviewed local change to a live application.",
    estimatedMinutes: 9,
    nextLessonId: "5.14",
    completionMessage: "You can describe deployment as a verified process, not a magic upload.",
    sections: [
      narrative(
        "5.13-intro",
        "Deployment makes a version available",
        `Deployment is the process of taking a tested version of a project and making it run in a target environment such as production. For ${projectName}, the team reviews and tests a commit, builds the app, sends the build to hosting, starts or updates the service, and checks the live result.`,
      ),
      concept("5.13-pipeline", "Order the deployment pipeline", {
        instructions: "Move the steps into a safe sequence from local work to live verification.",
        simulationLabel: "Simulation: no real deployment",
        hint: "Review and test before building; verify the live result after the host releases it.",
        successMessage: "Correct. A deployment is a sequence with review and verification on both sides of the release.",
        failureFeedback: "A safe release starts with reviewed code and ends with checking the live application.",
        interaction: {
          kind: "sequence",
          prompt: "Put the deployment steps in order.",
          steps: [
            { id: "host", label: "Release build on hosting", description: "The target environment receives and starts the version." },
            { id: "verify", label: "Verify the live app", description: "Check the public result and important workflows." },
            { id: "review", label: "Review and test the commit", description: "Confirm the intended version is safe to release." },
            { id: "build", label: "Create a production build", description: "Turn source files into deployable output." },
          ],
          correctOrder: ["review", "build", "host", "verify"],
        },
      }),
      whyCodex(
        "5.13-codex",
        "If Codex says an app is ready to ship, you still need to know what was tested, what build will be deployed, which environment changes, and how the live result will be verified.",
      ),
      quiz(
        "5.13-check",
        "When is deployment complete?",
        ["After the intended version is live and verified", "As soon as code is typed", "Before tests run"],
        0,
        "A responsible deployment includes checking the released application.",
      ),
    ],
  },
  {
    id: "5.14",
    levelId: 5,
    title: "DNS and Domains",
    subtitle: "Route a human-readable name to a deployed application.",
    estimatedMinutes: 10,
    nextLessonId: "6.1",
    completionMessage: "You can trace a domain through DNS to hosting and the deployed app.",
    sections: [
      narrative(
        "5.14-intro",
        "Domains are names; DNS helps find destinations",
        "A domain is a human-readable name such as creatorprojects.example. DNS, the Domain Name System, stores records that help a browser find the service responsible for that name. The browser resolves the domain, connects to the hosting destination, requests the application, and receives a response. DNS points traffic; it does not contain the application itself.",
      ),
      concept("5.14-route", "Route a visitor to the deployed app", {
        instructions: "Complete the path from the typed domain to the running product.",
        simulationLabel: "Simulation: DNS and hosting route",
        hint: "The browser starts with the domain, DNS returns a destination, hosting receives the request, and the deployed app responds.",
        successMessage: "Route complete. The domain, DNS, hosting, and deployed app each played a distinct role.",
        failureFeedback: "Follow the lookup in order: human-readable name, DNS destination, host, application.",
        interaction: {
          kind: "systemBuilder",
          prompt: `Connect creatorprojects.example to ${projectName}.`,
          slots: [
            { id: "name", label: "1. Visitor enters a name", description: "The browser begins with a human-readable address.", correctComponentId: "domain" },
            { id: "lookup", label: "2. Find the destination", description: "A naming system returns routing information.", correctComponentId: "dns" },
            { id: "destination", label: "3. Receive the connection", description: "Managed infrastructure accepts the request.", correctComponentId: "hosting" },
            { id: "app", label: "4. Return the product", description: "The released application handles the request.", correctComponentId: "deployed-app" },
          ],
          components: [
            { id: "deployed-app", label: "Deployed Creator Project Tracker", description: "The running application." },
            { id: "domain", label: "creatorprojects.example", description: "The domain the visitor remembers." },
            { id: "hosting", label: "Cloud hosting destination", description: "The service running the release." },
            { id: "dns", label: "DNS record", description: "Routing information for the domain." },
          ],
          summary: "The browser resolves the domain through DNS, connects to hosting, and receives the deployed application.",
        },
      }),
      whyCodex(
        "5.14-codex",
        "Understanding DNS helps you troubleshoot why a deployed app is not reachable. Codex can help inspect configuration, but you must distinguish application errors from domain records, propagation, certificates, and hosting.",
      ),
      quiz(
        "5.14-check",
        "What does DNS primarily provide?",
        ["Routing information that helps a name reach a destination", "The application source code", "Database rows"],
        0,
        "DNS connects names to routing destinations; the application runs elsewhere.",
      ),
    ],
  },
];
