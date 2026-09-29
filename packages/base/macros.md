# Macros & Extensibility

Jengo provides an integrated macro system across the ecosystem, allowing you to dynamically extend classes (such as entities, response adapters, or services) at runtime without inheritance or monkey patching.

---

## 1. Dynamic Macros (`MacroableTrait`)

Any class utilizing `Jengo\Base\Traits\MacroableTrait` (including `Jengo\Base\Entities\BaseEntity`) supports runtime method injection, static macros, and mixins.

### Defining Instance & Static Macros

You can define dynamic instance macros (where `$this` is bound to the object instance) or static macros:

```php
<?php

use App\Entities\User;

// Define an instance macro
User::macro('hasCompletedOnboarding', function () {
    /** @var User $this */
    return (bool) $this->is_active && !empty($this->organization_id);
});

// Define a static macro
User::macro('systemUser', function () {
    return new User(['id' => 1, 'username' => 'system']);
});
```

### Invoking Macros

Dynamic macros are called just like standard methods:

```php
$user = model('UserModel')->find(105);

if ($user->hasCompletedOnboarding()) {
    // Perform onboarding actions
}

$system = User::systemUser();
```

---

## 2. Macro Mixin Classes

For clean organization, you can bundle multiple related macros into dedicated mixin classes. Any public method in a mixin class returning a `\Closure` will be registered as a macro.

### Creating a Mixin

You can scaffold a new mixin class using the `jengo:make` generator:

```bash
php spark jengo:make macro UserMacros --target="App\Entities\User"
```

This generates `app/Macros/UserMacros.php`:

```php
<?php

declare(strict_types=1);

namespace App\Macros;

use App\Entities\User;

/**
 * Macro mixin for App\Entities\User.
 */
class UserMacros
{
    /**
     * Determine if the user has an active paid subscription.
     */
    public function isSubscribed(): \Closure
    {
        return function () {
            /** @var User $this */
            return $this->subscription_status === 'active';
        };
    }

    /**
     * Get the user initials.
     */
    public function initials(): \Closure
    {
        return function () {
            /** @var User $this */
            return strtoupper(substr($this->first_name, 0, 1) . substr($this->last_name, 0, 1));
        };
    }
}
```

### Registering Mixins

Register all methods defined in the mixin using the `mixin()` method:

```php
use App\Entities\User;
use App\Macros\UserMacros;

User::mixin(new UserMacros());
```

---

## 3. Macro Discovery (`app/Config/Macros.php`)

To keep your macros organized without polluting service providers or controllers, Jengo includes an automated Macro Discovery engine.

### Application Macros (`app/Config/Macros.php`)

By default, Jengo always discovers and registers macros defined in `app/Config/Macros.php` during application boot (both `pre_system` web requests and `pre_command` CLI runs).

You can define procedural macro registrations:

```php
<?php

use App\Entities\User;
use App\Macros\UserMacros;

User::mixin(new UserMacros());

User::macro('formattedBalance', function () {
    /** @var User $this */
    return '$' . number_format($this->balance / 100, 2);
});
```

Or implement a dedicated configuration class:

```php
<?php

namespace Config;

use App\Entities\User;
use App\Macros\UserMacros;
use CodeIgniter\Config\BaseConfig;

class Macros extends BaseConfig
{
    /**
     * Register application-level macros and mixins.
     */
    public function register(): void
    {
        User::mixin(new UserMacros());
    }
}
```

---

## 4. Module & Package Macro Discovery

Jengo respects CodeIgniter 4's `Config\Modules::$aliases` configuration. When `'macros'` discovery is enabled via `Config\Modules::shouldDiscover('macros')`, Jengo uses CodeIgniter's `FileLocator` to discover and register `Config/Macros.php` across all active modules (`modules/*/Config/Macros.php`) and Composer packages.

### Module Configuration (`app/Config/Modules.php`)

Jengo automatically registers `'macros'` into `$aliases` by default via its Config Registrar. You can customize discovery in `app/Config/Modules.php`:

```php
namespace Config;

use CodeIgniter\Config\Modules as BaseModules;

class Modules extends BaseModules
{
    /**
     * Array of module aliases to auto-discover.
     */
    public $aliases = [
        'events',
        'filters',
        'registrars',
        'routes',
        'services',
        'macros',
    ];
}
```

> [!NOTE]
> If `'macros'` is removed from `$aliases` or module discovery is disabled (`$enabled = false`), only `app/Config/Macros.php` in your application root will be loaded. Module and package macros will not be discovered.
