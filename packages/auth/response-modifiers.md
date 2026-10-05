# Response Modifiers

`jengo/auth` decouples authentication logic from presentation using pluggable **Response Modifiers**. By setting `$responseModifier` in `app/Config/Auth.php`, you can switch between server-rendered HTML views, pure JSON REST APIs, and Inertia.js Single-Page Applications (SPAs) without touching controller code.

---

## Built-in Modifiers

| Modifier | Class | Best For | Behavior |
| :--- | :--- | :--- | :--- |
| **Universal Modifier (Default)** | `Jengo\Auth\Modifiers\UniversalModifier` | Multi-Client Apps / Hybrids | Dynamically auto-detects `X-Inertia` headers for Inertia transitions, `Accept: application/json` / AJAX for API calls, and routes full-page browser visits to the configured `$viewRenderer` (`'standard'` or `'inertia'`). |
| **Standard Views** | `Jengo\Auth\Modifiers\StandardViewModifier` | Traditional MPAs | Renders CI4 view templates, handles session flash errors, and HTTP 302 redirects. |
| **JSON REST API** | `Jengo\Auth\Modifiers\JsonModifier` | Mobile Apps / SPAs / APIs | Returns uniform JSON payloads with HTTP status codes (`200`, `201`, `401`, `403`, `422`). |
| **Inertia.js SPA** | `Jengo\Auth\Modifiers\InertiaModifier` | React, Vue, Svelte SPAs | Returns `Inertia::render(...)` component responses, flashes validation errors, and passes branding props. |

---

## 1. Configuring the Active Modifier

In `app/Config/Auth.php`:

```php
namespace Config;

use Jengo\Auth\Config\Auth as BaseAuth;
use Jengo\Auth\Modifiers\UniversalModifier;

class Auth extends BaseAuth
{
    /**
     * Set the active response modifier.
     * UniversalModifier is the default, delegating dynamically based on request headers.
     */
    public string $responseModifier = UniversalModifier::class;

    /**
     * For full-page browser navigation with UniversalModifier:
     * 'standard' (renders HTML views) or 'inertia' (renders Inertia root and component).
     */
    public string $viewRenderer = 'standard';
}
```

---

## 2. Branding & Frontend Props

All response modifiers automatically incorporate the `$branding` configuration defined in `app/Config/Auth.php`:

```php
namespace Config;

use Jengo\Auth\Config\Auth as BaseAuth;

class Auth extends BaseAuth
{
    public array $branding = [
        'name'        => 'Acumen',
        'logo'        => 'https://example.com/logo.svg',
        'companyName' => 'Acumen Technologies Inc.',
    ];
}
```

### In Inertia SPAs (React / Vue / Svelte)

When using `InertiaModifier`, page components receive a structured `brand` object along with the user and action state:

```tsx
// React Inertia Page (e.g. resources/js/Pages/Auth/Login.tsx)
import { usePage } from '@inertiajs/react';

export default function Login() {
  const { brand } = usePage().props;

  return (
    <div>
      {brand.logo && <img src={brand.logo} alt={brand.name} className="h-10 mb-4" />}
      <h1>Sign in to {brand.name}</h1>
      <p>&copy; {new Date().getFullYear()} {brand.companyName || brand.name}</p>
    </div>
  );
}
```

### In Traditional HTML Views

When using `StandardViewModifier`, `$brand` is injected into the view template variables:

```php
<!-- app/Views/auth/login.php -->
<title>Log In - <?= esc($brand['name'] ?? 'Jengo') ?></title>
<div class="footer">
    &copy; <?= date('Y') ?> <?= esc($brand['companyName'] ?? $brand['name']) ?>. All rights reserved.
</div>
```

---

## 3. Customizing View & Component Templates

The `$views` array in `app/Config/Auth.php` is the **single source of truth** for both standard HTML view paths and Inertia page component paths:

```php
public array $views = [
    'login'               => 'Pages/Auth/Login',
    'register'            => 'Pages/Auth/Register',
    'forgotPassword'      => 'Pages/Auth/ForgotPassword',
    'resetPassword'       => 'Pages/Auth/ResetPassword',
    'magicLink'           => 'Pages/Auth/MagicLink',
    'action_mfa'          => 'Pages/Auth/TwoFactorChallenge',
    'sudo'                => 'Pages/Auth/SudoChallenge',
    'two_factor_settings' => 'Pages/Account/TwoFactorSettings',
    'tokens'              => 'Pages/Account/Tokens',
];
```

When using `UniversalModifier` with `$viewRenderer = 'inertia'` (or `InertiaModifier`), `InertiaModifier` directly looks up the component name registered in `$views` without guessing. If the modifier or view is missing, an explicit exception or error is raised.

---

## 4. Writing a Custom Response Modifier

Implement `Jengo\Auth\Contracts\ResponseModifierInterface` to format responses for custom protocols (e.g. XML, GraphQL envelopes, or mobile deep-link redirects):

```php
namespace App\Modifiers;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Config\Services;
use Jengo\Auth\Contracts\ResponseModifierInterface;
use Jengo\Auth\DTOs\AuthResponseData;

class CustomApiModifier implements ResponseModifierInterface
{
    public function modify(string $action, AuthResponseData $data, RequestInterface $request): ResponseInterface
    {
        return Services::response()
            ->setStatusCode($data->statusCode)
            ->setJSON([
                'success' => $data->isSuccess(),
                'action'  => $action,
                'meta'    => [
                    'brand' => config('Auth')->branding,
                ],
                'payload' => $data->toArray(),
            ]);
    }

    public function modifyValidationFailed(array $errors, RequestInterface $request, array $options = []): ResponseInterface
    {
        return Services::response()
            ->setStatusCode(422)
            ->setJSON([
                'success' => false,
                'errors'  => $errors,
            ]);
    }
}
```

