# Technical Specification — Issue #9

> **Status: already implemented.** Fixed by PR #10 (`6cf351f`, merged 2026-09-23 via the Claude GitHub Action). This spec documents the verified root cause and the implemented solution, and lists what is still unverified.

## 1. Issue Overview

| Field       | Value                                                                                                                                                                                                                                   |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Title       | Inside the footer, when user hovers on "Contact Us" not text being displayed                                                                                                                                                            |
| Description | Hovering "Contact Us" in the footer shows no text. The link navigates to the Contact page, where users message the admin about problems. The reporter wants help text shown on hover.                                                   |
| Labels      | None                                                                                                                                                                                                                                    |
| Priority    | Low (cosmetic/UX, no functional breakage)                                                                                                                                                                                               |

Issue state: CLOSED. Comments: owner asked `@claude` to fix; the bot pushed `claude/issue-9-20260923-0926`, which became PR #10.

## 2. Problem Analysis

Before PR #10, the "Contact Us" `Link` in `src/components/Footer.jsx` only rendered a gradient glow on hover. It had no tooltip element, unlike its three siblings (Privacy Policy, Terms of Service, Cookie Policy), which received tooltips in PRs #3, #7 and #6.

Root cause: the tooltip pattern was applied link by link, and Contact Us was not covered. There is no data or logic issue. The Contact page route (`contact` in `src/App.jsx:137`, page `src/pages/Contact.jsx`) already exists and works.

## 3. Proposed Solution

Add the same CSS-only tooltip used by the other footer links to the Contact Us link:

- A `role="tooltip"` element with id `contact-us-tooltip`, wired via `aria-describedby`.
- Shown with `group-hover` and `group-focus` utilities, so it needs no state, JS or new dependency.
- Help text: "Have a question or facing an issue? Get in touch with our support team and we'll help you out."

Trade-offs:

- Duplicating the ~15-line tooltip block a fourth time is the smallest change and matches existing code, but it is now four copies to keep in sync. Extracting a shared component is a reasonable follow-up, not required here.
- Unlike the other three links, Contact Us is a real `Link` (it navigates), so it correctly has no `cursor-help` and no `tabIndex={0}` (a `Link` is already focusable).

## 4. Step-by-Step Implementation (as merged)

1. Add `aria-describedby="contact-us-tooltip"` and `focus:text-white focus:outline-none` to the `Link` (`Footer.jsx:198-202`).
2. Add `group-focus:opacity-100` to the existing glow `div` so keyboard focus matches hover (`Footer.jsx:204`).
3. Add the tooltip `div` and arrow `span` inside the `Link` (`Footer.jsx:205-213`), copying the class list from the Cookie Policy tooltip.

## 5. Verification Strategy

The repo has no test runner configured (no test script, vitest or jest in `package.json`), so unit and integration tests do not apply without adding tooling, which is out of scope.

### Unit Tests

- Not applicable (no test tooling in repo).

### Integration Tests

- Not applicable (no test tooling in repo).

### Manual Checks

- Hover "Contact Us" in the footer → tooltip with the help text appears above the link.
- Tab to "Contact Us" with the keyboard → the same tooltip appears.
- Click "Contact Us" → navigates to `/contact`.
- View at ~320-375px width → tooltip is not clipped by the footer (see risk below).
- `npm run lint` → no new errors from `Footer.jsx`. The bot could not run lint; this is **unverified** for the merged code.

## 6. Files to Modify

| File Path                      | Nature of Change                                                    |
| ------------------------------ | ------------------------------------------------------------------- |
| `src/components/Footer.jsx`    | Add tooltip element and focus styles to the Contact Us `Link` (done) |

## 7. New Files to Create

| File Path | Purpose |
| --------- | ------- |
| None      | n/a     |

## 8. Existing Utilities to Leverage

| Utility                                               | Benefit                                                       |
| ----------------------------------------------------- | ------------------------------------------------------------- |
| Cookie Policy / Terms / Privacy tooltip markup        | Identical classes and structure keep visual consistency       |
| Tailwind `group` / `group-hover` / `group-focus`      | Hover and focus reveal with no JS or state                    |
| React Router `Link` (already used)                    | Keeps client-side navigation to `/contact`                    |

## 9. Acceptance Criteria

- Hovering or focusing "Contact Us" displays help text (met, per code at `Footer.jsx:205-213`).
- Link still navigates to `/contact` (unchanged `to` prop).
- Styling matches the other footer tooltips (met; class list is identical).
- `npm run lint` shows no new errors in `Footer.jsx` (not yet confirmed).
- No regressions to the other footer links (their markup is unchanged in PR #10).

## 10. Out of Scope

- Extracting a shared `FooterTooltipLink` component (recommended follow-up: four copies now exist).
- Narrow-viewport overflow and clipping by the footer's `overflow-hidden`, which affects all four tooltips and was flagged in the PR #6 review.
- Accessibility follow-ups from the PR #6 review: `<a>` elements without `href` for Privacy/Terms/Cookie, and `focus:outline-none` weakening the focus indicator.
- Adding a test framework.
- Real Privacy/Terms/Cookie pages.
