# Form Handlers & Validation

`jengo/base` introduces an enterprise-grade form handling and validation layer for CodeIgniter 4. It eliminates controller validation boilerplate through declarative PHP 8 attributes, strongly-typed data transfer objects (`ValidatedData`), automatic JSON body parsing, route parameter injection, and transparent Sqids ID deobfuscation.

---

## 1. Why Form Handlers?

In traditional CodeIgniter 4 applications, validation logic is typically manually written inside controllers or model callbacks:

```php
// Traditional CI4 Controller: Boilerplate & Unsafe Unvalidated Input Leakage
public function store()
{
    if (!$this->validate(['email' => 'required|valid_email', 'name' => 'required'])) {
        return redirect()->back()->withInput()->with('errors', $this->validator->getErrors());
    }

    $rawInput = $this->request->getPost(); // Contains unchecked raw fields
}
```

**Jengo Form Handlers solve this with 4 core principles:**
1. **Separation of Concerns**: Encapsulate validation rules, custom error messages, route parameter bindings, and response behavior in dedicated, testable classes.
2. **Zero-Boilerplate Controllers**: Use the `#[Validate(FormClass::class)]` attribute to automatically intercept requests, validate payloads, and short-circuit invalid requests with formatted redirects or 422 JSON errors before your controller action even runs.
3. **Type-Safe `ValidatedData` DTO**: Restrict access *only* to validated keys through typed getters (`getInt()`, `getString()`, `getBoolean()`, `getDateTime()`).
4. **Multi-Source Ingestion & Deobfuscation**: Automatically parse and merge query strings (GET), form data (POST), raw JSON request bodies, and route parameters, automatically converting obfuscated Sqids IDs back into integers.

---

## 2. Defining a Form Handler

Form handlers extend `Jengo\Base\Validation\FormHandler` and define their validation rules:

```php
<?php

declare(strict_types=1);

namespace App\Forms\Users;

use Jengo\Base\Validation\FormHandler;

class StoreUserForm extends FormHandler
{
    /**
     * Validation rules (mandatory).
     *
     * @var array<string, string|list<string>>
     */
    protected array $rules = [
        'organization_id' => 'required|integer',
        'name'            => 'required|min_length[3]|max_length[100]',
        'email'           => 'required|valid_email|is_unique[users.email]',
        'role'            => 'required|in_list[admin,manager,editor]',
        'is_active'       => 'permit_empty|in_list[0,1,true,false]',
    ];

    /**
     * Custom validation error messages (optional).
     *
     * @var array<string, array<string, string>>
     */
    protected array $messages = [
        'email' => [
            'is_unique' => 'An account with this email address already exists.',
        ],
        'organization_id' => [
            'required' => 'Please select a valid organization.',
        ],
    ];
}
```

> [!IMPORTANT]
> A `FormHandler` must define non-empty validation rules in its `$rules` property or by overriding the `getRules()` method. If a handler is executed without rules, Jengo will immediately throw a `\LogicException` to alert you during development.

---

## 3. Dynamic Rules with `getRules()`

If your validation rules depend on runtime state (such as the current authenticated user or route context), override the `getRules()` method:

```php
<?php

declare(strict_types=1);

namespace App\Forms\Users;

use Jengo\Base\Validation\FormHandler;

class UpdateProfileForm extends FormHandler
{
    public function getRules(): array
    {
        $userId = auth()->id() ?? 0;

        return [
            'name'  => 'required|min_length[3]',
            'email' => "required|valid_email|is_unique[users.email,id,{$userId}]",
            'bio'   => 'permit_empty|max_length[500]',
        ];
    }
}
```

---

## 4. Route Parameters & ID Obfuscation

Form handlers can seamlessly ingest and deobfuscate parameters from URL routes and query strings.

### Route Parameters Binding (`$routeParams`)

Map URL route segment indices into named fields to validate URL parameters alongside payload bodies:

```php
class UpdateUserRoleForm extends FormHandler
{
    /**
     * Map router parameter index 0 ($userId in routes.php) to field 'user_id'.
     */
    protected array $routeParams = [
        'user_id' => 0,
    ];

    protected array $rules = [
        'user_id' => 'required|integer',
        'role'    => 'required|in_list[admin,member,viewer]',
    ];
}
```

### Automatic Sqids Deobfuscation (`$obfuscatedFields`)

If your application uses public obfuscated Sqids strings (e.g. `X8kLm9`), configure `$obfuscatedFields`. Jengo will validate the payload and then automatically decode the string hash back into a raw database integer:

```php
class TransferAccountForm extends FormHandler
{
    protected array $routeParams = [
        'account_id' => 0, // e.g. /accounts/a7B9kP/transfer
    ];

    /**
     * Automatically deobfuscate Sqids hashes into integer IDs after validation.
     */
    protected array $obfuscatedFields = [
        'account_id',
        'target_user_id',
    ];

    protected array $rules = [
        'account_id'     => 'required',
        'target_user_id' => 'required',
        'amount'         => 'required|numeric|greater_than[0]',
    ];
}
```

---

## 5. Declarative Controller Validation (`#[Validate]`)

