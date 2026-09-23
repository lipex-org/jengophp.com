# Search

Perform searches across root schema columns and related table fields using dot-notation.

## Search All Searchable Fields

```php
// Search across all searchable fields on the schema
$result = query(UserSchema::class)
    ->search('John')
    ->get();
```

## Target Specific Fields

```php
// Target specific fields including related tables
$result = query(UserSchema::class)
    ->derive('files')
    ->search('quarterly_report', ['first_name', 'last_name', 'files.name'])
    ->get();
```
