# Schema-First Structured Output

Eliminate brittle regex parsing. Force the LLM to return strictly validated JSON structures directly mapped to PHP arrays or objects:

```php
use Jengo\Ai\Ai;

$userProfile = ai('Extract user details: John Doe, 32 years old, software engineer based in Nairobi, likes PHP and Rust.')
    ->system('Extract structured user information.')
    ->schema([
        'name'       => 'string',
        'age'        => 'integer',
        'occupation' => 'string',
        'city'       => 'string',
        'skills'     => 'array',
        'bio'        => 'string|nullable',
    ])
    ->asArray();

// Returns type-safe PHP array:
// [
//     'name'       => 'John Doe',
//     'age'        => 32,
//     'occupation' => 'software engineer',
//     'city'       => 'Nairobi',
//     'skills'     => ['PHP', 'Rust'],
//     'bio'        => null,
// ]
```

You can also use `->asObject()` to receive a standard `stdClass` object.
