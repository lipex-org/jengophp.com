# The Gatekeeper (Auth)

Jengo's "Gatekeeper" provides a robust, beautifully styled authentication system out of the box, built on top of the official **CodeIgniter Shield**.

## Installation

The easiest way to get the Gatekeeper is to use the `--auth` flag during project creation:

```bash
jengo new my-app --auth
```

If you already have a Jengo project and want to add authentication later, you can run:

```bash
php spark jengo:setup auth
```

## Smart Integration

The Jengo installer is smart enough to adapt the authentication UI based on your chosen starter kit.

### 1. Default PHP Kit
If you are using the default PHP kit, the installer will publish highly polished, Tailwind-styled `login.php` and `register.php` views directly into `app/Views/Shield/`. It automatically configures Shield to use these custom views instead of the default ones.

### 2. Inertia SPA Kits (React, Vue, Svelte)
If you install the Gatekeeper alongside an Inertia kit, Jengo skips the PHP views entirely. Instead, it:
1. Publishes a suite of Inertia-friendly controllers to `app/Controllers/Auth/`:
   - `LoginController`: Handles SPA login and logout.
   - `RegisterController`: Handles SPA user registration.
   - `MagicLinkController`: Manages email-based, passwordless login.
   - `ActionController`: Handles multi-step auth actions (e.g., 2FA, Email Verification).
2. Re-routes the default Shield endpoints to these custom controllers.
3. Scaffolds complete, working authentication pages in your chosen framework (React, Vue, or Svelte).

This ensures a seamless, page-refresh-free authentication experience for modern Single Page Applications.
