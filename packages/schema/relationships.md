# Relationship Derivation

Load single and collection relationships with automatic JOIN construction and entity hydration.

## Loading Relations

```php
// Load multiple relations
$result = query(UserSchema::class)
    ->derive(['profile', 'files'])
    ->get();

// Load nested grandchild relationships
$result = query(UserSchema::class)
    ->derive(['profile', 'files.comments'])
    ->get();
```

## Accessing Hydrated Entities

```php
foreach ($result->data as $user) {
    echo $user->profile->phone;
    foreach ($user->files as $file) {
        echo $file->name;
        foreach ($file->comments as $comment) {
            echo $comment->content;
        }
    }
}
```
