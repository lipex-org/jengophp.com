# Auth API & Payload Reference

This document provides a comprehensive technical reference for all HTTP endpoints published by `jengo/auth`. It details the required headers, query parameters, request payloads (JSON/Form-Data), validation constraints, and response structures across the entire authentication engine.

---

## Global Request Conventions

### Content-Type & Accept Headers

`jengo/auth` adapts dynamically according to request headers:
- **REST APIs**: Send `Accept: application/json` and `Content-Type: application/json`.
- **Inertia SPAs**: Send `X-Inertia: true` and `Accept: text/html, application/xhtml+xml`.
- **Traditional Forms**: Standard `application/x-www-form-urlencoded` or `multipart/form-data` with standard `<?= csrf_field() ?>`.

### Bearer Token Header

For guarded API endpoints:
```http
Authorization: Bearer <personal_access_token>
```

---

## 1. Core Authentication

### `POST /login`
Attempt credential authentication.

- **Route Name (`as`)**: `login.attempt`
- **Request Body (JSON or Form-Data)**:

| Field | Type | Required | Rules & Description |
| :--- | :--- | :--- | :--- |
| `email` | `string` | **Yes\*** | Email address (or username if using username login). Required unless `username` is provided. |
| `username` | `string` | **Yes\*** | Account username. Required if `email` is omitted. |
| `password` | `string` | **Yes** | Cleartext password. |
| `remember` | `bool\|int` | No | If `true` or `1`, issues a 30-day persistent remember cookie. |

- **Successful Response (JSON Modifier)**:
```json
{
  "action": "login.attempt",
  "status": "success",
  "statusCode": 200,
  "message": "Login successful.",
  "user": {
    "id": 1,
    "username": "janedoe",
    "email": "jane@example.com",
    "active": true
  },
  "redirect_to": "/dashboard"
}
```

- **MFA Required Response (`200 OK` / `status: 'info'`)**:
When post-auth actions (like `Email2FA`) are active:
```json
{
  "action": "login.action_required",
  "status": "info",
  "statusCode": 200,
  "message": "Additional verification required.",
  "redirect_to": "/action/show"
}
```

- **Validation / Auth Failure (`401` or `422`)**:
```json
{
  "action": "login.attempt",
  "status": "error",
  "message": "Invalid login credentials.",
  "errors": {
    "password": "The password field is required."
  }
}
```

---

### `POST /logout` (or `GET /logout`)
Terminates the user's active session or personal access token context.

- **Route Name (`as`)**: `logout`
- **Request Body**: None.
- **Successful Response**:
```json
{
  "action": "logout",
  "status": "success",
  "statusCode": 200,
  "message": "Logged out successfully.",
  "redirect_to": "/login"
}
```

---

### `POST /register`
Creates a new user account.

- **Route Name (`as`)**: `register.attempt`
- **Request Body**:

| Field | Type | Required | Rules & Description |
| :--- | :--- | :--- | :--- |
| `username` | `string` | **Yes** | Unique username (`min_length[3]\|max_length[30]\|alpha_numeric_space`). |
| `email` | `string` | **Yes** | Valid unique email address (`valid_email`). |
| `password` | `string` | **Yes** | Password meeting minimum strength requirements (`min_length[8]`). |
| `password_confirm` | `string` | **Yes** | Must match `password` (`matches[password]`). |

- **Successful Response (`201 Created` or `200 OK`)**:
```json
{
  "action": "register.attempt",
  "status": "success",
  "statusCode": 201,
  "message": "Registration successful.",
  "user": {
    "id": 2,
    "username": "johndoe",
    "email": "john@example.com",
    "active": true
  },
  "redirect_to": "/"
}
```

- **Activation Required Response (`200 OK` / `status: 'info'`)**:
When `EmailActivator` action is active:
```json
{
  "action": "register.action_required",
  "status": "info",
  "statusCode": 200,
  "message": "Account created. Please verify your email.",
  "redirect_to": "/action/show"
}
```

---

### `POST /forgot-password`
Generates and emails a password reset token.

- **Route Name (`as`)**: `forgot-password.send`
- **Request Body**:

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `email` | `string` | **Yes** | Account email address (`required\|valid_email`). |

