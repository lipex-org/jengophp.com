# @jengo/vite

`@jengo/vite` is a Vite plugin designed to eliminate the boilerplate configuration typically required to bridge PHP backends with modern JS build tools.

---

## What's Inside

| Section | Description |
| :--- | :--- |
| [The Magic: Dynamic Entrypoints](#the-magic-dynamic-entrypoints) | The Entrypoint Convention that removes manual input lists. |
| [How it Works](./how-it-works) | The hidden Spark command powering entrypoint discovery. |
| [Configuration](./configuration) | The near-zero `vite.config.ts` setup. |
| [Frontend Usage in CodeIgniter](./frontend-usage) | The `vite_tags()` helper. |

---

## The Magic: Dynamic Entrypoints

In a traditional Vite setup, you must manually list every entry file (CSS, JS, TS) in your `vite.config.ts` under `build.rollupOptions.input`. In large applications, this becomes a maintenance burden.

`@jengo/vite` solves this via the **Entrypoint Convention**.

### Naming Convention

Any file in your `app/` or `resources/` directories that includes `.entrypoint.` in its filename will automatically be discovered and compiled by Vite.

Supported extensions: `.ts`, `.js`, `.css`, `.scss`, `.vue`, `.svelte`, `.tsx`, `.jsx`.

**Examples:**

- `resources/js/app.entrypoint.tsx` (React SPA entry)
- `resources/css/tailwind.entrypoint.css` (Main stylesheet)
- `app/Modules/Admin/assets/admin.entrypoint.js` (Modular asset)
