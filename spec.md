# Specification

## Summary
**Goal:** Add a status breakdown (Pending, Completed, Cancelled trip counts) to the Dashboard stats and to the Reports view (Daily and Date Range reports).

**Planned changes:**
- Update `useDashboardStats` hook to compute Pending, Completed, and Cancelled trip counts from the currently filtered trip data.
- Add three additional stat cards (Pending Trips, Completed Trips, Cancelled Trips) to the Dashboard view, respecting the active daily/monthly filter.
- Update `DailyReport` component to display Pending, Completed, and Cancelled counts in the summary section after a report is generated.
- Update `DateRangeReport` component to display Pending, Completed, and Cancelled counts in the summary section after a report is generated.
- Status breakdown counts in all views are derived from the same filtered trip records used by existing stats.

**User-visible outcome:** Users can see how many trips are Pending, Completed, and Cancelled — both on the Dashboard (respecting the active filter) and in generated Daily/Date Range reports alongside the existing summary stats.
