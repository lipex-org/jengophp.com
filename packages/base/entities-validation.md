# Entities & Validated Data

`jengo/base` enhances CodeIgniter 4's data tier with automatic ID obfuscation, rich entity casting, and strict input validation DTOs.

---

## 1. `BaseEntity` & Sqids Obfuscation

The `Jengo\Base\Entities\BaseEntity` class extends CodeIgniter's `Entity` with automatic ID obfuscation via Sqids, preventing sequential database ID enumeration in public APIs and URLs.

### Defining an Entity

```php
<?php

declare(strict_types=1);

namespace App\Entities;

use Jengo\Base\Entities\BaseEntity;

class User extends BaseEntity
{
    /**
     * Fields that should be automatically encoded/decoded using Sqids.
     */
    protected array $obfuscatedFields = ['id', 'organization_id'];

    /**
     * Sensitive fields hidden during JSON serialization.
     */
    protected array $hidden = ['password_hash', 'remember_token'];

    protected $casts = [
        'id'              => 'integer',
        'organization_id' => 'integer',
        'is_active'       => 'boolean',
        'settings'        => 'json-array',
        'created_at'      => 'datetime',
    ];
}
```

### Working with Obfuscated IDs

```php
$user = model('UserModel')->find(105);

// The raw integer ID is internally preserved for database queries
echo $user->id; // 105

// When serialized to JSON or array, the ID is automatically hashed with Sqids
echo json_encode($user);
// {"id":"b9X2k","username":"alice","is_active":true}

// Setting an obfuscated string automatically decodes back to the integer ID
$user->id = 'b9X2k';
echo $user->id; // 105
```

---

## 2. `ValidatedData` DTO

`Jengo\Base\Validation\ValidatedData` provides a type-safe wrapper around validated input payloads, preventing unvalidated request data from leaking into domain actions.

```php
use Jengo\Base\Validation\ValidatedData;

$validated = new ValidatedData([
    'email' => 'user@example.com',
    'age'   => '28',
    'role'  => 'editor',
]);

// Type-safe access
$email = $validated->getString('email');
$age = $validated->getInt('age'); // 28 (auto-cast)
$isAdmin = $validated->getBoolean('is_admin', false);

// Check presence
if ($validated->has('role')) {
    // Process role
}

// Convert back to clean array
$data = $validated->toArray();
```

---

## 3. Dynamic Class Extension

For dynamic entity methods, computed properties, mixins, and automated macro discovery, see the dedicated [Macros & Extensibility](/packages/base/macros) documentation.
