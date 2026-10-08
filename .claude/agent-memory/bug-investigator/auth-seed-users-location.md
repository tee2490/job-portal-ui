---
name: auth-seed-users-location
description: Login credentials live in DUMMY_USERS inside src/context/AuthContext.jsx, not mockData.js; login matches against DUMMY_USERS + localStorage 'registeredUsers'
metadata:
  type: project
---

Login seed users are the `DUMMY_USERS` const at the top of `src/context/AuthContext.jsx` (employers, jobSeekers, admins), not `src/data/mockData.js`. `login()` searches `[...DUMMY_USERS..., ...JSON.parse(localStorage 'registeredUsers')]` with plain `===` on email/password (no trim/lowercase). `userType` arg from Login.jsx is ignored.

**Why:** Agent instructions point at mockData for seed data; looking there for credentials is a dead end.
**How to apply:** For any "Invalid email or password" report, start at `login()` in AuthContext and `git diff` it — 2026-10-08 the cause was an uncommitted `===` -> `!==` edit on the password compare.
