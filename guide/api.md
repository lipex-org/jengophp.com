# The Vault (API Suite)

"The Vault" provides a professional API foundation for Jengo applications, coming complete with JWT support and standardized JSON responses.

## Installation

Include the Vault during project creation:

```bash
jengo new my-app --api
```

Or add it to an existing project:

```bash
php spark jengo:setup api
```

Or install directly via composer and run:
```bash
php spark jengo:install api
```

## What it provides

Configuring the API suite:
1. Installs and configures `jengo/api` for automatic schema-backed REST routing, batch actions, and OpenAPI docs.
2. Publishes `app/Config/JengoApi.php` and connects routes in `app/Config/Routes.php`.

## Declarative API Responses

Jengo API leverages PHP 8 attributes to simplify custom API development. By applying the `#[API]` attribute to any controller or method, Jengo automatically intercepts the response and formats it into a standardized JSON structure.

```php
namespace App\Controllers;

use Jengo\Api\Attributes\API;

#[API]
class ProductController extends BaseController
{
    public function index()
    {
        // This will automatically be returned as JSON
        return ['status' => 'success', 'data' => ['name' => 'Jengo Pro']];
    }
}
```
