# Package Installers Architecture

`jengo/base` provides an automated, component-level installation and configuration subsystem for CodeIgniter 4 packages and features. It replaces cumbersome, error-prone manual setup steps with idempotent, self-verifying, and dependency-aware CLI installers.

---

## 1. Overview & Mental Model

When a developer runs:
```bash
php spark jengo:install <name>
```

Jengo executes a dedicated **Installer** component responsible for end-to-end configuration of that specific feature or package.

### Key Capabilities
- **Dependency Ordering**: Automatically resolves and installs prerequisites (e.g. installing `db` before running package migrations).
- **Environment Management (`EnvHandler`)**: Programmatically and safely updates `.env` values, preserving existing comments and key formatting.
- **Idempotent State Tracking (`InstallerTracker`)**: Records installation milestones in `.jengo/installers.json` to prevent duplicate writes or broken re-runs.
- **Safe Rollback**: Reverts published files and migrations if any step encounters an unexpected error.
- **Unified CLI Feedback**: Renders interactive progress indicators, checklists, and status logs.

---

## 2. Built-in First-Party Installers

`jengo/base` includes several foundational installers ready out-of-the-box:

| Installer | ID | What It Configures |
| :--- | :--- | :--- |
| **Dependency Injection** | `di` | Registers the PSR-11 container and enables route closure parameter injection. |
| **Database Setup** | `db` | Configures SQLite or active database connection and runs initial database migrations. |
| **Vite Asset Pipeline** | `vite` | Scaffolds `vite.config.ts`, Tailwind CSS, `package.json` scripts, and `@vite()` view tags. |
| **TypeScript Support** | `ts` | Scaffolds `tsconfig.json` and client-side TypeScript paths. |
| **Pest Testing Suite** | `pest` | Installs Pest PHP, initializes `Pest.php`, and configures database test runners. |
| **Blueprint UI** | `blueprint` | Generates modern layout views (`base.layout.php`, `app.layout.php`, headers, footers). |
| **Development Console** | `dev` | Sets up the multi-process supervisor for `php spark jengo:dev`. |
| **Maizzle Email Pipeline** | `maizzle` | Scaffolds email template compiling with Tailwind CSS and Maizzle. |

### Running Installers

```bash
# Run a specific installer
php spark jengo:install di

# Run multiple installers
php spark jengo:install db vite ts

# Force re-run already installed components
php spark jengo:install vite --force
```

---

## 3. The `AbstractInstaller` Lifecycle

Every installer implements `Jengo\Base\Installers\Contracts\InstallerInterface` or extends `Jengo\Base\Installers\Contracts\AbstractInstaller`:

```
┌─────────────────────────────────────────────────────────┐
│                   Installer Lifecycle                   │
├─────────────────────────────────────────────────────────┤
│ 1. getDependencies()  ──► Resolve prerequisite graph    │
│ 2. getRequirements()  ──► Validate system requirements  │
│ 3. onBeforeInstall()  ──► Pre-flight validation         │
│ 4. install()          ──► Publish files, env, migrations│
│ 5. onAfterInstall()   ──► Post-install hooks & cleanup  │
│ 6. (On Failure)       ──► rollback()                    │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Writing a Custom Package Installer

To make your package or module installable via `php spark jengo:install <your-id>`, create an installer extending `AbstractInstaller`:

```php
<?php

declare(strict_types=1);

namespace Jengo\Search\Installers;

use Jengo\Base\Installers\Contracts\AbstractInstaller;
use Jengo\Base\Installers\DTO\InstallerState;

class SearchInstaller extends AbstractInstaller
{
    /**
     * Unique identifier for CLI execution (php spark jengo:install search)
     */
    public function getId(): string
    {
        return 'search';
    }

    public function getTitle(): string
    {
        return 'Jengo Search Subsystem';
    }

    public function getDescription(): string
    {
        return 'Configures full-text search drivers, indices, and searchable model traits.';
    }

    /**
     * Declare dependencies that must be installed before this installer runs.
     *
     * @return list<string>
     */
    public function getDependencies(): array
    {
        return ['db']; // Ensures database connection is configured first
    }

    /**
     * Execute the installation tasks.
     */
    public function install(InstallerState $state): bool
    {
        $state->writeln('<info>Configuring Jengo Search...</info>');

        // 1. Publish configuration file
        $this->publishConfig(
            source: __DIR__ . '/../Config/Search.php',
            destination: APPPATH . 'Config/Search.php'
        );

        // 2. Safely inject or update .env variables
        $this->env->set([
            'search.driver' => 'sqlite',
            'search.prefix' => 'jengo_',
        ]);

        // 3. Publish and run migrations
        $this->publishMigration(
            source: __DIR__ . '/../Database/Migrations',
            prefix: 'create_search_indices_table'
        );
        $this->runMigrations();

        $state->writeln('<info>✓ Search subsystem successfully configured.</info>');

        return true;
    }

    /**
     * Optional: Roll back changes if an error occurs during execution.
     */
    public function rollback(InstallerState $state): bool
    {
        $this->deleteFile(APPPATH . 'Config/Search.php');
        return true;
    }
}
```

---

## 5. Working with `EnvHandler`

The `EnvHandler` class (`$this->env`) provides a robust API for manipulating `.env` files without destroying existing formatting, comments, or quotes:

```php
// Check key existence
if (!$this->env->has('AI_DEFAULT_PROVIDER')) {
    // Add new environment variable
    $this->env->set('AI_DEFAULT_PROVIDER', 'openai');
}

// Set multiple values atomically
$this->env->set([
    'BROADCAST_DRIVER' => 'sse',
    'REDIS_HOST'       => '127.0.0.1',
    'REDIS_PORT'       => 6379,
]);

// Read existing value
$currentDb = $this->env->get('database.default.database');
```

---

## 6. Registering Installers

Package installers are automatically discovered when placed in standard namespace locations or registered dynamically via the `InstallerRepository`:

```php
use Jengo\Base\Installers\Repositories\InstallerRepository;
use Jengo\Search\Installers\SearchInstaller;

// Programmatic registration (e.g. in your package ServiceProvider / Bootstrap)
InstallerRepository::register(new SearchInstaller());
```
