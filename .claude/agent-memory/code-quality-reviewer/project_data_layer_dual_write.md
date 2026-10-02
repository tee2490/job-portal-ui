---
name: data-layer-dual-write
description: Employer job persistence has two write paths (JobContext mutators vs pages writing localStorage directly) that drift; unguarded JSON.parse of localStorage is pervasive
metadata:
  type: project
---

As of 2026-10-02, employer job data is written in two independent ways: JobContext exposes postJob/updateJob/deleteJob plus a "persist postedJobs state" effect, while PostJob.jsx and MyJobs.jsx bypass the context and read/write `postedJobs_<id>` and `globalPostedJobs` straight to localStorage. The context mutators had no consumers, so JobContext.postedJobs (and Navbar's totalPostedJobs) goes stale. fetchAllJobs already merges globalPostedJobs, and getAllJobsSync merges it again, so posted jobs show up twice.

**Why:** No single owner for the job-mutation logic, so every new feature adds another direct localStorage writer.

**How to apply:** When reviewing anything that touches jobs or applications, check which write path it uses, whether both the per-user key and the global key are updated, and whether JobsDataContext.forceRefresh is called. Also expect `JSON.parse(localStorage.getItem(...) || '[]')` without try/catch; this crashes the render when it runs in a render path. Re-verify these facts before citing them, because a refactor may have consolidated the paths. Related: [[project-rules-vs-code-drift]]
