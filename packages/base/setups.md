# The Setup Hub Architecture

The **Setup Hub** (`src/Setups/`) provides an interactive, multi-step progressive enhancement wizard for CodeIgniter 4 and the Jengo Framework.

While **Installers** (`php spark jengo:install <name>`) perform low-level atomic component configuration, **Setups** (`php spark jengo:setup <target>`) are comprehensive, interactive onboarding wizards that guide developers through complex architectural integrations (such as configuring full authentication suites, REST API layers, or frontend SPA adapters).

---

## 1. How Setups Work

When running:
```bash
php spark jengo:setup
```

If no target argument is specified, Jengo launches an interactive selector presenting all discovered setup blueprints:

```
  ____                      
 |  _ \  ___ _ __   __ _  ___  
 | | | |/ _ \ '_ \ / _` |/ _ \ 
 | |_| |  __/ | | | (_| | (_) |
 |____/ \___|_| |_|\__, |\___/ 
                   |___/       

Select a setup blueprint to execute:
  [0] core          Install Jengo helpers and modular autoloading
  [1] auth          Configure Jengo Unified Auth (Vima RBAC/ABAC)
  [2] shield-auth   Configure CodeIgniter Shield with Blueprint styling
  [3] api           Configure Jengo REST API Vault & OpenAPI generator
  [4] inertia       Configure Inertia.js (React / Vue 3 / Svelte)
 > 
```

You can also trigger a specific setup directly:
```bash
php spark jengo:setup auth
```

---

## 2. Built-in Setup Blueprints

| Target | Class | Purpose |
| :--- | :--- | :--- |
| `core` | `CoreSetup` | Registers the Jengo helper library into the CodeIgniter autoloader and sets up modular namespace discovery. |
| `auth` | `AuthSetup` | Configures `jengo/auth`, publishes migrations, sets up token guards, registers Vima permissions, and publishes auth routes. |
| `shield-auth` | `ShieldAuthSetup` | Configures CodeIgniter Shield with custom Blueprint UI views, authentication filters, and user entities. |
| `api` | `ApiSetup` | Configures `jengo/api`, registers OpenAPI / Swagger documentation endpoints, and scaffolds resource definitions. |
| `inertia` | `InertiaSetup` | Configures `jengo/inertia`, establishes root view templates, registers the Inertia filter, and verifies Vite frontend adapters. |

---

## 3. The Setup Lifecycle (`AbstractSetup`)

Every setup extends `Jengo\Base\Setups\AbstractSetup` and implements `Jengo\Base\Setups\Contracts\SetupInterface`:

```php
<?php

declare(strict_types=1);

namespace Jengo\Auth\Setups;

use Jengo\Base\Setups\AbstractSetup;

class AuthSetup extends AbstractSetup
{
    public function getId(): string
    {
        return 'auth';
    }

    public function getName(): string
    {
        return 'Jengo Unified Authentication & Authorization';
    }

    public function getDescription(): string
    {
        return 'Configures Vima RBAC/ABAC, user entities, token guards, and auth routes.';
    }

    /**
     * Execute the multi-step setup pipeline.
     */
    public function run(): bool
    {
        $this->header('Configuring Jengo Auth Suite');

        // Step 1: Check prerequisites
        if (!$this->confirm('Proceed with installing authentication database tables?', true)) {
            $this->warning('Setup cancelled by user.');
            return false;
        }

        // Step 2: Run database migrations
        $this->step('Running authentication migrations...', function () {
            return $this->callCommand('migrate --all');
        });

        // Step 3: Publish routes and configuration
        $this->step('Publishing authentication routes...', function () {
            return $this->publishConfig(__DIR__ . '/../Config/Auth.php', APPPATH . 'Config/Auth.php');
        });

        // Step 4: Environment settings
        $this->step('Configuring session and token guards in .env...', function () {
            $this->env->set([
                'auth.default_guard' => 'session',
                'auth.token_expiry'  => '86400',
            ]);
            return true;
        });

        $this->success('Jengo Auth configured successfully!');

        return true;
    }
}
```

---

## 4. Setup Helper Methods

`AbstractSetup` provides rich CLI output and execution primitives:

- **`$this->step(string $title, callable $task)`**: Renders step indicators and spinners during execution.
- **`$this->callCommand(string $command)`**: Programmatically executes internal Spark commands.
- **`$this->confirm(string $question, bool $default = true)`**: Prompts for user confirmation.
- **`$this->choice(string $question, array $choices, int $default = 0)`**: Interactive multiple-choice selection.
- **`$this->header()`, `$this->success()`, `$this->warning()`, `$this->error()`**: Styled terminal headers and alerts.

---

## 5. Registering Custom Setups

Third-party packages or custom internal applications can register setup targets into the `SetupRepository`:

```php
use Jengo\Base\Setups\Repositories\SetupRepository;
use App\Setups\TenantBillingSetup;

// In a service provider or bootstrap file
SetupRepository::register(new TenantBillingSetup());
```

After registration, running `php spark jengo:setup tenant-billing` will execute the new blueprint.
