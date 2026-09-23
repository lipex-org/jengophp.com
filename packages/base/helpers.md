# Helpers & Utilities

Jengo provides a powerful global helper `jengo_helper.php`. Ensure it is loaded via `helper('jengo');` (Jengo's `core` setup does this automatically).

## Available Helpers

### `page(string $name, array $data = [])`

A semantic wrapper around CodeIgniter's `view()` function, automatically resolving paths relative to `app/Views/pages/`.

### `str(string $value)`

Returns a chainable `Jengo\Base\Libraries\Str` object for fluent string manipulation. See [Core Libraries](/packages/base/libraries#str-string-manipulation).

### `arr(array $value)`

Returns a chainable `Jengo\Base\Libraries\Arr` object for fluent array manipulation. See [Core Libraries](/packages/base/libraries#arr-array-manipulation).

### `vite_tags()`

Automatically resolves and injects the necessary `<script>`, `<link>`, and `<link rel="modulepreload">` tags for your Vite entrypoints.

### `model_of(string $modelClass)`

Resolves a model via the Jengo `ModelFacade`, ensuring a singleton instance and enabling fluent model access.

### Environment Checks

`isProduction()`, `isDevelopment()`, and `isTesting()` provide quick booleans for environment branching.
