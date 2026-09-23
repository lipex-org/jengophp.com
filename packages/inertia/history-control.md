# History & Navigation Control

The `render()` response can be configured to manage the browser history state:

```php
return Inertia::render('Profile/Edit', $data)
    ->encryptHistory()    // Encrypts history state
    ->clearHistory()      // Clears previous history
    ->preserveFragment(); // Preserves #fragments across redirects
```
