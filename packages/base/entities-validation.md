# Entities & ID Obfuscation

`jengo/base` enhances CodeIgniter 4's data tier with `BaseEntity`, providing automatic Sqids ID obfuscation, recursive JSON serialization, visible/hidden field filtering, and seamless macro extensibility.

For declarative request validation and form processing, see the dedicated [Form Handlers & Validation](/packages/base/validation) guide.

---

## 1. `BaseEntity` & Sqids Obfuscation

The `Jengo\Base\Entities\BaseEntity` class extends CodeIgniter's `Entity` with automatic ID obfuscation via Sqids, preventing sequential database ID enumeration in public APIs, URLs, and JSON responses.

### Defining an Entity

```php
<?php

declare(strict_types=1);

namespace App\Entities;

use Jengo\Base\Entities\BaseEntity;

class User extends BaseEntity
{
    /**
     * Fields that should be automatically obfuscated during JSON serialization.
     */
    protected array $obfuscatedFields = ['id', 'organization_id'];

    /**
     * Fields hidden from JSON serialization.
     */
    protected array $hidden = ['password_hash', 'remember_token'];

    /**
     * Explicit visible whitelist (if non-empty, ONLY these fields serialize).
     */
    protected array $visible = [];

    protected $casts = [
        'id'              => 'integer',
        'organization_id' => 'integer',
        'is_active'       => 'boolean',
        'settings'        => 'json-array',
        'created_at'      => 'datetime',
    ];
}
```

---

## 2. Working with Obfuscated IDs

```php
$user = model('UserModel')->find(105);

// 1. Raw integer ID is internally preserved for database queries and business logic
echo $user->id; // 105

// 2. When serialized to JSON, the ID is automatically hashed with Sqids
echo json_encode($user);
// {"id":"b9X2k","organization_id":"m4P8q","name":"Alice","is_active":true}

// 3. Setting an obfuscated string automatically decodes back to the integer ID
$user->id = 'b9X2k';
echo $user->id; // 105
```

---

## 3. Recursive Nested Entity Serialization

`BaseEntity` handles nested relation objects (`Profile`, `NextOfKin`, `Identity`) and arrays of entities recursively.

When `json_encode($user)` or `$user->jsonSerialize()` runs:
- The parent entity's visible, hidden, and obfuscated fields are processed.
- Child `BaseEntity` instances execute their own `jsonSerialize()` methods, preserving their own ID obfuscation and hidden fields.
- Arrays and collections of child entities are recursively serialized with proper obfuscation.

```php
$user = model('UserModel')->with('profile', 'identities')->find($id);

// Nested entities are automatically serialized with their own obfuscation rules
echo json_encode($user, JSON_PRETTY_PRINT);
/*
{
    "id": "b9X2k",
    "name": "Alice",
    "profile": {
        "id": "q1W2e",
        "bio": "Software Engineer"
    },
    "identities": [
        {
            "id": "z9X8c",
            "provider": "email"
        }
    ]
}
*/
```

---

## 4. Helper Functions

`jengo/base` exposes global Sqids helpers:

```php
// Encode an integer ID into a Sqids string
$hash = sqids_hash(105); // "b9X2k"

// Decode a Sqids string back into an integer ID (returns null on invalid string)
$id = sqids_unhash("b9X2k"); // 105
```

---

## 5. Dynamic Macros & Extensibility

`BaseEntity` uses `MacroableTrait`, allowing you to dynamically attach methods, computed accessors, or formatters at runtime without subclassing:

```php
use App\Entities\User;

User::macro('getDisplayName', function () {
    return "{$this->first_name} {$this->last_name} ({$this->email})";
});

$user = new User(['first_name' => 'Alice', 'last_name' => 'Smith', 'email' => 'alice@example.com']);
echo $user->getDisplayName(); // "Alice Smith (alice@example.com)"
```

See [Macros & Extensibility](/packages/base/macros) for more details.
