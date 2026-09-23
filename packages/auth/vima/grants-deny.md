# Fluent Grants and Explicit Denies

Explicit denies strictly override any role-level grant.

```php
$user = auth()->user();

// Grant role or direct permission
auth()->user($user)->grant()->role('editor');
auth()->user($user)->grant()->permission('reports.view');

// Explicitly deny permission (overrides role grant)
auth()->user($user)->deny()->permission('posts.publish', 'Account suspended by admin');
```
