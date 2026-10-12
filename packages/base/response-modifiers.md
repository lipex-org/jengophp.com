# Validation Response Modifiers & Failure Handling

`jengo/base` features a pluggable validation response modification pipeline that standardizes how validation failures and domain errors are formatted across different client types (HTML forms, Inertia SPAs, and REST APIs).

---

## 1. The Response Pipeline

When validation fails, `ResponseHandler` uses a 3-tier precedence hierarchy to negotiate the appropriate response modifier:

1. **Per-Request Override (Highest Priority)**: Configured directly on the `#[Validate(FormClass::class, modifier: ...)]` attribute, or overridden dynamically via `$form->setModifier(...)`.
2. **Per-Form Default**: Declared as the `$modifier` property on the specific `FormHandler` class.
3. **Global Configuration (Fallback)**: Configured in `Config\Jengo::$validationResponseModifier` (defaults to `UniversalModifier::class`).

```
                  ┌───────────────────────────────┐
                  │ Incoming Request with Errors  │
                  └──────────────┬────────────────┘
                                 │
                 Is "X-Inertia" Header Present?
                ├───► YES ──► InertiaModifier (302/303 Redirect + Flash Errors)
                │
                Is "Accept: application/json" or AJAX?
                ├───► YES ──► JsonModifier (422 JSON Payload)
                │
                └───► NO  ──► StandardViewModifier (302 Redirect Back + Flash Session)
```

---

## 2. Built-in Modifiers

All built-in modifiers reside in the `Jengo\Base\Validation\Modifiers` namespace:

### 1. `UniversalModifier` (`Jengo\Base\Validation\Modifiers\UniversalModifier`)
The default smart modifier. It inspects the incoming request and dynamically resolves to:
- `InertiaModifier` when an `X-Inertia` header is detected.
- `JsonModifier` when the request is AJAX or requests `application/json`.
- `StandardViewModifier` for standard web browser form submissions.

### 2. `JsonModifier` (`Jengo\Base\Validation\Modifiers\JsonModifier`)
Used for REST APIs and AJAX endpoints. It formats errors into a standardized JSON response:

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

### 3. `InertiaModifier` (`Jengo\Base\Validation\Modifiers\InertiaModifier`)
Used for Inertia.js SPAs (React, Vue 3, Svelte):
- Verifies that `jengo/inertia` is installed (throws a descriptive `RuntimeException` if missing).
- Flashes error messages to the session (`errors`) and Inertia shared flash storage.
- Performs a redirect back with input so Inertia receives the updated `$page.props.errors` without a full page refresh.

### 4. `StandardViewModifier` (`Jengo\Base\Validation\Modifiers\StandardViewModifier`)
Used for standard server-rendered HTML applications:
- Error messages flashed to the session: `session()->getFlashdata('errors')`
- Form inputs repopulated in old input storage: `old('email')`
- Redirects back with status code `302 Found`.

---

## 3. Precedence & Configuration

### Level 1: Per-Request (Attribute Override)
You can override the modifier for a specific controller endpoint via the `#[Validate]` attribute:

```php
use App\Forms\RegisterForm;
use Jengo\Base\Attributes\Validate;
use Jengo\Base\Validation\Modifiers\JsonModifier;

class AuthController extends BaseController
{
    #[Validate(RegisterForm::class, modifier: JsonModifier::class)]
    public function register()
    {
        $data = form()->validated();
        // ...
    }
}
```

### Level 2: Per-Form (Form Default)
You can declare a default modifier on a specific `FormHandler` subclass:

```php
namespace App\Forms;

use Jengo\Base\Validation\FormHandler;
use Jengo\Base\Validation\Modifiers\InertiaModifier;

class UpdateProfileForm extends FormHandler
{
    protected ?string $modifier = InertiaModifier::class;

    protected array $rules = [
        'name'  => 'required|min_length[3]',
        'email' => 'required|valid_email',
    ];
}
```

### Level 3: Global Config (`Config\Jengo`)
Configure the ecosystem-wide default in `app/Config/Jengo.php`:

```php
namespace Config;

use Jengo\Base\Config\Jengo as BaseJengo;
use Jengo\Base\Validation\Modifiers\UniversalModifier;

class Jengo extends BaseJengo
{
    /**
     * Global response modifier class for validation failures.
     */
    public ?string $validationResponseModifier = UniversalModifier::class;
}
```

---

## 4. The `response_handler()` Helper

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

You can also explicitly pass a target modifier class:

```php
use Jengo\Base\Validation\Modifiers\JsonModifier;

return response_handler()->validationFailed(
    errors: $errors,
    request: $request,
    modifierClass: JsonModifier::class
);
```

---

## 5. Writing a Custom Response Modifier

To support custom API formats (such as JSON:API, GraphQL, or legacy envelope schemas), implement `Jengo\Base\Contracts\ResponseModifierInterface`:

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
    public function modifyValidationFailed(array $errors, RequestInterface $request, array $options = []): ResponseInterface
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

