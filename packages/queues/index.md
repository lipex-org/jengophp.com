# Introduction to Jengo Queues

`jengo/queues` is an asynchronous job queue and worker management subsystem for CodeIgniter 4 and the Jengo Framework.

It enables offloading time-consuming tasks (such as sending emails, processing file uploads, executing AI workloads, syncing search indexes, or calling third-party APIs) to background workers with support for multiple drivers, automatic retry backoffs, worker daemons, failed job management, and zero external SDK dependencies.

---

## Key Features

- **Multi-Driver Queue Subsystem**: First-class support for **Redis**, **Database (MySQL/PostgreSQL/SQLite)**, **Sync (immediate execution)**, and **Null** drivers.
- **Zero Third-Party SDK Bloat**: Pure PHP native implementations utilizing standard Redis socket extensions and CodeIgniter 4 database connections.
- **Declarative Job Contracts & Traits**: Easy job authoring using `ShouldQueue`, `Queueable`, and `InteractsWithQueue` traits.
- **Delayed & Scheduled Jobs**: Postpone execution by seconds or timestamp targets with automatic delayed queue migration.
- **Resilient Worker Daemon**: Robust worker execution loop supporting memory ceilings, timeouts, retry attempts, sleep backoff, and graceful stopping.
- **Failed Job Management**: Automatic logging of failed jobs to database tables with CLI commands for inspection, selective retry, bulk retrying, and pruning.
- **Testing Capabilities**: Instant `Queue::fake()` support with PHPUnit assertions (`assertPushed`, `assertPushedTimes`, `assertPushedOn`, `assertNothingPushed`).
- **CLI Commands**: Unified `php spark jengo:queue` CLI master command with `work`, `listen`, `failed`, `clear`, and `status` variants.
