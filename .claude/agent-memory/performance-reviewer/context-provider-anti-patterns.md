---
name: context-provider-anti-patterns
description: Recurring perf anti-patterns in this project's context providers (unmemoized values, loading flag reused for background refresh, shared auth isLoading gating ProtectedRoute)
metadata:
  type: project
---

Recurring patterns seen across `src/context/` and `src/contexts/` (as of 2026-10-02; check they still hold before citing):

1. All five providers (Auth, JobsData, Job, Companies, Theme) build a fresh `value` object and fresh function identities every render: no useMemo/useCallback. JobProvider calls `useJobsData()`, so any JobsData change re-renders JobProvider and therefore every `useJobs()` consumer (Navbar included).
2. JobsData/Companies contexts set `loading=true` for background refreshes too (5-min interval, forceRefresh). Consumers that gate on `loading` (JobsSection, CompaniesSection) replace the rendered list with a skeleton and then remount it, so there is no stale-while-revalidate.
3. AuthContext uses one global `isLoading` for init, login, register and updateProfile. ProtectedRoute renders a spinner instead of children while it is true, so any protected page that calls `updateProfile` gets unmounted and remounted. This was latent on 2026-10-02 because Profile uses `updateProfileComplete`.
4. Focus/interval refetch already dedupes via `isFetchingRef` and the TTL check. That part is fine; don't flag it.

**Why:** These are cross-cutting causes behind many component-level symptoms. Recognising them avoids re-deriving them in every review.

**How to apply:** When reviewing a component that consumes these contexts, attribute re-render and remount issues to the provider pattern instead of the component, and recommend the fix at the provider level. See [[hot-paths-and-data-scale]].
