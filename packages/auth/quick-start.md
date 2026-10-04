# Quick Start

## 1. Authentication State

```php
// Check if current visitor is authenticated
if (auth()->check()) {
    $user   = auth()->user(); // Jengo\Auth\Entities\User
    $userId = auth()->id();
}

// Check if visitor is a guest
if (auth()->guest()) {
    return redirect()->to('/login');
}
```

## 2. Attempting Logins

```php
$credentials = [
    'email'    => $this->request->getPost('email'),
    'password' => $this->request->getPost('password'),
];

$result = auth()->attempt($credentials, remember: true);

if ($result->isSuccessful()) {
    return redirect()->to('/dashboard');
}

return redirect()->back()->with('error', $result->getMessage());
```

## 3. Personal Access Tokens

Issue scoped tokens for API or mobile clients:

```php
$user = auth()->user();

// Create token with specific abilities/scopes and optional expiration / custom prefix
$token = auth()->createTokenFor(
    user: $user,
    name: 'mobile-app',
    abilities: ['posts.read', 'posts.create'],
    expiresAt: new DateTime('+90 days'),
    prefix: 'acumen_pat_' // Optional custom prefix override
);

// Plaintext token is only displayed once
echo $token->plainTextToken; // e.g. "acumen_pat_7a8f9c1b2e3d4..."
```

---

## 4. Extending User Entity with Macros

Since `Jengo\Auth\Entities\User` extends `BaseEntity`, you can dynamically add helper methods and domain behaviors using macros:

```php
use Jengo\Auth\Entities\User;

// Register an instance macro
User::macro('hasCompletedOnboarding', function (): bool {
    /** @var User $this */
    return (bool) $this->active && !empty($this->username);
});

// Use the macro anywhere
if (auth()->user()->hasCompletedOnboarding()) {
    // ...
}
```
