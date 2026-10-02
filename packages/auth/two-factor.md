# Pluggable Multi-Factor & Passkeys

`jengo/auth` provides a driver-based **Two-Factor Authentication (MFA)** subsystem. Rather than hardcoding a single method, Jengo decouples factor verification into reusable, pluggable drivers that power **Login MFA**, **Sudo Mode**, and **User Security Settings**.

---

## 1. Supported First-Party Drivers

| Factor Driver | Identifier | Description |
| :--- | :--- | :--- |
| **Passkeys / WebAuthn** | `passkey` | FIDO2 hardware keys, Touch ID, Face ID, and Windows Hello. |
| **Authenticator App** | `totp` | RFC 6238 6-digit rolling codes (Google Authenticator, 1Password, Authy). |
| **Email Verification** | `email_otp` | 6-digit one-time code sent to the user's primary email. |
| **Recovery Codes** | `recovery_code` | Single-use emergency backup codes (`xxxx-xxxx`). |
| **Account Password** | `password` | Re-verification using current account password hash. |

---

## 2. Configuration (`Config/Auth.php`)

Configure available drivers and default preferences in `app/Config/Auth.php`:

```php
public array $twoFactor = [
    'enabled' => true,
    'drivers' => [
        'passkey'       => \Jengo\Auth\TwoFactor\Drivers\PasskeyDriver::class,
        'totp'          => \Jengo\Auth\TwoFactor\Drivers\TotpDriver::class,
        'email_otp'     => \Jengo\Auth\TwoFactor\Drivers\EmailOtpDriver::class,
        'recovery_code' => \Jengo\Auth\TwoFactor\Drivers\RecoveryCodeDriver::class,
        'password'      => \Jengo\Auth\TwoFactor\Drivers\PasswordDriver::class,
    ],
    'default' => 'passkey',
];
```

---

## 3. The `TwoFactorManager` API

Access the two-factor engine via `two_factor()` or `auth()->twoFactor()`:

```php
$user = auth()->user();

// 1. Check user enrolled factors
$enrolled = two_factor()->enrolledDriversFor($user);

// 2. Generate challenge for a factor (e.g. WebAuthn assertion options or Email OTP send)
$challenge = two_factor()->createChallenge($user, 'passkey');

// 3. Verify submitted proof
$isValid = two_factor()->verify($user, 'totp', '482910');

// 4. Start enrollment for TOTP (generates secret and QR code URI)
$setupData = two_factor()->startEnrollment($user, 'totp');
// ['secret' => 'JBSWY3DPE...', 'qr_uri' => 'otpauth://totp/...']

// 5. Confirm enrollment with user's first 6-digit code
$enrolled = two_factor()->confirmEnrollment($user, 'totp', '482910');

// 6. Unenroll factor
two_factor()->unenroll($user, 'totp');
```

---

## 4. Creating a Custom Factor Driver

You can easily integrate custom providers (such as **Duo Security**, **Twilio SMS**, or **YubiKey OTP**) by implementing `FactorDriverInterface` and `VerifiableFactorInterface`:

```php
<?php

declare(strict_types=1);

namespace App\TwoFactor\Drivers;

use Jengo\Auth\Entities\User;
use Jengo\Auth\TwoFactor\Contracts\FactorDriverInterface;
use Jengo\Auth\TwoFactor\Contracts\VerifiableFactorInterface;

class DuoPushDriver implements FactorDriverInterface, VerifiableFactorInterface
{
    public function getId(): string
    {
        return 'duo';
    }

    public function getLabel(): string
    {
        return 'Duo Security Push';
    }

    public function getIcon(): string
    {
        return 'shield-check';
    }

    public function getDescription(): string
    {
        return 'Approve the push prompt on your Duo Mobile app.';
    }

    public function isEnrolled(User $user): bool
    {
        return !empty($user->duo_enrolled);
    }

    public function verify(User $user, mixed $proof, array $context = []): bool
    {
        // Custom verification logic with Duo API client
        return true;
    }
}
```

Register your custom driver dynamically:
```php
two_factor()->extend('duo', new DuoPushDriver());
```
