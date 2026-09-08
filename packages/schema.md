# jengo/schema

> **Status:** Production Ready &bull; **Version:** `v1.0.0`

`jengo/schema` is an enterprise declarative querying, relationship derivation, entity hydration, infinite-scrolling cursor pagination, and TypeScript definition generation engine for **CodeIgniter 4** and the **Jengo Framework**.

---

## Key Capabilities

- **Declarative Schema Definitions**: Define database models, entity bindings, data types, and complex relationships using clean PHP 8 Attributes.
- **Fluent Query API**: Chain conditions, field selections, sorting, nested joins, and multi-field full-text searches with an intuitive builder syntax.
- **Automatic Relationship Derivation**: Seamlessly join and hydrate deeply nested single (`BelongsTo`) and collection (`HasMany`) relationships (e.g. `derive(['profile', 'files.comments'])`).
- **Dual Pagination Engines**: Traditional offset-based page links (`paginate(1, 15)`) and high-performance base64 opaque cursor pagination (`after($cursor)`) for infinite scrolling interfaces.
- **Pagination Clamping**: Automatically clamp out-of-range requested page numbers to the last available page.
- **Virtual Schemas & Dynamic Entities**: Query directly from CodeIgniter 4 Model classes (`query(UserModel::class)`) or raw database tables (`query('users')->as(User::class)`) without writing physical schema classes.
- **Open Query Mode (Request-Driven)**: Automatically parse incoming HTTP request parameters (`?include=...&filter[status]=...&sort=-created_at`) directly into type-safe query options.
- **TypeScript Interface Generation**: Generate matching TypeScript definitions (`.d.ts`) alongside PHP Schemas directly from database metadata.
- **AI Capability Integration**: Expose database structures, foreign keys, and column metadata to AI agents via `DatabaseSchemaCapabilityProvider`.

---

## Installation

Install the package via Composer:

```bash
composer require jengo/schema
```

Publish the configuration file using the Jengo Spark CLI:

```bash
php spark jengo:schema setup
```

This publishes `app/Config/JengoSchema.php` into your application.

---

## Defining Schemas

Schemas represent your database tables and their relationships to entities and other schemas using PHP 8 Attributes.

```php
namespace App\Schemas;

use App\Entities\User;
use App\Models\UserModel;
use Jengo\Schema\Attributes\Computed;
use Jengo\Schema\Attributes\Field;
use Jengo\Schema\Attributes\Model;
use Jengo\Schema\Attributes\PrimaryKey;
use Jengo\Schema\Attributes\Relations\BelongsTo;
use Jengo\Schema\Attributes\Relations\HasMany;
use Jengo\Schema\Hydration\Enums\Cast;

#[Model(model: UserModel::class, entity: User::class)]
class UserSchema
{
    #[PrimaryKey]
    public int $id;

    #[Field(searchable: true)]
    public string $first_name;

    #[Field(searchable: true)]
    public string $last_name;

    #[Field(searchable: true)]
    public string $email;

    #[Field(cast: Cast::DATETIME)]
    public string $created_at;

    #[BelongsTo(schema: ProfileSchema::class, from: 'id', to: 'user_id')]
    public ?ProfileSchema $profile = null;

    #[HasMany(schema: UserFileSchema::class, from: 'id', to: 'user_id')]
    public array $files = [];

    #[Computed('full_name', ['first_name', 'last_name'])]
    public function getFullName(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    #[Computed('file_count', ['files'])]
    public function getFileCount(): int
    {
        return count($this->files);
    }
}
```

### Schema Attributes

- **`#[Model(model: string, entity: ?string)]`**: Maps the schema to a CodeIgniter 4 Model and specifies the hydration target entity.
- **`#[PrimaryKey]`**: Identifies the primary key property.
- **`#[Field(searchable: bool, cast: ?Cast)]`**: Configures field behavior, including search indexing and hydration type casting.
- **`#[BelongsTo(schema: string, from: string, to: ?string)]`**: Defines a one-to-one or many-to-one relationship.
- **`#[HasMany(schema: string, from: string, to: ?string)]`**: Defines a one-to-many relationship (hydrated as a typed list).
- **`#[Computed(name: string, dependants: array, cast: ?Cast)]`**: Calculates dynamic fields post-hydration. Dependencies (including relationships) are resolved in topological order.

### Field Casting (`Cast` Enum)

The `Jengo\Schema\Hydration\Enums\Cast` enum supports automatic conversion:

- `Cast::INT`: Cast to integer.
- `Cast::FLOAT`: Cast to float/decimal.
- `Cast::BOOL`: Cast to boolean.
- `Cast::STRING`: Cast to string.
- `Cast::ARRAY`: Decode JSON string into a PHP array.
- `Cast::DATETIME`: Parse into datetime representation.

---

## The Fluent Query API

Execute queries with the global `query()` helper or `Query::run()`.

### Basic Querying

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

### Single Record Retrieval

```php
// Find by primary key directly
$user = query(UserSchema::class)->find(42);

// Find first matching record
$user = query(UserSchema::class)
    ->where('email', 'jane@example.com')
    ->first();
```

---

## Filtering & Conditions

`jengo/schema` provides an extensive set of condition builders:

