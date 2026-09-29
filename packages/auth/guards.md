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
