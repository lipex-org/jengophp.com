# The Jengo Installer

The Jengo Installer (`jengo new`) is a powerful, interactive CLI tool designed to scaffold your entire application in seconds.

## Interactive Mode

By default, running `jengo new <app-name>` triggers an interactive wizard. The wizard will ask you to select:

1. **Starter Kit**: Choose between Default Blueprint (Blade-like PHP Views + Tailwind + Vite) or modern SPAs (React 19, Vue 3, Svelte 5 via Inertia.js).
2. **Package Manager**: Select `npm`, `pnpm`, `yarn`, or `bun`.
3. **Authentication Provider**: Choose between:
   - `Jengo Auth`: Unified authentication and Vima RBAC/ABAC authorization (`jengo/auth`)
   - `CodeIgniter Shield`: Official CodeIgniter 4 authentication (`codeigniter4/shield`)
   - `None`: Lean setup without authentication
4. **Ecosystem Packages**: Select modular packages to bundle into your application:
   - `jengo/api`: The Vault REST API Suite & OpenAPI
   - `jengo/schema`: Fluent declarative schema builder & TypeScript generator
   - `jengo/storage`: Multi-disk filesystem abstraction & image pipeline
   - `jengo/broadcasting`: Real-time SSE and WebSocket event broadcasting
   - `jengo/ai`: Multi-provider AI SDK and agent engine
   - `jengo/pdf`: Dual-driver PDF reporting engine
5. **Testing Suite**: Choose between standard PHPUnit or Pest PHP.
6. **Git Repository**: Initialize a Git repository with an initial scaffold commit.

## Non-Interactive Mode (CI/CD)

For automated setups or continuous integration pipelines, pass your preferences directly via command-line flags. The installer will skip prompts for any options provided.

### Example: React SPA with Jengo Auth and Full Ecosystem

```bash
jengo new my-app --kit=react --auth=jengo --all --pest --pm=pnpm
```

### Example: Using CodeIgniter Shield

```bash
jengo new my-app --kit=vue --shield --db=sqlite
```

### Example: Lean API Service

```bash
jengo new api-service --api --schema --no-auth --db=sqlite
```

### Available Flags

| Flag | Description | Default |
| :--- | :--- | :--- |
| `--kit=<name>` | Starter kit: `default`, `react`, `vue`, or `svelte` | `default` |
| `--auth[=<driver>]` | Authentication provider: `jengo` or `shield` | `false` |
| `--shield` | Install CodeIgniter Shield (shortcut for `--auth=shield`) | `false` |
| `--no-auth` | Explicitly skip authentication | `false` |
| `--all` | Install all ecosystem packages (`api`, `schema`, `storage`, `broadcasting`, `ai`, `pdf`) | `false` |
| `--api` | Install Jengo API Suite (`jengo/api`) | `false` |
| `--schema` | Install Jengo Schema builder & types (`jengo/schema`) | `false` |
| `--storage` | Install Jengo Storage & image pipeline (`jengo/storage`) | `false` |
| `--broadcasting` | Install Jengo Broadcasting (`jengo/broadcasting`) | `false` |
| `--ai` | Install Jengo AI SDK (`jengo/ai`) | `false` |
| `--pdf` | Install Jengo PDF engine (`jengo/pdf`) | `false` |
| `--pest` | Configure Pest PHP test runner | `false` |
| `--maizzle` | Configure Maizzle email template compiler | `false` |
| `--ts` | Configure TypeScript compiler support | `true` for SPAs |
| `--no-ts` | Skip TypeScript configuration | `false` |
| `--tailwind` | Include Tailwind CSS | `true` |
| `--no-tailwind` | Skip Tailwind CSS installation | `false` |
| `--pm=<manager>` | Package manager: `npm`, `pnpm`, `yarn`, or `bun` | `npm` |
| `--db=<driver>` | Database engine: `sqlite`, `mysql`, `postgres` | `sqlite` |
| `--git` / `--no-git` | Initialize Git repository | `true` |
| `--force` (`-f`) | Overwrite target directory if it already exists | `false` |
| `--dev` | Link local Jengo packages via Composer path repositories | `false` |
| `--dev-path=<path>` | Custom path to local packages root | Auto-detected |

## Current Directory Installation

If you've already created an empty directory and want to scaffold Jengo inside it, you can pass `.` as the application name:

```bash
mkdir my-app
cd my-app
jengo new .
```

The installer will automatically name your application based on the current directory name.

## Development Server

After scaffolding, start your local development environment using the `jengo dev` command:

```bash
cd my-app
jengo dev
```

This runs `php spark jengo:dev` under the hood, concurrently orchestrating the PHP local server, Vite asset compiler, queue listeners, and broadcasting channels in a unified terminal interface.

## Post-Install & Standalone Installers

Inside an existing application, you can run individual package installers at any time using `php spark jengo:install`:

```bash
# Enable first-party Dependency Injection across BaseController and routes
php spark jengo:install di

# Configure Pest PHP testing suite
php spark jengo:install pest

# Configure SQLite database and run migrations
php spark jengo:install db

# Configure Vite asset pipeline
php spark jengo:install vite

# Configure TypeScript support
php spark jengo:install ts

# Configure Maizzle email compilation
php spark jengo:install maizzle
```
