# Workers & CLI Commands

`jengo/queues` includes CLI commands for processing queues, monitoring queue health, and managing workers.

---

## Starting the Worker Daemon

Run the `jengo:queue work` command to start the worker process:

```bash
php spark jengo:queue work
```

### Worker Options

```bash
# Work a specific connection (e.g. redis or database)
php spark jengo:queue work redis

# Specify queue priority order (comma-separated)
php spark jengo:queue work redis --queue=high,default,low

# Control sleep when idle (seconds)
php spark jengo:queue work --sleep=5

# Set maximum attempts before marking as failed
php spark jengo:queue work --tries=3

# Set memory limit ceiling in megabytes
php spark jengo:queue work --memory=256

# Process a specific number of jobs and exit
php spark jengo:queue work --max-jobs=100
```

---

## Processing Single Jobs (`listen`)

The `listen` command processes incoming jobs synchronously:

```bash
php spark jengo:queue listen redis --queue=default
```

---

## Clearing Queues

Delete all pending jobs from a queue:

```bash
# Clear default queue on default connection
php spark jengo:queue clear

# Clear specific queue without confirmation prompt
php spark jengo:queue clear redis --queue=emails --force
```

---

## Checking Queue Status

Check the health and pending job counts of a connection:

```bash
php spark jengo:queue status database
php spark jengo:queue status redis
```

---

## Production Process Supervision (Supervisor & Systemd)

Worker processes are long-lived CLI daemons. In production, always supervise worker processes so that they automatically recover from memory limits or unexpected server restarts.

### Supervisor Configuration

Create `/etc/supervisor/conf.d/jengo-worker.conf`:

```ini
[program:jengo-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/my-app/spark jengo:queue work redis --queue=high,default,low --sleep=3 --tries=3 --max-jobs=1000
autostart=true
autorestart=true
user=www-data
numprocs=4
redirect_stderr=true
stdout_logfile=/var/www/my-app/writable/logs/worker.log
stopwaitsecs=3600
```

### Systemd Service Configuration

Create `/etc/systemd/system/jengo-worker@.service`:

```ini
[Unit]
Description=Jengo Queue Worker %i
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/my-app
ExecStart=/usr/bin/php /var/www/my-app/spark jengo:queue work redis --queue=high,default --sleep=3 --tries=3
Restart=always
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

---

## Concurrency & Driver Performance

- **Redis Driver**: Recommended for high throughput (thousands of jobs/min). Atomic Redis operations (`RPOPLPUSH`, `ZREMRANGEBYSCORE`) eliminate race conditions across multiple concurrent workers.
- **Database Driver**: Ideal for simple setups without extra infrastructure. Uses `reserved_at` lock timestamps. When scaling workers beyond 10+ processes, Redis is recommended to reduce database lock contention.
