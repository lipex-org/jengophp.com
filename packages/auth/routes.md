# Route Publishing

Configure and publish authentication routes in `app/Config/Routes.php`.

> [!NOTE]
> `jengo/auth` does **not** publish all routes by default. You can publish only the exact features your application requires using dedicated helper methods or selective flow registration.

---

## 1. Feature Suites (Dedicated Helpers)

The recommended way to publish routes is using dedicated feature helper methods on `RouteRegistrar` or the `auth()` helper:

```php
// app/Config/Routes.php
use Jengo\Auth\Support\RouteRegistrar;

// 1. Core Authentication (login, logout, registration, password reset) -> [API Reference](./api-reference#1-core-authentication)
RouteRegistrar::core($routes);

// 2. Post-Auth MFA / Action Pipeline (show, challenge/resend, handle, cancel) -> [Actions Guide](./actions)
RouteRegistrar::action($routes);

// 3. Passwordless Magic Link Login & Verification -> [API Reference](./api-reference#2-passwordless-magic-links)
RouteRegistrar::magicLink($routes);

// 4. Two-Factor Authentication Settings & Enrollment (TOTP, Passkeys) -> [2FA Guide](./two-factor)
RouteRegistrar::twoFactor($routes);

// 5. Sudo Mode (Step-up privileged re-authentication) -> [Sudo Guide](./sudo)
RouteRegistrar::sudo($routes);

// 6. Personal Access Tokens API Management -> [Guards & Tokens](./guards#token-prefix--formatting)
RouteRegistrar::tokens($routes, [
    'prefix' => 'api/v1/auth/tokens',
    'filter' => 'auth:token',
]);

// 7. Publish All Features
RouteRegistrar::all($routes);
```

You can also call these directly via `auth()` or `service('auth')`:

```php
auth()->coreRoutes($routes);      // Core authentication
auth()->actionRoutes($routes);    // Post-auth action pipeline (MFA)
auth()->magicLinkRoutes($routes); // Passwordless magic links
auth()->twoFactorRoutes($routes); // Multi-factor management
auth()->sudoRoutes($routes);      // Sudo privileged step-up mode
auth()->tokenRoutes($routes);     // Scoped Personal Access Tokens
```

---

## 2. Advanced Customization & Prefixes

All route helper methods accept an `$options` array for granular URL prefixing, middleware filters, slug remapping, and controller overrides:

```php
RouteRegistrar::core($routes, [
    'prefix'       => 'auth',
    'paths'        => [
        'login'    => 'sign-in',
        'logout'   => 'sign-out',
        'register' => 'join',
    ],
    'logoutMethod' => 'post', // 'post' (default) or 'get'
    'controllers'  => [
        'login'    => \App\Controllers\CustomLoginController::class,
    ],
    'filters'      => [
        'register' => ['honeypot'],
    ],
]);
```

---

## 3. Selective Flow Registration (`only` / `except`)

When using `RouteRegistrar::routes($routes, $options)` or `auth()->routes($routes, $options)`, you can selectively filter which flow suites are published using the `only` and `except` options:

```php
// Register only specific flows
RouteRegistrar::routes($routes, [
    'only' => ['login', 'register', 'password-reset'],
]);

// Or exclude specific flows
RouteRegistrar::routes($routes, [
    'except' => ['magic-link', 'tokens'],
]);
```

---

## 4. Flow Identifier Reference Table

Below is the complete list of flow names available for `only` and `except`, along with their registered HTTP endpoints, canonical route names, and default controllers:

