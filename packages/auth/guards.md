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
