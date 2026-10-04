// Public routes that can contain admissions, student, applicant, or partner data.
// Keep this list explicit and review it whenever adding a new data-entry/search page.
export const ANALYTICS_EXCLUDED_PATHS = [
  "/admin",
  "/gate-internal-skomda",
  "/trial-class",
  "/ppdb",
  "/tefa/request",
  "/program/bkk",
  "/program/digital-talent",
  "/informasi/pengumuman-kelulusan",
];

export function isAnalyticsExcludedPath(pathname: string) {
  return ANALYTICS_EXCLUDED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}
