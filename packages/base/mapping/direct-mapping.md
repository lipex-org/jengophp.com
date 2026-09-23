# Direct Entity Mapping

Any entity extending `BaseEntity` (or using `MappableTrait`) supports static hydration and collection mapping.

## Map from a 3rd-party CI4 Entity

```php
use App\Entities\AppUser;

$shieldUser = $shieldUserModel->find(1);
$appUser = AppUser::from($shieldUser);
```

## Map from an Associative Array

```php
$appUser = AppUser::from($request->getPost());
```

## Batch Map a Collection

```php
$shieldUsers = $shieldUserModel->findAll();
$appUsers = AppUser::collect($shieldUsers);
```
