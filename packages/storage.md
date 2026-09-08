# jengo/storage

> **Status:** Production Ready &bull; **Version:** `v1.0.0`

`jengo/storage` is a unified filesystem abstraction, asset management, universal temporary signed URL engine, and fluent image processing pipeline for **CodeIgniter 4** and the **Jengo Framework**, powered by League Flysystem v3.

---

## Key Capabilities

- **Multi-Disk Switching**: Seamlessly manage files across **Local**, **AWS S3**, **Cloudflare R2**, **MinIO**, **Google Cloud Storage**, and in-memory test drivers via a unified API.
- **Universal Temporary Signed URLs**: Issue expiring download links with automatic HMAC-SHA256 signature verification for local private files and native pre-signed URLs for cloud object storage.
- **Direct-to-Cloud Pre-Signed Uploads**: Generate pre-signed tickets for direct browser-to-S3/R2 uploads, eliminating PHP worker bottlenecks and memory limits on large file transfers.
- **HTTP Range Streaming**: Built-in streaming controller supporting byte-range requests (`Accept-Ranges: bytes`) for smooth video/audio playback and resumable downloads.
- **Fluent Image Transformation Engine**: Zero-dependency image pipeline supporting aspect-ratio preserving resize, crop, fit, watermarking, responsive breakpoint variant generation, and modern format transcoding (WebP and AVIF).
- **CodeIgniter UploadedFile Bridge**: Decorates native CI4 uploaded files with automatic cryptographic hash naming, directory organization, and direct storage routing.
- **Zero-Cost Test Double (`Storage::fake()`)**: In-memory virtual disk replacement with comprehensive assertions (`assertExists`, `assertMissing`, `assertSize`, `assertChecksum`, `assertDirectoryFileCount`).
- **Spark CLI Management**: Dedicated commands for linking public storage (`php spark storage:link`) and pruning expired temporary files (`php spark storage:cleanup`).

---

## Installation

Install via Composer:

```bash
composer require jengo/storage
```

Connect the public storage symlink:

```bash
php spark storage:link
```

---

## Configuration (`app/Config/Storage.php`)

```php
namespace Config;

use CodeIgniter\Config\BaseConfig;

class Storage extends BaseConfig
{
    public string $default = 'local';

    public string $signingKey = '';

    public string $signedRoutePrefix = 'storage/signed';

    public string $imageDriver = 'gd'; // 'gd' or 'imagick'

    public array $disks = [
        'local' => [
            'driver'     => 'local',
            'root'       => WRITEPATH . 'storage/app',
            'visibility' => 'private',
        ],

        'public' => [
            'driver'     => 'local',
            'root'       => WRITEPATH . 'storage/app/public',
            'url'        => '/storage',
            'visibility' => 'public',
        ],

        's3' => [
            'driver'                  => 's3',
            'key'                     => '',
            'secret'                  => '',
            'region'                  => 'us-east-1',
            'bucket'                  => '',
            'url'                     => '',
            'endpoint'                => '',
            'use_path_style_endpoint' => false,
        ],

        'r2' => [
            'driver'                  => 's3',
            'key'                     => '',
            'secret'                  => '',
            'region'                  => 'auto',
            'bucket'                  => '',
            'url'                     => '',
            'endpoint'                => '',
            'use_path_style_endpoint' => false,
        ],

        'minio' => [
            'driver'                  => 's3',
            'key'                     => 'minioadmin',
            'secret'                  => 'minioadmin',
            'region'                  => 'us-east-1',
            'bucket'                  => 'app-bucket',
            'endpoint'                => 'http://127.0.0.1:9000',
            'use_path_style_endpoint' => true,
        ],
    ];
}
```

### Environment Configuration (`.env`)

CodeIgniter 4 automatically maps environment variables to configuration class properties using dot notation matching the class name and property paths. You do not need to call `env()` within your configuration files.

Define overrides directly in your root `.env` file:

```ini
# Storage Settings
Storage.default = 'local'
Storage.signingKey = 'your-32-character-secret-key'
Storage.imageDriver = 'gd'

# AWS S3 Disk Configuration
Storage.disks.s3.key = 'your-aws-access-key-id'
Storage.disks.s3.secret = 'your-aws-secret-access-key'
Storage.disks.s3.region = 'us-east-1'
Storage.disks.s3.bucket = 'your-s3-bucket-name'
Storage.disks.s3.url = 'https://your-s3-bucket-name.s3.amazonaws.com'

# Cloudflare R2 Disk Configuration
Storage.disks.r2.key = 'your-r2-access-key-id'
Storage.disks.r2.secret = 'your-r2-secret-access-key'
Storage.disks.r2.region = 'auto'
Storage.disks.r2.bucket = 'your-r2-bucket-name'
Storage.disks.r2.endpoint = 'https://<account-id>.r2.cloudflarestorage.com'
Storage.disks.r2.url = 'https://cdn.yourdomain.com'

# MinIO Local S3 Disk Configuration
Storage.disks.minio.key = 'minioadmin'
Storage.disks.minio.secret = 'minioadmin'
Storage.disks.minio.region = 'us-east-1'
Storage.disks.minio.bucket = 'app-bucket'
Storage.disks.minio.endpoint = 'http://127.0.0.1:9000'
Storage.disks.minio.use_path_style_endpoint = true
```

---

## Basic File Operations

### Writing Files