| Flow Name | HTTP Verb | Default Path | Canonical Route Name (`as`) | Default Controller Action |
| :--- | :--- | :--- | :--- | :--- |
| [**`login`**](./api-reference#post-login) | `GET` | `login` | `login` | `LoginController::showLogin` |
| | `POST` | `login` | `login.attempt` | `LoginController::attemptLogin` |
| | `POST` / `GET` | `logout` | `logout` | `LoginController::logout` |
| [**`register`**](./api-reference#post-register) | `GET` | `register` | `register` | `RegisterController::showRegister` |
| | `POST` | `register` | `register.attempt` | `RegisterController::attemptRegister` |
| [**`password-reset`**](./api-reference#3-self-service-password-reset) | `GET` | `forgot-password` | `forgot-password` | `ForgotPasswordController::showForgot` |
| | `POST` | `forgot-password` | `forgot-password.send` | `ForgotPasswordController::sendResetLink` |
| | `GET` | `reset-password/(:segment)` | `reset-password` | `ResetPasswordController::showReset` |
| | `GET` | `reset-password` | `reset-password.query` | `ResetPasswordController::showReset` |
| | `POST` | `reset-password` | `reset-password.attempt` | `ResetPasswordController::attemptReset` |
| [**`magic-link`**](./api-reference#2-passwordless-magic-links) | `GET` | `magic-link` | `magic-link` | `MagicLinkController::showMagicLink` |
| | `POST` | `magic-link` | `magic-link.send` | `MagicLinkController::sendLink` |
| | `GET` | `magic-link/verify/(:segment)` | `magic-link.verify` | `MagicLinkController::verifyLink` |
| | `GET` | `magic-link/verify` | `magic-link.verify.query` | `MagicLinkController::verifyLink` |
| [**`action`**](./actions) | `GET` | `auth/action/show` | `auth.action.show` | `ActionController::show` |
| | `POST` | `auth/action/challenge` | `auth.action.challenge` | `ActionController::challenge` |
| | `POST` | `auth/action/handle` | `auth.action.handle` | `ActionController::handle` |
| | `POST` | `auth/action/cancel` | `auth.action.cancel` | `ActionController::cancel` |
| | `GET` | `auth/action/cancel` | `auth.action.cancel.get` | `ActionController::cancel` |
| [**`sudo`**](./sudo) | `GET` | `auth/sudo` | `auth.sudo` | `SudoController::index` |
| | `POST` | `auth/sudo/challenge` | `auth.sudo.challenge` | `SudoController::challenge` |
| | `POST` | `auth/sudo/verify` | `auth.sudo.verify` | `SudoController::verify` |
| | `POST` | `auth/sudo/exit` | `auth.sudo.exit` | `SudoController::exit` |
| [**`two-factor`**](./two-factor) | `GET` | `user/two-factor` | `two-factor.index` | `TwoFactorSettingsController::index` |
| | `POST` | `user/two-factor/enroll/start` | `two-factor.enroll.start` | `TwoFactorSettingsController::startEnrollment` |
| | `POST` | `user/two-factor/enroll/confirm` | `two-factor.enroll.confirm` | `TwoFactorSettingsController::confirmEnrollment` |
| | `POST` | `user/two-factor/unenroll` | `two-factor.unenroll` | `TwoFactorSettingsController::unenroll` |
| [**`tokens`**](./guards#token-prefix--formatting) | `GET` | `api/tokens` | `tokens.index` | `TokenController::index` |
| | `POST` | `api/tokens` | `tokens.create` | `TokenController::create` |
| | `DELETE`| `api/tokens/(:segment)` | `tokens.revoke` | `TokenController::revoke` |

---

## 5. Route Options Reference

The `$options` parameter accepts the following configuration keys:

| Option Key | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **`prefix`** / **`group`** | `string` | `""` | Global URL prefix to wrap the published routes inside a CodeIgniter group (e.g. `'auth'` or `'api/v1/auth'`). |
| **`groupOptions`** | `array` | `[]` | Additional CI4 route group options (such as `['filter' => '...']`, `['subdomain' => '...']`). |
| **`only`** | `array` | `[]` | Explicit array of flow names to register. |
| **`except`** | `array` | `[]` | Explicit array of flow names to exclude. |
| **`paths`** | `array` | `[]` | Associative array overriding endpoint slugs (e.g. `['login' => 'sign-in', 'register' => 'signup']`). |
| **`controllers`** | `array` | `[]` | Associative array replacing the default controller classes per flow (e.g. `['login' => CustomLoginController::class]`). |
| **`filters`** | `array` | `[]` | Associative array applying route-specific filters (e.g. `['register' => ['honeypot'], 'login' => ['throttle:5,1']]`). |
| **`logoutMethod`** | `string` | `'post'` | HTTP verb for logout. Set to `'get'` to enable `GET /logout` instead of `POST`. |
| **`allowGetLogout`** | `bool` | `false` | Convenience flag. Setting `true` sets `logoutMethod` to `'get'`. |

---

## 6. Resolving Named Routes with `url_to()` and `auth_url()`

All route names (`as`) are canonical and standardized. Even when you customize paths or add prefixes, you can reliably resolve URLs across your application using `url_to()` or `auth_url()`:

```php
// In Views, Controllers, or Modifiers:
$loginUrl  = url_to('login');
$mfaUrl    = url_to('auth.action.show');
$cancelUrl = url_to('auth.action.cancel');
$resendUrl = url_to('auth.action.challenge');
$resetUrl  = url_to('reset-password', $token);

// auth_url() helper provides graceful fallbacks:
$profile2fa = auth_url('two-factor.index');
```

---

## 7. Configuring Redirect Destinations

In `app/Config/Auth.php`, configure post-authentication destinations using URL paths (for landing pages) or canonical route names (for authentication flows):

```php
namespace Config;

use Jengo\Auth\Config\Auth as BaseAuth;

class Auth extends BaseAuth
{
    /**
     * Redirect destinations.
     * Use URL paths (e.g. '/', '/dashboard') for landing pages or route names (e.g. 'login') for authentication targets.
     */
    public array $redirects = [
        'login'          => '/dashboard', // Landing page after login
        'register'       => '/welcome',   // Landing page after registration
        'logout'         => 'login',      // Named route or URL path after logout
        'password_reset' => 'login',      // Named route or URL path after password reset
        'magic_link'     => '/dashboard', // Landing page after magic link login
        'action'         => '/dashboard', // Landing page after completing MFA/action
        'sudo'           => '/settings',  // Landing page after sudo mode verification
        'denied'         => 'login',      // Named route or URL path when access is denied
    ];
}
```

When resolving redirects internally or in custom modifiers, use `auth_redirect_url($key, $default)`:

```php
// Resolves directly to '/dashboard'
$url = auth_redirect_url('login', '/');

// Resolves dynamically to the named route URL (e.g. 'https://example.com/sign-in')
$url = auth_redirect_url('logout', 'login');
```



