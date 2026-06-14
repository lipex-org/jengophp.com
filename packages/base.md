# jengo/base

`jengo/base` is the foundational package of the Jengo ecosystem. It provides the essential CLI tooling, architectural blueprints, and runtime utilities required to accelerate CodeIgniter 4 development.

## Core Architecture

When you bootstrap a Jengo application, `jengo/base` establishes a robust UI and backend architecture known as the **Blueprint**.

### The Blueprint UI
The Blueprint is a Tailwind-styled, responsive layout system that serves as the starting point for your application.
- `app/Views/layouts/base.layout.php`: The HTML skeleton containing the `<head>`, meta tags, fonts, and base structure.
- `app/Views/layouts/app.layout.php`: The main application shell extending `base`, featuring a responsive navigation bar and a standard content area.
- `app/Views/layouts/partials/`: Contains modular fragments like `header.layout.partial.php` (for Vite tag injection) and footers.

### Helpers & Utilities

Jengo provides a powerful global helper `jengo_helper.php`. Ensure it is loaded via `helper('jengo');` (Jengo's `core` setup does this automatically).
- **`page(string $name, array $data = [])`**: A semantic wrapper around CodeIgniter's `view()` function, automatically resolving paths relative to `app/Views/pages/`.
- **`str(string $value)`**: Returns a chainable `Jengo\Base\Libraries\Str` object for fluent string manipulation.
- **`arr(array $value)`**: Returns a chainable `Jengo\Base\Libraries\Arr` object for fluent array manipulation.
- **`vite_tags()`**: Automatically resolves and injects the necessary `<script>`, `<link>`, and `<link rel="modulepreload">` tags for your Vite entrypoints.
- **`model_of(string $modelClass)`**: Resolves a model via the Jengo `ModelFacade`, ensuring a singleton instance and enabling fluent model access.
- **Environment Checks**: `isProduction()`, `isDevelopment()`, and `isTesting()` provide quick booleans for environment branching.

## Command Variant Architecture

Jengo introduces a highly extensible **Command Variant** architecture to CodeIgniter 4. This system moves away from flat, bloated CLI lists in favor of organized, "Master/Variant" command structures.

### How it Works
Instead of registering dozens of individual commands (like `jengo:make-action`, `jengo:make-page`, etc.), Jengo uses a single **Master Command** (e.g., `jengo:make`) that acts as a dynamic router.

When you run a command like `php spark jengo:make page`, the Master command:
1. Detects the first argument (`page`).
2. Scans the registered namespaces for a matching **Variant class** (e.g., `PageVariant`).
3. Executes the variant's logic seamlessly.

### Benefits
- **Clean CLI**: Running `php spark list` only shows the high-level Master commands, keeping the interface focused and professional.
- **Dynamic Help**: Master commands automatically generate their help screens by discovering available variants and their specific arguments/options.
- **Infinite Extensibility**: You can add your own variants without modifying the Jengo core.

### Extending with Custom Variants
To add a new variant to a Master command, simply create a class in your `App` namespace that implements `Jengo\Base\Commands\Contracts\CommandVariantInterface` (or extends `AbstractVariant`).

For example, to add `php spark jengo:make component`:
1. Create `app/Commands/Variants/Make/ComponentVariant.php`.
2. Implement the `name()`, `description()`, and `run()` methods.
3. Jengo will automatically pick it up and list it under `jengo:make`!

---

## Resource Generators
Generate clean, boilerplate-ready architecture components:
- `php spark jengo:make action {name}`: Generates a single-action class.
- `php spark jengo:make event {name}`: Generates a strongly typed event and optional listener.
- `php spark jengo:make layout {name}`: Generates a new UI layout file.
- `php spark jengo:make page {name}`: Generates a new view page with layout extension.
- `php spark jengo:make repo {name}`: Generates a Repository class for a model.

### Operations & Diagnostics
- **The Auditor** (`php spark jengo:audit`): Scans your project for security misconfigurations.
- **The Observer** (`php spark jengo:tail log`): Streams CodeIgniter log files in real-time with color-coding and search filters.
- **The Guardian** (`php spark jengo:health`): Diagnoses application health and configuration status.
- **Vite Integration** (`php spark jengo:vite config`): Returns the dynamic entrypoint configuration as JSON for the Vite plugin.

## Core Libraries

### `Str` (String Manipulation)
A powerful, chainable library for string operations.
```php
str('  jengo_powerhouse  ')->squish()->headline(); // "Jengo Powerhouse"
str('orders/123')->is('orders/*'); // true
Str::random(32); // Secure random string
```

### `Arr` (Array Manipulation)
Fluent, functional array manipulation.
```php
arr([1, 2, 3])->map(fn($v) => $v * 2)->toArray(); // [2, 4, 6]
```

### `PackageManager`
An agnostic wrapper for Composer and Node-based package managers (`npm`, `pnpm`, `yarn`), handling syntax differences automatically.


## Declarative APIs

Jengo introduces PHP 8 Attributes to CodeIgniter controllers to dramatically simplify API development.

### `#[API]` Attribute
Apply the `Jengo\Base\Attributes\API` attribute to any controller class or specific method. Jengo will automatically intercept the response, force a `application/json` content type, and wrap your returned data in a standardized Jengo JSON envelope (`status`, `message`, `data`/`errors`).

```php
namespace App\Controllers;

use Jengo\Base\Attributes\API;

#[API]
class UserController extends BaseController
{
    public function show($id)
    {
        // Automatically wrapped in { "status": "success", "data": { ... } }
        return [
            'id' => $id,
            'name' => 'Jengo Developer'
        ];
    }
}
```

## System Integrations (The Setup Hub)

The `jengo:setup` command allows you to progressively enhance your application:
- `php spark jengo:setup core`: Installs Jengo helpers into the CI4 autoloader.
- `php spark jengo:setup auth`: Installs **The Gatekeeper** (CodeIgniter Shield with Jengo UI/Inertia stubs).
- `php spark jengo:setup api`: Installs **The Vault** (JWT support and base API controllers).
