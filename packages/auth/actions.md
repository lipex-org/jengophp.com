# Post-Authentication Actions (2FA & Activation)

`jengo/auth` provides an extensible **Action Pipeline** allowing you to intercept authentication workflows for mandatory post-login challenges, such as **Two-Factor Authentication (2FA)** or **Email Account Activation**.

---

## 1. Two-Factor Authentication (`Email2FA`)

When 2FA is enabled for a user, `jengo/auth` interrupts the login session and redirects them to the action verification screen (`auth/action/show`).

### How it Works:
1. `Email2FA::show()` generates a cryptographically secure 6-digit verification code.
2. Sends the code to the user's email via your pluggable `NotificationSenderInterface`.
3. Triggers the `mfaChallenge` event.
4. User submits the code. If valid and unexpired (5-minute TTL), authentication completes.
5. Users can click **Resend Code** (POST `/auth/action/challenge`) to issue a fresh code or **Cancel** (POST `/auth/action/cancel`) to abort and clear pending state.

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

Requires newly registered users to verify their email via a 6-digit security code before gaining full application access.

### How it Works:
1. When registered, user account status is set to `pending` with `active = 0`.
2. `EmailActivator::show()` generates a 6-digit activation code and sends an email notification.
3. User enters the code on the verification challenge screen.
4. On verification, user record is updated to `active = 1` and status becomes `active`.
5. Supports resending fresh activation codes via `POST /auth/action/challenge`.

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

To build a custom action (e.g. Terms of Service Acceptance or Forced Password Reset), implement `Jengo\Auth\Contracts\AuthActionInterface`. If your action supports re-issuing challenges (e.g. resending SMS codes), use the `HasActionChallenge` trait:

```php
<?php

declare(strict_types=1);

namespace App\Auth\Actions;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Jengo\Auth\Concerns\HasActionChallenge;
use Jengo\Auth\Contracts\AuthActionInterface;
use Jengo\Auth\DTOs\AuthResponseData;
use Jengo\Auth\Entities\User;

class RequireTermsAcceptance implements AuthActionInterface
{
    use HasActionChallenge;

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

    /**
     * Optional: Re-issue or reset challenge state.
     */
    public function challenge(RequestInterface $request, User $user): ResponseInterface
    {
        $data = new AuthResponseData(
            action: 'action.challenge',
            status: 'info',
            message: 'Terms challenge refreshed.',
            redirectTo: auth_url('auth.action.show'),
            user: $user
        );

        return auth()->renderResponse('action.challenge', $data, $request);
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

---

## 4. Action-Specific View Resolution

You can customize the HTML view or Inertia component for specific actions in `app/Config/Auth.php` using the action's identifier:

```php
// app/Config/Auth.php
public array $views = [
    // Global fallback view for all action challenges:
    'action_mfa'               => 'Pages/Auth/DefaultActionChallenge',

    // Action-specific view overrides (matched by getActionName()):
    'action_email_2fa'         => 'Pages/Auth/EmailTwoFactorChallenge',
    'action_terms_acceptance'  => 'Pages/Auth/TermsOfServiceModal',
    'action_sms_otp'           => 'App\Views\Auth\sms_otp_challenge',
];
```

### Resolution Priority Order

When rendering an action view:
1. **Explicit View on DTO**: `$data->view` provided directly by the action class.
2. **Action-Specific Config Key**: `config('Auth')->views['action_' . $actionName]` (or `action_mfa_{actionName}`).
3. **Global Action Fallback**: `config('Auth')->views['action_mfa']`.
4. **Default Built-in View**: `Jengo\Auth\Views\mfa_challenge` (or `auth/mfa_challenge` for Inertia).

---

## 5. Cancelling Pending Actions

If a user wishes to cancel out of a pending authentication action, the route `POST /auth/action/cancel` (`auth.action.cancel`) clears all pending session state (`auth_pending_user_id`, `auth_pending_actions`) and safely redirects back to the login screen.


