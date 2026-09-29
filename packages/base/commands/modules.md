# Modular Architecture & Discovery

Jengo provides an integrated modular architecture that discovers domain modules placed inside the `modules/` root directory.

Each module acts as an autonomous subsystem with its own Controllers, Models, Views, Config, and Routes:

```text
modules/
└── Blog/
    ├── Config/
    │   └── Routes.php
    └── Controllers/
        └── Blog.php
```

---

## CodeIgniter 4 Autoloader Limitation & Workaround

In vanilla CodeIgniter 4, the framework autoloader is initialized before third-party packages or events can register dynamic namespaces. Specifically:

1. `Config\AutoloadConfig` does not inherit from `CodeIgniter\Config\BaseConfig`, preventing package Registrars (`Config\Registrar::Autoload`) from declaring dynamic namespaces or helpers.
2. In CLI execution (`spark`), `Console::run()` loads routes before firing the `pre_command` lifecycle event.

We submitted an upstream PR to CodeIgniter 4 ([CodeIgniter4#10590](https://github.com/codeigniter4/CodeIgniter4/pull/10590)) introducing an `autoloader_initialized` event hook.

### Impact When Patch Is Not Applied

While standard HTTP requests may appear to work normally due to Jengo running `ModuleDiscovery::discoverAndRegister()` during the `pre_system` event, failing to apply this patch introduces critical subtle issues across the application:

1. **Testing Environment Failures**:
   - In PHPUnit/Pest test environments, `pre_system` and `pre_command` events do not execute the same web lifecycle.
   - Without the patch, module namespaces (`Modules\*`) are not registered into CodeIgniter's autoloader at test boot time, resulting in `Class Not Found` exceptions when testing module models, controllers, or services.
2. **CLI Spark Commands & Route Listing**:
   - Commands such as `php spark routes` will **not** display routes defined inside your modules (`modules/*/Config/Routes.php`), even though navigating to those endpoints in the browser works.
   - Other CLI commands that rely on early `FileLocator` scanning will miss files contained inside module directories.
3. **Unexpected Framework Desynchronization**:
   - Because `RouteCollection::loadRoutes()` runs in `Console::run()` before commands execute and locks `$didDiscover = true`, module discovery that occurs later is permanently hidden from CLI tools.

Applying the patch ensures that all module namespaces, helpers, and routes are registered uniformly across web requests, spark commands, and automated test runners.

### Mitigating with the Jengo CLI Patch Command

Until the PR is merged and tagged upstream in CodeIgniter 4, Jengo provides a CLI mitigation command to patch your local development environment:

```bash
php spark jengo:modules patch
```

This command automatically:
1. Triggers the `autoloader_initialized` event inside `SYSTEMPATH . 'Boot.php'` in `Boot::loadAutoloader()` right after autoloader initialization completes.
2. Appends the `autoloader_initialized` listener in `app/Config/Events.php` to run `ModuleDiscovery::discoverAndRegister()`.

You can verify the status at any time with:

```bash
php spark jengo:modules patch --check
```

---

## CLI Commands

### Discover Modules
Scan and list all detected modules in the project:

```bash
php spark jengo:modules discover
```

### Cache Module Mapping
Compile and cache module PSR-4 mappings to `.jengo/cache/modules.php` for production environments:

```bash
php spark jengo:modules cache
```

### Clear Module Cache
Purge the cached module mappings:

```bash
php spark jengo:modules clear
```
