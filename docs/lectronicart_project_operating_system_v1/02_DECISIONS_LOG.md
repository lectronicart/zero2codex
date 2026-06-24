# Decisions Log

## 2026-06-10 — Position LectronicArt around creative builders, not generic automation
**Decision:** LectronicArt Skool will focus on AI art, AI video, content systems, digital products, and simple automations for creative builders.

**Why it was made:** This better matches the founder’s interests and creates a more differentiated market position than a broad AI automation school.

**Alternatives considered:**
- Generic AI automation agency education
- A pure AI-art community
- A broad creator-business education brand without AI specialization

**Revisit if:** Audience feedback shows the positioning is too broad, unclear, or does not produce meaningful traction.

---

## 2026-06-10 — Use “Build your AI-powered creative machine” as core positioning
**Decision:** Use “Build your AI-powered creative machine” as the central positioning line.

**Why it was made:** It captures the outcome: creative work, systems, repeatability, and monetization without sounding like an agency course.

**Alternatives considered:** Not formally documented.

**Revisit if:** A stronger line emerges from audience testing or launch messaging.

---

## 2026-06-23 — Use the Creative Machine Flywheel as the core business model
**Decision:** Organize the business around the flywheel: Create → Teach → Attract → Community → Products → Proof → More Creation.

**Why it was made:** It makes content, community, products, and proof reinforce one another rather than operating as disconnected activities.

**Alternatives considered:** Building isolated content channels, products, and community offers without a shared loop.

**Revisit if:** The flywheel fails to create measurable content, community, product, or proof momentum.

---

## 2026-06-23 — Treat zero2codex as a major LectronicArt workstream
**Decision:** The Project Operating System covers both LectronicArt Skool HQ and zero2codex, with zero2codex tracked as a major product workstream.

**Why it was made:** zero2codex supports the broader LectronicArt mission while needing its own product, curriculum, and implementation discipline.

**Alternatives considered:**
- Treat zero2codex as fully separate
- Ignore zero2codex inside LectronicArt operating documents

**Revisit if:** zero2codex becomes a fully independent business, brand, or repository with separate goals and operations.

---

## 2026-06-23 — Build zero2codex as original, Codex-native education
**Decision:** zero2codex may pattern-match strong learning mechanics from zero2claude, but must use original content, branding, design, and implementation.

**Why it was made:** To learn from a strong reference product while avoiding copying its proprietary expression or private implementation.

**Alternatives considered:** Direct replication or creating a less interactive static course.

**Revisit if:** Licensing, partnership, or a new reference strategy changes the design constraints.

---

## 2026-06-23 — Build zero2codex in thin MVP slices
**Decision:** Do not build all 17 levels before implementation. Prioritize the course shell, lesson engine, terminal simulator, complete Levels 1 and 2, and a short Level 8 Codex teaser.

**Why it was made:** This delivers a working learning loop and validates the product before the full 151-lesson curriculum is built.

**Alternatives considered:** Writing and building every level before launch.

**Revisit if:** Early user testing demonstrates a different minimum compelling learning sequence.

---

## 2026-06-24 — Use a browser-safe Git model for Level 4
**Decision:** Teach Git through an in-memory simulator layered on the existing
virtual filesystem, with no real Git process or GitHub connection.

**Why it was made:** Beginners need to practice checkpoints, staging, diffs,
branches, merges, and recovery without risking a local repository or needing an
account.

**Alternatives considered:**
- Running real Git in a backend or WebContainer
- Teaching Git through passive diagrams only
- Deferring Git until after authentication

**Revisit if:** Later advanced lessons require production Git behavior that
cannot be represented honestly by the teaching model.
