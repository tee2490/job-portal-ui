---
name: hot-paths-and-data-scale
description: Data sizes (1000 generated jobs, ~30-40 companies) and which components/pages touch the full job list; use to calibrate severity of list/algorithm findings
metadata:
  type: project
---

Data scale: mockData.js generates 1000 jobs at module load (`generateJobs(1000)`), already sorted by postedDate desc; ~30-40 companies. `fetchAllJobs` appends `globalPostedJobs` from localStorage. `fetchCompanies` attaches a `jobs` array per company (companies x jobs filter on every fetch).

**Why:** O(n) work over 1000 items is ~sub-ms to a few ms; only flag algorithmic issues when they run per keystroke, per item (n x m), or allocate heavily (e.g. `new Date()` in sort comparators). The home page (Hero + JobsSection + CompaniesSection) is the main landing hot path; JobsSection sorts the full 1000-job list on mount and every filter change.

**How to apply:** Rate single O(n) passes on mount/fetch as Low or "not worth it". `src/components/` was reviewed in full on 2026-10-02 and was overall low-risk; remaining cost is mostly in the contexts, see [[context-provider-anti-patterns]]. Heavy Tailwind visual effects (blur-3xl, backdrop-blur on opaque cards, animate-pulse on blurred layers) are the main paint-cost theme in components.
