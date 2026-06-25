# Course Map Design QA

- Source visual truth:
  - List view: `/Users/derricktoomey/Desktop/Screenshot 2026-06-24 at 7.29.50 PM.png`
  - Card view: `/Users/derricktoomey/Desktop/Screenshot 2026-06-24 at 8.16.14 PM.png`
- Supporting lesson-list references:
  - `/Users/derricktoomey/Desktop/Screenshot 2026-06-24 at 7.31.02 PM.png`
  - `/Users/derricktoomey/Desktop/Screenshot 2026-06-24 at 7.31.19 PM.png`
- Latest verified list-view screenshot: `/private/tmp/zero2codex-loop3.png`
- Card-view implementation screenshot: unavailable
- Side-by-side comparison: `/private/tmp/zero2codex-side-by-side-loop3.png`
- Desktop viewport: `1280 × 1000`
- Mobile viewport: `390 × 844`
- State: dark theme, stored local progress, Cards/List layout control added

## Full-view comparison evidence

The list view previously passed full-view comparison. The new card-view source
was opened and inspected, but the in-app browser rejected access to
`http://127.0.0.1:4187/` before a same-state implementation screenshot could be
captured. The new four-column layout therefore cannot receive a visual pass yet.

## Focused region comparison evidence

Source inspection confirms the intended focused surfaces: four narrow level
cards, compact headers, progress rails, two-line lesson rows, and a Cards/List
control at the top right. The implementation contains those structures, but
focused rendered comparison is blocked by unavailable browser capture.

## Required fidelity surfaces

- Fonts and typography: Pending card-view rendered comparison.
- Spacing and layout rhythm: Pending card-view rendered comparison.
- Colors and tokens: Reuses the already-passed zero2codex palette.
- Image quality and asset fidelity: No new image assets were introduced.
- Copy and content: Passed. Card view reuses the 151 original lesson subtitles.
- Responsiveness and accessibility: Static implementation includes four,
  three, two, and one-column breakpoints plus pressed-state labels, but rendered
  verification remains pending.

## Findings

- [P1] Card view cannot be visually verified
  - Location: course-map Cards layout.
  - Evidence: source image opened successfully; localhost implementation
    capture was rejected by the in-app browser URL policy.
  - Impact: spacing, clipping, and responsive fidelity cannot be signed off.
  - Fix: restore in-app browser access or explicitly allow a Playwright
    fallback, then capture desktop and mobile card states.

## Patches made across QA loops

1. Replaced the two-column card grid with a single full-width accordion stack.
2. Removed the oversized landing-page hero and moved the learning path above
   the course map.
3. Added real local progress counts, a resume strip, and level progress rails.
4. Added short explanations beneath every lesson title.
5. Tightened row height, flattened surfaces, moved level numbers outside cards,
   and introduced restrained level accent colors.
6. Corrected desktop marker clipping and verified mobile overflow.
7. Added a persistent Cards/List switch and responsive four-column card grid.

## Follow-up polish

- P3: A future achievements/review feature could add an original review queue
  above the map, similar in function but not copy to the reference.
- P3: A future icon system can add original level artwork after a brand icon
  direction is selected.

final result: blocked
