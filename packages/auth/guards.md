# Custom Guards

Register custom authentication drivers (e.g., JWT, HMAC, LDAP) via `auth()->extend()`:

```php
// Register a custom guard
auth()->extend('jwt', fn() => new \App\Authentication\Guards\JwtGuard());

// Use it explicitly
if (auth()->guard('jwt')->check()) {
    $user = auth()->guard('jwt')->user();
}
```

## Setting a Default Guard

You can set your custom guard as default in `app/Config/Auth.php`:

```php
public string $defaultGuard = 'jwt';
```

---

## Token Abilities & Scopes

When using token-based guards (such as Personal Access Tokens or API guards), you can inspect token permissions and scopes:

```php
$user = auth()->user();

// Check if current token has permission
if ($user->tokenCan('reports:export')) {
    // Perform export
}

// Check abilities using fluent helper
if ($user->can('orders:write')) {
    // Process write
}
```

### Revoking Tokens

```php
// Revoke current request token
$user->currentAccessToken()->delete();

// Revoke all tokens for user
$user->tokens()->delete();
```

---

## Token Prefix & Formatting

You can customize how personal access tokens look across your organization. By default, tokens are prefixed with `jengo_pat_`, but you can customize this in `app/Config/Auth.php`:

```php
namespace Config;

use Jengo\Auth\Config\Auth as BaseAuth;

class Auth extends BaseAuth
{
    /**
     * Personal Access Token prefix (e.g., 'acumen_pat_', 'acumen/pat/', 'myapp_token_').
     */
    public string $tokenPrefix = 'acumen_pat_';
}
```

You can also pass an optional prefix override directly when issuing tokens programmatically:

```php
$tokenResult = auth()->createTokenFor($user, 'Billing Sync', ['billing:read'], null, 'acumen_api_');
echo $tokenResult->plainTextToken; // e.g. 'acumen_api_...'
```

---

## Custom Branding & Business Metadata

Customize application branding, company info, and logos across HTML views, notifications, and Inertia SPA props:

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

### Brand in Frontend & Inertia Props

When using `InertiaModifier` or inspecting `AuthResponseData::toArray()`, branding metadata is automatically delivered in the payload:

```json
{
  "action": "login.view",
  "status": "success",
  "brand": {
    "name": "Acumen",
    "logo": "https://example.com/logo.svg",
    "companyName": "Acumen Technologies Inc."
  }
}
```

