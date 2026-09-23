# Lifecycle Hooks

`ResourceConfig` classes support four lifecycle hooks:

```php
// Intercept query builder before execution
public function beforeQuery($query, ?HookContext $context = null): void
{
    // Apply multi-tenant scope
    $query->where('tenant_id', session('tenant_id'));
}

// Modify fetched records before formatting
public function afterQuery(array $data, ?HookContext $context = null): array
{
    return $data;
}

// Intercept data before saving (insert or update)
public function beforeSave(array $data, ?HookContext $context = null): array
{
    return $data;
}

// Inspect saved records post-save
public function afterSave(array $record, ?HookContext $context = null): array
{
    return $record;
}
```
