# Authorization with Vima

`jengo/auth` integrates the **Vima** authorization framework for enterprise permission handling: Role-Based Access Control (RBAC) with role hierarchies, Attribute-Based Access Control (ABAC) policies, direct grants, and explicit denies.

## On This Section

- [Defining Roles and Permissions](./roles-permissions)
- [Synchronizing to Database](./syncing)
- [Generating TypeScript Mappings](./typescript-maps)
- [Checking Permissions & Policies](./checking)
- [Fluent Grants and Explicit Denies](./grants-deny)

## Quick Example

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