- **Successful Response (`200 OK`)**:
```json
{
  "action": "forgot_password.send",
  "status": "success",
  "statusCode": 200,
  "message": "If your email is registered, you will receive a password reset link.",
  "redirect_to": "/login"
}
```

---

### `POST /reset-password`
Verifies the reset token and updates the user's password.

- **Route Name (`as`)**: `reset-password.attempt`
- **Request Body**:

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `token` | `string` | **Yes** | The raw password reset token received via email. |
| `password` | `string` | **Yes** | The new password (`min_length[8]`). |
| `password_confirm` | `string` | **Yes** | Must match `password` (`matches[password]`). |

- **Successful Response (`200 OK`)**:
```json
{
  "action": "reset_password.attempt",
  "status": "success",
  "statusCode": 200,
  "message": "Your password has been successfully reset. Please log in with your new password.",
  "redirect_to": "/login"
}
```

---

## 2. Passwordless Magic Link

### `POST /magic-link`
Generates and dispatches a time-limited magic login link.

- **Route Name (`as`)**: `magic-link.send`
- **Request Body**:

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `email` | `string` | **Yes** | Registered email address (`required\|valid_email`). |

- **Successful Response (`200 OK`)**:
```json
{
  "action": "magic_link.send",
  "status": "success",
  "statusCode": 200,
  "message": "Magic login link has been sent to your email address.",
  "redirect_to": "/magic-link"
}
```

---

### `GET /magic-link/verify/(:segment)` or `GET /magic-link/verify?token=...`
Consumes the magic link token and authenticates the user.

- **Route Name (`as`)**: `magic-link.verify` / `magic-link.verify.query`
- **Query / Path Parameter**:
  - `token` (or segment): The single-use magic login token string.
- **Successful Response (`200 OK`)**: Authenticates the user and redirects to configured landing page.

---

## 3. Post-Auth Actions & MFA Pipeline

The action pipeline runs between primary authentication and session completion.

### `GET /action/show`
Displays the current pending challenge view or returns challenge context.

- **Route Name (`as`)**: `auth.action.show`
- **Session Requirement**: Active pending context (`auth_pending_user_id`).
- **Response Payload (JSON Modifier)**:
```json
{
  "action": "action.show",
  "status": "info",
  "statusCode": 200,
  "data": {
    "action": "email_2fa",
    "email": "jane@example.com"
  }
}
```

---

### `POST /action/challenge`
Re-issues or resends a fresh challenge (e.g. resending a 6-digit MFA or activation code).

- **Route Name (`as`)**: `auth.action.challenge`
- **Request Body**: Empty or optional parameters specific to the active action.
- **Successful Response (`200 OK` / `status: 'info'`)**:
```json
{
  "action": "action.challenge",
  "status": "info",
  "statusCode": 200,
  "message": "A fresh verification code has been sent to your email.",
  "redirect_to": "/action/show"
}
```

---

### `POST /action/handle`
Submits verification proof for the active action step in the pipeline.

- **Route Name (`as`)**: `auth.action.handle`
- **Request Body**:

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `code` | `string` | **Yes\*** | 6-digit verification code (for `Email2FA` or `EmailActivator`). |
| `token` | `string` | No | Fallback alias for verification code. |
| *(custom)* | `mixed` | No | Any fields required by custom `AuthActionInterface` implementations. |

- **Final Step Completed (`action.success`)**:
```json
{
  "action": "action.success",
  "status": "success",
  "statusCode": 200,
  "message": "Authentication completed successfully.",
  "redirect_to": "/dashboard"
}
```

- **Intermediate Step Completed (`action.next`)**:
When additional actions remain in the multi-action pipeline:
```json
{
  "action": "action.next",
  "status": "info",
  "statusCode": 200,
  "message": "Next authentication action required.",
  "redirect_to": "/action/show"
}
```

- **Verification Failed (`404 Not Found`)**:
Returns `404` to protect against enumeration attacks.

---

### `POST /action/cancel` (or `GET /action/cancel`)
Aborts the pending action pipeline, wipes pending session state, and safely returns the user to the login screen.

