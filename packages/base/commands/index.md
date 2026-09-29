# Command Variant Architecture & CLI Overview

`jengo/base` introduces a structured **Command Variant** architecture to CodeIgniter 4, moving away from flat, cluttered CLI listings in favor of organized Master/Variant command groups.

---

## The Master / Variant Pattern

Instead of registering dozens of separate top-level commands (such as `jengo:make-action`, `jengo:make-page`, `jengo:make-form`), Jengo utilizes **Master Commands** that serve as dynamic command routers.

When you execute a command such as:

```bash
php spark jengo:make action ProcessOrder
```

The master command `jengo:make`:
1. Identifies the variant argument (`action`).
2. Discovers matching **Variant classes** across all registered namespaces (e.g. `ActionVariant`).
3. Invokes the variant's logic with parameters and options.

---

## Core Command Groups

`jengo/base` provides the following command suites:

| Command Group | Documentation | Description |
| :--- | :--- | :--- |
| **`jengo:dev`** | [Development Console](./dev.md) | Multi-process runner and interactive TUI dashboard. |
| **`jengo:make`** | [Resource Generators](./make.md) | Scaffolds actions, forms, repositories, pages, events, layouts, and modules. |
| **`jengo:modules`** | [Modular Discovery & Patch](./modules.md) | Module scanning, caching, and CI4 autoloader patch. |
| **`jengo:setup`** | [Setup Hub](./setup.md) | Progressive installation hub for frontend, auth, and database stacks. |
| **Diagnostics** | [Health, Audit & Logs](./diagnostics.md) | `jengo:health`, `jengo:audit`, and real-time log streaming (`jengo:tail log`). |
| **Utilities** | [Utilities & Performance](./utilities.md) | Cache optimization (`jengo:optimize`), cache purge (`jengo:clear cache`), REPL (`jengo:tinker`), Sqids (`jengo:sqids`), AI rules sync (`jengo:ai`), and Vite (`jengo:vite`). |

---

## Creating Custom Command Variants

To register a custom variant under any Jengo Master Command, create a class implementing `Jengo\Base\Contracts\CommandVariantInterface` (or extending `Jengo\Base\Commands\Core\AbstractVariant`) in your application namespace.

For example, to create `php spark jengo:make service <name>`:

```php
<?php

declare(strict_types=1);

namespace App\Commands\Variants\Make;

use Jengo\Base\Commands\Core\AbstractGeneratorVariant;

class ServiceVariant extends AbstractGeneratorVariant
{
    protected $component = 'Services';
    protected $directory = 'Services';

    public static function name(): string
    {
        return 'service';
    }

    public static function description(): string
    {
        return 'Generates a new domain service class.';
    }

    public function arguments(): array
    {
        return [
            'class_name' => 'Name of the service class to create',
        ];
    }
}
```

Jengo automatically discovers the class and exposes it under `php spark jengo:make service` without requiring manual route registration.
