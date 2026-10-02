---
name: project-rules-vs-code-drift
description: Documented coding standards (tabs, named exports, no dark: variant, no inline styles) are violated codebase-wide; report as systemic, not per-line
metadata:
  type: project
---

As of 2026-10-02 the whole of src/components/ (and contexts) breaks several documented rules uniformly:
- 2-space indentation everywhere, though the user/rules require tabs.
- Every component uses `export default`, though named exports are preferred.
- `dark:` variant is used everywhere. Dark mode actually works by ThemeContext toggling a `.dark` class on <html> plus `@variant dark (.dark &);` in src/index.css, so `dark:` is the real working mechanism. The rule in coding-standards.md contradicts how the code actually works.
- Inline `style={{ animationDelay }}` and `onError` handlers that set `e.target.style.display` repeat across card components.

**Why:** The rules seem to have been written after the code (the .claude/rules/ dir was untracked at the time). Flagging each line would bury real bugs.

**How to apply:** Report these once as systemic findings with counts, and recommend the team either migrate or amend the rule (especially dark:). Re-check whether the rule or code has changed before repeating. If the user decides to accept `dark:`, record that here and stop flagging it.

Other recurring weak spots: icon-only controls without aria-labels, inputs labelled only by placeholder, data contexts expose `error` but consumers ignore it, and large blocks of copy-pasted markup (Navbar menu items, Footer tooltips). Related: [[review-scope-components]]
