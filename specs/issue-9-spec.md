# Technical Specification — Issue #9

> **Status note:** Issue #9 is **CLOSED**. The fix was merged to `master` in commit
> `a9dbfa3` — *"fix: show help tooltip on footer contact us link (#10)"*. This spec
> documents the verified root cause and the implemented solution, and lists the
> verification still outstanding (the bot's comment on the issue says lint and browser checks were **not** run).

## 1. Issue Overview

| Field       | Value |
| ----------- | ----- |
| Title       | Inside the footer, when user hovers on "Contact Us" not text being displayed |
| Description | Hovering the footer "Contact Us" link shows no help text. The link opens the Contact page, where users can message the admin about a problem, so a hover hint should explain this. |
| Labels      | None |
| Milestone   | None |
| State       | Closed (fixed by PR #10) |
| Priority    | Low (UX hint only; no functional breakage) |

## 2. Problem Analysis

- `src/components/Footer.jsx` renders a bottom row of legal/help links. Privacy Policy, Terms of Service and Cookie Policy were already wrapped in the shared `Tooltip` component (`src/components/Tooltip.jsx`). The "Contact Us" `<Link to="/contact">` was not wrapped, so hovering it showed only the gradient highlight and no help text.
- The `/contact` route exists (`src/App.jsx:137` → `<Contact />`), so navigation already worked. Only the hover hint was missing.
- The root cause is a missing `Tooltip` wrapper; no logic bug was involved.

## 3. Proposed Solution (as implemented)

- Wrap the existing "Contact Us" `<Link>` in `<Tooltip content={…}>`, the same way the three sibling footer links do.
- Tooltip content: a bold "Contact Us" heading, then *"Having a problem or need help? Click to open the contact page and send a message to our admin team."*
- `Tooltip` already provides:
  - show on hover (`group-hover/tooltip`) **and** on keyboard focus (`group-focus-within/tooltip`)
  - `role="tooltip"`, plus `aria-describedby` cloned onto the trigger with `useId()`
  - `pointer-events-none`, so the tooltip never blocks clicks on the link
- Trade-off: this reuses the existing component with no new pattern or state. The change is the smallest possible.

## 4. Step-by-Step Implementation

1. **Wrap the link** — In `Footer.jsx`, wrap the "Contact Us" `<Link>` with `<Tooltip>` and pass the help-text content. ✅ Done (`Footer.jsx:206-224`).
2. **Keep the link behaviour** — Leave `to="/contact"`, the focus styles and the gradient hover span unchanged. ✅ Done.
3. **Tidy indentation (follow-up, optional)** — The Contact Us `<Tooltip>` block is indented one tab deeper than its sibling `<Tooltip>` blocks (lines 145/165/186). Align it with them for consistency. Tabs per project preference. ⏳ Pending.
4. **Run lint** — `npm run lint`. This was not run during the automated fix. ⏳ Pending.

## 5. Verification Strategy

The project has no test runner (`package.json` has no vitest/jest/testing-library), so verification is lint plus manual checks. Adding a test framework is out of scope for this low-complexity issue.

### Unit Tests

- N/A: no test tooling. *(If Vitest + RTL is added later: render `<Footer />` in a `MemoryRouter` → the "Contact Us" link has `aria-describedby` pointing to an element with `role="tooltip"` that contains "send a message to our admin team".)*

### Integration Tests

- N/A for the same reason. *(Future: click "Contact Us" → the router renders the `Contact` page.)*

### Manual Checks

- Hover "Contact Us" in the footer → the tooltip fades in above the link with the heading and help text.
- Tab to "Contact Us" with the keyboard → the same tooltip appears on focus.
- Click "Contact Us" → navigates to `/contact`, and the tooltip does not intercept the click.
- Hover Privacy / Terms / Cookie → their tooltips still work (no regression).
- Mobile width (<768px): the links wrap and centre, and the tooltip (`w-64`, centred) is not clipped horizontally.
- `npm run lint` → no new errors in `Footer.jsx`.

## 6. Files to Modify

| File Path | Nature of Change |
| --------- | ---------------- |
| `src/components/Footer.jsx` | ✅ Wrapped "Contact Us" link in `Tooltip` (done in `a9dbfa3`); optional indentation alignment |

## 7. New Files to Create

| File Path | Purpose |
| --------- | ------- |
| — | None required |

## 8. Existing Utilities to Leverage

| Utility | Benefit |
| ------- | ------- |
| `src/components/Tooltip.jsx` (`Tooltip`) | Hover and focus display, ARIA wiring and styling that match the other footer tooltips |
| React Router `Link` | Existing client-side navigation to `/contact` |

## 9. Acceptance Criteria

- [x] Hovering "Contact Us" in the footer shows help text explaining that it opens the contact page to message the admin.
- [x] The tooltip also appears on keyboard focus and is linked to the link via `aria-describedby`.
- [x] Clicking still navigates to `/contact`.
- [ ] `npm run lint` passes.
- [ ] Manual browser check done (desktop and mobile).
- [ ] No regressions in the other footer tooltips.

## 10. Out of Scope

- Adding a test framework (Vitest/RTL) to the project.
- Changes to the `Contact` page or the admin contact-messages flow.
- Redesigning `Tooltip` (for example viewport-edge collision handling or touch-device tap-to-show).
- Tooltips for the other footer columns (quick links, social icons).
