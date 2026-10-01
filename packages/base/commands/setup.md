# Setup Hub (`jengo:setup`)

The `jengo:setup` command provides an interactive, progressive enhancement hub for bootstrapping first-party Jengo package suites and community tools into your CodeIgniter 4 application.

For detailed information on writing custom setups or extending the setup pipeline, see the [Setup Hub Architecture](/packages/base/setups) guide.

---

## 1. Interactive Menu Mode

Running `php spark jengo:setup` without arguments presents an interactive menu of all registered setup blueprints:

```bash
php spark jengo:setup
```

The CLI wizard will prompt you to select an architectural blueprint, confirm prerequisites, and execute all database migrations, configuration publishing, and route bindings.

---

## 2. Direct Target Execution

You can bypass the interactive menu by specifying the target directly:

```bash
# Core Jengo helper library & modular autoloading
php spark jengo:setup core

# Unified Jengo Auth Suite with Vima RBAC/ABAC
php spark jengo:setup auth

# CodeIgniter Shield with custom Blueprint UI views
php spark jengo:setup shield-auth

# Jengo REST API Vault & OpenAPI generator
php spark jengo:setup api

# Inertia.js (React / Vue 3 / Svelte) SPA adapter
php spark jengo:setup inertia
```

---

## 3. Difference Between `install` and `setup`

| Command | Purpose |
| :--- | :--- |
| `php spark jengo:install <name>` | Low-level, non-interactive atomic component installer (e.g. `di`, `vite`, `db`, `pest`). |
| `php spark jengo:setup <target>` | High-level, interactive multi-step architectural blueprint (e.g. `auth`, `api`, `shield-auth`). |
