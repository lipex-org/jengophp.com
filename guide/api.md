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

## What it provides

Establishing the Vault does two main things:
1. Installs `firebase/php-jwt` for token handling.
2. Publishes a base `APIController` to your `app/Controllers` directory.

## Declarative API Responses

Jengo Base leverages PHP 8 attributes to simplify API development. By applying the `#[API]` attribute to a controller or method, Jengo automatically intercepts the response and formats it into a standardized JSON structure.

```php
namespace App\Controllers;

use Jengo\Base\Attributes\API;

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
