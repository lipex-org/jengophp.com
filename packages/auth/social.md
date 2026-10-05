# Social / OAuth2 Authentication

`jengo/auth` provides first-class third-party OAuth2 and Social Sign-In out of the box. Users can authenticate seamlessly using external identity providers such as Google and GitHub, with automatic account provisioning, verified email auto-linking, and password provisioning workflows.

---

## 1. Overview & Key Features

- **Built-in OAuth2 Providers**: Native drivers for **Google** (OpenID Connect) and **GitHub** (with private email fallback lookup).
- **Custom Extensibility**: Dynamically register or override OAuth drivers via `auth()->social()->extend()`.
- **Automatic User Provisioning**: New social users are automatically registered without requiring a password.
- **Verified Email Auto-Linking**: If an existing account matches the verified email returned by the OAuth provider, the social identity is automatically linked to that account.
- **Password Provisioning (`hasPassword()` / `setPassword()`)**: Social-registered users initially have no password (`hasPassword() === false`), allowing developers or users to establish an email/password credential later via the `/set-password` flow.
- **Security & CSRF Protection**: State parameters are cryptographically generated, session-bound, and verified upon callback.

---

## 2. Configuration

Social authentication is configured in `app/Config/Auth.php`. Configuration values are read dynamically via CodeIgniter 4's environment variable system (no `env()` function calls required in the config class itself).

```php
// app/Config/Auth.php
namespace Config;

use Jengo\Auth\Config\Auth as BaseAuth;

class Auth extends BaseAuth
{
    /**
     * Feature toggles.
     */
    public bool $allowSocial = true;

    /**
     * Social / OAuth2 Providers configuration.
     */
    public array $social = [
        'enabled'                  => true,
        'auto_link_verified_email' => true,
        'providers' => [
            'google' => [
                'enabled'       => true,
                'driver'        => \Jengo\Auth\Social\Providers\GoogleProvider::class,
                'client_id'     => '', // Injected via .env: auth.social.providers.google.client_id
                'client_secret' => '', // Injected via .env: auth.social.providers.google.client_secret
                'scopes'        => ['openid', 'profile', 'email'],
            ],
            'github' => [
                'enabled'       => true,
                'driver'        => \Jengo\Auth\Social\Providers\GitHubProvider::class,
                'client_id'     => '', // Injected via .env: auth.social.providers.github.client_id
                'client_secret' => '', // Injected via .env: auth.social.providers.github.client_secret
                'scopes'        => ['user:email', 'read:user'],
            ],
        ],
    ];
}
```

### Environment Variables (`.env`)

Add your OAuth provider credentials to your project's `.env` file:

```dotenv
# Google OAuth
auth.social.providers.google.enabled = true
auth.social.providers.google.client_id = "your-google-client-id.apps.googleusercontent.com"
auth.social.providers.google.client_secret = "GOCSPX-your-google-client-secret"

# GitHub OAuth
auth.social.providers.github.enabled = true
auth.social.providers.github.client_id = "your-github-client-id"
auth.social.providers.github.client_secret = "your-github-client-secret"
```

---

## 3. Publishing Routes

Publish social authentication and password provisioning routes in `app/Config/Routes.php`:

```php
// app/Config/Routes.php
use Jengo\Auth\Support\RouteRegistrar;

// 1. Publish all routes (including social and set-password)
RouteRegistrar::all($routes);

// 2. Or publish dedicated Social & Set-Password routes:
RouteRegistrar::social($routes);
RouteRegistrar::setPassword($routes);

// 3. Or using the auth() helper:
auth()->socialRoutes($routes);
auth()->setPasswordRoutes($routes);
```

### Registered Endpoints

| HTTP Method | Default Path | Canonical Route Name (`as`) | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/oauth/(:segment)` | `auth.oauth.redirect` | Redirects user to OAuth provider login screen |
| `GET` | `/oauth/callback/(:segment)` | `auth.oauth.callback` | Handles provider authorization code callback |
| `GET` | `/set-password` | `auth.password.set.view` | Displays password creation screen |
| `POST`| `/set-password` | `auth.password.set` | Validates and saves new password |

---

## 4. Frontend Integration & Buttons

Link users to your social redirect endpoint using `auth_url('auth.oauth.redirect', 'google')`:

### Traditional HTML View
```html
<a href="<?= auth_url('auth.oauth.redirect', 'google') ?>" class="btn-social google">
    Sign in with Google
</a>
<a href="<?= auth_url('auth.oauth.redirect', 'github') ?>" class="btn-social github">
    Sign in with GitHub
</a>
```

### Inertia SPA (Vue / React / Svelte)
```html
<!-- Vue 3 -->
<a :href="'/oauth/google'" class="btn-social">Sign in with Google</a>
<a :href="'/oauth/github'" class="btn-social">Sign in with GitHub</a>
```

---

## 5. Password Provisioning Workflow

When a user registers via a third-party social provider, they are assigned a unique username and their social identity (`oauth_<provider>`) is recorded in `user_identities`. However, they have no password set initially.

### Checking Password State

```php
$user = auth()->user();

if (! $user->hasPassword()) {
    // Prompt the user to create a password
    return redirect()->to(auth_url('auth.password.set.view'));
}
```

### Setting or Updating Password

```php
// Sets the password on the user's primary email identity
$user->setPassword('SecureNewPassword123!');
```

### Linked Social Identity Helpers

```php
// Check if user has connected a specific social provider
if ($user->hasSocialIdentity('google')) {
    // User is linked to Google
}

// Retrieve all connected OAuth identities
$socialIdentities = $user->getSocialIdentities();
```

---

## 6. Extending with Custom Providers

You can register custom OAuth2 drivers dynamically using the `extend()` method on `auth()->social()`:

```php
use Jengo\Auth\Social\Contracts\SocialProviderInterface;
use Jengo\Auth\Social\DTOs\SocialUserDTO;

auth()->social()->extend('gitlab', function (array $config): SocialProviderInterface {
    return new class($config) implements SocialProviderInterface {
        public function __construct(protected array $config) {}

        public function getIdentifier(): string
        {
            return 'gitlab';
        }

        public function getAuthUrl(array $options = []): string
        {
            return 'https://gitlab.com/oauth/authorize?' . http_build_query([
                'client_id'     => $this->config['client_id'] ?? '',
                'redirect_uri'  => auth_url('auth.oauth.callback', 'gitlab'),
                'response_type' => 'code',
                'state'         => csrf_hash(),
                'scope'         => implode(' ', $this->config['scopes'] ?? ['read_user']),
            ]);
        }

        public function handleCallback(array $queryParams): SocialUserDTO
        {
            return new SocialUserDTO(
                id: 'gitlab_user_id',
                email: 'user@example.com',
                name: 'GitLab User',
                avatar: 'https://gitlab.com/avatar.png',
                username: 'gitlabuser',
                accessToken: 'access_token_here'
            );
        }
    };
});
```

---

## 7. Lifecycle Events

`jengo/auth` triggers the following events during social authentication:

- `socialRegistered` (`User $user`, `string $provider`, `SocialUserDTO $socialUser`): Triggered when a new user record is created via social login.
- `socialLinked` (`User $user`, `string $provider`, `SocialUserDTO $socialUser`): Triggered when a social identity is linked to an existing account with matching verified email.
- `socialLogin` (`User $user`, `string $provider`, `SocialUserDTO $socialUser`): Triggered on every successful social login callback.
