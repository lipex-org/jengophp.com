# Core Libraries

## `Str` (String Manipulation)

A powerful, chainable library for string operations.

```php
str('  jengo_powerhouse  ')->squish()->headline(); // "Jengo Powerhouse"
str('orders/123')->is('orders/*'); // true
Str::random(32); // Secure random string
```

## `Arr` (Array Manipulation)

Fluent, functional array manipulation.

```php
arr([1, 2, 3])->map(fn($v) => $v * 2)->toArray(); // [2, 4, 6]
```

## `PackageManager`

An agnostic wrapper for Composer and Node-based package managers (`npm`, `pnpm`, `yarn`), handling syntax differences automatically.
