---
name: project-trust-boundaries
description: Where auth/role state and user-generated data live in JobPortal, and recurring weakness patterns seen in audits (role from localStorage, unvalidated JSON, no ownership checks)
metadata:
  type: project
---

Trust boundaries and recurring patterns (first full audit of src/components/ on 2026-10-02).

- Session = `jobPortalUser` JSON in localStorage, parsed in AuthContext with no schema/role validation. `isAuthenticated` is just `!!user`; `authToken` is only presence-checked at load, never verified or expired. ProtectedRoute and every JobContext role check read the same tamperable `user.role`.
- Credentials: plaintext passwords hardcoded in AuthContext DUMMY_USERS and stored in `registeredUsers` localStorage; demo creds also shown on Login page. Not yet confirmed by the user as an accepted demo risk — ask before treating as accepted.
- User-generated data path: employer posts -> `globalPostedJobs` localStorage -> companyService.fetchAllJobs (JSON.parse, no validation) -> JobsSection/Job pages render it. This is the path that becomes stored-content from other users once a backend exists.
- Ownership: ProtectedRoute enforces role only; `/job-applicants/:jobId` had no check that the job belongs to the logged-in employer (IDOR pattern to re-check on each audit).
- Login `from` redirect uses router history state pathname only (not a query param) — not an open redirect as of 2026-10-02; re-check if a `?redirect=` param is ever added.
- Registration (AuthContext.register) builds the new user from explicit fields and hardcodes ROLE_JOB_SEEKER; no role self-assignment via the form. Re-check that this stays explicit (no `...userData` spread) if employer signup is added. Email duplicate check is exact-match (no trim/lowercase).
- Services (e.g. profileService) work out the current user by reading `jobPortalUser` from localStorage, not from the context. AuthContext.login calls getProfile() before setUser, so it reads the previous or missing session. Look for this ordering hazard wherever services run during login.
- AuthContext persistence effect (`if (user) set else remove`) also runs on mount while user is still null, so it wipes authToken during restore. Session restore was fragile as of 2026-10-02, so "sessions never expire" doesn't fully hold in practice.
- AuthContext.updateProfile spreads arbitrary profileData over the session user (role/userId can be overwritten). This mass-assignment shape needs a server allow-list later.
- Data contexts and pages log liberally to console (incl. applicant profile data) — recurring info-leak pattern.

**Why:** Frontend-only app; these are the places that become real vulnerabilities once a backend is attached.
**How to apply:** Start future audits by re-verifying these points still hold; frame findings as "UX guard now, must be server-enforced later". See [[accepted-risks]] once the user confirms which demo shortcuts are intentional.
