# @jengo/vite

`@jengo/vite` is a Vite plugin designed to eliminate the boilerplate configuration typically required to bridge PHP backends with modern JS build tools.

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

### How it Works
When Vite starts, the `@jengo/vite` plugin executes a hidden CodeIgniter CLI command:

```bash
php spark jengo:vite config
```

This command quickly scans your project, finds all `.entrypoint.*` files, and feeds them back to Vite as the build inputs. 

## Configuration

Your `vite.config.ts` requires almost zero configuration. 

```typescript
import { defineConfig } from 'vite';
import jengo from '@jengo/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        jengo(),   // Handles dynamic entrypoints and manifest generation
        react(),   // Framework specific plugins
    ],
    // No need to define outDir, manifest, or rollupOptions.input!
});
```

The plugin automatically configures:
- `build.outDir`: Set to `public/dist`.
- `build.manifest`: Set to `true` (so CI4 knows how to load assets).
- `publicDir`: Set to `resources/static`.

## Frontend Usage in CodeIgniter

Once Vite is configured, use the `vite_tags()` helper function provided by `jengo/base` in your HTML `<head>`:

```php
<!-- app/Views/layouts/partials/header.layout.partial.php -->
<?php if (function_exists('vite_tags')): ?>
    <?= vite_tags() ?>
<?php endif; ?>
```

The `vite_tags()` helper automatically:
1. Detects if you are in development (`CI_ENVIRONMENT=development`).
2. If in dev mode, injects the Vite HMR client scripts and connects to the Vite Dev Server (using `VITE_DEV_SERVER` from your `.env`).
3. If React entrypoints are detected, injects the React Refresh Preamble automatically.
4. In production mode, parses the `public/dist/.vite/manifest.json` and outputs the compiled, version-hashed CSS and JS `<link>` and `<script>` tags.