Use the `#[Validate]` attribute on any controller method. Jengo's controller filter will execute the form handler before entering your method:

```php
<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Forms\Users\StoreUserForm;
use App\Forms\Users\UpdateUserRoleForm;
use Jengo\Base\Attributes\Validate;

class UsersController extends BaseController
{
    #[Validate(StoreUserForm::class)]
    public function store()
    {
        // 1. Retrieve the validated DTO
        $data = form()->validated();

        // 2. Safe, typed access to validated fields
        $user = model('UserModel')->create([
            'organization_id' => $data->getInt('organization_id'),
            'name'            => $data->getString('name'),
            'email'           => $data->getString('email'),
            'role'            => $data->getString('role'),
            'is_active'       => $data->getBoolean('is_active', true),
        ]);

        return redirect()->to("/users/{$user->id}")->with('success', 'User created successfully.');
    }

    #[Validate(UpdateUserRoleForm::class)]
    public function updateRole(string $obfuscatedId)
    {
        // Route param 'user_id' is already deobfuscated and available in validated data
        $userId = form()->validated()->getInt('user_id');
        $newRole = form()->validated()->getString('role');

        model('UserModel')->update($userId, ['role' => $newRole]);

        return response()->setJSON(['status' => 'success']);
    }
}
```

### What Happens on Validation Failure?
When validation fails, the `#[Validate]` filter automatically halts execution and produces a response tailored to the client:
- **API / JSON Requests (`Accept: application/json` or `Content-Type: application/json`)**: Returns an RFC-compliant `422 Unprocessable Entity` JSON response containing the field errors.
- **Inertia Requests (`X-Inertia: true`)**: Performs a `303 See Other` redirect back with error props flashed into the Inertia session.
- **Standard Web Requests**: Performs a redirect back with previous input and error messages in the flash session (`session()->getFlashdata('errors')`).

---

## 6. Type-Safe `ValidatedData` DTO

The `ValidatedData` DTO ensures that unvalidated input keys are completely excluded, and provides convenient type-casting methods:

```php
$validated = form()->validated();

// 1. Primitive Getters with Optional Defaults
$name      = $validated->getString('name');              // string
$age       = $validated->getInt('age', 18);              // int
$score     = $validated->getFloat('score', 0.0);         // float
$isActive  = $validated->getBoolean('is_active', false); // bool (interprets 1, '1', 'true', 'on')
$tags      = $validated->getArray('tags');               // array
$startDate = $validated->getDateTime('start_date');      // ?\DateTimeImmutable

// 2. Presence & Inspection
if ($validated->has('optional_notes')) {
    $notes = $validated->getString('optional_notes');
}

// 3. Scoped Source Inspection
$queryParam = $validated->get('search');       // Extracted from $_GET
$formField  = $validated->post('password');    // Extracted from $_POST
$jsonField  = $validated->json('payload_id');  // Extracted from JSON body
$routeId    = $validated->router('user_id');   // Extracted from URI route param
$anyValue   = $validated->any('user_id');      // First non-null match across all sources

// 4. Export all validated fields as a clean array
$cleanArray = $validated->toArray();
```

---

## 7. Custom Response Modifiers

You can customize how a form handler responds upon validation failure by specifying a custom response modifier:

```php
<?php

declare(strict_types=1);

namespace App\Forms;

use Jengo\Base\Modifiers\JsonModifier;
use Jengo\Base\Validation\FormHandler;

class ApiRegisterForm extends FormHandler
{
    /**
     * Explicitly force JSON 422 responses regardless of client request headers.
     */
    protected ?string $modifier = JsonModifier::class;

    protected array $rules = [
        'api_key' => 'required|min_length[32]',
        'device'  => 'required',
    ];
}
```

### Available Built-in Modifiers
- `Jengo\Base\Modifiers\RedirectModifier`: Standard web redirect with flash errors and old input.
- `Jengo\Base\Modifiers\JsonModifier`: Structured JSON response with HTTP 422 status code.
- `Jengo\Base\Modifiers\InertiaModifier`: Inertia protocol-compliant redirect with flashed validation errors.

---

## 8. Failure Events & Telemetry

When validation fails, `FormHandler` triggers the `jengo.form.failed` event, allowing you to log security audits or dynamically override the response:

```php
use CodeIgniter\Events\Events;
use Jengo\Base\Validation\FormFailedResponseHolder;

Events::on('jengo.form.failed', static function (FormFailedResponseHolder $holder) {
    $errors = $holder->getErrors();
    $request = $holder->getRequest();

    log_message('notice', 'Validation failure on {uri}: {errors}', [
        'uri'    => $request->getUri()->getPath(),
        'errors' => json_encode($errors),
    ]);

    // Optionally override the response completely:
    // $holder->setResponse(response()->setStatusCode(400)->setJSON(['custom' => 'payload']));
});
```

---

## 9. Manual Validation (Without Attribute)

If you need to run validation imperatively inside a service, queue job, or custom controller flow:

```php
$form = new StoreUserForm();

if (!$form->validate()) {
    $errors = $form->getErrors();
    return $form->redirectOrJson($errors, service('request'));
}

$validated = $form->validated();
// Process validated data...
```
