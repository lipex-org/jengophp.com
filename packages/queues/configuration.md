# Configuration

Configure default queue drivers, database connections, Redis settings, and failure tracking.

The configuration file is published to `app/Config/Queue.php`.

---

## Configuration Overview

```php
<?php

namespace Config;

use Jengo\Queues\Config\Queue as BaseQueue;

class Queue extends BaseQueue
{
    /**
     * Default queue connection name.
     */
    public string $default = 'sync';

    /**
     * Global queue prefix applied to all queues.
     */
    public string $prefix = '';

    /**
     * Connection definitions.
     */
    public array $connections = [
        'sync' => [
            'driver' => 'sync',
            'queue'  => 'default',
        ],

        'database' => [
            'driver'     => 'database',
            'queue'      => 'default',
            'retryAfter' => 90,
            'DBGroup'    => 'default',
        ],

        'redis' => [
            'driver'     => 'redis',
            'host'       => '127.0.0.1',
            'port'       => 6379,
            'password'   => null,
            'database'   => 0,
            'timeout'    => 5.0,
            'queue'      => 'default',
            'retryAfter' => 90,
        ],

        'null' => [
            'driver' => 'null',
        ],
    ];

    /**
     * Failed job storage configuration.
     */
    public array $failed = [
        'DBGroup' => 'default',
    ];
}
```

---

## Connection Settings

### Sync Connection
The `sync` driver runs all pushed jobs immediately in the same PHP process. This is the default in development and for quick local testing.

### Database Connection
The `database` driver stores pending and reserved jobs in the fixed `queue_jobs` table.
- `DBGroup`: Database connection group configured in `app/Config/Database.php`.
- `retryAfter`: Time in seconds after which an uncompleted reserved job is released back to the worker pool (default: `90`).

### Redis Connection
The `redis` driver provides high throughput by utilizing Redis lists (`LPUSH`/`RPOP`) and sorted sets for delayed jobs (`ZADD`).
- `host`: Redis host IP or hostname.
- `port`: Port number (default `6379`).
- `password`: Redis password (optional).
- `database`: Redis database index (default `0`).
- `retryAfter`: Reserved job expiration threshold in seconds (default `90`).
