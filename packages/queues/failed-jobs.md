# Failed Jobs Management

When a job exceeds its maximum retry attempts or encounters an unhandled exception, `jengo/queues` captures the execution context and records it into the failed jobs table.

---

## Listing Failed Jobs

View all failed jobs stored in the database:

```bash
php spark jengo:queue failed list
```

---

## Retrying Failed Jobs

### Retry a Specific Job
Pass the ID of the failed job:

```bash
php spark jengo:queue failed retry 14
```

### Retry All Failed Jobs
Retry all failures across all queues:

```bash
php spark jengo:queue failed retry all
```

Or retry failed jobs for a specific queue:

```bash
php spark jengo:queue failed retry all --queue=emails
```

---

## Forgetting / Deleting Failed Jobs

Remove a failed job permanently without retrying:

```bash
php spark jengo:queue failed forget 14
```

---

## Flushing Failed Jobs

Delete all failed jobs older than a specified duration or clear the entire failed jobs table:

```bash
# Flush all failed jobs
php spark jengo:queue failed flush

# Flush failed jobs older than 48 hours
php spark jengo:queue failed flush --hours=48
```

---

## Programmatic Failed Job Management

You can also interact with failed jobs directly in PHP:

```php
use Config\Services;

$failedManager = Services::queueFailedJobs();

// Get total failed count
$count = $failedManager->count();

// Retrieve all failed records
$allFailed = $failedManager->all();

// Retry a specific job
$failedManager->retry(14);
```
