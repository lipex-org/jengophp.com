# CLI Spark Commands

## `php spark storage:link`

Connects `writable/storage/app/public` to `public/storage` via a symbolic link.

```bash
php spark storage:link
php spark storage:link --force
```

## `php spark storage:cleanup`

Deletes stale temporary upload chunks and orphaned files older than a specified duration.

```bash
php spark storage:cleanup --hours=24
```
