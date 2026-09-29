# Diagnostics & Logs (`jengo:health`, `jengo:audit`, `jengo:tail`)

`jengo/base` includes diagnostic commands to inspect application health, perform code audits, and stream logs in real time.

---

## 1. Health Checks (`jengo:health`)

Runs system diagnostics across your environment, database connectivity, required PHP extensions, directory permissions, and framework configurations:

```bash
php spark jengo:health
```

Output includes:
- PHP version and active extensions (`intl`, `mbstring`, `curl`, `json`, `sqlite3` or `pdo_mysql`)
- Environment mode (`development`, `testing`, `production`)
- Writable directory permissions (`writable/cache`, `writable/logs`, `writable/session`)
- Database connection status and latency

---

## 2. Code Quality & Security Audit (`jengo:audit`)

Inspects your codebase for structural conventions, security hardening, and framework best practices:

```bash
php spark jengo:audit
```

Audit checks:
- Verifies CSRF protection status in `Config/Filters.php`
- Checks for unhashed password exposures or missing strict types
- Validates that registered modules conform to PSR-4 autoload rules
- Checks for orphaned config entries and missing migration files

---

## 3. Real-Time Log Streaming (`jengo:tail`)

Streams CodeIgniter 4 log entries directly to your terminal as they are written:

```bash
php spark jengo:tail log
```

### Options:
- `--lines=<N>`: Number of initial log lines to display (default: 20).
- `--level=<level>`: Filter output by log level (`ERROR`, `WARNING`, `INFO`, `DEBUG`).
- `--clear`: Clear today's log file before starting the stream.

### Color-Coded Log Highlights:
- **`CRITICAL` / `ERROR`**: Highlighted in red with stack traces expanded.
- **`WARNING`**: Highlighted in yellow.
- **`DEBUG` / `INFO`**: Rendered in muted gray/cyan.
- **SQL Queries**: Highlighted with table names and parameter bindings emphasized.
