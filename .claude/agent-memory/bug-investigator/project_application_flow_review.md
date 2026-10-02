---
name: application-flow-review-2026-10
description: Review-only audit (2026-10-02) of job seeker apply -> employer applicants flow; lists open bugs that were reported but NOT fixed
metadata:
  type: project
---

On 2026-10-02 a review-only bug audit (user said "don't make any changes") covered JobContext.jsx, jobApplicationService.js, JobApplicants.jsx, MyJobs.jsx, JobsDataContext.updateJobApplicationsCount. Nothing was fixed at the time.

**Why:** The user ran a multi-agent bug-review team; fixes were deferred to a later task.

**How to apply:** If asked to fix application-flow bugs later, re-verify each item against current code first (they may have been fixed since). Main open items at that time:
- JobApplicants reads app.userName/userEmail/userProfile, but the service returns applicantName/applicantEmail and no profile, so name.charAt crashes once any application exists.
- Status vocab mismatch: the service writes 'APPLIED', but JobApplicants options/counts use 'Applied'/'In Review'.
- globalApplications / allApplications_<id> in JobContext are never written (dead code). The real store is jobApplications_<userId>.
- applicationsCount is in-memory only and is never persisted to globalPostedJobs/postedJobs_<id>. Mock jobs are regenerated randomly on each reload, so counts and job content drift.
- At login, profileService reads jobPortalUser before AuthContext persists it, so seekers come back profileComplete=false and are blocked from applying.
- Service-layer keys are derived from the jobPortalUser localStorage key (written in an effect), not from React state. Watch for timing bugs [[storage-key-timing]].
