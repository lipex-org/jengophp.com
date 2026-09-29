# Resource Generators (`jengo:make`)

The `jengo:make` master command scaffolds standardized architecture components for your CodeIgniter 4 application.

```bash
php spark jengo:make <variant> [arguments] [options]
```

---

## Available Generators

### 1. Action (`jengo:make action`)
Generates a single-action class in `app/Actions/`:
```bash
php spark jengo:make action ProcessPayment
```
Generated signature:
```php
namespace App\Actions;

class ProcessPayment
{
    public function execute(...$params)
    {
        // Action domain logic
    }
}
```

### 2. Form Handler (`jengo:make form`)
Generates a dedicated `FormHandler` in `app/Forms/`:
```bash
php spark jengo:make form UserRegistration
```
Generated class extending `Jengo\Base\Forms\FormHandler` with validation rules, sanitization hooks, and success callbacks.

### 3. Repository (`jengo:make repo`)
Generates a data repository in `app/Repositories/`:
```bash
php spark jengo:make repo OrderRepository
```

### 4. Page View (`jengo:make page`)
Generates a Blade-like layout-extended page view in `app/Views/pages/`:
```bash
php spark jengo:make page users/profile --layout=app
```
Options:
- `--layout=<name>`: Specifies the layout to extend (defaults to `app`).
- `--verbose`: Includes detailed comment blocks for available section slots (`header`, `footer`, `content`).

### 5. Event & Listener (`jengo:make event`)
Generates an event payload and corresponding listener class in `app/Events/`:
```bash
php spark jengo:make event UserRegistered
```

### 6. Layout Shell (`jengo:make layout`)
Generates a layout template in `app/Views/layouts/`:
```bash
php spark jengo:make layout admin
```

### 7. Macro Mixin (`jengo:make macro`)
Generates a Macro mixin class in `app/Macros/` for dynamic class extension:
```bash
php spark jengo:make macro UserMacros --target="App\Entities\User"
```
Options:
- `--target=<class>`: Target entity or class being extended (defaults to `BaseEntity`).
- `--force`: Overwrite existing file.

### 8. Module (`jengo:make module`)
Scaffolds a complete standalone modular domain package with `Config/`, `Controllers/`, `Models/`, and `Views/` directories:
```bash
php spark jengo:make module Billing
```
