# Response Modifiers

`jengo/auth` can format its controller responses for different frontends by adjusting `$responseModifier` in `app/Config/Auth.php`:

- **`StandardViewModifier`**: Renders traditional CodeIgniter 4 HTML view templates and standard redirects.
- **`JsonModifier`**: Outputs clean REST API JSON responses (`status`, `message`, `data`, `errors`).
- **`InertiaModifier`**: Renders Inertia.js component responses (`Inertia::render(...)`) for React, Vue, and Svelte SPAs.
