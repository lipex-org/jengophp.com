# Directory Management

```php
// List immediate files in a directory
$files = Storage::files('documents');

// List all files recursively
$allFiles = Storage::allFiles('documents');

// List directories
$directories = Storage::directories('reports');
$allDirectories = Storage::allDirectories('reports');

// Create and delete directories
Storage::makeDirectory('vault/2026');
Storage::deleteDirectory('vault/2026');
```
