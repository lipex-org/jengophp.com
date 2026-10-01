# Response Modifiers & Failure Handling

`jengo/base` features a pluggable response modification pipeline that standardizes how validation failures and domain errors are formatted across different client types (HTML forms, Inertia SPAs, and REST APIs).

---

## 1. The Response Pipeline

When validation fails or an application action encounters a client error, `ResponseHandler` dynamically negotiates the appropriate response strategy:

```
                  ┌───────────────────────────────┐
                  │ Incoming Request with Errors  │
                  └──────────────┬────────────────┘
                                 │
                 Is "X-Inertia" Header Present?
                ├───► YES ──► InertiaModifier (303 Redirect + Flash Errors)
                │
                Is "Accept: application/json"?
                ├───► YES ──► JsonModifier (422 JSON Payload)
                │
                └───► NO  ──► RedirectModifier (302 Redirect Back + Flash Session)
```

---

## 2. Built-in Modifiers

### 1. `RedirectModifier`
Used for standard server-rendered HTML applications. It redirects back to the previous page with:
- Error messages flashed to the session: `session()->getFlashdata('errors')`
- Form inputs repopulated in old input storage: `old('email')`
- Status code `302 Found`

### 2. `JsonModifier`
Used for REST APIs and mobile backends. It formats errors into a standardized JSON response:

```json
{
  "status": "error",
  "message": "The given data was invalid.",
  "errors": {
    "email": "An account with this email address already exists.",
    "password": "The password must be at least 8 characters long."
  }
}
```
HTTP status code: `422 Unprocessable Entity`.

### 3. `InertiaModifier`
Used for Inertia.js SPAs (React, Vue 3, Svelte):
- Returns an HTTP `303 See Other` redirect back to the current URL.
- Injects errors directly into the Inertia page `$page.props.errors` object without resetting form state or triggering full page refreshes.

---

## 3. The `response_handler()` Helper

You can use the global `response_handler()` helper to trigger standardized error responses manually inside custom filters, middleware, or controllers:

```php
use Config\Services;

$errors = [
    'email' => 'Invalid credentials provided.',
];

return response_handler()->validationFailed(
    errors: $errors,
    request: Services::request()
);
```

You can also explicitly specify a target modifier:

```php
use Jengo\Base\Modifiers\JsonModifier;

return response_handler()->validationFailed(
    errors: $errors,
    request: $request,
    modifierClass: JsonModifier::class
);
```

---

## 4. Writing a Custom Response Modifier

To support custom API formats (e.g. GraphQL error format, JSON:API specification, or legacy XML), implement `Jengo\Base\Contracts\ResponseModifierInterface`:

```php
<?php

declare(strict_types=1);

namespace App\Modifiers;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Config\Services;
use Jengo\Base\Contracts\ResponseModifierInterface;

class JsonApiModifier implements ResponseModifierInterface
{
    public function modify(array $errors, RequestInterface $request, array $options = []): ResponseInterface
    {
        $jsonApiErrors = [];

        foreach ($errors as $field => $message) {
            $jsonApiErrors[] = [
                'status' => '422',
                'source' => ['pointer' => "/data/attributes/{$field}"],
                'title'  => 'Invalid Attribute',
                'detail' => $message,
            ];
        }

        return Services::response()
            ->setStatusCode(422)
            ->setHeader('Content-Type', 'application/vnd.api+json')
            ->setJSON(['errors' => $jsonApiErrors]);
    }
}
```

You can then configure your custom modifier directly on a `FormHandler`:

```php
class CreateOrderForm extends FormHandler
{
    protected ?string $modifier = JsonApiModifier::class;
}
```
