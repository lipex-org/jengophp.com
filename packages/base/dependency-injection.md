# Dependency Injection (DI)

Jengo introduces a lightweight, zero-overhead, PSR-11 compliant **Dependency Injection Container** directly built into `jengo/base`.

It bridges CodeIgniter 4's service-locator architecture with modern, typehinted Inversion of Control (IoC), enabling:
- Recursive constructor auto-wiring across classes and services.
- Seamless action method injection on controllers and commands.
- Modern route closures with typehinted dependency resolution via `inject()`.
- Unified lifecycle booting across both Web (`pre_system`) and CLI (`pre_command`) via the `init` event.
- Automated system-wide enablement via `php spark jengo:install di`.

---

## Quick Start

### 1. Enable Dependency Injection
Run the automated installer to enhance your `BaseController` and scan your routes:

```bash
php spark jengo:install di
```

This automatically attaches the `HasContainer` trait to your `App\Controllers\BaseController` and verifies route files.

---

## Defining Container Bindings

Register your interface-to-implementation bindings in `app/Config/Events.php` on the unified `init` event:

```php
use App\Contracts\UserRepositoryInterface;
use App\Repositories\DatabaseUserRepository;
use CodeIgniter\Events\Events;

Events::on('init', static function (): void {
    // Singleton binding (shared instance across requests/commands)
    app()->singleton(UserRepositoryInterface::class, DatabaseUserRepository::class);

    // Standard binding (fresh instance per resolution)
    app()->bind(PaymentGatewayInterface::class, StripePaymentGateway::class);

    // Instance binding
    app()->instance('app.version', '2.0.0');
});
```

### Declarative Binding with `#[Bind]` Attribute

Instead of registering bindings manually in event listeners, you can annotate concrete implementations using the `#[Bind]` attribute:

```php
namespace App\Repositories;

use App\Contracts\UserRepositoryInterface;
use Jengo\Base\Attributes\Bind;

#[Bind(UserRepositoryInterface::class, singleton: true)]
class InMemoryUserRepository implements UserRepositoryInterface
{
    // ...
}
```

Bindings annotated with `#[Bind]` are compiled and cached in `.jengo/cache/bindings.php` for production opcache performance without reflection overhead.

---

## Dependency Injection Patterns

### Pattern 1: Controller Method Injection (Recommended)

Controllers using the `HasContainer` trait (or extending `BaseController`) automatically resolve method dependencies alongside route URI parameters.

```php
namespace App\Controllers;

use App\Contracts\UserRepositoryInterface;
use App\Services\NotificationService;
use CodeIgniter\HTTP\ResponseInterface;
use Jengo\Base\Container\Traits\HasContainer;
use Jengo\Base\Validation\ValidatedData;

class UserController extends BaseController
{
    use HasContainer;

    /**
     * $id is matched from the route segment (:num) in sequential order.
     * $users is auto-wired from UserRepositoryInterface binding in Container.
     * $notifications is auto-wired from NotificationService class in Container.
     */
    public function show(int $id, UserRepositoryInterface $users, NotificationService $notifications): ResponseInterface
    {
        $user = $users->find($id);

        if ($user === null) {
            return response()->setStatusCode(404)->setJSON(['error' => 'User not found']);
        }

        $notifications->sendWelcome($user['name']);

        return response()->setJSON(['user' => $user]);
    }
}
```

In `app/Config/Routes.php`:
```php
$routes->get('users/(:num)', 'UserController::show/$1');
```

---

### Pattern 2: Route Closures with `inject()`

For micro-routes or lightweight API endpoints, wrap your closure in `inject()` to enable full dependency injection:

```php
use App\Contracts\UserRepositoryInterface;
use App\Services\BillingService;

$routes->get('api/users/(:num)/bill', inject(function (int $userId, UserRepositoryInterface $users, BillingService $billing) {
    $user = $users->find($userId);
    return response()->setJSON($billing->chargeUser($user));
}));
```

---

### Pattern 3: Controller Constructor Injection

If your controller defines constructor dependencies, route it using array syntax wrapped in `inject()`:

```php
namespace App\Controllers;

use App\Contracts\UserRepositoryInterface;
use App\Services\NotificationService;
use CodeIgniter\HTTP\ResponseInterface;

class OrderController
{
    public function __construct(
        protected UserRepositoryInterface $users,
        protected NotificationService $notifications
    ) {}

    public function checkout(int $userId, string $item): ResponseInterface
    {
        $user = $this->users->find($userId);
        return response()->setJSON(['order' => ['user' => $user['name'], 'item' => $item]]);
    }
}
```

In `app/Config/Routes.php`:
```php
$routes->post('api/orders/(:num)/(:segment)', inject([OrderController::class, 'checkout']));
```

---

### Pattern 4: Form Request Validation with `ValidatedData`

When using Jengo's `#[Validate]` attribute with a `FormHandler`, the validated payload is automatically injected into the controller action as a `ValidatedData` instance:

```php
namespace App\Controllers;

use App\Contracts\UserRepositoryInterface;
use App\Validation\UserUpdateFormHandler;
use CodeIgniter\HTTP\ResponseInterface;
use Jengo\Base\Attributes\Validate;
use Jengo\Base\Container\Traits\HasContainer;
use Jengo\Base\Validation\ValidatedData;

class UserController extends BaseController
{
    use HasContainer;

    #[Validate(UserUpdateFormHandler::class)]
    public function update(int $id, UserRepositoryInterface $users, ValidatedData $data): ResponseInterface
    {
        $payload = $data->toArray();
        $users->save($id, $payload);

        return response()->setJSON([
            'status' => 'updated',
            'user'   => $users->find($id),
        ]);
    }
}
```

---

## Global Helpers

Jengo provides intuitive helper functions accessible anywhere in your application:

| Helper | Description |
|---|---|
| `app()` | Returns the singleton `Container` instance. |
| `app(string $abstract, array $parameters = [])` | Resolves the given type from the container. |
| `resolve(string $abstract, array $parameters = [])` | Alias for `app($abstract, $parameters)`. |
| `inject(callable\|array\|string $target)` | Wraps a closure or controller callable into a DI-aware route handler. |

---

## The Unified `init` Event

CodeIgniter 4 triggers `pre_system` only during HTTP web requests, and `pre_command` during Spark CLI execution.

Jengo unifies application bootstrapping by firing the **`init`** event across both environments:

```php
use CodeIgniter\Events\Events;

Events::on('init', static function (): void {
    // Executes once per process lifecycle on both Web and Spark CLI!
    app()->singleton(MyServiceInterface::class, MyService::class);
});
```

---

## PSR-11 Compatibility

The Jengo Container implements `Psr\Container\ContainerInterface`:

```php
$container = app();

if ($container->has(UserRepositoryInterface::class)) {
    $repository = $container->get(UserRepositoryInterface::class);
}
```
