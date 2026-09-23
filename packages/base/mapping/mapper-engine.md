# The Central Mapper Engine

The `Mapper` facade provides decoupled mapping and fluent configuration.

## Standard Direct Mapping

```php
use Jengo\Base\Mapping\Mapper;

$appUser = Mapper::map($shieldUser, AppUser::class);
```

## Map into an Existing Entity Instance

```php
Mapper::from($requestData)->into($existingUser);
```

## Fluent Configuration Chain

```php
$appUser = Mapper::from($shieldUser)
    ->with(['tenant_id' => $tenantId])
    ->only(['id', 'username', 'email', 'tenant_id'])
    ->except(['password_hash'])
    ->pristine(true)
    ->to(AppUser::class);
```

## Batch Collections

```php
$appUsers = Mapper::collect($shieldUsers, AppUser::class);
```
