# Route Publishing

Configure and publish authentication routes in `app/Config/Routes.php`.

## Standard Publishing

```php
// app/Config/Routes.php
service('auth')->routes($routes);
```

## Customized Paths & Prefixes

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

## Selective Flow Registration

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

## Controller Overrides & Named Prefixes

```php
service('auth')->routes($routes, [
    'as'          => 'admin.', // Generates admin.login, admin.register, etc.
    'controllers' => [
        'login' => \App\Controllers\AdminLoginController::class,
    ],
]);
```
