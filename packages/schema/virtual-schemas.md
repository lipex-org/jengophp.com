# Virtual Schemas

Query directly from CodeIgniter 4 Models or database table strings without authoring schema classes.

## Query from a CI4 Model

```php
use App\Models\UserModel;

$users = query(UserModel::class)
    ->where('status', 'active')
    ->get();
```

## Query from a Raw Database Table

With runtime entity mapping:

```php
use App\Entities\User;

$users = query('users')
    ->as(User::class)
    ->where('status', 'active')
    ->derive('user_files')
    ->get();
```

## Registering Default Entity Mappings

You can also register default table-to-entity mappings globally in `app/Config/JengoSchema.php`:

```php
public array $entityMap = [
    'users'      => \App\Entities\User::class,
    'user_files' => \App\Entities\UserFile::class,
];
```
