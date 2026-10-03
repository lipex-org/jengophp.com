# Protecting Routes and Controllers

`jengo/auth` uses a combination of an `auth` filter, declarative PHP 8 attributes (`#[Authenticate]`, `#[Role]`, `#[Can]`, `#[Guest]`, `#[Sudo]`), and authentication guards to protect web, SPA, and API routes.

---

## 1. Using Global Filter with Controller Attributes (Recommended)

This is the recommended approach for modern Jengo applications. By registering the `auth` filter globally, it acts as an attribute scanner on all routes. Routes without attributes or guard arguments remain publicly accessible, avoiding redirect loops on public pages (like login).

### Step 1: Add the global `auth` filter to `app/Config/Filters.php`

```php
// app/Config/Filters.php

public array $globals = [
    'before' => [
        'auth',
    ],
    // ...
];
```

### Step 2: Add attributes to controllers or methods

You can add attributes to the entire controller class or to individual methods:

```php
// app/Controllers/DashboardController.php

namespace App\Controllers;

use Jengo\Auth\Attributes\Authenticate;
use Jengo\Auth\Attributes\Role;
use Jengo\Auth\Attributes\Can;

#[Authenticate] // Protects all methods using the default/universal guard
class DashboardController extends BaseController
{
    public function index()
    {
        return view('dashboard');
    }

    #[Role('admin')] // Requires admin role
    public function settings()
    {
        return view('admin/settings');
    }

    #[Can('reports.export')] // Requires Vima permission
    public function export()
    {
        // Export report
    }
}
```

You can also specify a specific guard in `#[Authenticate]`:

```php
#[Authenticate('token')] // Enforce API token guard
class ApiUserController extends BaseController
{
    // ...
}
```

### Restricting Endpoints to Guests (e.g., Login & Register)

Use `#[Guest]` to redirect already authenticated users:

```php
use Jengo\Auth\Attributes\Guest;

#[Guest]
class LoginController extends BaseController
{
    public function show()
    {
        return view('auth/login');
    }
}
```

---

## 2. Using Route Filters with Explicit Guards

If you prefer configuring protection directly in your route definitions instead of controller attributes, you can attach the `auth` filter with an explicit guard name (e.g. `auth:session`, `auth:token`):

```php
// app/Config/Routes.php

// Protect a single web route with session guard
$routes->get('dashboard', 'DashboardController::index', ['filter' => 'auth:session']);

// Protect an API group with token guard
$routes->group('api/v1', ['filter' => 'auth:token'], static function ($routes) {
    $routes->get('profile', 'Api\ProfileController::show');
    $routes->post('orders', 'Api\OrderController::create');
});
```

---

## How It Works

1. When `auth` is executed, it first inspects the targeted controller and method for PHP 8 attributes (`#[Guest]`, `#[Authenticate]`, `#[Role]`, `#[Can]`, `#[Sudo]`). If attributes are found, they are evaluated immediately.
2. If no controller attributes match and an explicit guard argument was provided (e.g., `['filter' => 'auth:session']`), `AuthFilter` evaluates that guard.
3. If no guard argument was provided and no attributes were defined, the request proceeds through without blocking. This allows the global filter to run cleanly across public and private routes alike.
