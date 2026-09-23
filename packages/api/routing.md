# Publishing Routes & Swagger Documentation

Publish versioned endpoints, JSON OpenAPI specifications, and interactive Swagger UI in `app/Config/Routes.php`:

```php
// app/Config/Routes.php
use Jengo\Api\Router;
use Jengo\Api\Support\RouterOptions;
use Jengo\Api\Support\DocsOptions;

Router::publish($routes, new RouterOptions(
    version: 'v1',
    docs: new DocsOptions(
        route:   'docs',     // Serves OpenAPI JSON at /api/v1/docs
        uiRoute: 'docs/ui'   // Serves interactive Swagger UI at /api/v1/docs/ui
    )
));
```

## Multi-Version Routing

Chain mutations dynamically to serve multiple API versions concurrently:

```php
Router::publish($routes, new RouterOptions(version: 'v1'))
    ->mutate(new RouterOptions(version: 'v2'));
```
