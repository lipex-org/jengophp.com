# Bi-Directional Synchronization

The mapping engine tracks mapping context and field origin, allowing modified domain entities to sync back to the original source or reconstruct the original entity class.

## Syncing Back to the Source Instance

```php
$shieldUser = $shieldUserModel->find(1);
$appUser = AppUser::from($shieldUser);

// Modify application state
$appUser->email = 'updated@example.com';
$appUser->name = 'Jane Doe';

// Sync modified values back into the original $shieldUser instance
$appUser->syncTo($shieldUser);

// Save through the 3rd-party repository or model
$shieldUserModel->save($shieldUser);
```

When no argument is passed to `syncTo()`, the entity automatically updates the captured origin instance:

```php
$appUser->name = 'Jane Doe';
$appUser->syncTo(); // Automatically syncs to the captured $shieldUser
$shieldUserModel->save($shieldUser);
```

To sync only attributes that were actually modified, pass `onlyChanged: true`:

```php
$appUser->syncTo($shieldUser, onlyChanged: true);
```

## Reconstructing the Original Entity (`toOriginal`)

```php
// Reconstruct the 3rd-party entity with reversed mappings
$shieldUser = $appUser->toOriginal();
$shieldUserModel->save($shieldUser);

// When mapped from an array, toOriginal() exports back to an array
$data = ['user_id' => 5, 'user_name' => 'alex'];
$user = AppUser::from($data);
$user->name = 'alex_updated';

$originalArray = $user->toOriginal();
// ['user_id' => 5, 'user_name' => 'alex_updated']
```
