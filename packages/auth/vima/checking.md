# Checking Permissions & Policies

## The `can()` Helper

```php
// Check permission via global helper
if (can('posts.publish')) {
    // Current user can publish posts
}

// Check with entity context (ABAC Policy)
if (can('posts.edit', $post)) {
    // Current user can edit this specific post instance
}
```

## ABAC Policies

Scaffold a policy class for attribute-based checks:

```bash
php spark vima:make policy <PolicyName>
```
