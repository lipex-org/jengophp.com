# jengo/auth

> **Status:** In Active Development &bull; Pre-Release

`jengo/auth` is a unified authentication and authorization engine for **CodeIgniter 4** and the **Jengo Framework**, powered by **Vima**.

---

## Key Capabilities

- **Universal Guard**: Intelligently auto-detects Bearer tokens for API requests and seamlessly falls back to session cookies and remember-me tokens for web applications.
- **Pluggable Response Modifiers**: Switch between traditional CodeIgniter 4 HTML views, REST API JSON envelopes, and Inertia.js SPA responses via configuration.
- **Vima Authorization Engine**: Advanced Role-Based Access Control (RBAC) with role hierarchies, Attribute-Based Access Control (ABAC) policies, direct grants, explicit denies, and TypeScript map generation.
- **Declarative PHP 8 Security Attributes**: Guard controllers and specific methods cleanly using `#[Authenticate]`, `#[Can]`, `#[Role]`, and `#[Guest]`.
- **Smart Throttling & Brute-Force Protection**: Multi-signal rate limiter that evaluates IP and identity to prevent brute-force attacks without penalizing shared corporate networks.
- **Post-Auth Actions Pipeline**: Modular multi-step verification pipeline supporting Email 2FA, Email Activation, and custom flows.
- **Personal Access Tokens (PAT)**: Issue, inspect, and revoke scoped API tokens for mobile clients, third-party integrations, and background services.
- **Passwordless Magic Links & Self-Service Resets**: Built-in time-limited secure magic link logins and password recovery workflows.
- **CodeIgniter Shield Migration**: Seamlessly import users, credentials, and password hashes from existing CodeIgniter Shield installations with a single command.

---

## Installation

Install the package via Composer:

```bash
composer require jengo/auth
```

Run the interactive setup command:

```bash
php spark jengo:auth setup
```

Execute database migrations:

```bash
php spark migrate
```

The setup command publishes `app/Config/Auth.php`, `app/Config/Vima.php`, `app/Libraries/Vima/Setup.php`, and registers standard authentication routes in `app/Config/Routes.php`.

---

## Route Publishing

Configure and publish authentication routes in `app/Config/Routes.php`:

### Standard Publishing

```php
// app/Config/Routes.php
service('auth')->routes($routes);
```

### Customized Paths & Prefixes

```php
service('auth')->routes($routes, [
    'prefix'       => 'auth',
    'paths'        => [
        'login'    => 'sign-in',
        'logout'   => 'sign-out',
        'register' => 'join',
    ],
    'logoutMethod' => 'post', // 'post' (default) or 'get'
]);
```

### Selective Flow Registration

```php
// Register only specific flows
service('auth')->routes($routes, [
    'only' => ['login', 'register', 'password-reset'],
]);

// Or exclude specific flows
service('auth')->routes($routes, [
    'except' => ['magic-link', 'tokens'],
]);
```

### Controller Overrides & Named Prefixes

```php
service('auth')->routes($routes, [
    'as'          => 'admin.', // Generates admin.login, admin.register, etc.
    'controllers' => [
        'login' => \App\Controllers\AdminLoginController::class,
    ],
]);
```

---

## Quick Start

### 1. Authentication State

```php
// Check if current visitor is authenticated
if (auth()->check()) {
    $user   = auth()->user(); // Jengo\Auth\Entities\User
    $userId = auth()->id();
}

// Check if visitor is a guest
if (auth()->guest()) {
    return redirect()->to('/login');
}
```

### 2. Attempting Logins

```php
$credentials = [
    'email'    => $this->request->getPost('email'),
    'password' => $this->request->getPost('password'),
];

$result = auth()->attempt($credentials, remember: true);

if ($result->isSuccessful()) {
    return redirect()->to('/dashboard');
}

return redirect()->back()->with('error', $result->getMessage());
```

### 3. Personal Access Tokens

Issue scoped tokens for API or mobile clients:

```php
$user = auth()->user();

// Create token with specific abilities/scopes
$token = auth()->createTokenFor($user, 'mobile-app', ['posts.read', 'posts.create']);

// Plaintext token is only displayed once
echo $token->plainTextToken;
```

---

## Authorization with Vima

`jengo/auth` integrates the Vima authorization framework for enterprise permission handling.

### Defining Roles and Permissions

Edit `app/Libraries/Vima/Setup.php`:

```php
namespace App\Libraries\Vima;

use Vima\Core\Config\Contracts\SetupProviderInterface;
use Vima\Core\Role\Entities\Role;
use Vima\Core\Permission\Entities\Permission;

class Setup implements SetupProviderInterface
{
    public function get(): array
    {
        return [
            'permissions' => [
                Permission::define('posts.create', 'Create new blog posts'),
                Permission::define('posts.edit', 'Edit existing blog posts'),
                Permission::define('posts.publish', 'Publish drafts live'),
                Permission::define('users.manage', 'Manage team members'),
            ],
            'roles' => [
                Role::define('editor', 'Content Editor')
                    ->withPermissions(['posts.create', 'posts.edit']),
                Role::define('admin', 'Administrator')
                    ->inherits(['editor'])
                    ->withPermissions(['posts.publish', 'users.manage']),
            ],
        ];
    }
}
```

