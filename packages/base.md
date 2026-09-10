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

---

## Data Mappings

`jengo/base` includes a high-performance, bidirectional data mapping engine (`Jengo\Base\Mapping\Mapper`). It enables seamless mapping between arrays, third-party CodeIgniter 4 entities, generic objects/DTOs, and Jengo entities.

### The Problem It Solves

Third-party CodeIgniter 4 packages (such as CodeIgniter Shield, Myth:Auth, or custom vendor packages) frequently provide their own `Entity` classes extending `CodeIgniter\Entity\Entity`. Because PHP does not support multiple inheritance, application entities cannot extend both the third-party entity and `Jengo\Base\Entities\BaseEntity`.

With the mapping system, you can define a domain entity extending `BaseEntity` (with Sqids ID obfuscation, `$hidden`, `$visible`, and custom casting), and map the third-party entity or raw array into it with zero friction.

### Core Usage

#### Direct Entity Mapping

Any entity extending `BaseEntity` (or using `MappableTrait`) supports static hydration and collection mapping:

```php
use App\Entities\AppUser;

// 1. Map from a 3rd-party CI4 Entity (e.g. Shield User)
$shieldUser = $shieldUserModel->find(1);
$appUser = AppUser::from($shieldUser);

// 2. Map from an associative array
$appUser = AppUser::from($request->getPost());

// 3. Batch map a collection
$shieldUsers = $shieldUserModel->findAll();
$appUsers = AppUser::collect($shieldUsers);
```

#### Central Mapper Engine

The `Mapper` facade provides decoupled mapping and fluent configuration:

```php
use Jengo\Base\Mapping\Mapper;

// Standard direct mapping
$appUser = Mapper::map($shieldUser, AppUser::class);

// Map into an existing entity instance
Mapper::from($requestData)->into($existingUser);

// Fluent configuration chain
$appUser = Mapper::from($shieldUser)
    ->with(['tenant_id' => $tenantId])
    ->only(['id', 'username', 'email', 'tenant_id'])
    ->except(['password_hash'])
    ->pristine(true)
    ->to(AppUser::class);

// Batch collections
$appUsers = Mapper::collect($shieldUsers, AppUser::class);
```

---

### Bi-Directional Synchronization

The mapping engine tracks mapping context and field origin, allowing modified domain entities to sync back to the original source or reconstruct the original entity class.

#### Syncing Back to the Source Instance

```php
$shieldUser = $shieldUserModel->find(1);
$appUser = AppUser::from($shieldUser);

// Modify application state
$appUser->email = 'updated@example.com';
$appUser->name = 'Jane Doe';

// Sync modified values back into the original $shieldUser instance
$appUser->syncTo($shieldUser);

// Save through the 3rd-party repository or model
$shieldUserModel->save($shieldUser);
```

When no argument is passed to `syncTo()`, the entity automatically updates the captured origin instance:

```php
$appUser->name = 'Jane Doe';
$appUser->syncTo(); // Automatically syncs to the captured $shieldUser
$shieldUserModel->save($shieldUser);
```

To sync only attributes that were actually modified, pass `onlyChanged: true`:

```php
$appUser->syncTo($shieldUser, onlyChanged: true);
```

#### Reconstructing the Original Entity (`toOriginal`)

```php
// Reconstruct the 3rd-party entity with reversed mappings
$shieldUser = $appUser->toOriginal();
$shieldUserModel->save($shieldUser);

// When mapped from an array, toOriginal() exports back to an array
$data = ['user_id' => 5, 'user_name' => 'alex'];
$user = AppUser::from($data);
$user->name = 'alex_updated';

$originalArray = $user->toOriginal();
// ['user_id' => 5, 'user_name' => 'alex_updated']
```

---

### PHP 8 Mapping Attributes

Declare column renaming, exclusions, custom transformations, and nested relationships directly on entity classes:

```php
namespace App\Entities;

use Jengo\Base\Entities\BaseEntity;
use Jengo\Base\Attributes\Mapping\MapFrom;
use Jengo\Base\Attributes\Mapping\MapTo;
use Jengo\Base\Attributes\Mapping\MapIgnore;
use Jengo\Base\Attributes\Mapping\MapCast;
use Jengo\Base\Attributes\Mapping\MapWith;

class AppUser extends BaseEntity
{
    #[MapFrom('user_id')]
    #[MapTo('user_id')]
    public ?int $id = null;

    #[MapFrom('user_email')]
    #[MapTo('user_email')]
    public ?string $email = null;

    #[MapWith(PhoneTransformer::class)]
    public ?string $phone = null;

    #[MapIgnore]
    public ?string $internalCache = null;

    #[MapCast(AddressEntity::class)]
    public ?AddressEntity $address = null;

    #[MapCast(RoleEntity::class, isCollection: true)]
    public array $roles = [];
}
```

#### Class-Level Dynamic Attribute Mapping

For CodeIgniter 4 entities that rely on dynamic `$attributes` without declared PHP properties, use class-level attributes:

```php
namespace App\Entities;

use Jengo\Base\Entities\BaseEntity;
use Jengo\Base\Attributes\Mapping\MapProperty;
use Jengo\Base\Attributes\Mapping\MapSource;

#[MapSource(\CodeIgniter\Shield\Entities\User::class)]
#[MapProperty(target: 'email', source: 'user_email')]
#[MapProperty(target: 'status', source: 'is_active')]
class AppUser extends BaseEntity
{
}
```

#### Attribute Reference

| Attribute | Target | Description |
| :--- | :--- | :--- |
| `#[MapFrom('column')]` | Property / Method | Reads value from the specified source column or key. |
| `#[MapTo('column')]` | Property / Method | Sets destination key during reverse sync or export. |
| `#[MapProperty(target, source)]` | Class | Maps source key to target attribute for dynamic entity attributes. |
| `#[MapIgnore]` | Property | Excludes property from mapping (`both`, `to_target`, or `to_source`). |
| `#[MapCast(Target::class)]` | Property | Hydrates nested child entity or collection (`isCollection: true`). |
| `#[MapWith(Transformer::class)]` | Property | Applies custom `ValueTransformerInterface` for forward and reverse transforms. |
| `#[MapSource(Source::class)]` | Class | Sets the default paired origin class for `toOriginal()`. |

---

### Custom Transformers

Implement `Jengo\Base\Mapping\Contracts\ValueTransformerInterface` to provide custom bidirectional transformations:

```php
namespace App\Transformers;

use Jengo\Base\Mapping\Contracts\ValueTransformerInterface;

class JsonArrayTransformer implements ValueTransformerInterface
{
    public function transform(mixed $value, string $sourceKey, object|array $source): mixed
    {
        return is_string($value) ? json_decode($value, true) : (array) $value;
    }

    public function reverse(mixed $value, string $targetKey, object|array $target): mixed
    {
        return json_encode($value);
    }
}
```

---

### Performance Architecture

The mapping system is engineered for fast-run batch processing:
- **Static Reflection Caching**: Property mappings, attributes, and transformers are evaluated once per class lifecycle and cached in static memory. Subsequent hydrations execute in O(1) time without reflection overhead.
- **Direct Entity Extraction**: For CodeIgniter 4 entities, raw data is read directly via `$source->toRawArray()`, avoiding unnecessary getter loops.
- **Single-Pass Collection Hydration**: Efficiently maps thousands of records with minimal memory allocations.

