# Post-Authentication Actions (2FA & Activation)

`jengo/auth` provides an extensible **Action Pipeline** allowing you to intercept authentication workflows for mandatory post-login challenges, such as **Two-Factor Authentication (2FA)** or **Email Account Activation**.

---

## 1. Two-Factor Authentication (`Email2FA`)

When 2FA is enabled for a user, `jengo/auth` interrupts the login session and redirects them to the action verification screen.

### How it Works:
1. `Email2FA::show()` generates a cryptographically secure 6-digit verification code.
2. Sends the code to the user's email via your pluggable `NotificationSenderInterface`.
3. Triggers the `mfaChallenge` event.
4. User submits the code. If valid and unexpired (5-minute TTL), authentication completes.

### Enabling in `app/Config/Auth.php`:

```php
public array $actions = [
    'login' => [
        \Jengo\Auth\Actions\Email2FA::class,
    ],
];
```

---

## 2. Account Activation (`EmailActivator`)

Requires newly registered users to verify their email before gaining full application access.

### How it Works:
1. When registered, user account status is set to `pending` with `active = 0`.
2. `EmailActivator::show()` generates a verification token and activation link.
3. User clicks the email link or enters the token.
4. On verification, user record is updated to `active = 1` and status becomes `active`.

### Enabling in `app/Config/Auth.php`:

```php
public array $actions = [
    'register' => [
        \Jengo\Auth\Actions\EmailActivator::class,
    ],
];
```

---

## 3. Creating Custom Actions

To build a custom action (e.g. Terms of Service Acceptance or Forced Password Reset), implement `Jengo\Auth\Contracts\AuthActionInterface`:

```php
<?php

declare(strict_types=1);

namespace App\Auth\Actions;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Jengo\Auth\Contracts\AuthActionInterface;
use Jengo\Auth\DTOs\AuthResponseData;
use Jengo\Auth\Entities\User;

class RequireTermsAcceptance implements AuthActionInterface
{
    public function getActionName(): string
    {
        return 'terms_acceptance';
    }

    public function show(RequestInterface $request, User $user): ResponseInterface
    {
        $data = new AuthResponseData(
            action: 'action.show',
            message: 'Please review and accept our updated Terms of Service.',
            data: ['action' => 'terms_acceptance'],
            user: $user
        );

        return auth()->renderResponse('action.show', $data, $request);
    }

    public function verify(RequestInterface $request, User $user): bool
    {
        $accepted = (bool) ($request->getPost('accept_terms') ?? false);
        if ($accepted) {
            $user->terms_accepted_at = date('Y-m-d H:i:s');
            auth()->getUserModel()->save($user);
            return true;
        }

        return false;
    }
}
```
