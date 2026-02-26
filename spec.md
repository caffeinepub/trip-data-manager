# Specification

## Summary
**Goal:** Add a login page with hardcoded credentials to protect the Trip Data Manager app.

**Planned changes:**
- Create a `Login.tsx` component with a centered card containing username and password fields.
- Validate submitted credentials against hardcoded values (username: `vsat`, password: `0558`); show an error message on failure.
- Store authentication state in `sessionStorage` so login persists within the same browser session.
- Update `App.tsx` to conditionally render the login page for unauthenticated users and the full app for authenticated users.
- Provide a logout mechanism to return to the login page.

**User-visible outcome:** Users must log in with the correct credentials before accessing the app. Unauthenticated users see only the login page, while authenticated users see the full trip management interface. Login state persists across page refreshes within the same session but clears when the session ends.
