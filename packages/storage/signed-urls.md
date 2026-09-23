# URL Generation & Signed URLs

## Public URLs

```php
$url = Storage::disk('public')->url('avatars/profile.png');
// Returns: /storage/avatars/profile.png
```

## Temporary Signed URLs

Generate expiring URLs for sensitive, private files without exposing storage paths:

```php
$downloadUrl = Storage::temporaryUrl(
    'vault/financial-report.pdf',
    now()->addMinutes(15)
);
```

- **Cloud Disks (S3 / R2 / MinIO)**: Automatically generates native cloud pre-signed URLs.
- **Local Disks**: Generates an HMAC-SHA256 signed route (`/storage/signed/{path}?expires=...&signature=...`). The built-in controller validates expiration and signature, then streams the file with HTTP `Range` request support.
