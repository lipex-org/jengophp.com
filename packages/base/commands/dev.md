# Development Console & Runner

`jengo/base` includes an interactive development orchestrator and Terminal User Interface (TUI) console: `php spark jengo:dev`.

It replaces the need to manage multiple terminal tabs for your local PHP web server, Vite assets bundler, real-time log viewer, and background queues by orchestrating them concurrently inside a single terminal dashboard.

---

## Quick Start

Run the dev command from the root of your CodeIgniter 4 project:

```bash
php spark jengo:dev
```

When executed in an interactive terminal, Jengo launches a full-screen TUI dashboard with live log streaming, process health monitoring, memory usage tracking, and hotkey navigation.

---

## Default Managed Services

By default, `jengo:dev` inspects your project environment and coordinates the following services:

| Service | Command | Color | Description |
| :--- | :--- | :--- | :--- |
| **Server** | `php spark serve` | Green | Local CodeIgniter 4 development web server. |
| **Logs** | `php spark jengo:tail log` | Yellow | Real-time log streaming tail with live error and SQL query highlighting. |
| **Vite** | `npm run dev` | Cyan | Frontend asset bundler. Automatically booted when `VITE_ENABLED=true` in `.env`. |

---

## Interactive TUI Controls

The Development Console provides single-key keyboard shortcuts for monitoring and process control:

| Key | Action | Description |
| :--- | :--- | :--- |
| `0` or `a` | **All Logs** | Switch to the unified view aggregating logs from all active processes. |
| `1` - `9` | **Process Tab** | Switch focus directly to an individual process log buffer (e.g., `1` for Vite, `2` for Server). |
| `↑` / `↓` or `u` / `d` | **Scroll Logs** | Scroll up and down through historical log lines. |
| `End` or `G` | **Live Follow** | Jump back to the latest log output and resume live follow mode. |
| `c` | **Clear Buffer** | Clear the log display buffer for the current tab. |
| `r` | **Restart** | Restart all running child processes or the active tab's process. |
| `h` | **Diagnostics** | Print process diagnostic statuses, exit codes, and memory consumption. |
| `q` or `Ctrl+C` | **Quit** | Gracefully terminate all child processes and restore standard terminal settings. |

---

## Output Formats

For CI/CD runners, non-interactive shells, or IDE integrations, `jengo:dev` supports alternative output formats via `--format`:

### 1. Interactive TUI (Default)
```bash
php spark jengo:dev
```
Renders the full double-buffered TUI dashboard with tab bars, memory gauges, and interactive scrolling.

### 2. Stream Format
```bash
php spark jengo:dev --format stream
```
Streams all process outputs into an interleaved standard output stream prefixed with colored process tags:
```text
[Vite]   VITE v5.4.0 ready in 340 ms
[Server] CodeIgniter development server started on http://localhost:8080
[Logs]   [2026-09-29 14:30:00] DEBUG - Session initialized
```

### 3. JSON Lines (NDJSON)
```bash
php spark jengo:dev --format json
```
Emits structured JSON objects per line, ideal for log forwarders, Docker containers, or IDE tool windows:
```json
{"timestamp":"2026-09-29T14:30:00+00:00","process":"Server","message":"CodeIgniter development server started on http://localhost:8080"}
{"timestamp":"2026-09-29T14:30:01+00:00","process":"Vite","message":"VITE v5.4.0 ready in 340 ms"}
```

### 4. Compact Format
```bash
php spark jengo:dev --format compact
```
Suppresses routine log outputs and only renders high-level system notifications and exit state alerts.

---

## Registering Custom Tasks & Workers

You can register custom commands, background workers, or pre-flight initialization scripts to run alongside your development stack using the fluent `DevCommand` API.

Add registrations to `app/Config/Events.php` (or inside a custom Module / Service Provider):

```php
use Jengo\Base\Commands\DevCommand;

// 1. Register a background queue worker with auto-restart
DevCommand::spark('queue:work --tries=3', 'Queue')
    ->magenta()
    ->autoRestart();

// 2. Register a Tailwind CSS standalone compiler with file watching
DevCommand::register('npx tailwindcss -i ./app/Views/input.css -o ./public/css/app.css --watch', 'Tailwind')
    ->blue()
    ->watch('app/Views', 'modules');

// 3. Register a pre-flight sequential task that must finish before servers start
DevCommand::spark('migrate --all', 'Migrations')
    ->sequential();

// 4. Register a local mock mail or webhook service (e.g. Stripe CLI or Mailpit)
DevCommand::register('mailpit', 'Mailpit')
    ->green();
```

---

## Fluent Process Configuration (`DevProcessBuilder`)

The `DevCommand::register()` and `DevCommand::spark()` methods return a `DevProcessBuilder` instance supporting fluent configuration:

### `autoRestart(bool $enable = true)`
Automatically restarts the process if it terminates unexpectedly or crashes:
```php
DevCommand::spark('broadcasting:serve', 'WebSockets')
    ->autoRestart();
```

### `watch(string ...$paths)`
Monitors specific directories or files for changes and triggers an automatic restart of that specific process when changes are detected:
```php
DevCommand::spark('ai:sync-manifest', 'AI Syncer')
    ->watch('app/Ai/Tools', 'modules');
```

### `sequential(bool $enable = true)`
Executes the command as a blocking startup task before any concurrent background services are booted. If a sequential task exits with a non-zero code, `jengo:dev` halts startup with an error:
```php
DevCommand::spark('optimize', 'Optimize Cache')
    ->sequential();
```

### `dependsOn(string ...$labels)`
Specifies dependency ordering between background processes:
```php
DevCommand::spark('broadcasting:sse', 'SSE Worker')
    ->dependsOn('Server');
```

### Color Customization
Customize the ANSI badge color displayed in the tab bar and stream logs:
```php
$builder->green();    // ANSI 32
$builder->yellow();   // ANSI 33
$builder->blue();     // ANSI 34
$builder->magenta();  // ANSI 35
$builder->cyan();     // ANSI 36
$builder->red();      // ANSI 31
$builder->color('38;5;208'); // Custom 256-color ANSI code
```

---

## Filtering Default Tasks

If your workflow requires disabling certain default services (or running only a subset), use `DevCommand::only()` or `DevCommand::except()`:

```php
use Jengo\Base\Commands\DevCommand;

// Run only the PHP server and custom workers (omit Vite and Logs)
DevCommand::only('server');

// Or exclude specific default tasks
DevCommand::except('logs');
```

---

## Clean Process Lifecycle & Terminal Safety

`jengo:dev` includes process supervision and terminal state restoration:

- **Signal Handling**: Catches `SIGINT` (Ctrl+C), `SIGTERM`, and `SIGHUP` via `pcntl` to send termination signals to all running child process groups before exiting.
- **Terminal Restoration**: Automatically exits the alternate screen buffer (`\033[?1049l`), restores cursor visibility (`\033[?25h`), and resets `stty` canonical mode on shutdown, ensuring your shell prompt is never corrupted.
- **Memory Tracking**: Periodically inspects resident memory (`RSS`) for active child processes and displays live memory consumption directly in the status bar.
