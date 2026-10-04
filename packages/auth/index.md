# jengo/auth

`jengo/auth` is a unified authentication and authorization engine for **CodeIgniter 4** and the **Jengo Framework**, powered by **Vima**.

---

## What's Inside

| Section | Description |
| :--- | :--- |
| [Key Capabilities](#key-capabilities) | A summary of everything the package ships with. |
| [Installation](./installation) | Install via Composer, run setup, and migrate. |
| [Route Publishing](./routes) | Configure standard, customized, selective, and controller-overridden routes. |
| [Quick Start](./quick-start) | Check auth state, attempt logins, and issue Personal Access Tokens. |
| [Protecting Routes and Controllers](./protecting-routes) | Global `auth` filter, `Authenticate` attributes, and guards. |
| [Authorization with Vima](./vima/) | Roles, permissions, ABAC policies, grants, and denies. |
| [Declarative PHP 8 Attributes](./attributes) | `#[Authenticate]`, `#[Can]`, `#[Role]`, and `#[Guest]`. |
| [Post-Auth Actions](./actions) | Email 2FA, Email Activator, and custom post-auth verification steps. |
| [Form Handlers](./forms) | Built-in login, registration, password reset, and magic link form handlers. |
| [Response Modifiers](./response-modifiers) | Switch between HTML views, JSON envelopes, and Inertia responses. |
| [API & Payload Reference](./api-reference) | Full HTTP endpoint specifications, request payloads, and response structures. |
| [Custom Notification Senders](./notifications) | Queue or replace auth emails and codes. |
| [Custom Guards & Tokens](./guards) | Register custom authentication drivers and manage token abilities. |
| [CLI Commands](./cli) | All `jengo:auth` and `vima` Spark commands. |



---

## Key Capabilities

- [**Universal Guard**](./quick-start#1-authentication-state): Intelligently auto-detects Bearer tokens for API requests and seamlessly falls back to session cookies and remember-me tokens for web applications.
- [**Pluggable Response Modifiers**](./response-modifiers): Switch between traditional CodeIgniter 4 HTML views, REST API JSON envelopes, and Inertia.js SPA responses via configuration.
- [**Vima Authorization Engine**](./vima/): Advanced Role-Based Access Control (RBAC) with role hierarchies, Attribute-Based Access Control (ABAC) policies, direct grants, explicit denies, and TypeScript map generation.
- [**Declarative PHP 8 Security Attributes**](./attributes): Guard controllers and specific methods cleanly using `#[Authenticate]`, `#[Can]`, `#[Role]`, and `#[Guest]`.
- [**Multi-Factor & Sudo Step-Up Mode**](./two-factor): Built-in TOTP, Passkeys/WebAuthn, Email OTP, Recovery Codes, and GitHub-style elevated Sudo verification.
- [**Post-Auth Actions Pipeline**](./actions): Modular multi-step verification pipeline supporting Email 2FA, Email Activation, action challenges, and custom flows.
- [**Personal Access Tokens (PAT)**](./guards#token-prefix--formatting): Issue, inspect, and revoke scoped API tokens with customizable prefixes and expiration policies.
- [**Passwordless Magic Links & Self-Service Resets**](./api-reference#2-passwordless-magic-links): Built-in time-limited secure magic link logins and password recovery workflows.
- [**Full OpenAPI 3.1 & API Payload Reference**](./api-reference): Detailed HTTP specs, request schemas, validation rules, and response payloads.
- [**CodeIgniter Shield Migration**](./cli#migration-commands): Seamlessly import users, credentials, and password hashes from existing CodeIgniter Shield installations with a single command.
