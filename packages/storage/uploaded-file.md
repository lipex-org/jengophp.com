# CodeIgniter `UploadedFile` Integration

`UploadedFileDecorator` enriches standard uploaded files with automated hash naming and direct disk storage:

```php
use Jengo\Storage\Support\UploadedFileDecorator;

$file = $this->request->getFile('avatar');

if ($file->isValid() && ! $file->hasMoved()) {
    $decorator = new UploadedFileDecorator($file);

    // Store with an automated cryptographic hash name
    $storedPath = $decorator->store('avatars', 'public');
    // Result: avatars/5e884898da28047151d0e56f8dc6292773603d0d.png

    // Store with an explicit filename
    $customPath = $decorator->storeAs('invoices', 'INV-2026.pdf', 's3');
}
```
