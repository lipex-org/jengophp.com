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
| [Protecting Endpoints](./protecting-endpoints) | Global `auth` filter, `Authenticate` attributes, and guards. |
| [Authorization with Vima](./vima/) | Roles, permissions, ABAC policies, grants, and denies. |
| [Declarative PHP 8 Attributes](./attributes) | `#[Authenticate]`, `#[Can]`, `#[Role]`, and `#[Guest]`. |
| [Response Modifiers](./response-modifiers) | Switch between HTML views, JSON envelopes, and Inertia responses. |
| [Custom Notification Senders](./notifications) | Queue or replace auth emails and codes. |
| [Custom Guards](./guards) | Register custom authentication drivers via `auth()->extend()`. |
| [CLI Commands](./cli) | All `jengo:auth` and `vima` Spark commands. |

---

## Key Capabilities

- **Universal Guard**: Intelligently auto-detects Bearer tokens for API requests and seamlessly falls back to session cookies and remember-me tokens for web applications.
- **Pluggable Response Modifiers**: Switch between traditional CodeIgniter 4 HTML views, REST API JSON envelopes, and Inertia.js SPA responses via configuration.
- **Vima Authorization Engine**: Advanced Role-Based Access Control (RBAC) with role hierarchies, Attribute-Based Access Control (ABAC) policies, direct grants, explicit denies, and TypeScript map generation.
- **Declarative PHP 8 Security Attributes**: Guard controllers and specific methods cleanly using `#[Authenticate]`, `#[Can]`, `#[Role]`, and `#[Guest]`.
- **Smart Throttling & Brute-Force Protection**: Multi-signal rate limiter that evaluates IP and identity to prevent brute-force attacks without penalizing shared corporate networks.
- **Post-Auth Actions Pipeline**: Modular multi-step verification pipeline supporting Email 2FA, Email Activation, and custom flows.
- **Personal Access Tokens (PAT)**: Issue, inspect, and revoke scoped API tokens for mobile clients, third-party integrations, and background services.
- **Passwordless Magic Links & Self-Service Resets**: Built-in time-limited secure magic link logins and password recovery workflows.
- **CodeIgniter Shield Migration**: Seamlessly import users, credentials, and password hashes from existing CodeIgniter Shield installations with a single command.
