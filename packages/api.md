# jengo/api

> **Status:** In Active Development &bull; Pre-Release

`jengo/api` is an automated, configuration-driven REST API and OpenAPI/Swagger engine for **CodeIgniter 4** and the **Jengo Framework**. It provides declarative resource routing, schema-driven querying, atomic bulk transactional writes, validation form mapping, and real-time interactive Swagger documentation.

---

## Key Capabilities

- **Automated REST Resource Routing**: Expose full CRUD endpoints automatically with clean HTTP verb mapping (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).
- **Interactive OpenAPI & Swagger UI**: Auto-generates complete OpenAPI 3.0 specs and embeds an interactive Swagger UI with zero manual annotation upkeep.
- **Declarative Resource Configurations**: Define access policies, versioning, allowed relations, and validation rules in clean `ResourceConfig` classes.
- **Relational Tree Derivations**: Query and resolve deeply nested relationship graphs on the fly using `?derive=relation_name`.
- **Atomic Bulk & Nested Writes**: Batch array insertions and nested relationship writes executed sequentially inside database transaction savepoints.
- **Database Key Obfuscation**: Native integration with Sqids to hash and decode auto-increment primary and foreign keys automatically.
- **Granular Validation Mapping**: Bind HTTP verbs directly to specific FormHandler or validation classes.
- **Lifecycle Mutation Hooks**: Intercept records before and after queries and saves via `beforeQuery`, `afterQuery`, `beforeSave`, and `afterSave`.
- **Version Mutation Chaining**: Chain and serve multiple concurrent API versions from a single routing declaration.

---

## Installation

Install the package via Composer:

```bash
composer require jengo/api
```

Publish the configuration file using the Jengo Spark CLI:

```bash
php spark jengo:api setup
```

This publishes `app/Config/JengoApi.php`.

---

## Defining Resource Configurations

Resource configurations extend `Jengo\Api\Support\ResourceConfig` to define endpoint behavior, relationship permissions, and validation bindings.

```php
namespace App\Api;

use Jengo\Api\Support\ResourceConfig;
use Jengo\Api\Support\HookContext;
use App\Forms\CreateUserForm;
use App\Forms\UpdateUserForm;

class UserResourceConfig extends ResourceConfig
{
    /**
     * Target API version constraint
     */
    protected $version = 'v1';

    /**
     * Allowed relationships to derive via ?derive=
     */
    protected array $allowedRelations = ['profile', 'posts'];

    /**
     * Fields whose IDs should be obfuscated with Sqids
     */
    protected array $obfuscatedFields = ['id'];

    /**
     * Maximum pagination limit allowed for this resource
     */
    protected int $maxLimit = 100;

    /**
     * HTTP verbs requiring authentication
     */
    protected array $requiredAuth = ['post', 'put', 'patch', 'delete'];

    /**
     * Validation FormHandler classes mapped to HTTP verbs
     */
    protected $formClass = [
        'post' => CreateUserForm::class,
        'put'  => UpdateUserForm::class,
    ];

    /**
     * Resource URL identifier (e.g. /api/v1/users)
     */
    public function name(): string
    {
        return 'users';
    }

    /**
     * Modify data before saving
     */
    public function beforeSave(array $data, ?HookContext $context = null): array
    {
        if (isset($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }

        return $data;
    }
}
```

> [!NOTE]
> To use database key obfuscation, your database Entity class must extend `Jengo\Base\Entities\BaseEntity` and declare the targeted fields in its `$obfuscatedFields` property.

---

## Registering Resources

Register your resource configurations in `app/Config/JengoApi.php`:

```php
namespace Config;

use Jengo\Api\Config\JengoApi as BaseJengoApi;
use App\Api\UserResourceConfig;
use App\Api\PostResourceConfig;

class JengoApi extends BaseJengoApi
{
    public string $apiName = 'My Application API';
    public string $apiBaseUrl = '/api';

    public array $resources = [
        UserResourceConfig::class,
        PostResourceConfig::class,
    ];
}
```

---

## Publishing Routes & Swagger Documentation

Publish versioned endpoints, JSON OpenAPI specifications, and interactive Swagger UI in `app/Config/Routes.php`:

```php
// app/Config/Routes.php
use Jengo\Api\Router;
use Jengo\Api\Support\RouterOptions;
use Jengo\Api\Support\DocsOptions;

Router::publish($routes, new RouterOptions(
    version: 'v1',
    docs: new DocsOptions(
        route:   'docs',     // Serves OpenAPI JSON at /api/v1/docs
        uiRoute: 'docs/ui'   // Serves interactive Swagger UI at /api/v1/docs/ui
    )
));
```

### Multi-Version Routing

Chain mutations dynamically to serve multiple API versions concurrently:

```php
Router::publish($routes, new RouterOptions(version: 'v1'))
    ->mutate(new RouterOptions(version: 'v2'));
```

---

## Query Parameters

Endpoints support standardized URL query parameters:

### 1. Pagination

```http
GET /api/v1/users?page=2&limit=15
```

Returns standard pagination envelopes:

```json
{
  "status": "success",
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 15,
    "total": 120,
    "totalPages": 8,
    "hasMore": true,
    "nextPage": 3,
    "prevPage": 1
  }
}
```

### 2. Sorting

Prefix with `-` for descending order:

```http
GET /api/v1/users?sort=-created_at
```

### 3. Full-Text Search

```http
GET /api/v1/users?search=Alice
```

### 4. Relational Tree Derivations

Derive relationships defined in `$allowedRelations`:

```http
GET /api/v1/users?derive=profile,posts
```

---

## Relational Mutations & Bulk Writes

All mutation operations are processed atomically inside database transaction savepoints. If any single validation rule or hook fails, the entire transaction is rolled back.

### Standard Resource Creation

```http
POST /api/v1/users
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

### Bulk Array Insertions (Batch POST)

Send an array of records to create multiple rows in a single atomic transaction:

```http
POST /api/v1/users
Content-Type: application/json

[
  { "name": "John Doe", "email": "john@example.com" },
  { "name": "Jane Doe", "email": "jane@example.com" },
  { "name": "Bob Smith", "email": "bob@example.com" }
]
```

### Nested Relational Writes

Create root resources and their child relations simultaneously:

```http
POST /api/v1/users
Content-Type: application/json

{
  "name": "Alice Smith",
  "email": "alice@example.com",
  "posts": [
    { "title": "First Blog Post", "content": "Hello World..." },
    { "title": "Second Blog Post", "content": "More content..." }
  ]
}
```

---

## Lifecycle Hooks

`ResourceConfig` classes support four lifecycle hooks:

```php
// Intercept query builder before execution
public function beforeQuery($query, ?HookContext $context = null): void
{
    // Apply multi-tenant scope
    $query->where('tenant_id', session('tenant_id'));
}

// Modify fetched records before formatting
public function afterQuery(array $data, ?HookContext $context = null): array
{
    return $data;
}

// Intercept data before saving (insert or update)
public function beforeSave(array $data, ?HookContext $context = null): array
{
    return $data;
}

// Inspect saved records post-save
public function afterSave(array $record, ?HookContext $context = null): array
{
    return $record;
}
```

---

## CLI Commands

### Scaffolding a Resource Configuration

Use the Jengo Master Command generator:

```bash
php spark jengo:make api_resource UserResource
```

This scaffolds `app/Api/UserResource.php`.

### Publishing Configuration

```bash
php spark jengo:api setup
```
