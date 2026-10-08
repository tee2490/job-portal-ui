---
name: recurring-data-layer-issues
description: Recurring data-layer review hotspots in job-portal-ui (duplicate job-mutation paths, localStorage key drift, dark: variant usage) - verify against current code before citing
metadata:
  type: project
---

Recurring hotspots seen in review on 2026-10-08 (verify still true before reporting):

- Employer job mutations exist twice: JobContext postJob/updateJob/deleteJob (unused by pages) and direct localStorage writes in pages/PostJob.jsx and pages/MyJobs.jsx. Context state (postedJobs, Navbar totalPostedJobs) goes stale.
- localStorage keys drift from data-layer.md table: services use `savedJobIds_{id}` and `jobApplications_{id}`; JobContext fallback reads `appliedJobs_`/`savedJobs_`; undocumented `allApplications_`, `globalApplications` (never written).
- JSON.parse of localStorage is unguarded in JobContext mutation helpers and all services.
- Pages (MyJobs, PostJob) use `dark:` variant heavily and default exports - pre-existing, widespread; no team decision recorded accepting it.

**Why:** These recur across reviews; knowing them saves re-discovery.
**How to apply:** When reviewing changes touching jobs/applications/saved jobs, check both mutation paths and key names; label the above as pre-existing unless the diff touches them.
