# Configuration

The published `app/Config/Search.php` file defines your default search engine, engine host connections, credentials, and index prefixes.

```php
<?php

namespace Config;

use Jengo\Search\Config\Search as BaseSearch;

class Search extends BaseSearch
{
    /**
     * Default search driver ('meilisearch', 'typesense', 'database', 'null').
     */
    public string $default = 'meilisearch';

    /**
     * Global index prefix (useful for multi-tenant or shared environments).
     */
    public string $prefix = '';

    /**
     * Whether model indexing/de-indexing should be queued asynchronously (via jengo/queues).
     * Defaults to true when jengo/queues is available.
     */
    public bool $queue = true;

    /**
     * Driver configurations.
     */
    public array $drivers = [
        'meilisearch' => [
            'host'    => 'http://localhost:7700',
            'key'     => 'masterKey',
            'timeout' => 5,
        ],

        'typesense' => [
            'nodes' => [
                [
                    'host'     => 'localhost',
                    'port'     => 8108,
                    'protocol' => 'http',
                ],
            ],
            'key'     => 'xyz123',
            'timeout' => 5,
        ],

        'database' => [
            'group'   => 'default',
            'mode'    => 'natural', // 'natural', 'boolean', 'query_expansion'
        ],

        'null' => [],
    ];
}
```

---

## Environment Configuration (.env)

CodeIgniter 4 automatically populates configuration class properties using dot-notation environment variables matching the config class name:

```ini
# Default driver & prefix
search.default = 'meilisearch'
search.prefix = 'app_'

# Meilisearch Driver
search.drivers.meilisearch.host = 'http://localhost:7700'
search.drivers.meilisearch.apiKey = 'your_meilisearch_master_key'

# Typesense Driver
search.drivers.typesense.nodes.0.host = 'localhost'
search.drivers.typesense.nodes.0.port = '8108'
search.drivers.typesense.nodes.0.protocol = 'http'
search.drivers.typesense.apiKey = 'your_typesense_api_key'
```
