# Level 5 Software Systems Handoff

Last updated: 2026-06-24

## Implemented

Level 5, "How Software Actually Works," contains 14 playable lessons covering
code, programming languages, websites, client/server, HTTP, APIs, JSON,
databases, SQL, frontend/backend, tech stacks, cloud hosting, deployment, DNS,
and domains.

The fictional Creator Project Tracker connects the concepts across the level.
Every lesson has an active interaction and one section titled exactly
"Why this matters with Codex."

## New Lesson Section Type

`conceptInteraction` is a Zod-backed discriminated union with six kinds:

- `assignment`
- `sequence`
- `requestResponse`
- `jsonInspector`
- `dataTable`
- `systemBuilder`

The union is intentionally narrow. It supports the Level 5 learning models
without introducing a generic visual editor or real network/database runtime.

## Architecture

- `src/content/level5Lessons.ts`: Level 5 content and configuration.
- `src/content/lessonSchema.ts`: `conceptInteraction` schemas and types.
- `src/components/ConceptInteraction.tsx`: React renderers.
- `src/concepts/levelFiveValidation.ts`: framework-free state and validation.
- `src/styles.css`: responsive conceptual diagrams, tables, flows, and maps.

All simulations are browser-only. There are no HTTP requests, API integrations,
SQL execution, database connections, cloud calls, DNS changes, or deployments.

## Accessibility

Interactions use labeled native selects and buttons, visible focus treatment,
keyboard-operable ordering controls, text feedback, table semantics, and text
summaries for system diagrams. Wide data and JSON examples scroll inside their
own containers. Mobile layouts collapse to one column without page overflow.

## Test Coverage

- Pure validation tests cover assignment, ordering, request state transitions,
  JSON parsing/inspection, data choices, and system builders.
- Lesson-flow tests require all 14 lessons, active interactions, and Codex
  relevance sections.
- Progress tests verify Level 5 localStorage compatibility.
- Playwright covers all routes plus Client vs Server, HTTP, JSON,
  Frontend vs Backend, Deployment, DNS, keyboard operation, persistence, and
  mobile layout.

## Known Limitations

- HTTP, API, JSON, SQL, hosting, deployment, and DNS behavior is conceptual.
- The data table does not implement a SQL parser or mutable database engine.
- The request simulator follows authored phases rather than a general network
  protocol.
- Progress remains localStorage-only until authentication and sync exist.

## Recommended Next Goal Mode Task

Implement Supabase email/password authentication and authenticated progress
sync while preserving anonymous local progress for migration. Google OAuth
remains postponed. If curriculum sequencing is preferred, Level 6 can extend
the conceptual HTTP model into safe `curl` and public-API practice.