```php
use Jengo\Storage\Storage;

// Write to default disk
Storage::put('documents/notes.txt', 'Contents here');

// Write to specific disk with visibility
Storage::disk('s3')->put('reports/2026.pdf', $pdfBinary, 'private');

// Memory-efficient stream writing
$stream = fopen('/path/to/large/file.zip', 'rb');
Storage::disk('s3')->writeStream('archives/backup.zip', $stream);
if (is_resource($stream)) {
    fclose($stream);
}

// Prepend or append text
Storage::prepend('logs/audit.log', "Timestamp: " . time() . "\n");
Storage::append('logs/audit.log', "Finished.\n");
```

### Reading Files

```php
// Read full content into memory
$content = Storage::get('documents/notes.txt');

// Stream reading for large assets
$resource = Storage::readStream('videos/clip.mp4');
```

### Existence and Metadata

```php
if (Storage::exists('avatars/user.jpg')) {
    $size      = Storage::size('avatars/user.jpg');         // Bytes
    $mimeType  = Storage::mimeType('avatars/user.jpg');     // image/jpeg
    $timestamp = Storage::lastModified('avatars/user.jpg'); // Timestamp
    $checksum  = Storage::checksum('avatars/user.jpg');     // SHA256 checksum
}

if (Storage::missing('drafts/document.docx')) {
    // Handle missing file
}
```

### Copying, Moving, and Deleting

```php
// Copy a file
Storage::copy('drafts/post.md', 'published/post.md');

// Move or rename a file
Storage::move('temp/invoice.pdf', 'invoices/INV-2026.pdf');

// Delete a single file or array of files
Storage::delete('invoices/INV-2026.pdf');
Storage::delete(['temp/1.tmp', 'temp/2.tmp']);
```

---

## Directory Management

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

---

## URL Generation & Signed URLs

### Public URLs

```php
$url = Storage::disk('public')->url('avatars/profile.png');
// Returns: /storage/avatars/profile.png
```

### Temporary Signed URLs

Generate expiring URLs for sensitive, private files without exposing storage paths:

```php
$downloadUrl = Storage::temporaryUrl(
    'vault/financial-report.pdf',
    now()->addMinutes(15)
);
```

- **Cloud Disks (S3 / R2 / MinIO)**: Automatically generates native cloud pre-signed URLs.
- **Local Disks**: Generates an HMAC-SHA256 signed route (`/storage/signed/{path}?expires=...&signature=...`). The built-in controller validates expiration and signature, then streams the file with HTTP `Range` request support.

---

## Direct Browser Pre-Signed Uploads

To upload large files directly from the browser (Inertia.js, React, Vue) to S3 or Cloudflare R2 without passing through the PHP web server:

```php
namespace App\Controllers;

use CodeIgniter\Controller;
use Jengo\Storage\Storage;

class MediaController extends Controller
{
    public function getUploadTicket()
    {
        $userId = auth()->id();
        $filename = "uploads/{$userId}/" . bin2hex(random_bytes(16)) . ".mp4";

        $ticket = Storage::disk('s3')->createUploadUrl($filename, [
            'expires'     => time() + 900,
            'contentType' => 'video/mp4',
            'visibility'  => 'private',
        ]);

        return $this->response->setJSON([
            'uploadUrl' => $ticket->getUrl(),
            'headers'   => $ticket->getHeaders(),
            'key'       => $filename,
        ]);
    }
}
```

---

## Image Transformation Pipeline

Manipulate stored images via a fluent API without external heavyweight dependencies:

```php
use Jengo\Storage\Storage;

// Resize, fit, and convert to WebP
Storage::disk('public')
    ->image('products/camera.jpg')
    ->fit(800, 600)
    ->toWebp(quality: 85)
    ->save('products/camera_thumb.webp');

// Watermarking and aspect-ratio resizing
Storage::disk('public')
    ->image('photos/landscape.png')
    ->resize(1920) // Calculates height proportionally
    ->watermark('branding/watermark.png', position: 'bottom-right', opacity: 75)
    ->save('photos/landscape_watermarked.jpg');

// Generating responsive breakpoint sets
$variants = Storage::disk('public')
    ->image('hero.jpg')
    ->generateResponsiveVariants('hero_variants', [
        'sm' => 640,
        'md' => 1024,
        'lg' => 1920,
    ], format: 'webp', quality: 80);
```

---

## CodeIgniter `UploadedFile` Integration

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

---

## Testing with `Storage::fake()`

```php
namespace Tests\Feature;

use CodeIgniter\Test\CIUnitTestCase;
use Jengo\Storage\Storage;
use Jengo\Storage\Testing\FileFactory;

class FileUploadTest extends CIUnitTestCase
{
    public function test_user_can_upload_document(): void
    {
        // Intercept disk in memory
        Storage::fake('public');

        $fakeFile = FileFactory::create('contract.pdf', kilobytes: 50, mimeType: 'application/pdf');

        $response = $this->post('/documents/upload', [
            'file' => $fakeFile,
        ]);

        $response->assertStatus(200);

        // Assert file exists on disk
        Storage::disk('public')->assertExists('documents/contract.pdf');

        // Assert file count in directory
        Storage::disk('public')->assertDirectoryFileCount('documents', 1);

        // Assert file size
        Storage::disk('public')->assertSize('documents/contract.pdf', 50 * 1024);
    }
}
```

---

## CLI Spark Commands

### `php spark storage:link`
Connects `writable/storage/app/public` to `public/storage` via a symbolic link.

```bash
php spark storage:link
php spark storage:link --force
```

### `php spark storage:cleanup`
Deletes stale temporary upload chunks and orphaned files older than a specified duration.

```bash
php spark storage:cleanup --hours=24
```
