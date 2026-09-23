# Inertia v3 Features

Jengo fully supports the Inertia v3 protocol, providing advanced control over how data is loaded and synchronized.

## Advanced Prop Types

- **`Inertia::defer()`**: Loads a prop in a subsequent request, preventing it from blocking the initial page load.
- **`Inertia::lazy()`**: Prop that is only resolved when explicitly requested via a partial reload.
- **`Inertia::once()`**: Data that loads once and is reused on subsequent page visits.
- **`Inertia::merge()` / `prepend()`**: Controls how arrays/lists are updated on the client during navigation.
- **`Inertia::always()`**: Ensures a prop is included even during partial reloads.

```php
return Inertia::render('Dashboard', [
    'stats' => Inertia::defer(fn() => $this->getStats()),
    'logs' => Inertia::prepend($this->getRecentLogs()),
    'config' => Inertia::once(fn() => $this->getAppConfig()),
]);
```