```php
query(UserSchema::class)
    // Basic equality & negation
    ->where('status', 'active')
    ->orWhere('role', 'admin')
    ->whereNot('email', 'banned@example.com')

    // Set membership
    ->whereIn('role_id', [1, 2, 5])
    ->whereNotIn('id', [10, 11])
    ->orWhereNotIn('tier', ['bronze'])

    // Pattern matching
    ->whereLike('first_name', '%Alex%')
    ->orWhereLike('last_name', '%Smith%')

    // Range conditions
    ->whereBetween('age', [21, 65])
    ->whereNotBetween('score', [0, 49])
    ->whereGt('reputation', 100)
    ->whereGte('level', 5)
    ->whereLt('strikes', 3)
    ->whereLte('penalty_points', 0)

    // Null checks
    ->whereNull('deleted_at')
    ->whereNotNull('email_verified_at')

    // Temporal helpers
    ->whereToday()           // Records created today
    ->whereSince('-7 days')  // Records created within the last 7 days

    // Conditional execution
    ->when($filterByCountry, fn($q) => $q->where('country', $countryCode))

    ->get();
```

---

## Relationship Derivation

Load single and collection relationships with automatic JOIN construction and entity hydration:

```php
// Load multiple relations
$result = query(UserSchema::class)
    ->derive(['profile', 'files'])
    ->get();

// Load nested grandchild relationships
$result = query(UserSchema::class)
    ->derive(['profile', 'files.comments'])
    ->get();

// Access hydrated entities directly
foreach ($result->data as $user) {
    echo $user->profile->phone;
    foreach ($user->files as $file) {
        echo $file->name;
        foreach ($file->comments as $comment) {
            echo $comment->content;
        }
    }
}
```

---

## Full-Text & Multi-Field Search

Perform searches across root schema columns and related table fields using dot-notation:

```php
// Search across all searchable fields on the schema
$result = query(UserSchema::class)
    ->search('John')
    ->get();

// Target specific fields including related tables
$result = query(UserSchema::class)
    ->derive('files')
    ->search('quarterly_report', ['first_name', 'last_name', 'files.name'])
    ->get();
```

---

## Pagination & Infinite Scrolling

### 1. Traditional Offset Pagination

```php
$result = query(UserSchema::class)
    ->paginate(page: 2, limit: 10)
    ->get();

$pagination = $result->pagination;

echo $pagination->page;        // 2
echo $pagination->limit;       // 10
echo $pagination->total;       // e.g. 84
echo $pagination->totalPages;  // 9
echo $pagination->hasMore;     // true
echo $pagination->nextPage;    // 3
echo $pagination->prevPage;    // 1
```

### 2. Cursor Pagination (Infinite Scrolling)

Opaque base64 cursors provide zero-offset performance degradation for infinite scroll feeds:

```php
// Initial request
$firstPage = query(UserFileSchema::class)
    ->sort('size', 'ASC')
    ->limit(10)
    ->get();

$nextCursor = $firstPage->pagination->nextCursor;

// Next request passing the cursor token
$nextPage = query(UserFileSchema::class)
    ->sort('size', 'ASC')
    ->after($nextCursor)
    ->limit(10)
    ->get();
```

### 3. Pagination Clamping

Prevent empty screens when users request pages out of range:

```php
// If there are only 5 pages and page 99 is requested:
$result = query(UserSchema::class)
    ->clamp(true) // Automatically clamps request to page 5
    ->paginate(page: 99, limit: 10)
    ->get();
```

---

## Virtual Schemas

Query directly from CodeIgniter 4 Models or database table strings without authoring schema classes:

```php
use App\Entities\User;
use App\Models\UserModel;

// Query from a CI4 Model
$users = query(UserModel::class)
    ->where('status', 'active')
    ->get();

// Query from a raw database table with runtime entity mapping
$users = query('users')
    ->as(User::class)
    ->where('status', 'active')
    ->derive('user_files')
    ->get();
```

You can also register default table-to-entity mappings globally in `app/Config/JengoSchema.php`:

```php
public array $entityMap = [
    'users'      => \App\Entities\User::class,
    'user_files' => \App\Entities\UserFile::class,
];
```

---

## Open Query Mode (Request-Driven)

Open mode automatically inspects the active HTTP Request and binds query options without writing boilerplate controller logic:

```php
namespace App\Controllers;

use App\Schemas\UserSchema;
use CodeIgniter\RESTful\ResourceController;
use function Jengo\Schema\query;

class UserController extends ResourceController
{
    public function index()
    {
        // Automatically parses:
        // ?include=profile,files
        // &filter[status]=active
        // &sort=-created_at
        // &page=1
        // &limit=15
        $result = query(UserSchema::class)
            ->open()
            ->get();

        return $this->response->setJSON($result);
    }
}
```

---

## Spark CLI Commands

### 1. Publish Configuration

```bash
php spark jengo:schema setup
```

### 2. Generate Schemas & TypeScript Definitions

Scan your database and automatically generate PSR-4 Schema classes:

```bash
php spark jengo:schema generate
```

Generate TypeScript interfaces for frontend consumption:

```bash
php spark jengo:schema generate --ts --ts-dir=resources/js/types/schemas
```

#### Available Command Options

| Option | Description |
| :--- | :--- |
| `--table` | Generate schema for a specific table only. |
| `--force` | Force overwrite existing schema files. |
| `--dbgroup` | Specify database group (defaults to `default` or `tests`). |
| `--namespace` | Custom namespace for schema classes (defaults to `App\Schemas`). |
| `--dir` | Directory where schema files will be stored (defaults to `app/Schemas`). |
| `--dry-run` | Simulate generation without creating or modifying files. |
| `--with-vendor` | Include vendor and system tables. |
| `--ts` | Generate TypeScript definition files (`.d.ts`). |
| `--ts-dir` | Directory for TypeScript definition files. |

---

## AI Agent Integration

`jengo/schema` includes `DatabaseSchemaCapabilityProvider`, which implements `Jengo\Base\AI\AiCapableInterface`. This automatically provides AI models with real-time insight into database tables, column definitions, data types, primary keys, and foreign key relations for intelligent querying and code generation.
