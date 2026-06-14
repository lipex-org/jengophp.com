# jengo/schema

> **Status:** 🚧 Experimental / Active Development

`jengo/schema` introduces a declarative, schema-driven querying engine to CodeIgniter 4. It bridges the gap between RESTful API requests, complex database joins, and strongly-typed PHP entities.

## The Problem

Traditional ORMs or Query Builders often require you to manually write `join()`, `select()`, and `where()` clauses. When building APIs, parsing query string parameters (like `?include=profile,posts&sort=-created_at`) and translating them into safe SQL queries is tedious and error-prone.

## The Jengo Schema Solution

With Jengo Schema, you define a **Schema Class** using PHP 8 Attributes. This class acts as the single source of truth for how an entity maps to the database and how it relates to other entities.

### Defining a Schema

```php
namespace App\Schemas;

use Jengo\Schema\Attributes\Schema;
use Jengo\Schema\Attributes\PrimaryKey;
use Jengo\Schema\Attributes\Field;
use Jengo\Schema\Attributes\Relations\HasMany;
use Jengo\Schema\Attributes\Relations\BelongsTo;

#[Schema(table: 'users', model: \App\Models\UserModel::class)]
class UserSchema
{
    #[PrimaryKey]
    public int $id;

    #[Field(column: 'username', type: 'string')]
    public string $username;

    #[Field(column: 'email', type: 'string')]
    public string $email;

    #[BelongsTo(schema: ProfileSchema::class, foreignKey: 'profile_id')]
    public ProfileSchema $profile;

    #[HasMany(schema: PostSchema::class, foreignKey: 'user_id')]
    public array $posts;
}
```

## The Query API

Once your schema is defined, you can query it effortlessly using the `Query` API.

### Inline (Programmatic) Mode

Used when you know exactly what you want to fetch in your backend code.

```php
use Jengo\Schema\Query\Query;
use Jengo\Schema\Query\DTO\QueryOptions;

$users = Query::run(
    schema: UserSchema::class,
    options: new QueryOptions(
        derive: ['profile', 'posts'], // Automatically handles JOINs and hydration
        filters: ['status' => 'active'],
        sort: ['created_at' => 'desc'],
        pagination: new PaginationOptions(limit: 15, page: 1)
    )
);
```

### Open (Request-Driven) Mode

*Coming Soon.* This mode will automatically parse HTTP Request parameters and translate them into a `QueryOptions` object, allowing the frontend to dynamically request relationships without changing backend code.

```
GET /api/users?derive=profile,posts&filter[status]=active&sort=-created_at
```

## Advanced Attributes

- `#[Derived]`: Used to calculate fields on the fly via SQL (e.g., `COUNT(posts.id) as posts_count`).
- `#[Computed]`: Used to calculate fields in PHP after hydration (e.g., `$first_name . ' ' . $last_name`).

*Note: The hydration and complex derivation engines are currently in active development.*
