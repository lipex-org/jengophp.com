# Shared Data

Shared data is data that is automatically included with every Inertia response, making it accessible to all frontend components without manually passing it from every controller method.

---

## The `HandleInertiaRequests` Middleware Filter

The recommended architectural approach is using the `HandleInertiaRequests` filter (`app/Filters/HandleInertiaRequests.php`), which extends `Jengo\Inertia\Middleware` and overrides the `withShare()` method:

```php
namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use Jengo\Inertia\Middleware;
use function Jengo\Base\Support\arr;

class HandleInertiaRequests extends Middleware
{
    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function withShare(RequestInterface $request): array
    {
        return array_merge(parent::withShare($request), [
            'app_name' => config('App')->appName ?? 'Jengo',
            'auth' => [
                'user' => function_exists('auth') && auth()->user()
                    ? arr(auth()->user())->only(['id', 'username', 'email'])->asNullWhenEmpty()
                    : null,
            ],
            'csrf_token' => csrf_token(),
            'csrf_hash'  => csrf_hash(),
        ]);
    }
}
```

### Registering the Filter

Register the filter alias and attach it to the global `before` and `after` pipelines in `app/Config/Filters.php`:

```php
namespace Config;

use CodeIgniter\Config\BaseConfig;

class Filters extends BaseConfig
{
    public array $aliases = [
        'inertia' => \App\Filters\HandleInertiaRequests::class,
    ];

    public array $globals = [
        'before' => [
            'inertia',
        ],
        'after' => [
            'inertia',
        ],
    ];
}
```

Running `php spark jengo:install inertia` sets this up automatically using AST-safe configuration modification.

---

## Imperative Sharing (`Inertia::share`)

You can also share data dynamically at any point during request execution using `Inertia::share()`:

```php
use Jengo\Inertia\Inertia;

// Share a single key-value pair
Inertia::share('siteName', 'Acme Corp');

// Share multiple props at once
Inertia::share([
    'locale' => session()->get('locale') ?? 'en',
    'theme'  => 'dark',
]);
```

### Accessing Shared Data

To inspect or retrieve shared props on the server:

```php
// Retrieve a specific key with an optional default
$siteName = Inertia::getShared('siteName', 'Default App');

// Retrieve all shared props
$allShared = Inertia::getShared();
```

---

## Automatic System Shared Props

`jengo/inertia` automatically manages and shares two critical system properties on every response:

### 1. Validation Errors (`errors`)

Validation errors from CodeIgniter's validator service or flashdata are automatically formatted and shared:

* If an `X-Inertia-Error-Bag` header is present, errors are scoped under that bag name (e.g. `errors.loginForm.email`).
* If no error bag is specified, errors are placed directly under `errors` (e.g. `errors.email`).

### 2. Session Flash Data (`flash`)

Session flash data stored via `session()->setFlashdata()` is automatically shared under the `flash` key. Internal CodeIgniter session keys (starting with `_ci_`) and validation errors are filtered out automatically.

```php
// In controller:
session()->setFlashdata('status', 'Profile updated successfully!');

// Available in Vue/React frontend:
// page.props.flash.status
```

> [!NOTE]
> Because `errors` and `flash` are managed by the adapter, passing them directly inside `Inertia::render('Page', ['errors' => ...])` will throw an `InvalidArgumentException` to prevent accidental prop collision.

---

## Instant Visits & Shared Keys

Inertia v3 introduces **Instant Visits**, allowing the client to render the target page immediately using cached shared props while fetching new page props in the background.

`jengo/inertia` automatically tracks all shared prop keys registered through `withShare()` or `Inertia::share()`, and communicates them to the client via the `X-Inertia-Shared-Keys` header. No manual configuration is required.