- **Route Name (`as`)**: `auth.action.cancel` / `auth.action.cancel.get`
- **Successful Response**:
```json
{
  "action": "action.cancelled",
  "status": "info",
  "statusCode": 200,
  "message": "Authentication action cancelled.",
  "redirect_to": "/login"
}
```

---

## 4. Two-Factor Authentication Settings & Enrollment

All two-factor settings endpoints require an authenticated session (`auth()->check() === true`).

### `GET /two-factor`
Lists the user's enrolled security factors and available drivers.

- **Route Name (`as`)**: `two-factor.index`
- **Response Payload**:
```json
{
  "action": "two_factor.index",
  "status": "success",
  "statusCode": 200,
  "data": {
    "enrolled_factors": ["totp"],
    "available_factors": [
      { "id": "passkey", "label": "Passkey / WebAuthn" },
      { "id": "totp", "label": "Authenticator App" }
    ]
  }
}
```

---

### `POST /two-factor/enroll/start`
Initiates factor enrollment (e.g. generating TOTP secret or WebAuthn registration options).

- **Route Name (`as`)**: `two-factor.enroll.start`
- **Request Body**:

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `factor` | `string` | **Yes** | Factor identifier (`'totp'`, `'passkey'`, etc.). |

- **Response Payload (TOTP Example)**:
```json
{
  "action": "two_factor.enroll.start",
  "status": "success",
  "statusCode": 200,
  "data": {
    "factor": "totp",
    "secret": "JBSWY3DPEHPK3PXP",
    "qr_uri": "otpauth://totp/App:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=App"
  }
}
```

---

### `POST /two-factor/enroll/confirm`
Confirms and finalizes factor enrollment with proof of possession.

- **Route Name (`as`)**: `two-factor.enroll.confirm`
- **Request Body**:

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `factor` | `string` | **Yes** | Factor identifier (`'totp'`, `'passkey'`, etc.). |
| `proof` | `string\|array` | **Yes** | The 6-digit rolling code (TOTP) or WebAuthn registration response. |

- **Successful Response (`200 OK`)**:
```json
{
  "action": "two_factor.enroll.confirm",
  "status": "success",
  "statusCode": 200,
  "message": "Two-factor factor [totp] successfully enrolled."
}
```

---

### `POST /two-factor/unenroll`
Removes an enrolled factor from the user's account.

- **Route Name (`as`)**: `two-factor.unenroll`
- **Request Body**:

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `factor` | `string` | **Yes** | Factor identifier to unenroll. |

---

## 5. Sudo Mode (Step-Up Re-Authentication)

### `GET /sudo`
Renders Sudo challenge view or returns list of eligible factors for step-up auth.

- **Route Name (`as`)**: `auth.sudo`

---

### `POST /sudo/challenge`
Generates assertion challenge parameters for a specific factor (e.g. WebAuthn challenge payload).

- **Route Name (`as`)**: `auth.sudo.challenge`
- **Request Body**: `{"factor": "passkey"}`

---

### `POST /sudo/verify`
Verifies factor proof and activates the Sudo grace period.

- **Route Name (`as`)**: `auth.sudo.verify`
- **Request Body**:

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `factor` | `string` | **Yes** | Factor identifier (`'totp'`, `'passkey'`, `'password'`, `'recovery_code'`). |
| `proof` | `string\|array` | **Yes** | The proof payload (TOTP 6-digit code, password string, or WebAuthn assertion). |

- **Successful Response (`200 OK`)**:
```json
{
  "action": "sudo.verified",
  "status": "success",
  "statusCode": 200,
  "message": "Elevated session confirmed.",
  "redirect_to": "/previous-target"
}
```

---

### `POST /sudo/exit`
Immediately terminates the active Sudo grace period.

- **Route Name (`as`)**: `auth.sudo.exit`

---

## 6. Personal Access Tokens

Manage scoped Bearer tokens for mobile clients and API integrations. Requires authenticated session or Bearer token with token-management abilities.

### `GET /tokens`
Lists all active access tokens for the authenticated user (or renders the token management UI).

