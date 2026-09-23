# The Fluent Query API

Execute queries with the global `query()` helper or `Query::run()`.

## Basic Querying

```php
use App\Schemas\UserSchema;
use function Jengo\Schema\query;

// Fetch multiple records
$result = query(UserSchema::class)
    ->where('status', 'active')
    ->sort('created_at', 'DESC')
    ->paginate(page: 1, limit: 15)
    ->get();

// Returns Jengo\Schema\Query\DTO\QueryResult
$users      = $result->data;       // Array of User entities
$totalCount = $result->count;      // Total returned rows
$pagination = $result->pagination; // Pagination metadata
```

## Single Record Retrieval

```php
// Find by primary key directly
$user = query(UserSchema::class)->find(42);

// Find first matching record
$user = query(UserSchema::class)
    ->where('email', 'jane@example.com')
    ->first();
```
