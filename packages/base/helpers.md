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

### `app(?string $abstract = null, array $parameters = [])`

Returns the global PSR-11 `Container` instance when called with no arguments, or resolves the given `$abstract` type:

```php
$container = app();
$userService = app(UserService::class);
```

### `resolve(string $abstract, array $parameters = [])`

Alias for `app($abstract, $parameters)` to resolve a class or interface from the container:

```php
$gateway = resolve(PaymentGatewayInterface::class);
```

### `inject(callable|array|string $target)`

Wraps a route closure, invokable object, or controller callable into a DI-aware route handler:

```php
$routes->get('users/(:num)', inject(function (int $id, UserRepositoryInterface $users) {
    return json($users->find($id));
}));
```

### `sqids_hash(?int $id)` & `sqids_unhash(?string $hash)`

Generates and decodes obfuscated, URL-friendly IDs using Sqids configured via `Config\Jengo::$sqids`:

```php
$hash = sqids_hash(12345); // e.g. "b9bDbvbxbj"
$id = sqids_unhash($hash);  // 12345
```

### `resource_path(?string $path = null)`

Returns the fully qualified path to the application's `resources` directory, optionally appending a subpath normalized with the system directory separator:

```php
// Returns the root resources directory path (e.g. "/path/to/project/resources/")
$baseResources = resource_path();

// Resolves a path within resources
$jsPages = resource_path('js/Pages');       // "/path/to/project/resources/js/Pages"
$css = resource_path('css/app.css');        // "/path/to/project/resources/css/app.css"
```

### `RESOURCEPATH` Constant

`jengo/base` officially introduces and defines the `RESOURCEPATH` constant pointing to the application's `resources/` directory (analogous to CodeIgniter's `APPPATH`, `ROOTPATH`, and `WRITEPATH`):

```php
defined('RESOURCEPATH') || define('RESOURCEPATH', ROOTPATH . 'resources' . DIRECTORY_SEPARATOR);
```


