# Sudo Mode (Step-Up Authentication)

**Sudo Mode** in `jengo/auth` provides a GitHub-style privileged action verification system for CodeIgniter 4 applications. It allows sensitive endpoints (e.g. deleting repositories, transferring funds, viewing API secrets, changing billing) to require an elevated security verification challenge before proceeding.

---

## 1. How Sudo Mode Works

```
                       User clicks "Delete Organization"
                                      │
                                      ▼
                        #[Sudo] Controller Interceptor
                                      │
                         Is Sudo Session Active?
                         ├───► YES ──► Executes Action Immediately
                         │
                         └───► NO  ──► Prompts Verification Challenge
                                             │
               ┌─────────────────────────────┼─────────────────────────────┐
               ▼                             ▼                             ▼
        Passkey / Biometric            Authenticator App                Password /
         (TouchID / FaceID)                 (TOTP)                    Recovery Code
               │                             │                             │
               └─────────────────────────────┼─────────────────────────────┘
                                             ▼
                              Identity Confirmed!
                                             │
                                             ▼
                             Enters Sudo Mode (e.g. 2 Hours)
                             Resumes Original Action Seamlessly
```

Once a user verifies their identity via any of their enrolled security factors (Passkey, Authenticator app, Email OTP, or password), Jengo opens a **Sudo Grace Period** (default: 2 hours). During this window, subsequent sensitive actions proceed without interrupting the user.

---

## 2. Declarative Controller Protection (`#[Sudo]`)

Protect any controller method using the `#[Sudo]` attribute:

```php
<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Controllers\BaseController;
use Jengo\Auth\Attributes\Authenticate;
use Jengo\Auth\Attributes\Sudo;

#[Authenticate]
class RepositoryController extends BaseController
{
    // Standard actions proceed normally
    public function show(string $id)
    {
        return view('repo/show');
    }

    // Sensitive actions require Sudo verification
    #[Sudo(lifetime: '2 hours')]
    public function delete(string $id)
    {
        model('RepoModel')->delete($id);
        return redirect()->to('/dashboard')->with('success', 'Repository deleted.');
    }

    // Force an immediate fresh challenge (ignores active grace period)
    #[Sudo(forceFresh: true, factors: ['passkey', 'totp'])]
    public function revealDeployKeys(string $id)
    {
        return response()->setJSON(['key' => 'ssh-ed25519-secret...']);
    }
}
```

### Attribute Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `lifetime` | `int\|string` | `'2 hours'` | Grace period duration before re-verification is required (e.g. `'2 hours'`, `'15 minutes'`, `7200`). |
| `factors` | `array` | `['passkey', 'totp', 'password', 'email_otp', 'recovery_code']` | Whitelist of permitted verification factors for this action. |
| `forceFresh` | `bool` | `false` | When `true`, bypasses any active Sudo session and forces immediate verification. |
| `redirectTo` | `?string` | `null` | Custom redirect URL for HTML web clients (defaults to `/sudo`). |

---

## 3. Client Challenge Handling

When an unverified user requests a `#[Sudo]` route:

### REST APIs / Mobile Apps (`Accept: application/json`)
Returns an HTTP `403 Forbidden` with the `X-Jengo-Sudo-Required: true` header:

```json
{
  "status": "error",
  "sudo_required": true,
  "message": "This action requires elevated verification (Sudo Mode).",
  "available_factors": [
    { "id": "passkey", "label": "Passkey / Security Key", "icon": "fingerprint" },
    { "id": "totp", "label": "Authenticator App", "icon": "smartphone" },
    { "id": "password", "label": "Account Password", "icon": "lock" }
  ]
}
```

### Inertia.js SPAs & Traditional Web Requests
Saves the intended destination URL in session and redirects to `/sudo` (or displays an in-place challenge modal).

---

## 4. The Sudo Service & Global Helper

Access the `SudoManager` anytime via `sudo()` or `auth()->sudo()`:

```php
// Check if user is currently in Sudo mode
if (sudo()->check()) {
    $seconds = sudo()->secondsRemaining();
    $factor = sudo()->factorUsed(); // e.g. 'passkey'
}

// Manually activate Sudo mode for 1 hour
sudo()->activate('1 hour', 'passkey');

// Verify a factor and activate Sudo in one call
$verified = sudo()->verifyAndActivate(auth()->user(), 'totp', '123456');

// Immediately exit Sudo mode
sudo()->deactivate();
```

---

## 5. Built-in Endpoints

When auth routes are registered (`auth()->routes($routes)`), the following Sudo endpoints are enabled:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/sudo` | Renders challenge UI / lists available factors. |
| `POST` | `/sudo/challenge` | Generates challenge payload (e.g. WebAuthn assertion options). |
| `POST` | `/sudo/verify` | Verifies submitted proof (Passkey assertion, TOTP code, password) and activates Sudo. |
| `POST` | `/sudo/exit` | Exits Sudo mode immediately. |
