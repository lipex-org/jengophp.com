# Frontend Usage in CodeIgniter

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