### Synchronizing to Database

Sync definitions into your database:

```bash
php spark vima:sync
```

### Generating TypeScript Mappings

Generate type-safe PHP mappers and TypeScript mapping interfaces for your frontend (React, Vue, Inertia):

```bash
php spark vima:maps:generate --ts
```

This scaffolds PHP classes in `app/Mappers/Vima/` and TypeScript definitions in `resources/js/vima/`.

### Checking Permissions & Policies

```php
// Check permission via global helper
if (can('posts.publish')) {
    // Current user can publish posts
}

// Check with entity context (ABAC Policy)
if (can('posts.edit', $post)) {
    // Current user can edit this specific post instance
}
```

### Fluent Grants and Explicit Denies

Explicit denies strictly override any role-level grant:

```php
$user = auth()->user();

// Grant role or direct permission
auth()->user($user)->grant()->role('editor');
auth()->user($user)->grant()->permission('reports.view');

// Explicitly deny permission (overrides role grant)
auth()->user($user)->deny()->permission('posts.publish', 'Account suspended by admin');
```

---

## Declarative PHP 8 Attributes

Protect controllers and actions declaratively without writing manual filters:

```php
namespace App\Controllers;

use Jengo\Auth\Attributes\Authenticate;
use Jengo\Auth\Attributes\Can;
use Jengo\Auth\Attributes\Role;
use Jengo\Auth\Attributes\Guest;

#[Authenticate]
class ArticleController extends BaseController
{
    #[Can('posts.create')]
    public function new()
    {
        return view('articles/create');
    }

    #[Role('admin')]
    public function destroy(int $id)
    {
        // Only users with the 'admin' role can delete
    }
}
```

To restrict an endpoint to guests only (e.g., login or registration page):

```php
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

## Response Modifiers

`jengo/auth` can format its controller responses for different frontends by adjusting `$responseModifier` in `app/Config/Auth.php`:

- **`StandardViewModifier`**: Renders traditional CodeIgniter 4 HTML view templates and standard redirects.
- **`JsonModifier`**: Outputs clean REST API JSON responses (`status`, `message`, `data`, `errors`).
- **`InertiaModifier`**: Renders Inertia.js component responses (`Inertia::render(...)`) for React, Vue, and Svelte SPAs.

---

## Custom Notification Senders & Queues

Swap the default mailer with an asynchronous background queue or third-party service by implementing `Jengo\Auth\Contracts\NotificationSenderInterface`:

```php
namespace App\Notifications;

use Jengo\Auth\Contracts\NotificationSenderInterface;
use Jengo\Auth\Entities\User;

class QueuedAuthNotifier implements NotificationSenderInterface
{
    public function sendMagicLink(User $user, string $token, string $url): bool
    {
        queue('emails')->push(new SendMagicLinkJob($user->getEmail(), $url));
        return true;
    }

    public function sendPasswordReset(User $user, string $token, string $url): bool
    {
        queue('emails')->push(new SendPasswordResetJob($user->getEmail(), $url));
        return true;
    }

    public function sendMfaCode(User $user, string $code): bool
    {
        return true;
    }

    public function sendActivation(User $user, string $token, string $url): bool
    {
        return true;
    }

    public function sendNotification(string $type, User $user, array $data = []): bool
    {
        return true;
    }
}
```

Register your custom sender in `app/Config/Auth.php`:

```php
public string $notifier = \App\Notifications\QueuedAuthNotifier::class;
```

---

## Custom Guards

Register custom authentication drivers (e.g., JWT, HMAC, LDAP) via `auth()->extend()`:

```php
// Register a custom guard
auth()->extend('jwt', fn() => new \App\Authentication\Guards\JwtGuard());

// Use it explicitly
if (auth()->guard('jwt')->check()) {
    $user = auth()->guard('jwt')->user();
}
```

You can set your custom guard as default in `app/Config/Auth.php`:

```php
public string $defaultGuard = 'jwt';
```

---

## CLI Commands

### Jengo Auth Commands

```bash
# Publish configuration, migrations, and routes
php spark jengo:auth setup

# Migrate users and credentials from CodeIgniter Shield
php spark jengo:auth import:shield [--dry-run]
```

### Vima Authorization Commands

```bash
# Synchronize roles and permissions from Setup.php to database
php spark vima:sync

# Generate PHP mappers and TypeScript interfaces
php spark vima:maps:generate [--ts]

# Create role or permission directly via CLI
php spark vima:role:create <name>
php spark vima:permission:create <name>

# Grant role or permission to user
php spark vima:grant <user-id> <role|permission>

# Explicitly deny permission to user
php spark vima:deny <user-id> <permission> [reason]

# Scaffold an ABAC Policy class
php spark vima:make:policy <PolicyName>
```
