# Change Investigation Report

**Target**: `src/components/Footer.jsx:198-214` (the footer "Contact Us" `Link` block, including its tooltip)
**Interpretation**: file path with line range, resolved to the JSX `<Link to="/contact">` element and its children.
**Investigation Date**: 2026-09-27
**Repository**: https://github.com/tee2490/job-portal-ui.git
**Branch**: master (working tree has unrelated uncommitted changes; `Footer.jsx` itself is clean)

---

## Investigation Summary

| Detail                  | Value                                              |
| ----------------------- | -------------------------------------------------- |
| File(s) Analyzed        | `src/components/Footer.jsx`                        |
| Lines Investigated      | 198-214 (17 lines)                                 |
| Total Commits on File   | 5 (2 touched the target lines)                     |
| Unique Authors          | 1 (`tee2490`), plus `claude[bot]` as co-author     |
| File Age (First Commit) | 2026-09-20                                         |
| Last Modified           | 2026-09-23 by `tee2490` (squash merge of PR #10)   |

---

## Author Breakdown

| #   | Author    | Email                                          | Commits | Lines Owned (target) | Lines Owned (file) | First Contribution | Last Contribution |
| --- | --------- | ---------------------------------------------- | ------- | -------------------- | ------------------ | ------------------ | ----------------- |
| 1   | tee2490   | 44152787+tee2490@users.noreply.github.com      | 5       | 17 (100%)            | 231 (100%)         | 2026-09-20         | 2026-09-23        |
| -   | claude[bot] | 41898282+claude[bot]@users.noreply.github.com | 0 (co-author on 6cf351f) | 0 in blame | 0 in blame | 2026-09-23 | 2026-09-23 |

**Primary Owner**: tee2490 (100% of current lines)
**Most Recent Contributor**: tee2490 on 2026-09-23 (committer shown as GitHub, i.e. a squash merge)
**CODEOWNERS**: Not configured

Note: blame credits the whole of `6cf351f` to `tee2490` because the PR was squash-merged and GitHub attributes the squashed commit to the PR opener. The commit trailer `Co-authored-by: claude[bot]` and the branch name `claude/issue-9-20260923-0926` show the change was written by the Claude GitHub Action.

---

## Change Timeline

### 6cf351f - 2026-09-23 16:45:17 +0700

- **Author**: tee2490 <44152787+tee2490@users.noreply.github.com> (Committer: GitHub)
- **Message**: `fix: add hover tooltip text to footer Contact Us link (#10)`
- **Body**: "Contact Us in the footer had no descriptive text on hover, unlike the neighboring Privacy Policy, Terms of Service, and Cookie Policy links which all show a helpful tooltip. Added a matching tooltip so users know what clicking the link will do." Trailer: `Co-authored-by: claude[bot]`.
- **Ticket References**: PR #10 (in subject). Issue #9 is linked through the PR and the bot's issue comment ("Closes #9"), not in the commit message itself.
- **Lines Changed**: +12 / -2 in `Footer.jsx` (whole commit; the same 12 additions fall inside the target range)
- **What Changed**:
  > A bug fix / UX improvement. Added `aria-describedby="contact-us-tooltip"` and `focus:text-white focus:outline-none` to the `Link`, added `group-focus:opacity-100` to the glow div, and added a `role="tooltip"` div (id `contact-us-tooltip`) with help text plus an arrow span. It copies the tooltip pattern from the three sibling links.

### 899dd8e - 2026-09-20 10:09:50 +0700

- **Author**: tee2490 <44152787+tee2490@users.noreply.github.com>
- **Message**: `Initial commit: job portal UI`
- **Body**: -
- **Ticket References**: None found
- **Lines Changed**: +5 lines remain in the target range (Link open tag, `to`, closing `>`, label span, closing tag)
- **What Changed**:
  > Original creation of the Contact Us link: a plain `Link` to `/contact` with a hover glow and no tooltip.

Other commits on the file (not touching lines 198-214, listed for context):

| Commit  | Date       | Subject                                                        |
| ------- | ---------- | -------------------------------------------------------------- |
| 77d9cff | 2026-09-22 | fix: show tooltip on footer privacy policy hover (#7)          |
| af935c0 | 2026-09-22 | fix: show tooltip on footer terms of service hover (#6)        |
| d1c3dca | 2026-09-21 | fix: show tooltip on footer cookie policy hover (#3)           |

---

## Line-by-Line Blame (Current State)

| Line    | Code (truncated)                                  | Author  | Date       | Commit  |
| ------- | ------------------------------------------------- | ------- | ---------- | ------- |
| 198-199 | `<Link to="/contact"`                             | tee2490 | 2026-09-20 | 899dd8e |
| 200     | `aria-describedby="contact-us-tooltip"`           | tee2490 | 2026-09-23 | 6cf351f |
| 201     | `className="group relative hover:text-white ...`  | tee2490 | 2026-09-23 | 6cf351f |
| 202-203 | `>` and `<span ...>Contact Us</span>`             | tee2490 | 2026-09-20 | 899dd8e |
| 204     | glow `div` (now with `group-focus:opacity-100`)   | tee2490 | 2026-09-23 | 6cf351f |
| 205-213 | tooltip `div`, help text, arrow `span`            | tee2490 | 2026-09-23 | 6cf351f |
| 214     | `</Link>`                                         | tee2490 | 2026-09-20 | 899dd8e |

---

## Linked Tickets & References

| Ticket ID | Commit  | Author  | Date       | Commit Subject                                         |
| --------- | ------- | ------- | ---------- | ------------------------------------------------------ |
| PR #10    | 6cf351f | tee2490 | 2026-09-23 | fix: add hover tooltip text to footer Contact Us link  |
| Issue #9  | 6cf351f | tee2490 | 2026-09-23 | linked via the PR and issue thread, not the commit text |

No commit message on this file references an issue number directly; all four fix commits carry only a PR number.

---

## Insights

- **Churn Assessment**: 5 commits in about 3 days (2026-09-20 to 2026-09-23), 4 of them fixes with the same shape (add a tooltip to one footer link). Churn is high but it is one repeated pattern applied link by link, not instability. The target range itself changed once after creation.
- **Bus Factor**: One human author owns 100% of lines. Low risk for a small single-developer project, but there is no second reviewer of record. (PRs #6, #7, #10 were opened and merged by the same account.)
- **Stale Code Risk**: None; the last change was 4 days ago.
- **Review Gaps**: `899dd8e` has no reference of any kind, which is expected for an initial commit. Commit `fc9b9c3` ("chore:Claude Workflow updates") went straight to `master` without a PR and does not touch this file, so it is outside this investigation.
- **Duplication**: the tooltip block now exists four times in this file (Privacy, Terms, Cookie, Contact). A follow-up extracting a shared component would remove the copy-paste. Related notes are in `specs/issue-9-spec.md`.