- **Route Name (`as`)**: `tokens.index`
- **Response Payload**:
```json
{
  "action": "tokens.index",
  "status": "success",
  "statusCode": 200,
  "tokens": [
    {
      "id": 1,
      "name": "GitHub Actions CI",
      "abilities": ["deploy:read", "deploy:write"],
      "last_used_at": "2026-10-04T12:00:00Z",
      "created_at": "2026-10-01T08:00:00Z",
      "expires_at": null
    }
  ]
}
```

---

### `POST /tokens` or `POST /tokens/create`
Generates a new Personal Access Token with defined scopes.

- **Route Name (`as`)**: `tokens.create` (and `tokens.create.named`)
- **Request Body**:

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | **Yes** | Descriptive token label (`required|min_length[2]|max_length[100]`). |
| `abilities` | `array` | No | List of permitted scopes (defaults to `['*']`). Example: `["posts:read", "users:create"]`. |
| `expires_at` | `string` | No | Optional ISO-8601 expiration timestamp (e.g. `"2027-01-01 00:00:00"`). |

- **Successful Response (`201 Created`)**:
> [!IMPORTANT]
> The `token` plain-text string is returned **only once** upon creation. Store it securely.

```json
{
  "action": "tokens.create",
  "status": "success",
  "statusCode": 201,
  "message": "Token created successfully.",
  "token": "jengo_pat_7a8f9c1b2e3d4a5c6e7f8a9b0c1d2e3f4a5b6c7d8e9f",
  "token_id": 2,
  "name": "Mobile App Client"
}
```

---

### `DELETE /tokens/(:segment)` or `POST /tokens/revoke/(:segment)`
Revokes and deletes a specific access token.

- **Route Name (`as`)**: `tokens.revoke` (and `tokens.revoke.post`)
- **Path Parameter**: Token ID (`integer`).
- **Successful Response (`200 OK`)**:
```json
{
  "action": "tokens.revoke",
  "status": "success",
  "statusCode": 200,
  "message": "Token revoked successfully."
}
```

---

## 7. Social / OAuth2 Authentication & Password Provisioning

Third-party OAuth login, callback handling, and password provisioning for social users.

### `GET /oauth/(:segment)`
Redirects the user to the third-party OAuth provider authorization screen (e.g. Google, GitHub).

- **Route Name (`as`)**: `auth.oauth.redirect`
- **Path Parameter**: `provider` (`string`, e.g. `'google'`, `'github'`).
- **Response**: `302 Found` HTTP redirect to the provider's OAuth authorization URL with session-bound CSRF state.

---

### `GET /oauth/callback/(:segment)`
Receives the authorization code from the provider, exchanges it for access tokens, loads profile info, and executes `findOrCreateUser()`.

- **Route Name (`as`)**: `auth.oauth.callback`
- **Path Parameter**: `provider` (`string`, e.g. `'google'`, `'github'`).
- **Query Parameters**:
  - `code`: Authorization code from provider.
  - `state`: CSRF state string.
- **Successful Response (JSON Modifier)**:
```json
{
  "action": "social.login",
  "status": "success",
  "statusCode": 200,
  "message": "Successfully signed in with Google.",
  "user": {
    "id": 12,
    "username": "janedoe",
    "email": "jane@example.com",
    "active": true
  },
  "redirect_to": "/dashboard"
}
```

---

### `GET /set-password`
Renders the password creation form for authenticated users who signed up via social login and do not yet have a password.

- **Route Name (`as`)**: `auth.password.set.view`
- **Response**: `set_password` view / Inertia component.

---

### `POST /set-password`
Validates and provisions a new password for the authenticated user.

- **Route Name (`as`)**: `auth.password.set`
- **Request Body**:

| Field | Type | Required | Rules & Description |
| :--- | :--- | :--- | :--- |
| `password` | `string` | **Yes** | `required|min_length[8]`. New account password. |
| `password_confirm` | `string` | **Yes** | `required|matches[password]`. Confirmation matching password. |

- **Successful Response (JSON Modifier)**:
```json
{
  "action": "password.set",
  "status": "success",
  "statusCode": 200,
  "message": "Password has been successfully set.",
  "redirect_to": "/dashboard"
}
```

