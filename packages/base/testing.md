# Pest Testing & Database Suite

`jengo/base` includes testing integrations for **Pest PHP** and **PHPUnit**, providing fluent database test scaffolding without `beforeEach` hook boilerplate.

---

## 1. The Pest Database Builder (`PestDatabaseBuilder`)

Configuring migrations and seeders across multiple test folders in Pest typically requires repetitive `beforeEach()` hooks. Jengo provides `PestDatabaseBuilder` to fluently configure database lifecycle rules per directory directly in `tests/Pest.php`.

### Basic Usage in `tests/Pest.php`

```php
use Jengo\Base\Testing\PestDatabaseBuilder;
use Tests\Support\Database\Seeds\UserSeeder;

PestDatabaseBuilder::make()
    ->migrate()
    ->seed(UserSeeder::class)
    ->group('tests')
    ->in('feature/database');
```

### Fluent Configuration Options

| Method | Description |
| :--- | :--- |
| `->migrate(bool $migrate = true)` | Run migrations before each test in the directory. |
| `->seed(string $seederClass)` | Run the specified seeder class before each test. |
| `->group(string $dbGroup)` | Specify the database group (defaults to `'tests'`). |
| `->namespace(string $namespace)` | Set the namespace for migration and seeder classes (defaults to `'Tests\Support'`). |
| `->basePath(string $path)` | Set custom base directory for migration and seed files. |
| `->in(string $directory)` | Apply this configuration to all Pest tests in the directory. |

---

## 2. Writing Clean Pest Database Tests

With `PestDatabaseBuilder` configured in `tests/Pest.php`, your feature test files require zero setup boilerplate:

```php
<?php

use App\Models\UserModel;

describe('User Management', function () {
    test('findAll returns seeded users', function () {
        $model = new UserModel();
        $users = $model->findAll();

        expect($users)->toHaveCount(3);
    });

    test('soft delete removes user from default queries', function () {
        $model = new UserModel();
        $user = $model->first();

        $model->delete($user->id);

        expect($model->find($user->id))->toBeNull();
    });
});
```

---

## 3. The `DatabaseTestCase` Base Class

For classic PHPUnit tests or custom Pest inheritance, Jengo publishes an abstract `DatabaseTestCase` base class:

```php
<?php

namespace Tests\TestCases;

use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;

abstract class DatabaseTestCase extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $seed      = 'Tests\Support\Database\Seeds\AppSeeder';
    protected $migrate   = true;
    protected $DBGroup   = 'tests';
    protected $namespace = 'Tests\Support';
}
```

Usage in `tests/Pest.php`:
```php
uses(Tests\TestCases\DatabaseTestCase::class)->in('feature/api');
```
