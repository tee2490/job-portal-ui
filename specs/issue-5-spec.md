# Technical Specification — Issue #5

> **Status: already implemented.** Fixed by PR #7 (`77d9cff`, merged 2026-09-22). This spec documents the verified root cause and the implemented solution, and lists what is still unverified.

## 1. Issue Overview

| Field       | Value                                                                                                                                              |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Title       | Inside the footer, when hover onto the "Privacy Policy" nothing being displayed                                                                    |
| Description | Hovering "Privacy Policy" in the footer shows nothing. The reporter expects text about the privacy policy to be displayed. A screenshot is attached. |
| Labels      | None                                                                                                                                               |
| Priority    | Low (cosmetic/UX, no functional breakage)                                                                                                          |

Issue state: CLOSED. Comments: none.

## 2. Problem Analysis

Before PR #7, the "Privacy Policy" element in `src/components/Footer.jsx` was an `<a>` with no `href` and no tooltip. It only rendered a gradient glow on hover. The Cookie Policy link had already received a tooltip in PR #3, and Terms of Service in PR #6, so Privacy Policy was the remaining inconsistent link.

Root cause: the tooltip pattern was applied one link at a time and Privacy Policy was not covered. There is no data or logic defect, and no Privacy Policy page or route exists (the link is a placeholder), so a tooltip was the requested minimal behavior.

## 3. Proposed Solution

Add the same CSS-only tooltip used by the Cookie Policy link:

- A `role="tooltip"` element with id `privacy-policy-tooltip`, wired via `aria-describedby`.
- Revealed by `group-hover` and `group-focus`, with `tabIndex={0}` so keyboard users can reach it, and `cursor-help` to signal the hint.
- Text: "We respect your privacy. We only collect the information needed to run JobPortal and never share your personal data with third parties without your consent."

Trade-offs:

- Copying the ~15-line block is the smallest change and stays consistent, at the cost of duplication (now four copies with Contact Us, per issue #9). A shared component is a reasonable follow-up.
- The tooltip copy is placeholder text written for this fix. It is not legal text. Real wording should come from the product owner.

## 4. Step-by-Step Implementation (as merged)

1. Add `tabIndex={0}`, `aria-describedby="privacy-policy-tooltip"`, and `cursor-help hover:text-white focus:text-white focus:outline-none` to the Privacy Policy `<a>` (`Footer.jsx:144-148`).
2. Add `group-focus:opacity-100` to the existing glow `div` so focus matches hover (`Footer.jsx:150`).
3. Add the tooltip `div` and arrow `span` inside the `<a>` (`Footer.jsx:151-160`), copying the Cookie Policy class list.

## 5. Verification Strategy

The repo has no test runner configured (no test script, vitest or jest in `package.json`), so unit and integration tests do not apply without adding tooling, which is out of scope.

### Unit Tests

- Not applicable (no test tooling in repo).

### Integration Tests

- Not applicable (no test tooling in repo).

### Manual Checks

- Hover "Privacy Policy" in the footer → tooltip with the privacy text appears above the link.
- Tab to "Privacy Policy" → the same tooltip appears.
- Hover the other three footer links → their tooltips are unaffected.
- View at ~320-375px width → tooltip is not clipped by the footer (known risk, see Out of Scope).
- `npx eslint src/components/Footer.jsx` → no errors. (Before PR #7, `npm run lint` already had ~30 unrelated errors in other files, so lint the file alone.)

## 6. Files to Modify

| File Path                   | Nature of Change                                                          |
| --------------------------- | ------------------------------------------------------------------------- |
| `src/components/Footer.jsx` | Add tooltip element, focus and accessibility attributes to Privacy Policy (done) |

## 7. New Files to Create

| File Path | Purpose |
| --------- | ------- |
| None      | n/a     |

## 8. Existing Utilities to Leverage

| Utility                                          | Benefit                                                   |
| ------------------------------------------------ | --------------------------------------------------------- |
| Cookie Policy tooltip markup (PR #3)             | Identical classes and structure keep visual consistency   |
| Tailwind `group` / `group-hover` / `group-focus` | Hover and focus reveal with no JS or state                |

## 9. Acceptance Criteria

- Hovering or focusing "Privacy Policy" displays privacy text (met, `Footer.jsx:151-160`).
- Styling matches the other footer tooltips (met; class list is identical).
- No new lint errors in `Footer.jsx` (met at the time of PR #6; not re-run here for PR #7).
- No regressions to the other footer links.

## 10. Out of Scope

- A real Privacy Policy page or route, and final legal copy.
- Extracting a shared `FooterTooltipLink` component (four copies now exist).
- Narrow-viewport overflow and clipping by the footer's `overflow-hidden`, affecting all four tooltips.
- `<a>` elements without `href` (announced as links but not actionable) and `focus:outline-none` weakening the focus indicator, both flagged in the PR #6 review.
- Adding a test framework.
