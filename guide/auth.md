# The Gatekeeper (Auth)

Jengo's "Gatekeeper" (`jengo/auth`) provides a unified, enterprise-ready authentication and authorization engine built natively for **CodeIgniter 4**, powered by **Vima**.

## Installation

The easiest way to get the Gatekeeper is to use the `--auth` flag during project creation:

```bash
jengo new my-app --auth
```

If you already have a Jengo project and want to add authentication later, you can run:

```bash
php spark jengo:auth setup
php spark migrate
```

## Smart Architecture & Response Modifiers

Jengo Auth is built around **Universal Modifier** architecture that dynamically detects whether an incoming request expects traditional CodeIgniter 4 HTML views, REST API JSON envelopes, or Inertia.js Single Page Application responses:

### 1. Default PHP Kit
If you are using the default PHP kit, standard responsive Tailwind-styled views (`login.php`, `register.php`, `two_factor_settings.php`, `set_password.php`, etc.) are rendered with standard flash redirects.

### 2. Inertia SPA Kits (Vue, React, Svelte)
When installed alongside an Inertia starter kit, Jengo Auth:
1. Configures `Config/Auth.php` with `viewRenderer = 'inertia'` and publishes component stubs (`auth/login`, `auth/register`, `auth/two_factor_settings`, `auth/set_password`, etc.) to `resources/js/inertia/pages/auth/`.
2. Serves seamless, page-refresh-free authentication across Vue, React, and Svelte frontend frameworks.

### 3. Core Features Included Out of the Box
- **Universal Guard**: Auto-detects stateless Bearer tokens for APIs and falls back to session cookies and encrypted remember-me tokens for web.
- **Social / OAuth2 Authentication**: Sign in with Google, GitHub, and custom providers with automatic user provisioning, email auto-linking, and password provisioning (`/set-password`).
- **Multi-Factor & Sudo Step-Up**: TOTP authenticator apps, Passkeys / WebAuthn, Email OTP codes, Recovery Codes, and elevated Sudo mode.
- **Vima RBAC/ABAC**: Full role hierarchies, fine-grained permissions, ABAC policies, direct grants, explicit denies, and TypeScript map generation.
- **Personal Access Tokens (PAT)**: Scoped API token lifecycle management.
- **Passwordless Magic Links**: Secure, time-limited one-click email logins.
