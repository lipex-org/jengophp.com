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

// Create token with specific abilities/scopes
$token = auth()->createTokenFor($user, 'mobile-app', ['posts.read', 'posts.create']);

// Plaintext token is only displayed once
echo $token->plainTextToken;
```
