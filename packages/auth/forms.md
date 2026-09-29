# Auth Form Handlers

`jengo/auth` provides dedicated form handler classes responsible for processing incoming authentication requests, validating payloads, throttling brute-force attempts, and executing lifecycle operations.

Each form handler encapsulates validation rules, error handling, rate limiting, and event emission, allowing controllers or custom endpoints to remain clean and focused.

---

## Available Form Handlers

| Form Handler | Purpose | Primary Operation |
| :--- | :--- | :--- |
| `LoginFormHandler` | Validates credentials, checks rate limits, and issues sessions/tokens. | `$handler->handle($credentials, $remember)` |
| `RegisterFormHandler` | Validates user registration fields, hashes passwords, and saves records. | `$handler->handle($data)` |
| `ForgotPasswordFormHandler` | Validates email address and sends reset tokens/links. | `$handler->handle($email)` |
| `ResetPasswordFormHandler` | Validates reset tokens and sets new passwords. | `$handler->handle($token, $password)` |
| `MagicLinkFormHandler` | Generates and sends passwordless login tokens. | `$handler->handle($email)` |

---

## LoginFormHandler

`Jengo\Auth\Forms\LoginFormHandler` handles standard credential authentication (email/username and password).

### Basic Usage

```php
namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use Jengo\Auth\Forms\LoginFormHandler;

class AuthController extends ResourceController
{
    public function login()
    {
        $handler = new LoginFormHandler();

        $credentials = [
            'email'    => $this->request->getPost('email'),
            'password' => $this->request->getPost('password'),
        ];

        $remember = (bool) $this->request->getPost('remember');

        $result = $handler->handle($credentials, $remember);

        if (! $result->isSuccess()) {
            return redirect()->back()->withInput()->with('error', $result->getMessage());
        }

        return redirect()->to('/dashboard');
    }
}
```

### Rate Limiting & Lockout

The login form handler automatically invokes the smart rate limiter:

- Evaluates both IP address and targeted account identity.
- Increments failure counters upon invalid credentials.
- Enforces progressive lockout periods without blocking innocent users on shared corporate NATs.

---

## RegisterFormHandler

`Jengo\Auth\Forms\RegisterFormHandler` processes new user registration, validates uniqueness rules, hashes credentials securely, and triggers activation actions if configured.

### Basic Usage

```php
namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use Jengo\Auth\Forms\RegisterFormHandler;

class AuthController extends ResourceController
{
    public function register()
    {
        $handler = new RegisterFormHandler();

        $data = [
            'name'                  => $this->request->getPost('name'),
            'email'                 => $this->request->getPost('email'),
            'password'              => $this->request->getPost('password'),
            'password_confirmation' => $this->request->getPost('password_confirmation'),
        ];

        $result = $handler->handle($data);

        if (! $result->isSuccess()) {
            return redirect()->back()->withInput()->with('errors', $result->getErrors());
        }

        $user = $result->getUser();

        return redirect()->to('/login')->with('message', 'Registration complete. Please verify your email.');
    }
}
```

---

## ForgotPasswordFormHandler & ResetPasswordFormHandler

These handlers manage password recovery workflows.

### Requesting a Password Reset Link

```php
use Jengo\Auth\Forms\ForgotPasswordFormHandler;

public function forgotPassword()
{
    $handler = new ForgotPasswordFormHandler();
    $email = $this->request->getPost('email');

    $result = $handler->handle($email);

    return redirect()->back()->with('message', 'If that account exists, a reset link has been sent.');
}
```

### Resetting the Password

```php
use Jengo\Auth\Forms\ResetPasswordFormHandler;

public function resetPassword()
{
    $handler = new ResetPasswordFormHandler();

    $token = $this->request->getPost('token');
    $password = $this->request->getPost('password');
    $passwordConfirm = $this->request->getPost('password_confirmation');

    $result = $handler->handle($token, $password, $passwordConfirm);

    if (! $result->isSuccess()) {
        return redirect()->back()->with('error', $result->getMessage());
    }

    return redirect()->to('/login')->with('message', 'Password updated successfully. Please log in.');
}
```

---

## MagicLinkFormHandler

`Jengo\Auth\Forms\MagicLinkFormHandler` facilitates passwordless authentication by issuing signed, time-limited login tokens sent directly to user email addresses.

```php
use Jengo\Auth\Forms\MagicLinkFormHandler;

public function sendMagicLink()
{
    $handler = new MagicLinkFormHandler();
    $email = $this->request->getPost('email');

    $result = $handler->handle($email);

    return redirect()->back()->with('message', 'Magic login link sent to your email.');
}
```

---

## Customizing Form Handlers & Extending Validation

You can extend built-in form handlers or provide custom validation rules:

```php
namespace App\Authentication\Forms;

use Jengo\Auth\Forms\RegisterFormHandler as BaseRegisterHandler;

class CustomRegisterFormHandler extends BaseRegisterHandler
{
    protected function getValidationRules(): array
    {
        return array_merge(parent::getValidationRules(), [
            'company_name' => 'required|min_length[3]|max_length[100]',
            'terms'        => 'required|in_list[1,on,yes]',
        ]);
    }

    protected function beforeSave(array $data): array
    {
        $data['company_name'] = trim($data['company_name']);
        return $data;
    }
}
```
